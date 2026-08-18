import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {generatePDF} from 'react-native-html-to-pdf';
import Share from 'react-native-share';

import HoroscopeStepper from '../components/HoroscopeStepper';
import AppLogoHeader from '../components/AppLogoHeader';

const ViewHoroscopeScreen = ({route}: any) => {
  const horoscopeData =
    route?.params?.horoscopeData;

  console.log(
    'VIEW HOROSCOPE DATA:',
    JSON.stringify(
      horoscopeData,
      null,
      2,
    ),
  );

  // =========================
  // Birth Details
  // =========================

  const birthDetails =
    horoscopeData?.birthDetails;

  // =========================
  // Prokerala Response
  // =========================

  const astrologyData =
    horoscopeData?.horoscope?.data;

  // =========================
  // Astrology Sections
  // =========================

  const nakshatra =
    astrologyData?.nakshatra;

  const chandraRasi =
    astrologyData?.chandra_rasi;

  const sooryaRasi =
    astrologyData?.soorya_rasi;

  const zodiac =
    astrologyData?.zodiac;

  const additionalInfo =
    astrologyData?.additional_info;

  // =====================================================
  // GET LOGO AS BASE64
  // =====================================================

  const getLogoBase64 = async (): Promise<string> => {
    try {
      /*
       * IMPORTANT:
       *
       * This assumes your file is:
       *
       * src/
       *   assets/
       *     images/
       *       logo.png
       *
       * and this screen is:
       *
       * src/
       *   screens/
       *     ViewHoroscopeScreen.tsx
       */

      const logoSource =
        Image.resolveAssetSource(
          require('../assets/images/logo.png'),
        );

      console.log(
        'Logo Source:',
        logoSource,
      );

      if (!logoSource?.uri) {
        throw new Error(
          'Logo URI not found',
        );
      }

      /*
       * Fetch the bundled React Native image
       */

      const response =
        await fetch(
          logoSource.uri,
        );

      const blob =
        await response.blob();

      /*
       * Convert image to Base64
       */

      return await new Promise(
        (
          resolve,
          reject,
        ) => {
          const reader =
            new FileReader();

          reader.onloadend = () => {
            try {
              const result =
                reader.result as string;

              if (!result) {
                reject(
                  new Error(
                    'Unable to convert logo to Base64',
                  ),
                );
                return;
              }

              /*
               * Result will be:
               *
               * data:image/png;base64,XXXXX
               *
               * We only need XXXXX
               */

              const base64 =
                result.split(',')[1];

              if (!base64) {
                reject(
                  new Error(
                    'Invalid Base64 logo data',
                  ),
                );
                return;
              }

              resolve(base64);
            } catch (error) {
              reject(error);
            }
          };

          reader.onerror = () => {
            reject(
              new Error(
                'Unable to read logo',
              ),
            );
          };

          reader.readAsDataURL(
            blob,
          );
        },
      );
    } catch (error) {
      console.log(
        'Logo Base64 Error:',
        error,
      );

      throw error;
    }
  };

  // =====================================================
  // DOWNLOAD HOROSCOPE PDF
  // =====================================================

  const handleDownloadPDF = async () => {
    try {
      if (!horoscopeData) {
        Alert.alert(
          'Error',
          'Horoscope data is not available.',
        );
        return;
      }

      console.log(
        'Generating Horoscope PDF...',
      );

      // =================================================
      // GET LOGO
      // =================================================

      const logoBase64 =
        await getLogoBase64();

      console.log(
        'Logo Base64 generated successfully',
      );

      // =================================================
      // PDF HTML
      // =================================================

      const html = `
        <html>

          <head>

            <meta charset="UTF-8" />

            <style>

              body {
                font-family: Arial, sans-serif;
                padding: 30px;
                color: #202020;
                background-color: #ffffff;
              }

              /* ========================= */
              /* HEADER */
              /* ========================= */

              .header {
                text-align: center;
                margin-bottom: 20px;
              }

              .logo {
                width: 180px;
                height: auto;
                margin-bottom: 8px;
              }

              .subtitle {
                color: #777777;
                font-size: 13px;
                margin-top: 5px;
              }

              .report-title {
                text-align: center;
                color: #FF6B00;
                font-size: 24px;
                font-weight: bold;
                margin-top: 18px;
                margin-bottom: 25px;
              }

              /* ========================= */
              /* SECTION TITLE */
              /* ========================= */

              .section-title {
                background-color: #FFF1E8;
                color: #FF6B00;
                font-size: 19px;
                font-weight: bold;
                padding: 10px;
                margin-top: 20px;
                margin-bottom: 10px;
                border-left: 5px solid #FF6B00;
              }

              /* ========================= */
              /* CARD */
              /* ========================= */

              .card {
                border: 1px solid #E5E5E5;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 15px;
              }

              .main-value {
                font-size: 21px;
                font-weight: bold;
                color: #202020;
                margin-bottom: 12px;
              }

              /* ========================= */
              /* TABLE */
              /* ========================= */

              table {
                width: 100%;
                border-collapse: collapse;
              }

              td {
                border: 1px solid #E5E5E5;
                padding: 9px;
                font-size: 13px;
              }

              .table-label {
                color: #202020;
                width: 40%;
                font-weight: bold;
              }

              .table-value {
                color: #202020;
                font-weight: bold;
              }

              /* ========================= */
              /* FOOTER */
              /* ========================= */

              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #E5E5E5;
                color: #888888;
                font-size: 11px;
              }

            </style>

          </head>

          <body>

            <!-- ========================= -->
            <!-- SWADHARMA LOGO -->
            <!-- ========================= -->

            <div class="header">

              <img
                src="data:image/png;base64,${logoBase64}"
                class="logo"
              />

            

            </div>

            <!-- ========================= -->
            <!-- REPORT TITLE -->
            <!-- ========================= -->

            <div class="report-title">
              Horoscope Report
            </div>

            <!-- ========================= -->
            <!-- BIRTH DETAILS -->
            <!-- ========================= -->

            <div class="section-title">
              Birth Details
            </div>

            <div class="card">

              <table>

                <tr>

                  <td class="table-label">
                    Date of Birth
                  </td>

                  <td class="table-value">
                    ${birthDetails?.dateOfBirth || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Time of Birth
                  </td>

                  <td class="table-value">
                    ${birthDetails?.timeOfBirth || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Place of Birth
                  </td>

                  <td class="table-value">
                    ${birthDetails?.placeOfBirth || '-'}
                  </td>

                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- ASTROLOGY DETAILS -->
            <!-- ========================= -->

            <div class="section-title">
              Astrology Details
            </div>

            <!-- ========================= -->
            <!-- NAKSHATRA -->
            <!-- ========================= -->

            <div class="card">

              <div class="main-value">
                Nakshatra:
                ${nakshatra?.name || '-'}
              </div>

              <table>

                <tr>

                  <td class="table-label">
                    Pada
                  </td>

                  <td class="table-value">
                    ${nakshatra?.pada || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Nakshatra ID
                  </td>

                  <td class="table-value">
                    ${nakshatra?.id || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Lord
                  </td>

                  <td class="table-value">
                    ${nakshatra?.lord?.name || '-'}
                  </td>

                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- CHANDRA RASHI -->
            <!-- ========================= -->

            <div class="card">

              <div class="main-value">
                Chandra Rashi:
                ${chandraRasi?.name || '-'}
              </div>

              <table>

                <tr>

                  <td class="table-label">
                    Rashi ID
                  </td>

                  <td class="table-value">
                    ${chandraRasi?.id || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Lord
                  </td>

                  <td class="table-value">
                    ${chandraRasi?.lord?.name || '-'}
                  </td>

                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- SOORYA RASHI -->
            <!-- ========================= -->

            <div class="card">

              <div class="main-value">
                Soorya Rashi:
                ${sooryaRasi?.name || '-'}
              </div>

              <table>

                <tr>

                  <td class="table-label">
                    Rashi ID
                  </td>

                  <td class="table-value">
                    ${sooryaRasi?.id || '-'}
                  </td>

                </tr>

                <tr>

                  <td class="table-label">
                    Lord
                  </td>

                  <td class="table-value">
                    ${sooryaRasi?.lord?.name || '-'}
                  </td>

                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- ZODIAC -->
            <!-- ========================= -->

            <div class="card">

              <div class="main-value">
                Zodiac:
                ${zodiac?.name || '-'}
              </div>

              <table>

                <tr>

                  <td class="table-label">
                    Zodiac ID
                  </td>

                  <td class="table-value">
                    ${zodiac?.id || '-'}
                  </td>

                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- ADDITIONAL INFORMATION -->
            <!-- ========================= -->

            <div class="section-title">
              Additional Information
            </div>

            <div class="card">

              <table>

                <tr>
                  <td class="table-label">
                    Deity
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.deity || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Ganam
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.ganam || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Symbol
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.symbol || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Animal Sign
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.animal_sign || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Nadi
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.nadi || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Color
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.color || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Best Direction
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.best_direction || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Syllables
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.syllables || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Birth Stone
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.birth_stone || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Gender
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.gender || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Planet
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.planet || '-'}
                  </td>
                </tr>

                <tr>
                  <td class="table-label">
                    Enemy Yoni
                  </td>

                  <td class="table-value">
                    ${additionalInfo?.enemy_yoni || '-'}
                  </td>
                </tr>

              </table>

            </div>

            <!-- ========================= -->
            <!-- FOOTER -->
            <!-- ========================= -->

            <div class="footer">
              Swadharma Horoscope Report
            </div>

          </body>

        </html>
      `;

      // =================================================
      // GENERATE PDF
      // =================================================

      const pdf =
        await generatePDF({
          html,
          fileName:
            'Swadharma_Horoscope',
          base64: false,
        });

      console.log(
        'Generated PDF:',
        pdf,
      );

      if (!pdf.filePath) {
        Alert.alert(
          'Error',
          'Unable to generate PDF.',
        );
        return;
      }

      // =================================================
      // SHARE / SAVE PDF
      // =================================================

      await Share.open({
        url: `file://${pdf.filePath}`,
        type: 'application/pdf',
        filename:
          'Swadharma_Horoscope.pdf',
        title:
          'Swadharma Horoscope',
        failOnCancel: false,
      });

    } catch (error) {

      console.log(
        'PDF Generation Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to create Horoscope PDF.',
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }>

        {/* ========================= */}
        {/* APP LOGO */}
        {/* ========================= */}

        <AppLogoHeader />

        {/* ========================= */}
        {/* HOROSCOPE STEPPER */}
        {/* ========================= */}

        <HoroscopeStepper
          currentStep={2}
        />

        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <Text style={styles.title}>
          Your Horoscope
        </Text>

        {/* ========================= */}
        {/* BIRTH DETAILS */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Birth Details
          </Text>

          <View style={styles.row}>

            <View style={styles.column}>

              <Text style={styles.label}>
                Date of Birth
              </Text>

              <Text style={styles.value}>
                {birthDetails?.dateOfBirth ||
                  '-'}
              </Text>

            </View>

            <View style={styles.column}>

              <Text style={styles.label}>
                Time of Birth
              </Text>

              <Text style={styles.value}>
                {birthDetails?.timeOfBirth ||
                  '-'}
              </Text>

            </View>

          </View>

          <Text style={styles.label}>
            Place of Birth
          </Text>

          <Text style={styles.value}>
            {birthDetails?.placeOfBirth ||
              '-'}
          </Text>

        </View>

        {/* ========================= */}
        {/* ASTROLOGY DETAILS */}
        {/* ========================= */}

        <Text style={styles.sectionTitle}>
          Astrology Details
        </Text>

        {/* ========================= */}
        {/* NAKSHATRA */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Nakshatra
          </Text>

          <Text style={styles.bigValue}>
            {nakshatra?.name || '-'}
          </Text>

          <View style={styles.row}>

            <Text style={styles.detailText}>
              Pada: {nakshatra?.pada || '-'}
            </Text>

            <Text style={styles.detailText}>
              ID: {nakshatra?.id || '-'}
            </Text>

          </View>

          <Text style={styles.detailText}>
            Lord: {nakshatra?.lord?.name || '-'}
          </Text>

        </View>

        {/* ========================= */}
        {/* CHANDRA RASHI */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Chandra Rashi
          </Text>

          <Text style={styles.bigValue}>
            {chandraRasi?.name || '-'}
          </Text>

          <View style={styles.row}>

            <Text style={styles.detailText}>
              ID: {chandraRasi?.id || '-'}
            </Text>

            <Text style={styles.detailText}>
              Lord: {chandraRasi?.lord?.name || '-'}
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* SOORYA RASHI */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Soorya Rashi
          </Text>

          <Text style={styles.bigValue}>
            {sooryaRasi?.name || '-'}
          </Text>

          <View style={styles.row}>

            <Text style={styles.detailText}>
              ID: {sooryaRasi?.id || '-'}
            </Text>

            <Text style={styles.detailText}>
              Lord: {sooryaRasi?.lord?.name || '-'}
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* ZODIAC */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Zodiac
          </Text>

          <Text style={styles.bigValue}>
            {zodiac?.name || '-'}
          </Text>

          <Text style={styles.detailText}>
            ID: {zodiac?.id || '-'}
          </Text>

        </View>

        {/* ========================= */}
        {/* ADDITIONAL INFORMATION */}
        {/* ========================= */}

        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            Additional Information
          </Text>

          <View style={styles.infoGrid}>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Deity
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.deity || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Ganam
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.ganam || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Symbol
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.symbol || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Animal Sign
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.animal_sign || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Nadi
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.nadi || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Color
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.color || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Direction
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.best_direction || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Syllables
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.syllables || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Birth Stone
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.birth_stone || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Gender
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.gender || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Planet
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.planet || '-'}
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.smallLabel}>
                Enemy Yoni
              </Text>

              <Text style={styles.smallValue}>
                {additionalInfo?.enemy_yoni || '-'}
              </Text>
            </View>

          </View>

        </View>

        {/* ========================= */}
        {/* DOWNLOAD PDF BUTTON */}
        {/* ========================= */}

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownloadPDF}>

          <Text
            style={
              styles.downloadButtonText
            }>

            Download Horoscope PDF

          </Text>

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

export default ViewHoroscopeScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FF6B00',
    textAlign: 'center',
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B00',
    marginBottom: 12,
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FF6B00',
    marginBottom: 6,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  column: {
    width: '48%',
  },

  label: {
    fontSize: 20,
    color: '#000000',
    marginTop: 5,
    marginBottom: 2,
  },

  value: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
  },

  bigValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#202020',
    marginTop: 4,
    marginBottom: 10,
  },

  detailText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
    marginTop: 5,
  },

  smallLabel: {
    fontSize: 18,
    color: '#888888',
    fontWeight: '800',
    marginTop: 5,
  },

  smallValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
    marginTop: 2,
  },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  infoItem: {
    width: '48%',
    marginBottom: 10,
  },

  // =========================
  // DOWNLOAD BUTTON
  // =========================

  downloadButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 25,
    elevation: 3,
  },

  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

});