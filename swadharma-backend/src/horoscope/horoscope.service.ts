import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { createWorker } from 'tesseract.js';


import { Horoscope } from './entities/horoscope.entity';
import { CreateHoroscopeDto } from './dto/create-horoscope.dto';
import { ViewHoroscopeDto } from './dto/view-horoscope.dto';

import { LocationService } from '../location/location.service';
import { ProkeralaService } from '../prokerala/prokerala.service';

@Injectable()
export class HoroscopeService {
  constructor(
    @InjectRepository(Horoscope)
    private readonly horoscopeRepository: Repository<Horoscope>,

    private readonly locationService: LocationService,

    private readonly prokeralaService: ProkeralaService,
  ) {}

  // =====================================================
  // Save Birth Details
  // =====================================================

  async create(
    createHoroscopeDto: CreateHoroscopeDto,
  ): Promise<Horoscope> {
    const horoscope =
      this.horoscopeRepository.create(
        createHoroscopeDto,
      );

    return await this.horoscopeRepository.save(
      horoscope,
    );
  }

  // =====================================================
  // Generate / View Horoscope
  // =====================================================

  async viewHoroscope(
    viewHoroscopeDto: ViewHoroscopeDto,
  ) {
    const {
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
    } = viewHoroscopeDto;

    console.log(
      'Date of Birth:',
      dateOfBirth,
    );

    console.log(
      'Time of Birth:',
      timeOfBirth,
    );

    console.log(
      'Place of Birth:',
      placeOfBirth,
    );

    // ===================================================
    // 1. Get latitude and longitude
    // ===================================================

    const location =
      await this.locationService.getCoordinates(
        placeOfBirth,
      );

    console.log(
      'Location:',
      location,
    );

    // ===================================================
    // 2. Create Prokerala datetime
    // ===================================================

    const datetime =
      `${dateOfBirth}T${timeOfBirth}+05:30`;

    console.log(
      'Prokerala datetime:',
      datetime,
    );

    // ===================================================
    // 3. Call Prokerala
    // ===================================================

    const horoscope =
      await this.prokeralaService.getBirthDetails(
        location.latitude,
        location.longitude,
        datetime,
      );

    console.log(
      'Prokerala Horoscope Response:',
      horoscope,
    );

    // ===================================================
    // 4. Return everything
    // ===================================================

    return {
      success: true,

      birthDetails: {
        dateOfBirth,
        timeOfBirth,
        placeOfBirth,
      },

      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        displayName: location.displayName,
      },

      horoscope,
    };
  }

  // =====================================================
  // Upload Horoscope Image / PDF
  // =====================================================

  async uploadHoroscope(
    file: Express.Multer.File,
  ) {
    // ===================================================
    // 1. Check file
    // ===================================================

    if (!file) {
      return {
        success: false,
        message:
          'No horoscope file was uploaded.',
      };
    }

    console.log(
      '====================================',
    );

    console.log(
      'Uploaded Horoscope File',
    );

    console.log(
      'Original Name:',
      file.originalname,
    );

    console.log(
      'MIME Type:',
      file.mimetype,
    );

    console.log(
      'Size:',
      file.size,
    );

    console.log(
      '====================================',
    );

    // ===================================================
    // 2. Allowed file types
    // ===================================================

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
    ];

    if (
      !allowedTypes.includes(
        file.mimetype,
      )
    ) {
      return {
        success: false,
        message:
          'Only JPG, PNG and PDF horoscope files are supported.',
      };
    }

    // ===================================================
    // 3. Maximum file size - 10 MB
    // ===================================================

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        message:
          'Horoscope file size must be less than 10 MB.',
      };
    }

    try {
      // =================================================
      // 4. Extract text
      // =================================================

      let extractedText = '';

      // Image that will be sent to the vision model if OCR
      // cannot reliably extract all birth details.
      let visionImageDataUrl: string | null = null;

      // =================================================
      // IMAGE
      // JPG / PNG
      // =================================================

      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'
      ) {
        console.log('Starting English + Kannada OCR...');

        visionImageDataUrl =
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

        const worker = await createWorker(
          ['eng', 'kan'],
          1,
        );

        try {
          const result = await worker.recognize(
            file.buffer,
          );

          extractedText =
            result?.data?.text || '';
        } finally {
          await worker.terminate();
        }

        console.log(
          'English + Kannada OCR Completed.',
        );
      }

      // =================================================
      // PDF
      // =================================================

      else if (file.mimetype === 'application/pdf') {
        console.log(
          'Starting PDF text extraction...',
        );
const { PDFParse } = await import('pdf-parse');
        const parser = new PDFParse({
          data: file.buffer,
        });

        try {
          const result = await parser.getText();

          extractedText =
            result?.text || '';
        } finally {
          await parser.destroy();
        }

        console.log(
          'PDF Text Extraction Completed.',
        );

        // -------------------------------------------------
        // Scanned PDF fallback:
        // render pages and OCR them.
        // -------------------------------------------------

        const preliminaryDetails =
          this.extractBirthDetails(
            extractedText,
          );

        if (
          !preliminaryDetails.dateOfBirth ||
          !preliminaryDetails.timeOfBirth ||
          !preliminaryDetails.placeOfBirth
        ) {
          console.log(
            'PDF text did not contain all birth details.',
          );

          console.log(
            'Rendering PDF pages for OCR...',
          );

          const screenshotParser =
            new PDFParse({
              data: file.buffer,
            });

          try {
            const screenshotResult =
              await screenshotParser.getScreenshot({
                first: 5,
                scale: 2,
              });

            const worker =
              await createWorker(
                ['eng', 'kan'],
                1,
              );

            try {
              const pageTexts: string[] = [];

              for (
                const page of screenshotResult.pages
              ) {
                console.log(
                  `OCR PDF page ${page.pageNumber}...`,
                );

                const pageBuffer =
                  Buffer.from(page.data);

                // Use the first rendered page for vision.
                if (
                  !visionImageDataUrl &&
                  page.pageNumber === 1
                ) {
                  visionImageDataUrl =
                    `data:image/png;base64,${pageBuffer.toString(
                      'base64',
                    )}`;
                }

                const result =
                  await worker.recognize(
                    pageBuffer,
                  );

                pageTexts.push(
                  result?.data?.text || '',
                );
              }

              const pdfOcrText =
                pageTexts.join('\n\n');

              if (pdfOcrText.trim()) {
                extractedText =
                  [
                    extractedText,
                    pdfOcrText,
                  ]
                    .filter(
                      text => text.trim(),
                    )
                    .join('\n\n');
              }
            } finally {
              await worker.terminate();
            }
          } finally {
            await screenshotParser.destroy();
          }

          console.log(
            'Scanned PDF OCR Completed.',
          );
        }
      }

      // =================================================
      // 5. Log extracted text
      // =================================================

      console.log(
        '====================================',
      );

      console.log(
        'Horoscope OCR completed. Extracted text length:',
        extractedText.length,
      );

      // =================================================
      // 6. Extract birth details from OCR
      // =================================================

      let birthDetails =
        this.extractBirthDetails(
          extractedText,
        );

      console.log(
        'OCR Extracted Birth Details:',
        birthDetails,
      );

      // =================================================
      // 7. Vision fallback
      //
      // OCR is useful for normal printed documents, but
      // horoscope forms often contain handwritten Kannada.
      // If any required value is missing, use vision to read
      // the actual image.
      // =================================================

      if (
        (!birthDetails.dateOfBirth ||
          !birthDetails.timeOfBirth ||
          !birthDetails.placeOfBirth) &&
        visionImageDataUrl
      ) {
        console.log(
          'OCR could not extract all details.',
        );

        console.log(
          'Trying vision-based birth-detail extraction...',
        );

        const visionDetails =
          await this.extractBirthDetailsWithVision(
            visionImageDataUrl,
          );

        console.log(
          'Vision Extracted Birth Details:',
          visionDetails,
        );

        birthDetails = {
          dateOfBirth:
            visionDetails.dateOfBirth ||
            birthDetails.dateOfBirth,

          timeOfBirth:
            visionDetails.timeOfBirth ||
            birthDetails.timeOfBirth,

          placeOfBirth:
            visionDetails.placeOfBirth ||
            birthDetails.placeOfBirth,
        };
      }

      console.log(
        'Final Extracted Birth Details:',
        birthDetails,
      );

      // =================================================
      // 8. Check required details
      // =================================================

      if (
        !birthDetails.dateOfBirth ||
        !birthDetails.timeOfBirth ||
        !birthDetails.placeOfBirth
      ) {
        const hasVisionKey = Boolean(
          process.env.GEMINI_API_KEY ||
          process.env.GOOGLE_API_KEY,
        );

        return {
          success: false,
          message: hasVisionKey
            ? 'The horoscope file was read, but all birth details could not be identified confidently. Please upload a clearer image or PDF.'
            : 'Gemini Vision is not configured. Add GEMINI_API_KEY to the backend .env file, then restart the backend.',
          extractedText,
          birthDetails,
        };
      }

      // =================================================
      // 9. All details found
      // Generate horoscope using the SAME existing
      // Prokerala flow.
      // =================================================

      console.log(
        'All birth details extracted.',
      );

      console.log(
        'Generating horoscope...',
      );

      const horoscopeResponse =
        await this.viewHoroscope({
          dateOfBirth:
            birthDetails.dateOfBirth,

          timeOfBirth:
            birthDetails.timeOfBirth,

          placeOfBirth:
            birthDetails.placeOfBirth,
        });

      // =================================================
      // 10. Return same horoscope response
      // used by manual birth-details flow
      // =================================================

      return {
        ...horoscopeResponse,

        source: 'uploaded_horoscope',

        extractedText,
      };
    } catch (error) {
      console.error(
        'Horoscope Upload Processing Error:',
        error,
      );

      return {
        success: false,

        message:
          'The horoscope file was uploaded, but we could not process it. Please try another clear image or PDF.',
      };
    }
  }

  // =====================================================
  // Extract Birth Details From OCR / PDF Text
  // =====================================================

  private extractBirthDetails(
    text: string,
  ) {
    const normalizedText =
      text
        .replace(/\r/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

    console.log(
      'Normalized OCR Text:',
      normalizedText,
    );

    // ===================================================
    // DATE OF BIRTH
    //
    // Handles:
    // 10-10-2021
    // 10/10/2021
    // 10.10.2021
    // 10-10-21
    // ===================================================

    let dateOfBirth:
      | string
      | null = null;

    const datePatterns = [
      // English labels
      /(?:date\s*of\s*birth|dob|birth\s*date|date\s*birth)[^\d]*(\d{1,2}[\s\/.-]\d{1,2}[\s\/.-]\d{2,4})/i,

      // Kannada labels commonly found on horoscope forms
      /(?:ಜನನ\s*ದಿನಾಂಕ|ಜನ್ಮ\s*ದಿನಾಂಕ)[^\d]*(\d{1,2}[\s\/.-]\d{1,2}[\s\/.-]\d{2,4})/i,

      // Romanized labels
      /(?:janana\s*dinanka|janma\s*dinanka|janma\s*date)[^\d]*(\d{1,2}[\s\/.-]\d{1,2}[\s\/.-]\d{2,4})/i,

      // Any full date
      /\b(\d{1,2}[\s\/.-]\d{1,2}[\s\/.-]\d{4})\b/,

      // OCR may drop one or two digits from the year
      /\b(\d{1,2}[\s\/.-]\d{1,2}[\s\/.-]\d{2})\b/,

      // ISO
      /\b(\d{4}[\s\/.-]\d{1,2}[\s\/.-]\d{1,2})\b/,
    ];

    for (
      const pattern of datePatterns
    ) {
      const match =
        normalizedText.match(pattern);

      if (match?.[1]) {
        dateOfBirth =
          this.normalizeDate(
            match[1],
          );

        if (dateOfBirth) {
          break;
        }
      }
    }

    // ===================================================
    // TIME OF BIRTH
    //
    // Handles OCR variants:
    // 09:20
    // 9:20
    // 9-20
    // 9.20
    // 09:20 AM
    // ===================================================

    let timeOfBirth:
      | string
      | null = null;

    const timePatterns = [
      // English labels
      /(?:time\s*of\s*birth|birth\s*time|birth\s*hour|time)[^\d]*(\d{1,2}\s*[:.-]\s*\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i,

      // Kannada labels
      /(?:ಜನನ\s*ಸಮಯ|ಜನನ\s*ವೇಳೆ|ಜನ್ಮ\s*ಸಮಯ|ವೇಳೆ)[^\d]*(\d{1,2}\s*[:.-]\s*\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i,

      // Romanized labels
      /(?:janana\s*samaya|janma\s*samaya|janma\s*vela)[^\d]*(\d{1,2}\s*[:.-]\s*\d{2}(?::\d{2})?\s*(?:AM|PM)?)/i,

      // Generic time
      /\b(\d{1,2}\s*[:.-]\s*\d{2}(?::\d{2})?\s*(?:AM|PM))\b/i,

      // Generic 24-hour/OCR hyphen time
      /\b(\d{1,2}\s*[:.-]\s*\d{2}(?::\d{2})?)\b/,
    ];

    for (
      const pattern of timePatterns
    ) {
      const match =
        normalizedText.match(pattern);

      if (match?.[1]) {
        timeOfBirth =
          this.normalizeTime(
            match[1],
          );

        if (timeOfBirth) {
          break;
        }
      }
    }

    // ===================================================
    // PLACE OF BIRTH
    // ===================================================

    let placeOfBirth:
      | string
      | null = null;

    const placePatterns = [
      /(?:place\s*of\s*birth|birth\s*place|born\s*at|birth\s*location|birth\s*city|birth\s*town)[\s:,-]+([^\n]+)/i,

      /(?:ಜನ್ಮ\s*ಸ್ಥಳ|ಜನ್ಮಸ್ಥಳ|ಜನನ\s*ಸ್ಥಳ|ಹುಟ್ಟಿದ\s*ಸ್ಥಳ)[\s:,-]+([^\n]+)/i,

      /(?:janma\s*sthala|janma\s*sthal|janana\s*sthala)[\s:,-]+([^\n]+)/i,
    ];

    for (
      const pattern of placePatterns
    ) {
      const match =
        normalizedText.match(pattern);

      if (match?.[1]) {
        const candidate =
          match[1]
            .replace(/\s+/g, ' ')
            .replace(/[|]+/g, '')
            .trim();

        // Avoid returning a whole OCR line when it is clearly
        // another field.
        if (
          candidate.length > 1 &&
          candidate.length < 100
        ) {
          placeOfBirth = candidate;
          break;
        }
      }
    }

    return {
      dateOfBirth,
      timeOfBirth,
      placeOfBirth,
    };
  }

  // =====================================================
  // Vision-based extraction
  //
  // Used only when OCR cannot read all three values.
  // =====================================================

  private async extractBirthDetailsWithVision(
    imageDataUrl: string,
  ): Promise<{
    dateOfBirth: string | null;
    timeOfBirth: string | null;
    placeOfBirth: string | null;
  }> {
    // Keep the API key on the backend. Do not put it in the mobile app.
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn(
        'Gemini Vision is not configured. Set GEMINI_API_KEY in the backend .env file.',
      );

      return {
        dateOfBirth: null,
        timeOfBirth: null,
        placeOfBirth: null,
      };
    }

    try {
      const dataUrlMatch = imageDataUrl.match(
        /^data:(image\/(?:jpeg|png|webp));base64,([\s\S]+)$/i,
      );

      if (!dataUrlMatch) {
        console.error(
          'Unsupported vision image data URL. Expected a base64 JPEG, PNG, or WebP image.',
        );

        return {
          dateOfBirth: null,
          timeOfBirth: null,
          placeOfBirth: null,
        };
      }

      const mimeType = dataUrlMatch[1].toLowerCase();
      const base64Data = dataUrlMatch[2];
      const model =
        process.env.GEMINI_VISION_MODEL ||
        'gemini-3.8-flash';

      const prompt = `
Read this Indian horoscope document carefully. It may contain printed Kannada, handwritten Kannada, or English.

Extract ONLY these three details about the person's birth:
1. Date of Birth
2. Time of Birth
3. Place of Birth

Instructions:
- Read the values associated with the birth-detail labels, not unrelated dates in a Panchanga, calendar, chart, or document header.
- Kannada labels may include "ಜನನ ದಿನಾಂಕ", "ಜನ್ಮ ದಿನಾಂಕ", "ಜನನ ಸಮಯ", "ಜನನ ವೇಳೆ", "ಜನ್ಮ ಸಮಯ", "ಜನ್ಮ ಸ್ಥಳ", and "ಜನನ ಸ್ಥಳ".
- Convert the date to YYYY-MM-DD.
- Convert the time to 24-hour HH:mm:ss. If seconds are not shown, use :00. Respect AM/PM when present.
- Write the place name in English transliteration if it appears in Kannada.
- Do not guess. If a value is not legible or cannot be confidently identified, return null for that field.

Return ONLY a JSON object with exactly these keys:
{
  "dateOfBirth": "YYYY-MM-DD or null",
  "timeOfBirth": "HH:mm:ss or null",
  "placeOfBirth": "English place name or null"
}
`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {text: prompt},
                  {
                    inline_data: {
                      mime_type: mimeType,
                      data: base64Data,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0,
              responseMimeType: 'application/json',
            },
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          'Gemini Vision API Error:',
          response.status,
          errorText,
        );

        return {
          dateOfBirth: null,
          timeOfBirth: null,
          placeOfBirth: null,
        };
      }

      const data: any = await response.json();
      const outputText = Array.isArray(
        data?.candidates?.[0]?.content?.parts,
      )
        ? data.candidates[0].content.parts
            .map((part: any) =>
              typeof part?.text === 'string' ? part.text : '',
            )
            .join('\n')
            .trim()
        : '';

      console.log('Gemini Vision Raw Response:', outputText);

      if (!outputText) {
        console.error(
          'Gemini returned no text. Finish reason:',
          data?.candidates?.[0]?.finishReason,
          'Prompt feedback:',
          data?.promptFeedback,
        );

        return {
          dateOfBirth: null,
          timeOfBirth: null,
          placeOfBirth: null,
        };
      }

      const jsonText = outputText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```$/i, '')
        .trim();

      let parsed: any;
      try {
        parsed = JSON.parse(jsonText);
      } catch {
        const firstBrace = jsonText.indexOf('{');
        const lastBrace = jsonText.lastIndexOf('}');

        if (firstBrace < 0 || lastBrace <= firstBrace) {
          console.error(
            'Gemini response did not contain a valid JSON object.',
          );
          return {
            dateOfBirth: null,
            timeOfBirth: null,
            placeOfBirth: null,
          };
        }

        parsed = JSON.parse(
          jsonText.slice(firstBrace, lastBrace + 1),
        );
      }

      const rawDate =
        typeof parsed?.dateOfBirth === 'string'
          ? parsed.dateOfBirth.trim()
          : '';
      const rawTime =
        typeof parsed?.timeOfBirth === 'string'
          ? parsed.timeOfBirth.trim()
          : '';
      const rawPlace =
        typeof parsed?.placeOfBirth === 'string'
          ? parsed.placeOfBirth.trim()
          : '';

      return {
        dateOfBirth: rawDate
          ? this.normalizeDate(rawDate)
          : null,
        timeOfBirth: rawTime
          ? this.normalizeTime(rawTime)
          : null,
        placeOfBirth: rawPlace || null,
      };
    } catch (error) {
      console.error('Gemini Vision extraction failed:', error);

      return {
        dateOfBirth: null,
        timeOfBirth: null,
        placeOfBirth: null,
      };
    }
  }

  private normalizeDate(
    value: string,
  ): string | null {
    const cleaned =
      value
        .trim()
        .replace(/\s+/g, '');

    // YYYY-MM-DD
    const isoMatch =
      cleaned.match(
        /^(\d{4})[\/.-](\d{1,2})[\/.-](\d{1,2})$/,
      );

    if (isoMatch) {
      const year =
        isoMatch[1];

      const month =
        isoMatch[2].padStart(
          2,
          '0',
        );

      const day =
        isoMatch[3].padStart(
          2,
          '0',
        );

      return `${year}-${month}-${day}`;
    }

    // DD-MM-YYYY
    const normalMatch =
      cleaned.match(
        /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})$/,
      );

    if (normalMatch) {
      const day =
        normalMatch[1].padStart(
          2,
          '0',
        );

      const month =
        normalMatch[2].padStart(
          2,
          '0',
        );

      let year =
        normalMatch[3];

      // Horoscope OCR often reads 2021 as 21.
      if (year.length === 2) {
        year = `20${year}`;
      }

      const dayNumber = Number(day);
      const monthNumber = Number(month);
      const yearNumber = Number(year);

      if (
        monthNumber < 1 ||
        monthNumber > 12 ||
        dayNumber < 1 ||
        dayNumber > 31 ||
        yearNumber < 1900 ||
        yearNumber > 2100
      ) {
        return null;
      }

      return `${year}-${month}-${day}`;
    }

    return null;
  }

  // =====================================================
  // Normalize Time
  // =====================================================

  private normalizeTime(
    value: string,
  ): string | null {
    const cleaned =
      value
        .trim()
        .toUpperCase();

    // ===================================================
    // 12-hour format
    // ===================================================

    const twelveHourMatch =
      cleaned.match(
        /^(\d{1,2})[:.-](\d{2})(?::(\d{2}))?\s*(AM|PM)$/,
      );

    if (twelveHourMatch) {
      let hours =
        Number(
          twelveHourMatch[1],
        );

      const minutes =
        twelveHourMatch[2];

      const seconds =
        twelveHourMatch[3] ||
        '00';

      const period =
        twelveHourMatch[4];

      const minuteNumber =
        Number(minutes);

      const secondNumber =
        Number(seconds);

      if (
        hours < 1 ||
        hours > 12 ||
        minuteNumber < 0 ||
        minuteNumber > 59 ||
        secondNumber < 0 ||
        secondNumber > 59
      ) {
        return null;
      }

      if (
        period === 'AM' &&
        hours === 12
      ) {
        hours = 0;
      }

      if (
        period === 'PM' &&
        hours !== 12
      ) {
        hours += 12;
      }

      return `${String(
        hours,
      ).padStart(2, '0')}:${minutes}:${seconds}`;
    }

    // ===================================================
    // 24-hour format
    // ===================================================

    const twentyFourHourMatch =
      cleaned.match(
        /^(\d{1,2})[:.-](\d{2})(?::(\d{2}))?$/,
      );

    if (twentyFourHourMatch) {
      const hours =
        Number(
          twentyFourHourMatch[1],
        );

      const minutes =
        Number(
          twentyFourHourMatch[2],
        );

      const seconds =
        Number(
          twentyFourHourMatch[3] ||
            '0',
        );

      if (
        hours < 0 ||
        hours > 23
      ) {
        return null;
      }

      if (
        minutes < 0 ||
        minutes > 59
      ) {
        return null;
      }

      if (
        seconds < 0 ||
        seconds > 59
      ) {
        return null;
      }

      return `${String(
        hours,
      ).padStart(2, '0')}:${String(
        minutes,
      ).padStart(2, '0')}:${String(
        seconds,
      ).padStart(2, '0')}`;
    }

    return null;
  }
}