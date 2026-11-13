import React, {useEffect, useState} from 'react';

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

import {useNavigation, useRoute} from '@react-navigation/native';

import {

  startAssessment,

  saveAssessmentStep,

} from '../../services/api';

// ======================================================

// ACTIVITY TYPES

// ======================================================

const activityTypes = [

  {

    id: 'physical',

    title: 'Physical',

    description: 'Sports, exercise and physical activities',

    icon: 'run',

  },

  {

    id: 'intellectual',

    title: 'Intellectual',

    description: 'Reading, learning and exploring ideas',

    icon: 'book-open-page-variant',

  },

  {

    id: 'creative',

    title: 'Creative',

    description: 'Art, music, dance and creative expression',

    icon: 'palette-outline',

  },

  {

    id: 'emotional',

    title: 'Emotional',

    description: 'Understanding and expressing emotions',

    icon: 'heart-outline',

  },

  {

    id: 'social',

    title: 'Social',

    description: 'Interaction, relationships and community',

    icon: 'account-group-outline',

  },

  {

    id: 'spiritual',

    title: 'Spiritual',

    description: 'Spiritual practices and inner development',

    icon: 'meditation',

  },

  {

    id: 'organisational',

    title: 'Organisational',

    description: 'Planning, organising and coordinating',

    icon: 'clipboard-check-outline',

  },

  {

    id: 'technical',

    title: 'Technical',

    description: 'Technology, tools and practical skills',

    icon: 'laptop',

  },

  {

    id: 'analytical',

    title: 'Analytical',

    description: 'Analysis, logic and problem solving',

    icon: 'brain',

  },

  {

    id: 'communicative',

    title: 'Communicative',

    description: 'Speaking, writing and sharing ideas',

    icon: 'message-text-outline',

  },

  {

    id: 'leadership',

    title: 'Leadership',

    description: 'Leading, guiding and taking responsibility',

    icon: 'account-tie-outline',

  },

  {

    id: 'service',

    title: 'Service-oriented',

    description: 'Helping, supporting and serving others',

    icon: 'hand-heart-outline',

  },

  {

    id: 'exploratory',

    title: 'Exploratory',

    description: 'Discovering, experimenting and trying new things',

    icon: 'compass-outline',

  },

  {

    id: 'contemplative',

    title: 'Contemplative',

    description: 'Reflection, meditation and deep observation',

    icon: 'thought-bubble-outline',

  },

];

// ======================================================

// SCREEN

// ======================================================

