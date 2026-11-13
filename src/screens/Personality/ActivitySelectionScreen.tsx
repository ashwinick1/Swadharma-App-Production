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
// ACTIVITY DATA
// ======================================================
const activitiesByType: any = {
  physical: [
    {
      id: 'cricket',
      title: 'Playing Cricket',
      icon: 'cricket',
    },
    {
      id: 'football',
      title: 'Playing Football',
      icon: 'soccer',
    },
    {
      id: 'running',
      title: 'Running',
      icon: 'run',
    },
    {
      id: 'swimming',
      title: 'Swimming',
      icon: 'swim',
    },
    {
      id: 'yoga',
      title: 'Yoga',
      icon: 'meditation',
    },
    {
      id: 'gym',
      title: 'Gym / Workout',
      icon: 'dumbbell',
    },
  ],
  intellectual: [
    {
      id: 'reading',
      title: 'Reading',
      icon: 'book-open-page-variant',
    },
    {
      id: 'research',
      title: 'Research',
      icon: 'file-search-outline',
    },
    {
      id: 'mathematics',
      title: 'Solving Mathematical Problems',
      icon: 'calculator-variant-outline',
    },
    {
      id: 'learning',
      title: 'Learning New Concepts',
      icon: 'school-outline',
    },
    {
      id: 'history',
      title: 'Studying History',
      icon: 'book-outline',
    },
    {
      id: 'science',
      title: 'Learning Science',
      icon: 'flask-outline',
    },
  ],
  creative: [
    {
      id: 'drawing',
      title: 'Drawing / Painting',
      icon: 'palette-outline',
    },
    {
      id: 'music',
      title: 'Music',
      icon: 'music',
    },
    {
      id: 'dance',
      title: 'Dance',
      icon: 'human-female-dance',
    },
    {
      id: 'photography',
      title: 'Photography',
      icon: 'camera-outline',
    },
    {
      id: 'craft',
      title: 'Craft / Handmade Work',
      icon: 'creation',
    },
    {
      id: 'story_writing',
      title: 'Story Writing',
      icon: 'pencil-outline',
    },
  ],
  emotional: [
    {
      id: 'journaling',
      title: 'Journaling',
      icon: 'notebook-outline',
    },
    {
      id: 'self_reflection',
      title: 'Self Reflection',
      icon: 'account-search-outline',
    },
    {
      id: 'emotional_support',
      title: 'Supporting Others Emotionally',
      icon: 'heart-outline',
    },
  ],
  social: [
    {
      id: 'socialising',
      title: 'Socialising',
      icon: 'account-group-outline',
    },
    {
      id: 'group_activities',
      title: 'Group Activities',
      icon: 'account-multiple-outline',
    },
    {
      id: 'community',
      title: 'Community Activities',
      icon: 'account-multiple-check-outline',
    },
    {
      id: 'networking',
      title: 'Networking',
      icon: 'account-network-outline',
    },
  ],
  spiritual: [
    {
      id: 'meditation',
      title: 'Meditation',
      icon: 'meditation',
    },
    {
      id: 'prayer',
      title: 'Prayer',
      icon: 'hands-pray',
    },
    {
      id: 'spiritual_reading',
      title: 'Spiritual Reading',
      icon: 'book-open-outline',
    },
    {
      id: 'spiritual_practice',
      title: 'Spiritual Practices',
      icon: 'flower-outline',
    },
  ],
  organisational: [
    {
      id: 'planning',
      title: 'Planning',
      icon: 'calendar-check-outline',
    },
    {
      id: 'event_organising',
      title: 'Organising Events',
      icon: 'calendar-multiselect',
    },
    {
      id: 'project_management',
      title: 'Managing Projects',
      icon: 'clipboard-text-outline',
    },
    {
      id: 'scheduling',
      title: 'Scheduling Activities',
      icon: 'calendar-clock-outline',
    },
  ],
  technical: [
    {
      id: 'coding',
      title: 'Coding / Programming',
      icon: 'code-tags',
    },
    {
      id: 'technology',
      title: 'Exploring Technology',
      icon: 'laptop',
    },
    {
      id: 'electronics',
      title: 'Electronics',
      icon: 'chip',
    },
    {
      id: 'technical_projects',
      title: 'Technical Projects',
      icon: 'tools',
    },
  ],
  analytical: [
    {
      id: 'problem_solving',
      title: 'Problem Solving',
      icon: 'puzzle-outline',
    },
    {
      id: 'data_analysis',
      title: 'Data Analysis',
      icon: 'chart-box-outline',
    },
    {
      id: 'strategy',
      title: 'Strategy / Planning',
      icon: 'chess-queen',
    },
    {
      id: 'logic',
      title: 'Logical Reasoning',
      icon: 'brain',
    },
  ],
  communicative: [
    {
      id: 'public_speaking',
      title: 'Public Speaking',
      icon: 'microphone-outline',
    },
    {
      id: 'writing',
      title: 'Writing',
      icon: 'pencil-outline',
    },
    {
      id: 'teaching',
      title: 'Teaching',
      icon: 'teach',
    },
    {
      id: 'storytelling',
      title: 'Storytelling',
      icon: 'book-open-outline',
    },
  ],
  leadership: [
    {
      id: 'leading_team',
      title: 'Leading a Team',
      icon: 'account-tie-outline',
    },
    {
      id: 'decision_making',
      title: 'Decision Making',
      icon: 'gavel',
    },
    {
      id: 'guiding_people',
      title: 'Guiding Others',
      icon: 'account-supervisor-outline',
    },
    {
      id: 'taking_responsibility',
      title: 'Taking Responsibility',
      icon: 'shield-account-outline',
    },
  ],
  service: [
    {
      id: 'helping_people',
      title: 'Helping People',
      icon: 'hand-heart-outline',
    },
    {
      id: 'volunteering',
      title: 'Volunteering',
      icon: 'account-heart-outline',
    },
    {
      id: 'community_service',
      title: 'Community Service',
      icon: 'hand-heart',
    },
  ],
  exploratory: [
    {
      id: 'travel',
      title: 'Travelling',
      icon: 'airplane',
    },
    {
      id: 'new_experiences',
      title: 'Trying New Experiences',
      icon: 'compass-outline',
    },
    {
      id: 'exploring_places',
      title: 'Exploring New Places',
      icon: 'map-marker-outline',
    },
    {
      id: 'experimenting',
      title: 'Experimenting',
      icon: 'flask-outline',
    },
  ],
  contemplative: [
    {
      id: 'meditation_contemplation',
      title: 'Meditation / Contemplation',
      icon: 'meditation',
    },
    {
      id: 'nature_observation',
      title: 'Observing Nature',
      icon: 'nature',
    },
    {
      id: 'quiet_reflection',
      title: 'Quiet Reflection',
      icon: 'thought-bubble-outline',
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      icon: 'flower-outline',
    },
  ],
};
// ======================================================
// CATEGORY TITLES
// ======================================================
const categoryTitles: any = {
  physical: 'Physical',
  intellectual: 'Intellectual',
  creative: 'Creative',
  emotional: 'Emotional',
  social: 'Social',
  spiritual: 'Spiritual',
  organisational: 'Organisational',
  technical: 'Technical',
  analytical: 'Analytical',
  communicative: 'Communicative',
  leadership: 'Leadership',
  service: 'Service-oriented',
  exploratory: 'Exploratory',
  contemplative: 'Contemplative',
};
// ======================================================
// SCREEN
// ======================================================
const ActivitySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const userId = Number(route.params?.userId);
  const [isSaving, setIsSaving] = useState(false);
  // ====================================================
  // SELECTED ACTIVITY TYPES
  // ====================================================
  const selectedTypes = Array.isArray(route.params?.selectedTypes)
    ? route.params.selectedTypes
    : [];
  // ====================================================
  // SELECTED ACTIVITIES
  // ====================================================
  const [
    selectedActivities,
    setSelectedActivities,
  ] = useState<string[]>([]);
  // ====================================================
  // SELECT / UNSELECT ACTIVITY
  // ====================================================
  const toggleActivity = (
    activityId: string,
  ) => {
    setSelectedActivities(
      previous => {
        if (
          previous.includes(
            activityId,
          )
        ) {
          return previous.filter(
            item =>
              item !== activityId,
          );
        }
        return [
          ...previous,
          activityId,
        ];
      },
    );
  };
  // ====================================================
  // CONTINUE
  // ====================================================
  const handleContinue = async () => {
    if (isSaving) {
      return;
    }
    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert(
        'Unable to continue',
        'Your user session was not found. Please go back and reopen the assessment.',
      );
      return;
    }
    if (selectedActivities.length === 0) {
      Alert.alert(
        'Select activities',
        'Please select at least one activity to continue.',
      );
      return;
    }
    setIsSaving(true);
    try {
      const stepAnswer = {
        step: 'ACTIVITY_SELECTION',
        selectedTypes,
        selectedActivities,
      };
      await saveAssessmentStep({
        userId,
        assessmentType: 'PERSONALITY',
        stepAnswer,
      });
      console.log(
        'PERSONALITY Step 2 saved and verified successfully',
      );
      navigation.navigate(
        'SpecificInterest' as never,
        {
          userId,
          selectedTypes,
          selectedActivities,
        } as never,
      );
    } catch (error) {
      console.error(
        'Failed to save PERSONALITY Step 2:',
        error,
      );
      Alert.alert(
        'Save Failed',
        error instanceof Error
          ? error.message
          : 'Unable to save your selected activities. Please try again.',
      );
    } finally {
      setIsSaving(false);
    }
  };
  // ====================================================
  // PREVIOUS
  // ====================================================
  const handlePrevious = () => {
    navigation.goBack();
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
            onPress={
              handlePrevious
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
              Step 2 of 6
            </Text>
            <Text
              style={styles.progressText}>
              33%
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
        {/* TITLE */}
        {/* ========================================= */}
        <View
          style={styles.introSection}>
          <Text
            style={styles.title}>
            Choose Your Activities
          </Text>
          <Text
            style={styles.subtitle}>
            Select the activities you enjoy,
            practise or participate in. You can
            select more than one.
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
            Activities Selected
          </Text>
          <View
            style={
              styles.countBadge
            }>
            <Text
              style={
                styles.countText
              }>
              {
                selectedActivities.length
              }
            </Text>
          </View>
        </View>
        {/* ========================================= */}
        {/* ACTIVITIES BY CATEGORY */}
        {/* ========================================= */}
        {selectedTypes.map(
          (type: string) => {
            const activities =
              activitiesByType[
                type
              ] ?? [];
            if (
              activities.length === 0
            ) {
              return null;
            }
            return (
              <View
                key={type}
                style={
                  styles.categorySection
                }>
                {/* CATEGORY TITLE */}
                <Text
                  style={
                    styles.categoryTitle
                  }>
                  {
                    categoryTitles[
                      type
                    ] ?? type
                  }
                </Text>
                {/* ACTIVITIES */}
                {activities.map(
                  (activity: any) => {
                    const isSelected =
                      selectedActivities.includes(
                        activity.id,
                      );
                    return (
                      <TouchableOpacity
                        key={
                          activity.id
                        }
                        style={[
                          styles.activityCard,
                          isSelected &&
                            styles.selectedCard,
                        ]}
                        onPress={() =>
                          toggleActivity(
                            activity.id,
                          )
                        }
                        activeOpacity={
                          0.8
                        }>
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
                            size={26}
                            color={
                              isSelected
                                ? '#FFFFFF'
                                : '#FF5A00'
                            }
                          />
                        </View>
                        {/* NAME */}
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
            );
          },
        )}
        {/* ========================================= */}
        {/* CONTINUE */}
        {/* ========================================= */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedActivities.length === 0 || isSaving) &&
              styles.disabledButton,
          ]}
          disabled={
            selectedActivities.length === 0 || isSaving
          }
          onPress={
            handleContinue
          }>
          <Text
            style={
              styles.continueText
            }>
            {isSaving ? 'Saving...' : 'Continue'}
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
          Select all activities that genuinely
          interest you.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ActivitySelectionScreen;
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
      width: '33%',
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
      fontSize: 18,
      lineHeight: 21,
      fontWeight: '900',
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
      marginBottom: 15,
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
    // CATEGORY
    // ==================================================
    categorySection: {
      marginBottom: 12,
    },
    categoryTitle: {
      fontSize: 19,
      fontWeight: '900',
      color: '#FF5A00',
      marginBottom: 10,
      marginTop: 5,
    },
    // ==================================================
    // ACTIVITY CARD
    // ==================================================
    activityCard: {
      minHeight: 64,
      backgroundColor:
        '#FFFFFF',
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor:
        '#E8DDD5',
      paddingHorizontal: 13,
      flexDirection: 'row',
      alignItems:
        'center',
      marginBottom: 10,
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
      width: 46,
      height: 46,
      borderRadius: 13,
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
    // CONTENT
    // ==================================================
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: '#2B211B',
    },
    selectedCardTitle: {
      color: '#D94D00',
      fontWeight: '900',
      fontSize: 18,
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
      marginTop: 15,
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