import React, {useState} from 'react';

import {
  Alert,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  saveAssessmentStep,
} from '../../services/api';


// ======================================================
// QUALITY OPTIONS
// ======================================================

const qualityOptions = [
  {
    id: 'creativity',
    title: 'Creativity',
    description:
      'Ability to generate ideas, express yourself and create something new.',
  },

  {
    id: 'logical_thinking',
    title: 'Logical Thinking',
    description:
      'Ability to reason, analyse information and understand relationships.',
  },

  {
    id: 'problem_solving',
    title: 'Problem Solving',
    description:
      'Ability to identify problems and find practical solutions.',
  },

  {
    id: 'curiosity',
    title: 'Curiosity',
    description:
      'Interest in discovering, questioning and learning new things.',
  },

  {
    id: 'discipline',
    title: 'Discipline',
    description:
      'Ability to maintain consistency, practice and follow through.',
  },

  {
    id: 'patience',
    title: 'Patience',
    description:
      'Ability to remain steady and continue without rushing.',
  },

  {
    id: 'concentration',
    title: 'Concentration',
    description:
      'Ability to focus attention on a task or subject.',
  },

  {
    id: 'adaptability',
    title: 'Adaptability',
    description:
      'Ability to adjust to changes and different situations.',
  },

  {
    id: 'communication',
    title: 'Communication',
    description:
      'Ability to express ideas and understand other people.',
  },

  {
    id: 'teamwork',
    title: 'Teamwork',
    description:
      'Ability to cooperate, coordinate and work effectively with others.',
  },

  {
    id: 'leadership',
    title: 'Leadership',
    description:
      'Ability to guide, coordinate and take responsibility.',
  },

  {
    id: 'empathy',
    title: 'Empathy',
    description:
      'Ability to understand and respond to the feelings of others.',
  },

  {
    id: 'reflection',
    title: 'Reflection',
    description:
      'Tendency to examine experiences, thoughts and behaviour deeply.',
  },

  {
    id: 'self_awareness',
    title: 'Self Awareness',
    description:
      'Understanding of your own thoughts, emotions, strengths and behaviour.',
  },

  {
    id: 'organisation',
    title: 'Organisation',
    description:
      'Ability to structure tasks, information, time and resources.',
  },

  {
    id: 'strategic_thinking',
    title: 'Strategic Thinking',
    description:
      'Ability to think ahead, understand systems and plan for outcomes.',
  },

  {
    id: 'initiative',
    title: 'Initiative',
    description:
      'Tendency to take action and begin work without waiting for direction.',
  },

  {
    id: 'responsibility',
    title: 'Responsibility',
    description:
      'Willingness to take ownership of tasks and outcomes.',
  },

  {
    id: 'service_orientation',
    title: 'Service Orientation',
    description:
      'Interest in helping, supporting and contributing to others.',
  },

  {
    id: 'exploration',
    title: 'Exploration',
    description:
      'Interest in discovering new places, ideas, experiences or possibilities.',
  },
];


// ======================================================
// SCREEN
// ======================================================

