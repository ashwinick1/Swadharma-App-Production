import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {useNavigation, useRoute} from '@react-navigation/native';

const DoshaAssessmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const userId = route.params?.userId;

  const handleStartAssessment = () => {
    (navigation.navigate as any)(
      'DoshaQuestions',
      {userId},
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF6B00"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Dosha Assessment
          </Text>

          <View style={styles.headerSpace} />

        </View>

        {/* ========================= */}
        {/* SWADHARMA LOGO */}
        {/* ========================= */}

        <View style={styles.logoContainer}>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

        </View>

        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <Text style={styles.discoverText}>
          Discover Your
        </Text>

        <Text style={styles.doshaText}>
          Dosha Balance
        </Text>

        {/* ========================= */}
        {/* DESCRIPTION */}
        {/* ========================= */}

        <Text style={styles.description}>
          This assessment helps you understand
          your unique body–mind constitution
          based on Vata, Pitta and Kapha.
        </Text>

        {/* ========================= */}
        {/* FEATURE 1 */}
        {/* ========================= */}

        <View style={styles.featureCard}>

          <View style={styles.iconCircle}>

            <MaterialCommunityIcons
              name="clipboard-check-outline"
              size={25}
              color="#FF6B00"
            />

          </View>

          <View style={styles.featureContent}>

            <Text style={styles.featureTitle}>
              10 Simple Questions
            </Text>

            <Text style={styles.featureDescription}>
              Answer based on your natural
              tendencies.
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* FEATURE 2 */}
        {/* ========================= */}

        <View style={styles.featureCard}>

          <View style={styles.iconCircle}>

            <MaterialCommunityIcons
              name="heart-outline"
              size={25}
              color="#FF6B00"
            />

          </View>

          <View style={styles.featureContent}>

            <Text style={styles.featureTitle}>
              No Right or Wrong Answers
            </Text>

            <Text style={styles.featureDescription}>
              Be honest and choose what
              suits you most.
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* FEATURE 3 */}
        {/* ========================= */}

        <View style={styles.featureCard}>

          <View style={styles.iconCircle}>

            <MaterialCommunityIcons
              name="chart-donut"
              size={25}
              color="#FF6B00"
            />

          </View>

          <View style={styles.featureContent}>

            <Text style={styles.featureTitle}>
              Personalized Results
            </Text>

            <Text style={styles.featureDescription}>
              Get your Dosha balance with
              insights and tips.
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* DOSHA PREVIEW */}
        {/* ========================= */}

        <View style={styles.doshaPreview}>

          <Text style={styles.previewTitle}>
            Understand Your Doshas
          </Text>

          <View style={styles.doshaRow}>

            {/* VATA */}

            <View style={styles.doshaItem}>

              <View
                style={[
                  styles.doshaIcon,
                  styles.vataBackground,
                ]}>

                <MaterialCommunityIcons
                  name="weather-windy"
                  size={23}
                  color="#3A8FD8"
                />

              </View>

              <Text style={styles.vataText}>
                Vata
              </Text>

            </View>

            {/* PITTA */}

            <View style={styles.doshaItem}>

              <View
                style={[
                  styles.doshaIcon,
                  styles.pittaBackground,
                ]}>

                <MaterialCommunityIcons
                  name="fire"
                  size={23}
                  color="#FF7043"
                />

              </View>

              <Text style={styles.pittaText}>
                Pitta
              </Text>

            </View>

            {/* KAPHA */}

            <View style={styles.doshaItem}>

              <View
                style={[
                  styles.doshaIcon,
                  styles.kaphaBackground,
                ]}>

                <MaterialCommunityIcons
                  name="leaf"
                  size={23}
                  color="#6DAA55"
                />

              </View>

              <Text style={styles.kaphaText}>
                Kapha
              </Text>

            </View>

          </View>

        </View>

        {/* ========================= */}
        {/* START BUTTON */}
        {/* ========================= */}

        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStartAssessment}>

          <Text style={styles.startButtonText}>
            Start Assessment
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DoshaAssessmentScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* ========================= */
  /* HEADER */
  /* ========================= */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF5A00',
  },

  headerSpace: {
    width: 40,
  },

  /* ========================= */
  /* LOGO */
  /* ========================= */

  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },

  logo: {
    width: 135,
    height: 105,
  },

  /* ========================= */
  /* TITLE */
  /* ========================= */

  discoverText: {
    fontSize: 27,
    fontWeight: '900',
    color: '#2B211B',
    textAlign: 'center',
    marginTop: 5,
  },

  doshaText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FF5A00',
    textAlign: 'center',
    marginTop: 2,
  },

  description: {
    fontSize: 16,
    lineHeight: 23,
    color: '#5A514B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 22,
    paddingHorizontal: 10,
    fontWeight: '800',
  },

  /* ========================= */
  /* FEATURE CARDS */
  /* ========================= */

  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 15,

    marginBottom: 12,

    borderWidth: 1,
    borderColor: '#FFE0C2',

    elevation: 4,

    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,

    backgroundColor: '#FFF0DD',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#FFD3A8',
  },

  featureContent: {
    flex: 1,
    marginLeft: 14,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2B211B',
  },

  featureDescription: {
    fontSize: 16,
    color: '#5F5751',
    fontWeight: '800',
    marginTop: 4,
    lineHeight: 19,
  },

  /* ========================= */
  /* DOSHA PREVIEW */
  /* ========================= */

  doshaPreview: {
    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 18,

    marginTop: 5,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#FFD7B0',

    elevation: 4,

    shadowColor: '#FF6B00',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  previewTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2B211B',
    textAlign: 'center',
    marginBottom: 18,
  },

  doshaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  doshaItem: {
    alignItems: 'center',
    width: '30%',
  },

  doshaIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 8,
  },

  /* ========================= */
  /* VATA */
  /* ========================= */

  vataBackground: {
    backgroundColor: '#DDF1FF',
    borderWidth: 1,
    borderColor: '#B8E0FA',
  },

  vataText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2383D1',
  },

  /* ========================= */
  /* PITTA */
  /* ========================= */

  pittaBackground: {
    backgroundColor: '#FFE3D9',
    borderWidth: 1,
    borderColor: '#FFC2B0',
  },

  pittaText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F4511E',
  },

  /* ========================= */
  /* KAPHA */
  /* ========================= */

  kaphaBackground: {
    backgroundColor: '#E6F5D9',
    borderWidth: 1,
    borderColor: '#C9E6B6',
  },

  kaphaText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#4E963A',
  },

  /* ========================= */
  /* START BUTTON */
  /* ========================= */

  startButton: {
    height: 58,

    backgroundColor: '#FF5A00',

    borderRadius: 15,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 5,

    shadowColor: '#FF5A00',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    marginTop: 2,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginRight: 10,
  },

});