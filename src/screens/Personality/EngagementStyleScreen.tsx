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
// ENGAGEMENT STYLE OPTIONS
// ======================================================

const engagementOptions = [
  {
    id: 'independent',
    title: 'Independently',
    description:
      'I prefer doing the activity on my own and working independently.',
  },
  {
    id: 'collaborative',
    title: 'With Others',
    description:
      'I enjoy working, learning or participating with other people.',
  },
  {
    id: 'structured',
    title: 'In a Structured Way',
    description:
      'I prefer a clear plan, routine or organised approach.',
  },
  {
    id: 'experimental',
    title: 'By Experimenting',
    description:
      'I like trying different approaches and discovering what works.',
  },
  {
    id: 'challenge',
    title: 'By Challenging Myself',
    description:
      'I enjoy pushing myself to improve or overcome challenges.',
  },
  {
    id: 'mastery',
    title: 'Focused on Mastery',
    description:
      'I like practising deeply and becoming highly skilled.',
  },
  {
    id: 'casual',
    title: 'Casually',
    description:
      'I enjoy the activity without needing a specific goal or result.',
  },
  {
    id: 'regular',
    title: 'Regularly',
    description:
      'I prefer to practise or engage in the activity consistently.',
  },
  {
    id: 'responsibility',
    title: 'Taking Responsibility',
    description:
      'I enjoy taking ownership and responsibility for the activity.',
  },
  {
    id: 'helping',
    title: 'Helping Others',
    description:
      'I enjoy using the activity to support, teach or help others.',
  },
  {
    id: 'creative',
    title: 'Creatively',
    description:
      'I enjoy expressing my own ideas and creating something different.',
  },
  {
    id: 'exploration',
    title: 'Exploring',
    description:
      'I enjoy discovering new possibilities and experiences.',
  },
];


// ======================================================
// SCREEN
// ======================================================

const EngagementStyleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const userId = Number(route.params?.userId);

  const selectedTypes =
    route.params?.selectedTypes ?? [];

  const selectedActivities =
    route.params?.selectedActivities ?? [];

  const selectedInterests =
    route.params?.selectedInterests ?? {};

  const selectedMotivations =
    route.params?.selectedMotivations ?? [];


  const [
    selectedEngagementStyles,
    setSelectedEngagementStyles,
  ] = useState<string[]>([]);


  // ====================================================
  // SELECT / UNSELECT
  // ====================================================

  const toggleEngagementStyle = (
    id: string,
  ) => {
    setSelectedEngagementStyles(
      previous => {
        if (previous.includes(id)) {
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
        step: 'ENGAGEMENT_STYLE',
        selectedTypes,
        selectedActivities,
        selectedInterests,
        selectedMotivations,
        selectedEngagementStyles,
      };

      await saveAssessmentStep({
        userId,
        assessmentType: 'PERSONALITY',
        stepAnswer,
      });

      console.log(
        'PERSONALITY Step 5 saved successfully',
      );

      navigation.navigate(
        'Qualities' as never,
        {
          userId,
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
          selectedEngagementStyles,
        } as never,
      );
    } catch (error) {
      console.error('Failed to save PERSONALITY Step 5:', error);
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Unable to save your engagement style. Please try again.',
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

        {/* HEADER */}

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


        {/* PROGRESS */}

        <View
          style={styles.progressSection}>

          <View
            style={styles.progressHeader}>

            <Text
              style={styles.stepText}>

              Step 5 of 6

            </Text>

            <Text
              style={styles.progressText}>

              83%

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


        {/* INTRO */}

        <View
          style={styles.introSection}>

          <Text
            style={styles.title}>

            How Do You Engage?

          </Text>

          <Text
            style={styles.subtitle}>

            Think about how you usually
            participate in the activities you
            selected. Choose the options that
            best describe your approach.

          </Text>

        </View>


        {/* INFO */}

        <View
          style={styles.infoCard}>

          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color="#FF5A00"
          />

          <Text
            style={styles.infoText}>

            The way you engage in an activity
            helps us understand your qualities
            and preferences more accurately.

          </Text>

        </View>


        {/* COUNT */}

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

              {selectedEngagementStyles.length}

            </Text>

          </View>

        </View>


        {/* OPTIONS */}

        {engagementOptions.map(
          option => {

            const isSelected =
              selectedEngagementStyles.includes(
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
                  toggleEngagementStyle(
                    option.id,
                  )
                }
                activeOpacity={0.8}>

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


        {/* CONTINUE */}

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedEngagementStyles.length ===
              0 &&
              styles.disabledButton,
          ]}
          disabled={
            selectedEngagementStyles.length ===
            0
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

          Choose the options that genuinely
          describe your usual approach.

        </Text>

      </ScrollView>

    </SafeAreaView>
  );
};


export default EngagementStyleScreen;


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
      width: '83%',
      height: '100%',
      backgroundColor: '#FF5A00',
      borderRadius: 10,
    },

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

    infoCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#FFF0DD',
      borderRadius: 15,
      borderWidth: 1,
      borderColor: '#FFD7B0',
      padding: 13,
      marginBottom: 18,
    },

    infoText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: '600',
      color: '#665D56',
      marginLeft: 9,
    },

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