const QualitiesScreen = () => {

  const navigation = useNavigation();

  const route = useRoute<any>();
  const userId = Number(route.params?.userId);


  // ====================================================
  // DATA FROM PREVIOUS SCREENS
  // ====================================================

  const selectedTypes =
    route.params?.selectedTypes ?? [];

  const selectedActivities =
    route.params?.selectedActivities ?? [];

  const selectedInterests =
    route.params?.selectedInterests ?? {};

  const selectedMotivations =
    route.params?.selectedMotivations ?? [];

  const selectedEngagementStyles =
    route.params?.selectedEngagementStyles ?? [];


  // ====================================================
  // SELECTED QUALITIES
  // ====================================================

  const [
    selectedQualities,
    setSelectedQualities,
  ] = useState<string[]>([]);


  // ====================================================
  // TOGGLE QUALITY
  // ====================================================

  const toggleQuality = (
    id: string,
  ) => {

    setSelectedQualities(
      previous => {

        if (
          previous.includes(id)
        ) {

          return previous.filter(
            item => item !== id,
          );

        }

        return [
          ...previous,
          id,
        ];

      },
    );

  };


  // ====================================================
  // CONTINUE
  // ====================================================

  const handleContinue = async () => {
    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert('Unable to continue', 'Your user session was not found. Please reopen the Personality assessment from the dashboard.');
      return;
    }

    try {
      const stepAnswer = {
        step: 'QUALITIES',
        selectedTypes,
        selectedActivities,
        selectedInterests,
        selectedMotivations,
        selectedEngagementStyles,
        selectedQualities,
      };

      await saveAssessmentStep({
        userId,
        assessmentType: 'PERSONALITY',
        stepAnswer,
      });

      console.log('PERSONALITY Step 6 saved successfully');

      navigation.navigate(
        'InterestProfile' as never,
        {
          userId,
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
          selectedEngagementStyles,
          selectedQualities,
        } as never,
      );
    } catch (error) {
      console.error('Failed to save PERSONALITY Step 6:', error);
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Unable to save your selected qualities. Please try again.',
      );
    }
  };


  // ====================================================
  // UI
  // ====================================================

  return (
    <SafeAreaView
      style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <View
          style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={styles.backButton}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF5A00"
            />

          </TouchableOpacity>


          <Text
            style={styles.headerTitle}>

            Personality & Interest

          </Text>


          <View
            style={styles.headerSpace}
          />

        </View>


        {/* ========================================= */}
        {/* PROGRESS */}
        {/* ========================================= */}

        <View
          style={styles.progressSection}>

          <View
            style={styles.progressHeader}>

            <Text
              style={styles.stepText}>

              Step 6 of 6

            </Text>


            <Text
              style={styles.progressText}>

              100%

            </Text>

          </View>


          <View
            style={
              styles.progressBackground
            }>

            <View
              style={
                styles.progressFill
              }
            />

          </View>

        </View>


        {/* ========================================= */}
        {/* INTRO */}
        {/* ========================================= */}

        <View
          style={styles.introSection}>

          <Text
            style={styles.title}>

            Your Qualities

          </Text>


          <Text
            style={styles.subtitle}>

            Based on the activities and interests
            you selected, choose the qualities
            that best describe you.

          </Text>

        </View>


        {/* ========================================= */}
        {/* MODEL INFO */}
        {/* ========================================= */}

        <View
          style={styles.infoCard}>

          <MaterialCommunityIcons
            name="account-search-outline"
            size={23}
            color="#FF5A00"
          />


          <View
            style={
              styles.infoContent
            }>

            <Text
              style={
                styles.infoTitle
              }>

              Activity-to-Profile Model

            </Text>


            <Text
              style={
                styles.infoText
              }>

              Activities reveal preferences and
              patterns. These patterns help identify
              qualities that may later connect to
              fields, roles and professions.

            </Text>

          </View>

        </View>


        {/* ========================================= */}
        {/* SELECTED COUNT */}
        {/* ========================================= */}

        <View
          style={styles.selectionInfo}>

          <Text
            style={styles.selectionText}>

            Select your key qualities

          </Text>


          <View
            style={styles.countBadge}>

            <Text
              style={styles.countText}>

              {selectedQualities.length}

            </Text>

          </View>

        </View>


        {/* ========================================= */}
        {/* QUALITY OPTIONS */}
        {/* ========================================= */}

        {qualityOptions.map(
          quality => {

            const isSelected =
              selectedQualities.includes(
                quality.id,
              );


            return (

              <TouchableOpacity
                key={quality.id}
                style={[
                  styles.qualityCard,

                  isSelected &&
                    styles.selectedQualityCard,
                ]}
                onPress={() =>
                  toggleQuality(
                    quality.id,
                  )
                }
                activeOpacity={0.8}>


                {/* CHECK */}

                <View
                  style={[
                    styles.checkCircle,

                    isSelected &&
                      styles.selectedCheckCircle,
                  ]}>

                  {isSelected && (

                    <MaterialCommunityIcons
                      name="check"
                      size={17}
                      color="#FFFFFF"
                    />

                  )}

                </View>


                {/* CONTENT */}

                <View
                  style={
                    styles.qualityContent
                  }>

                  <Text
                    style={[
                      styles.qualityTitle,

                      isSelected &&
                        styles.selectedQualityTitle,
                    ]}>

                    {quality.title}

                  </Text>


                  <Text
                    style={
                      styles.qualityDescription
                    }>

                    {quality.description}

                  </Text>

                </View>

              </TouchableOpacity>

            );

          },
        )}


        {/* ========================================= */}
        {/* CONTINUE */}
        {/* ========================================= */}

        <TouchableOpacity
          style={[
            styles.continueButton,

            selectedQualities.length ===
              0 &&
              styles.disabledButton,
          ]}
          disabled={
            selectedQualities.length ===
            0
          }
          onPress={
            handleContinue
          }>

          <Text
            style={
              styles.continueText
            }>

            View My Profile

          </Text>


          <MaterialCommunityIcons
            name="arrow-right"
            size={22}
            color="#FFFFFF"
          />

        </TouchableOpacity>


        <Text
          style={
            styles.bottomText
          }>

          Select the qualities that genuinely
          describe you.

        </Text>

      </ScrollView>

    </SafeAreaView>
  );
};


