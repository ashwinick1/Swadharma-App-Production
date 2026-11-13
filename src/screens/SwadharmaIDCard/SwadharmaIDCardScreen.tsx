
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

import {generatePDF} from 'react-native-html-to-pdf';
import Share from 'react-native-share';

import {
  getUserProfile,
  getAssessment,
  completeAssessment,
} from '../../services/api';

// Existing Swadharma logo, including the 'Know Your Self' tagline.
const swadharmaLogo = require('../../assets/images/logo.png');

type IDCardData = {
  schemaVersion: string;
  artifactType: string;
  swadharmaId: string;
  issuedAt: string;
  participant: {
    userId: number;
    displayName: string;
  };
  assessmentHighlights: {
    dosha: string;
    guna: string;
    personality: string;
    interests: string;
  };
  profile: {
    keyStrengths: string[];
    recommendedProfessions: string[];
    professionalSkillsToDevelop: string[];
  };
  reportReference: {
    assessmentType: string;
  };
};

const unwrapAssessment = (response: any): any => {
  let value =
    response?.assessment ??
    response?.data?.assessment ??
    response?.data ??
    response;

  if (value?.result !== undefined && value?.result !== null) {
    value = value.result;
  } else if (value?.insights) {
    value = value.insights;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, character => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };

    return entities[character];
  });

const valueToText = (value: any): string | null => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (Array.isArray(value)) {
    const values = value
      .map(item => valueToText(item))
      .filter((item): item is string => Boolean(item));
    return values.length > 0 ? values.join(', ') : null;
  }

  if (value && typeof value === 'object') {
    return valueToText(
      value.name ?? value.label ?? value.title ?? value.value ?? value.type,
    );
  }

  return null;
};