const ActivityTypeScreen = () => {

  const navigation = useNavigation();
  const route = useRoute<any>();

  // ====================================================

  // USER / ASSESSMENT

  // ====================================================

  // Temporary user ID.

  // Later this will come from logged-in user authentication.

  const userId = Number(route.params?.userId);

  const assessmentType = 'PERSONALITY';

  // ====================================================

  // START PERSONALITY ASSESSMENT

  // ====================================================

  useEffect(() => {
    if (!Number.isInteger(userId) || userId <= 0) {
      console.log('PERSONALITY assessment: valid userId is missing');
      return;
    }

    const startPersonalityAssessment = async () => {

      try {

        await startAssessment({

          userId,

          assessmentType,

        });

        console.log(

          'PERSONALITY assessment started successfully',

        );

      } catch (error) {

        console.error(

          'Failed to start PERSONALITY assessment:',

          error,

        );

      }

    };

    startPersonalityAssessment();

  }, [userId]);

  const [

    selectedTypes,

    setSelectedTypes,

  ] = useState<string[]>([]);

  // ====================================================

  // SELECT / UNSELECT

  // ====================================================

  const toggleActivityType = (

    id: string,

  ) => {

    setSelectedTypes(

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
      Alert.alert('Unable to continue', 'Your user session was not found. Please go back to the dashboard and reopen the assessment.');
      return;
    }

    try {

      const stepAnswer = {

        step: 'ACTIVITY_TYPE',

        selectedTypes: selectedTypes,

      };

      await saveAssessmentStep({
        userId,
        assessmentType,
        stepAnswer,
      });

      console.log(

        'PERSONALITY Step 1 saved successfully',

      );

      navigation.navigate(

        'ActivitySelection' as never,

        {
          userId,
          selectedTypes,
        } as never,

      );

    } catch (error) {

      console.error('Failed to save PERSONALITY Step 1:', error);
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Unable to save your activity types. Please try again.',
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

        showsVerticalScrollIndicator={

          false

        }

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

              Step 1 of 6

            </Text>

            <Text

              style={styles.progressText}>

              17%

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

            Discover Your Interests

          </Text>

          <Text

            style={styles.subtitle}>

            Start with the activities you enjoy.

            Your interests will help us understand

            your strengths, qualities and natural

            preferences.

          </Text>

        </View>

        {/* ========================================= */}

        {/* SELECTED COUNT */}

        {/* ========================================= */}

        <View

          style={styles.selectionInfo}>

          <Text

            style={

              styles.selectionText

            }>

            Select all that apply

          </Text>

          <View

            style={

              styles.countBadge

            }>

            <Text

              style={

                styles.countText

              }>

              {selectedTypes.length}

            </Text>

          </View>

        </View>

        {/* ========================================= */}

        {/* ACTIVITY TYPES */}

        {/* ========================================= */}

        <View

          style={

            styles.activityContainer

          }>

          {activityTypes.map(

            activity => {

              const isSelected =

                selectedTypes.includes(

                  activity.id,

                );

              return (

                <TouchableOpacity

                  key={activity.id}

                  style={[

                    styles.activityCard,

                    isSelected &&

                      styles.selectedCard,

                  ]}

                  onPress={() =>

                    toggleActivityType(

                      activity.id,

                    )

                  }

                  activeOpacity={0.8}>

                  {/* ICON */}

                  <View

                    style={[

                      styles.iconContainer,

                      isSelected &&

                        styles.selectedIconContainer,

                    ]}>

                    <MaterialCommunityIcons

                      name={

                        activity.icon

                      }

                      size={28}

                      color={

                        isSelected

                          ? '#FFFFFF'

                          : '#FF5A00'

                      }

                    />

                  </View>

                  {/* CONTENT */}

                  <View

                    style={

                      styles.cardContent

                    }>

                    <Text

                      style={[

                        styles.cardTitle,

                        isSelected &&

                          styles.selectedCardTitle,

                      ]}>

                      {

                        activity.title

                      }

                    </Text>

                    <Text

                      style={[

                        styles.cardDescription,

                        isSelected &&

                          styles.selectedCardDescription,

                      ]}>

                      {

                        activity.description

                      }

                    </Text>

                  </View>

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

            selectedTypes.length === 0 &&

              styles.disabledButton,

          ]}

          disabled={

            selectedTypes.length === 0

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

          You can select multiple activity types.

        </Text>

      </ScrollView>

    </SafeAreaView>

  );

};

export default ActivityTypeScreen;

// ======================================================

// STYLES

// ======================================================

const styles =

  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:

        '#FFF7ED',

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

      justifyContent:

        'space-between',

      marginBottom: 20,

    },

    backButton: {

      width: 40,

      height: 40,

      justifyContent:

        'center',

      alignItems:

        'flex-start',

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

      justifyContent:

        'space-between',

      alignItems:

        'center',

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

      backgroundColor:

        '#FFE0C2',

      borderRadius: 10,

      overflow: 'hidden',

    },

    progressFill: {

      width: '17%',

      height: '100%',

      backgroundColor:

        '#FF5A00',

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

    // SELECTION INFO

    // ==================================================

    selectionInfo: {

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent:

        'space-between',

      marginBottom: 12,

    },

    selectionText: {

      fontSize: 15,

      fontWeight: '800',

      color: '#2B211B',

    },

    countBadge: {

      minWidth: 28,

      height: 28,

      paddingHorizontal: 7,

      borderRadius: 14,

      backgroundColor:

        '#FFE0C2',

      justifyContent:

        'center',

      alignItems:

        'center',

    },

    countText: {

      fontSize: 13,

      fontWeight: '900',

      color: '#FF5A00',

    },

    // ==================================================

    // ACTIVITY CARDS

    // ==================================================

    activityContainer: {

      marginBottom: 20,

    },

    activityCard: {

      minHeight: 78,

      backgroundColor:

        '#FFFFFF',

      borderRadius: 16,

      borderWidth: 1.5,

      borderColor:

        '#E8DDD5',

      padding: 13,

      flexDirection: 'row',

      alignItems:

        'center',

      marginBottom: 11,

      elevation: 2,

    },

    selectedCard: {

      backgroundColor:

        '#FFF0DD',

      borderColor:

        '#FF5A00',

      borderWidth: 2,

    },

    // ==================================================

    // ICON

    // ==================================================

    iconContainer: {

      width: 50,

      height: 50,

      borderRadius: 14,

      backgroundColor:

        '#FFF3E7',

      justifyContent:

        'center',

      alignItems:

        'center',

      marginRight: 13,

    },

    selectedIconContainer: {

      backgroundColor:

        '#FF5A00',

    },

    // ==================================================

    // CARD CONTENT

    // ==================================================

    cardContent: {

      flex: 1,

      paddingRight: 8,

    },

    cardTitle: {

      fontSize: 16,

      fontWeight: '900',

      color: '#2B211B',

      marginBottom: 3,

    },

    selectedCardTitle: {

      color: '#D94D00',

    },

    cardDescription: {

      fontSize: 16,

      lineHeight: 17,

      fontWeight: '800',

      color: '#777777',

    },

    selectedCardDescription: {

      color: '#725846',

    },

    // ==================================================

    // CHECK

    // ==================================================

    checkCircle: {

      width: 25,

      height: 25,

      borderRadius: 13,

      borderWidth: 2,

      borderColor:

        '#D5CCC5',

      justifyContent:

        'center',

      alignItems:

        'center',

    },

    selectedCheckCircle: {

      backgroundColor:

        '#FF5A00',

      borderColor:

        '#FF5A00',

    },

    // ==================================================

    // CONTINUE

    // ==================================================

    continueButton: {

      height: 55,

      borderRadius: 15,

      backgroundColor:

        '#FF5A00',

      flexDirection: 'row',

      justifyContent:

        'center',

      alignItems:

        'center',

      elevation: 4,

    },

    disabledButton: {

      backgroundColor:

        '#D8CFC8',

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