export default QualitiesScreen;


// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#FFF7ED',
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },


    // ==================================================
    // HEADER
    // ==================================================

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
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


    // ==================================================
    // PROGRESS
    // ==================================================

    progressSection: {
      marginBottom: 25,
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },

    stepText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#4A4039',
    },

    progressText: {
      fontSize: 14,
      fontWeight: '900',
      color: '#FF5A00',
    },

    progressBackground: {
      height: 8,
      backgroundColor: '#FFE0C2',
      borderRadius: 10,
      overflow: 'hidden',
    },

    progressFill: {
      width: '100%',
      height: '100%',
      backgroundColor: '#FF5A00',
      borderRadius: 10,
    },


    // ==================================================
    // INTRO
    // ==================================================

    introSection: {
      marginBottom: 18,
    },

    title: {
      fontSize: 25,
      fontWeight: '900',
      color: '#2B211B',
      marginBottom: 8,
    },

    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '600',
      color: '#6E625A',
    },


    // ==================================================
    // INFO CARD
    // ==================================================

    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',

      backgroundColor: '#FFF0DD',

      borderRadius: 16,

      borderWidth: 1,

      borderColor: '#FFD7B0',

      padding: 14,

      marginBottom: 20,
    },

    infoContent: {
      flex: 1,
      marginLeft: 10,
    },

    infoTitle: {
      fontSize: 15,
      fontWeight: '900',
      color: '#D94D00',
      marginBottom: 4,
    },

    infoText: {
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
      color: '#665D56',
    },


    // ==================================================
    // SELECTION
    // ==================================================

    selectionInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },

    selectionText: {
      fontSize: 15,
      fontWeight: '800',
      color: '#2B211B',
    },

    countBadge: {
      minWidth: 30,
      height: 30,
      paddingHorizontal: 8,
      borderRadius: 15,
      backgroundColor: '#FFE0C2',
      justifyContent: 'center',
      alignItems: 'center',
    },

    countText: {
      fontSize: 13,
      fontWeight: '900',
      color: '#FF5A00',
    },


    // ==================================================
    // QUALITY CARD
    // ==================================================

    qualityCard: {
      minHeight: 76,

      backgroundColor: '#FFFFFF',

      borderRadius: 16,

      borderWidth: 1.5,

      borderColor: '#E8DDD5',

      flexDirection: 'row',

      alignItems: 'center',

      padding: 13,

      marginBottom: 11,

      elevation: 2,
    },

    selectedQualityCard: {
      backgroundColor: '#FFF0DD',

      borderColor: '#FF5A00',

      borderWidth: 2,
    },


    // ==================================================
    // CHECK
    // ==================================================

    checkCircle: {
      width: 25,
      height: 25,

      borderRadius: 13,

      borderWidth: 2,

      borderColor: '#BDB5AE',

      justifyContent: 'center',

      alignItems: 'center',

      marginRight: 13,
    },

    selectedCheckCircle: {
      backgroundColor: '#FF5A00',

      borderColor: '#FF5A00',
    },


    // ==================================================
    // CONTENT
    // ==================================================

    qualityContent: {
      flex: 1,
    },

    qualityTitle: {
      fontSize: 16,

      fontWeight: '800',

      color: '#2B211B',

      marginBottom: 3,
    },

    selectedQualityTitle: {
      color: '#D94D00',

      fontWeight: '900',
    },

    qualityDescription: {
      fontSize: 12,

      lineHeight: 17,

      fontWeight: '600',

      color: '#777777',
    },


    // ==================================================
    // BUTTON
    // ==================================================

    continueButton: {
      height: 55,

      borderRadius: 15,

      backgroundColor: '#FF5A00',

      flexDirection: 'row',

      justifyContent: 'center',

      alignItems: 'center',

      marginTop: 10,

      elevation: 4,
    },

    disabledButton: {
      backgroundColor: '#D8CFC8',

      elevation: 0,
    },

    continueText: {
      color: '#FFFFFF',

      fontSize: 16,

      fontWeight: '900',

      marginRight: 8,
    },

    bottomText: {
      textAlign: 'center',

      marginTop: 10,

      fontSize: 12,

      fontWeight: '600',

      color: '#8A7D73',
    },

  });