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

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const GunaAssessmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const userId = route.params?.userId;

  const handleStartAssessment = () => {
    if (!userId) {
      console.log(
        'Guna Assessment: userId is missing',
      );
      return;
    }

    navigation.navigate(
      'GunaQuestions' as never,
      {userId} as never,
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
              color="#FF5A00"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Guna Assessment
          </Text>

          <View style={styles.headerSpace} />

        </View>

        {/* ========================= */}
        {/* LOGO */}
        {/* ========================= */}

        <View style={styles.logoContainer}>

          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

        </View>

        {/* ========================= */}
        {/* TITLE */}
        {/* ========================= */}

        <View style={styles.titleSection}>

          <Text style={styles.title}>
            Discover Your
          </Text>

          <Text style={styles.titleOrange}>
            Guna Balance
          </Text>

          <Text style={styles.subtitle}>
            Understand the qualities that influence
            your thoughts, behaviour and daily
            tendencies.
          </Text>

        </View>

        {/* ========================= */}
        {/* THREE GUNAS */}
        {/* ========================= */}

        <View style={styles.gunaCard}>

          <Text style={styles.gunaCardTitle}>
            Understand Your Gunas
          </Text>

          <Text style={styles.gunaCardSubtitle}>
            Everyone has all three qualities in
            different proportions.
          </Text>

          {/* SATTVA */}

          <View style={styles.gunaItem}>

            <View style={styles.gunaCircle}>
              <Text style={styles.gunaSymbol}>
                S
              </Text>
            </View>

            <View style={styles.gunaTextContainer}>

              <Text style={styles.gunaTitle}>
                Sattva
              </Text>

              <Text style={styles.gunaDescription}>
                Clarity, balance, harmony and
                awareness
              </Text>

            </View>

          </View>

          {/* TEJAS */}

          <View style={styles.gunaItem}>

            <View style={styles.gunaCircle}>
              <Text style={styles.gunaSymbol}>
                T
              </Text>
            </View>

            <View style={styles.gunaTextContainer}>

              <Text style={styles.gunaTitle}>
                Tejas
              </Text>

              <Text style={styles.gunaDescription}>
                Energy, action, drive and
                determination
              </Text>

            </View>

          </View>

          {/* TAMAS */}

          <View style={styles.gunaItem}>

            <View style={styles.gunaCircle}>
              <Text style={styles.gunaSymbol}>
                T
              </Text>
            </View>

            <View style={styles.gunaTextContainer}>

              <Text style={styles.gunaTitle}>
                Tamas
              </Text>

              <Text style={styles.gunaDescription}>
                Rest, stability, resistance and
                inactivity
              </Text>

            </View>

          </View>

        </View>

        {/* ========================= */}
        {/* SIMPLE QUESTIONS */}
        {/* ========================= */}

        <View style={styles.infoCard}>

          <View style={styles.infoIconContainer}>

            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={25}
              color="#FF5A00"
            />

          </View>

          <View style={styles.infoTextContainer}>

            <Text style={styles.infoTitle}>
              Simple Questions
            </Text>

            <Text style={styles.infoDescription}>
              Answer questions based on your
              natural thoughts, feelings and
              behaviours.
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* NO RIGHT OR WRONG */}
        {/* ========================= */}

        <View style={styles.infoCard}>

          <View style={styles.infoIconContainer}>

            <MaterialCommunityIcons
              name="heart-outline"
              size={25}
              color="#FF5A00"
            />

          </View>

          <View style={styles.infoTextContainer}>

            <Text style={styles.infoTitle}>
              No Right or Wrong Answers
            </Text>

            <Text style={styles.infoDescription}>
              Be honest and choose what
              describes you best.
            </Text>

          </View>

        </View>

        {/* ========================= */}
        {/* PERSONALIZED RESULTS */}
        {/* ========================= */}

        <View style={styles.infoCard}>

          <View style={styles.infoIconContainer}>

            <MaterialCommunityIcons
              name="chart-donut"
              size={25}
              color="#FF5A00"
            />

          </View>

          <View style={styles.infoTextContainer}>

            <Text style={styles.infoTitle}>
              Personalized Results
            </Text>

            <Text style={styles.infoDescription}>
              Discover your Sattva, Tejas and
              Tamas balance with personalized
              insights.
            </Text>

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
            size={22}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default GunaAssessmentScreen;

const styles = StyleSheet.create({

  // =========================
  // CONTAINER
  // =========================

  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // =========================
  // HEADER
  // =========================

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
    fontSize: 19,
    fontWeight: '900',
    color: '#FF5A00',
  },

  headerSpace: {
    width: 40,
  },

  // =========================
  // LOGO
  // =========================

  logoContainer: {
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 8,
  },

  logo: {
    width: 125,
    height: 60,
    resizeMode: 'contain',
  },

  // =========================
  // TITLE
  // =========================

  titleSection: {
    alignItems: 'center',
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: '900',
    color: '#2B211B',
  },

  titleOrange: {
    fontSize: 27,
    fontWeight: '900',
    color: '#FF5A00',
    marginTop: 2,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#665D56',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },

  // =========================
  // GUNA CARD
  // =========================

  gunaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: '#FFD7B0',

    elevation: 3,
  },

  gunaCardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2B211B',
  },

  gunaCardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#777777',
    marginTop: 4,
    marginBottom: 12,
  },

  gunaItem: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#FFF8F2',

    borderRadius: 14,

    paddingVertical: 11,
    paddingHorizontal: 12,

    marginTop: 8,

    borderWidth: 1,
    borderColor: '#FFE4CE',
  },

  gunaCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,

    backgroundColor: '#FFE8D5',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  gunaSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF5A00',
  },

  gunaTextContainer: {
    flex: 1,
  },

  gunaTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF5A00',
  },

  gunaDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#665D56',
    marginTop: 2,
  },

  // =========================
  // INFO CARDS
  // =========================

  infoCard: {
    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 14,

    marginBottom: 11,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#FFE0C2',

    elevation: 2,
  },

  infoIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,

    backgroundColor: '#FFF0DD',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#2B211B',
  },

  infoDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#777777',
    marginTop: 3,
  },

  // =========================
  // START BUTTON
  // =========================

  startButton: {
    height: 55,

    borderRadius: 14,

    backgroundColor: '#FF5A00',

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    marginTop: 5,

    elevation: 4,
  },

  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 8,
  },

});