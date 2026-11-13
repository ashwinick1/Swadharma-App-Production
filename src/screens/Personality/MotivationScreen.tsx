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
// MOTIVATION OPTIONS
// ======================================================

const motivationOptions = [
  {
    id: 'learning',
    title: 'Learning',
    description:
      'I enjoy learning and understanding new things.',
  },
  {
    id: 'achievement',
    title: 'Achievement',
    description:
      'I am motivated by achieving goals and results.',
  },
  {
    id: 'creativity',
    title: 'Creativity',
    description:
      'I enjoy creating, expressing and developing ideas.',
  },
  {
    id: 'competition',
    title: 'Competition',
    description:
      'I enjoy challenges and competing with others.',
  },
  {
    id: 'helping',
    title: 'Helping Others',
    description:
      'I feel motivated when I can help or support others.',
  },
  {
    id: 'exploration',
    title: 'Exploration',
    description:
      'I enjoy discovering new things and experiences.',
  },
  {
    id: 'self_development',
    title: 'Self Development',
    description:
      'I enjoy improving myself and developing my abilities.',
  },
  {
    id: 'recognition',
    title: 'Recognition',
    description:
      'Appreciation and recognition motivate me.',
  },
  {
    id: 'relaxation',
    title: 'Relaxation',
    description:
      'I engage in activities because they help me relax.',
  },
  {
    id: 'inner_growth',
    title: 'Inner Growth',
    description:
      'I am motivated by reflection and inner development.',
  },
  {
    id: 'problem_solving',
    title: 'Problem Solving',
    description:
      'I enjoy finding solutions to difficult problems.',
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description:
      'I enjoy working and achieving things with others.',
  },
];


// ======================================================
// SCREEN
// ======================================================

const MotivationScreen = () => {

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


  // ====================================================
  // SELECTED MOTIVATIONS
  // ====================================================

  const [
    selectedMotivations,
    setSelectedMotivations,
  ] = useState<string[]>([]);


  // ====================================================
  // SELECT / UNSELECT
  // ====================================================

  const toggleMotivation = (
    id: string,
  ) => {

    setSelectedMotivations(
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
        step: 'MOTIVATION',
        selectedTypes,
        selectedActivities,
        selectedInterests,
        selectedMotivations,
      };

      await saveAssessmentStep({
        userId,
        assessmentType: 'PERSONALITY',
        stepAnswer,
      });

      console.log(
        'PERSONALITY Step 4 saved successfully',
      );

      navigation.navigate(
        'EngagementStyle' as never,
        {
          userId,
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
        } as never,
      );

    } catch (error) {
      console.error('Failed to save PERSONALITY Step 4:', error);
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Unable to save your motivations. Please try again.',
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

              Step 4 of 6

            </Text>

            <Text
              style={styles.progressText}>

              67%

            </Text>

          </View>

          <View
            style={styles.progressBackground}>

            <View
              style={styles.progressFill}
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

            What Motivates You?

          </Text>

          <Text
            style={styles.subtitle}>

            Think about why you enjoy the
            activities you selected. Choose the
            motivations that best describe you.

          </Text>

        </View>


        {/* ========================================= */}
        {/* SELECTED COUNT */}
        {/* ========================================= */}

        <View
          style={styles.selectionInfo}>

          <Text
            style={styles.selectionText}>

            Select all that apply

          </Text>

          <View
            style={styles.countBadge}>

            <Text
              style={styles.countText}>

              {selectedMotivations.length}

            </Text>

          </View>

        </View>


        {/* ========================================= */}
        {/* MOTIVATION OPTIONS */}
        {/* ========================================= */}

        <View>

          {motivationOptions.map(
            option => {

              const isSelected =
                selectedMotivations.includes(
                  option.id,
                );

              return (

                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,

                    isSelected &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    toggleMotivation(
                      option.id,
                    )
                  }
                  activeOpacity={0.8}>

                  {/* RADIO */}

                  <View
                    style={[
                      styles.radioCircle,

                      isSelected &&
                        styles.selectedRadio,
                    ]}>

                    {isSelected && (
                      <View
                        style={
                          styles.radioDot
                        }
                      />
                    )}

                  </View>


                  {/* CONTENT */}

                  <View
                    style={
                      styles.optionContent
                    }>

                    <Text
                      style={[
                        styles.optionTitle,

                        isSelected &&
                          styles.selectedOptionTitle,
                      ]}>

                      {option.title}

                    </Text>

                    <Text
                      style={
                        styles.optionDescription
                      }>

                      {option.description}

                    </Text>

                  </View>

                </TouchableOpacity>

              );
            },
          )}

        </View>


        {/* ========================================= */}
        {/* CONTINUE */}
        {/* ========================================= */}

        <TouchableOpacity
          style={[
            styles.continueButton,

            selectedMotivations.length === 0 &&
              styles.disabledButton,
          ]}
          disabled={
            selectedMotivations.length === 0
          }
          onPress={
            handleContinue
          }>

          <Text
            style={
              styles.continueText
            }>

            Continue

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

          There are no right or wrong answers.

        </Text>

      </ScrollView>

    </SafeAreaView>
  );
};


export default MotivationScreen;


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
      width: '67%',
      height: '100%',
      backgroundColor: '#FF5A00',
      borderRadius: 10,
    },

    // ==================================================
    // INTRO
    // ==================================================

    introSection: {
      marginBottom: 20,
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
    // OPTION CARD
    // ==================================================

    optionCard: {
      minHeight: 72,
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

    selectedOption: {
      backgroundColor: '#FFF0DD',
      borderColor: '#FF5A00',
      borderWidth: 2,
    },

    // ==================================================
    // RADIO
    // ==================================================

    radioCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#BDB5AE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 13,
    },

    selectedRadio: {
      borderColor: '#FF5A00',
    },

    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FF5A00',
    },

    // ==================================================
    // CONTENT
    // ==================================================

    optionContent: {
      flex: 1,
    },

    optionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: '#2B211B',
      marginBottom: 3,
    },

    selectedOptionTitle: {
      color: '#D94D00',
      fontWeight: '900',
    },

    optionDescription: {
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