const findFirstValue = (source: any, keys: string[]): string | null => {
  const records = [
    source,
    source?.result,
    source?.assessmentResult,
    source?.data,
    source?.profile,
    source?.analysis,
  ].filter(Boolean);

  for (const record of records) {
    for (const key of keys) {
      const result = valueToText(record?.[key]);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

const findHighestScore = (
  source: any,
  keys: string[],
): string | null => {
  const records = [source, source?.result, source?.assessmentResult, source?.data]
    .filter(Boolean);

  for (const record of records) {
    const scores = keys
      .map(key => ({
        name: key,
        value: Number(record?.[key] ?? record?.[key.toLowerCase()]),
      }))
      .filter(item => Number.isFinite(item.value));

    if (scores.length > 0) {
      scores.sort((a, b) => b.value - a.value);
      return scores[0].name;
    }
  }

  return null;
};

const makeAssessmentHighlights = (
  doshaData: any,
  gunaData: any,
  personalityData: any,
  existingHighlights?: Partial<IDCardData['assessmentHighlights']>,
): IDCardData['assessmentHighlights'] => {
  const dosha =
    findFirstValue(doshaData, [
      'dominantDosha', 'primaryDosha', 'doshaType', 'dosha', 'dominant', 'type',
    ]) || findHighestScore(doshaData, ['Vata', 'Pitta', 'Kapha']);

  const guna =
    findFirstValue(gunaData, [
      'primaryGuna', 'dominantGuna', 'gunaType', 'guna', 'dominant', 'type',
    ]) || findHighestScore(gunaData, ['Sattva', 'Rajas', 'Tamas']);

  const personality = findFirstValue(personalityData, [
    'personalityType', 'dominantPersonality', 'personality', 'personalityResult',
    'type', 'profileType', 'title', 'resultLabel',
  ]);

  const interests = findFirstValue(personalityData, [
    'interests', 'topInterests', 'interestAreas', 'interestArea', 'careerInterests',
    'areasOfInterest', 'preferredInterests', 'interest',
  ]);

  return {
    dosha: dosha || existingHighlights?.dosha || 'Not available',
    guna: guna || existingHighlights?.guna || 'Not available',
    personality:
      personality || existingHighlights?.personality || 'Not available',
    interests: interests || existingHighlights?.interests || 'Not available',
  };
};

const SwadharmaIDCardScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const userId = Number(route.params?.userId);
  // Use the database user ID with a four-digit minimum display width.
  const databaseSwadharmaId = `SWD-${String(userId).padStart(4, '0')}`;

  const [card, setCard] = useState<IDCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOrGenerateCard = async () => {
    if (!Number.isInteger(userId) || userId <= 0) {
      setError('User ID is missing. Please reopen the ID Card from your dashboard.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        profileResponse,
        reportResponse,
        cardResponse,
        doshaResponse,
        gunaResponse,
        personalityResponse,
      ] = await Promise.all([
        getUserProfile(userId).catch(() => null),
        getAssessment({
          userId,
          assessmentType: 'SWADHARMA_REPORT',
        }).catch(() => null),
        getAssessment({
          userId,
          assessmentType: 'SWADHARMA_ID_CARD',
        }).catch(() => null),
        getAssessment({
          userId,
          assessmentType: 'DOSHA',
        }).catch(() => null),
        getAssessment({
          userId,
          assessmentType: 'GUNA',
        }).catch(() => null),
        getAssessment({
          userId,
          assessmentType: 'PERSONALITY',
        }).catch(() => null),
      ]);

      const profile =
        profileResponse?.user ??
        profileResponse?.profile ??
        profileResponse?.data?.user ??
        profileResponse?.data ??
        profileResponse ??
        {};

      const finalAnalysis = unwrapAssessment(reportResponse);
      const existingCard = unwrapAssessment(cardResponse);
      const assessmentHighlights = makeAssessmentHighlights(
        unwrapAssessment(doshaResponse),
        unwrapAssessment(gunaResponse),
        unwrapAssessment(personalityResponse),
        existingCard?.assessmentHighlights,
      );

      // Reuse an already generated card if the final report
      // is not available from the assessment endpoint.
      if (
        !finalAnalysis?.summary &&
        !Array.isArray(finalAnalysis?.careerRecommendations) &&
        existingCard?.swadharmaId
      ) {
        // Older saved cards may not contain the full profile fields.
        // Use the normalized four-digit minimum ID and render missing sections as empty lists.
        const mergedCard = {
          ...existingCard,
          // Normalize previously saved six-digit IDs to the current four-digit format.
          swadharmaId: databaseSwadharmaId,
          assessmentHighlights,
          profile: {
            keyStrengths: existingCard.profile?.keyStrengths ?? [],
            recommendedProfessions:
              existingCard.profile?.recommendedProfessions ?? [],
            professionalSkillsToDevelop:
              existingCard.profile?.professionalSkillsToDevelop ?? [],
          },
        } as IDCardData;

        await completeAssessment({
          userId,
          assessmentType: 'SWADHARMA_ID_CARD',
          answers: [],
          result: mergedCard,
        });

        setCard(mergedCard);
        return;
      }

      // The final report must exist before a new ID card is generated.
      if (
        !finalAnalysis?.summary &&
        !Array.isArray(finalAnalysis?.careerRecommendations) &&
        !Array.isArray(finalAnalysis?.strengths)
      ) {
        throw new Error(
          'The saved Swadharma Final Analysis Report was not found. Open the report, generate it, and then return to the ID Card.',
        );
      }

      const displayName =
        [
          profile.firstName,
          profile.lastName,
        ]
          .filter(
            (part: unknown) =>
              typeof part === 'string' && part.trim(),
          )
          .join(' ') ||
        profile.fullName ||
        profile.name ||
        'Swadharma Member';

      const strengths = Array.isArray(finalAnalysis?.strengths)
        ? finalAnalysis.strengths
            .filter(
              (item: unknown): item is string =>
                typeof item === 'string' && item.trim().length > 0,
            )
            .slice(0, 6)
        : [];

      const careerRecommendations = Array.isArray(
        finalAnalysis?.careerRecommendations,
      )
        ? finalAnalysis.careerRecommendations
        : [];

      const recommendations = careerRecommendations.length > 0
        ? careerRecommendations
            .map((item: any) =>
              typeof item === 'string' ? item : item?.profession,
            )
            .filter(
              (item: unknown): item is string =>
                typeof item === 'string' && item.trim().length > 0,
            )
            .slice(0, 6)
        : Array.isArray(finalAnalysis?.careerDirections)
          ? finalAnalysis.careerDirections
              .filter(
                (item: unknown): item is string =>
                  typeof item === 'string' && item.trim().length > 0,
              )
              .slice(0, 6)
          : Array.isArray(finalAnalysis?.potentialRoles)
            ? finalAnalysis.potentialRoles
                .filter(
                  (item: unknown): item is string =>
                    typeof item === 'string' && item.trim().length > 0,
                )
                .slice(0, 6)
            : [];

      const professionalSkillsToDevelop = Array.from(
        new Set<string>(
          careerRecommendations.flatMap((item: any) =>
            Array.isArray(item?.skillsToDevelop)
              ? item.skillsToDevelop.filter(
                  (skill: unknown): skill is string =>
                    typeof skill === 'string' && skill.trim().length > 0,
                )
              : [],
          ),
        ),
      ).slice(0, 8);

      const cardData: IDCardData = {
        schemaVersion: '1.0',
        artifactType: 'SWADHARMA_ID_CARD',
        swadharmaId: databaseSwadharmaId,
        issuedAt:
          existingCard?.issuedAt ||
          new Date().toISOString(),
        participant: {
          userId,
          displayName,
        },
        assessmentHighlights,
        profile: {
          keyStrengths: strengths,
          recommendedProfessions: recommendations,
          professionalSkillsToDevelop,
        },
        reportReference: {
          assessmentType: 'SWADHARMA_REPORT',
        },
      };

      // Persist the structured JSON artifact in the existing
      // assessment system. Reopening the screen reuses the ID.
      await completeAssessment({
        userId,
        assessmentType: 'SWADHARMA_ID_CARD',
        answers: [],
        result: cardData,
      });

      setCard(cardData);
    } catch (err) {
      console.error('Swadharma ID Card error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate the Swadharma ID Card.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOrGenerateCard();
  }, [userId]);

  const handleDownloadPDF = async () => {
    if (!card) {
      return;
    }

    try {
      setBusy(true);

      const logoUri = Image.resolveAssetSource(swadharmaLogo)?.uri;

      const strengthsHtml = card.profile.keyStrengths
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join('');
      const professionsHtml = card.profile.recommendedProfessions
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join('');
      const skillsHtml = card.profile.professionalSkillsToDevelop
        .map(item => `<li>${escapeHtml(item)}</li>`)
        .join('');
      const highlights = card.assessmentHighlights ?? {
        dosha: 'Not available',
        guna: 'Not available',
        personality: 'Not available',
        interests: 'Not available',
      };

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8"/>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 28px;
                background: #FFF8F1;
                color: #30251F;
              }
              .card {
                background: #FFFFFF;
                border: 2px solid #F2C7A7;
                border-radius: 18px;
                padding: 26px;
              }
              .logo {
                display: block;
                width: 180px;
                height: auto;
                max-height: 170px;
                object-fit: contain;
                margin: 0 auto 14px;
              }
              h1 {
                text-align: center;
                font-size: 25px;
              }
              .id {
                font-size: 19px;
                font-weight: bold;
                text-align: center;
                color: #B94D08;
                padding: 14px;
                background: #FFF1E5;
                border-radius: 10px;
              }
              h2 {
                color: #B94D08;
                font-size: 20px;
                margin-top: 26px;
              }
              p, li {
                font-size: 16px;
                line-height: 1.8;
              }
              .assessment-grid {
                width: 100%;
                table-layout: fixed;
                border-collapse: collapse;
                margin: 8px 0 14px;
              }
              .assessment-grid td {
                vertical-align: top;
                width: 50%;
                padding: 9px 10px 9px 0;
                background: transparent;
                border: none;
                overflow-wrap: anywhere;
              }
              .assessment-label {
                font-size: 12px;
                line-height: 1.5;
                font-weight: bold;
                color: #A84408;
              }
              .assessment-value {
                font-size: 17px;
                line-height: 1.6;
                font-weight: bold;
                color: #30251F;
              }
              .footer {
                margin-top: 26px;
                padding-top: 14px;
                border-top: 1px solid #EAD8C8;
                font-size: 11px;
                color: #766A62;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <img class="logo" src="${escapeHtml(logoUri || '')}" alt="Swadharma Know Yourself" />
              <h1>Swadharma ID Card</h1>

              <p class="id">
                ${escapeHtml(card.swadharmaId)}
              </p>

              <h2>Participant</h2>
              <p><strong>${escapeHtml(card.participant.displayName)}</strong></p>

              <p>Issued: ${escapeHtml(
                new Date(card.issuedAt).toLocaleDateString(),
              )}</p>

              <table class="assessment-grid">
                <tr>
                  <td>
                    <div class="assessment-label">DOSHA</div>
                    <div class="assessment-value">${escapeHtml(highlights.dosha)}</div>
                  </td>
                  <td>
                    <div class="assessment-label">GUNA</div>
                    <div class="assessment-value">${escapeHtml(highlights.guna)}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="assessment-label">PERSONALITY</div>
                    <div class="assessment-value">${escapeHtml(highlights.personality)}</div>
                  </td>
                  <td>
                    <div class="assessment-label">INTERESTS</div>
                    <div class="assessment-value">${escapeHtml(highlights.interests)}</div>
                  </td>
                </tr>
              </table>

              <h2>Key Strengths</h2>
              <ul>${strengthsHtml || '<li>Not available</li>'}</ul>

              <h2>Recommended Professions and Paths</h2>
              <ul>${professionsHtml || '<li>Not available</li>'}</ul>

              <h2>Professional Skills to Develop</h2>
              <ul>${skillsHtml || '<li>Not available</li>'}</ul>

              <div class="footer">
                Swadharma • Know Yourself
                <br/>This card summarises assessment insights and is not a hiring decision.
              </div>
            </div>
          </body>
        </html>
      `;

      const pdf = await generatePDF({
        html,
        fileName: `Swadharma_ID_${card.swadharmaId}`,
        base64: false,
      });

      if (!pdf.filePath) {
        throw new Error('The PDF file could not be created.');
      }

      await Share.open({
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
        filename: `${card.swadharmaId}.pdf`,
        title: 'Swadharma ID Card',
        failOnCancel: false,
      });
    } catch (err) {
      console.error('ID Card PDF error:', err);
      Alert.alert(
        'PDF Export Failed',
        'Unable to generate or share the ID Card PDF.',
      );
    } finally {
      setBusy(false);
    }
  };



  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
        <Text style={styles.loadingText}>
          Generating your Swadharma ID Card...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !card) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorTitle}>ID Card Not Ready</Text>
        <Text style={styles.errorText}>
          {error || 'Unable to load your ID Card.'}
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate('SwadharmaReport', {userId})
          }>
          <Text style={styles.buttonText}>Open Final Analysis Report</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>‹  Back</Text>
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Swadharma ID Card</Text>

        <View style={styles.idCard}>
          <Image
            source={swadharmaLogo}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Swadharma Know Your Self logo"
          />

          <View style={styles.divider} />

          <Text style={styles.memberName}>
            {card.participant.displayName}
          </Text>

          <Text style={styles.idLabel}>SWADHARMA ID</Text>
          <Text style={styles.idValue}>{card.swadharmaId}</Text>

          <Text style={styles.issueDate}>
            Issued {new Date(card.issuedAt).toLocaleDateString()}
          </Text>

          <View style={styles.divider} />

          <View style={styles.highlightsGrid}>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>DOSHA</Text>
              <Text style={styles.highlightValue}>
                {card.assessmentHighlights?.dosha || 'Not available'}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>GUNA</Text>
              <Text style={styles.highlightValue}>
                {card.assessmentHighlights?.guna || 'Not available'}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>PERSONALITY</Text>
              <Text style={styles.highlightValue}>
                {card.assessmentHighlights?.personality || 'Not available'}
              </Text>
            </View>
            <View style={styles.highlightItem}>
              <Text style={styles.highlightLabel}>INTERESTS</Text>
              <Text style={styles.highlightValue}>
                {card.assessmentHighlights?.interests || 'Not available'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Key Strengths</Text>
          {card.profile.keyStrengths.length > 0 ? (
            card.profile.keyStrengths.map((item, index) => (
              <Text key={`strength-${index}`} style={styles.listText}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Not available.</Text>
          )}

          <Text style={styles.sectionTitle}>Recommended Professions and Paths</Text>
          {card.profile.recommendedProfessions.length > 0 ? (
            card.profile.recommendedProfessions.map((item, index) => (
              <Text key={`profession-${index}`} style={styles.listText}>
                {index + 1}. {item}
              </Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Not available.</Text>
          )}

          <Text style={styles.sectionTitle}>Professional Skills to Develop</Text>
          {card.profile.professionalSkillsToDevelop.length > 0 ? (
            card.profile.professionalSkillsToDevelop.map((item, index) => (
              <Text key={`skill-${index}`} style={styles.listText}>
                • {item}
              </Text>
            ))
          ) : (
            <Text style={styles.bodyText}>Not available.</Text>
          )}

          <Text style={styles.footer}>
            Swadharma • Know Yourself
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, busy && styles.disabledButton]}
          disabled={busy}
          onPress={handleDownloadPDF}>
          <Text style={styles.buttonText}>
            {busy ? 'Preparing PDF...' : 'Download / Share ID Card PDF'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default SwadharmaIDCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F1',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: '#FFF8F1',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    color: '#514239',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#B94D08',
  },
  pageTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    color: '#30251F',
  },
  idCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F2C7A7',
    borderRadius: 22,
    padding: 20,
    elevation: 3,
    marginBottom: 20,
  },
  logo: {
    width: 170,
    height: 155,
    alignSelf: 'center',
    marginTop: -8,
    marginBottom: -4,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0DACA',
    marginVertical: 18,
  },
  memberName: {
    fontSize: 26,
    lineHeight: 35,
    fontWeight: '900',
    color: '#30251F',
    textAlign: 'center',
    marginBottom: 18,
  },
  idLabel: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#765B49',
    textAlign: 'center',
  },
  idValue: {
    fontSize: 25,
    fontWeight: '900',
    color: '#B94D08',
    textAlign: 'center',
    marginTop: 6,
  },
  issueDate: {
    fontSize: 16,
    lineHeight: 24,
    color: '#766A62',
    textAlign: 'center',
    marginTop: 8,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    marginBottom: 4,
  },
  highlightItem: {
    width: '50%',
    paddingVertical: 10,
    paddingRight: 8,
  },
  highlightLabel: {
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '800',
    color: '#A84408',
    marginBottom: 4,
  },
  highlightValue: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: '700',
    color: '#30251F',
  },
  sectionTitle: {
    fontSize: 23,
    lineHeight: 32,
    fontWeight: '900',
    color: '#B94D08',
    marginTop: 14,
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '500',
    color: '#30251F',
    marginBottom: 8,
  },
  listText: {
    fontSize: 18,
    lineHeight: 30,
    fontWeight: '500',
    color: '#30251F',
    marginBottom: 5,
  },
  footer: {
    marginTop: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0DACA',
    textAlign: 'center',
    color: '#766A62',
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '900',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D66A22',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonText: {
    color: '#A84408',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  note: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B5B50',
  },
  errorTitle: {
    fontSize: 23,
    fontWeight: '900',
    color: '#30251F',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 15,
    lineHeight: 23,
    color: '#8B2F20',
    textAlign: 'center',
    marginBottom: 20,
  },
});