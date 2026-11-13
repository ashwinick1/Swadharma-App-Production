import React from 'react';

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
  completeAssessment,
} from '../../services/api';


// ======================================================
// ACTIVITY NAMES
// ======================================================

const activityNames: any = {
  cricket: 'Playing Cricket',
  football: 'Playing Football',
  running: 'Running',
  swimming: 'Swimming',
  yoga: 'Yoga',
  gym: 'Gym / Workout',

  reading: 'Reading',
  research: 'Research',
  mathematics: 'Solving Mathematical Problems',
  learning: 'Learning New Concepts',
  history: 'Studying History',
  science: 'Learning Science',

  drawing: 'Drawing / Painting',
  music: 'Music',
  dance: 'Dance',
  photography: 'Photography',
  craft: 'Craft / Handmade Work',
  story_writing: 'Story Writing',

  journaling: 'Journaling',
  self_reflection: 'Self Reflection',
  emotional_support: 'Supporting Others Emotionally',

  socialising: 'Socialising',
  group_activities: 'Group Activities',
  community: 'Community Activities',
  networking: 'Networking',

  meditation: 'Meditation',
  prayer: 'Prayer',
  spiritual_reading: 'Spiritual Reading',
  spiritual_practice: 'Spiritual Practices',

  planning: 'Planning',
  event_organising: 'Organising Events',
  project_management: 'Managing Projects',
  scheduling: 'Scheduling Activities',

  coding: 'Coding / Programming',
  technology: 'Exploring Technology',
  electronics: 'Electronics',
  technical_projects: 'Technical Projects',

  problem_solving: 'Problem Solving',
  data_analysis: 'Data Analysis',
  strategy: 'Strategy / Planning',
  logic: 'Logical Reasoning',

  public_speaking: 'Public Speaking',
  writing: 'Writing',
  teaching: 'Teaching',
  storytelling: 'Storytelling',

  leading_team: 'Leading a Team',
  decision_making: 'Decision Making',
  guiding_people: 'Guiding Others',
  taking_responsibility: 'Taking Responsibility',

  helping_people: 'Helping People',
  volunteering: 'Volunteering',
  community_service: 'Community Service',

  travel: 'Travelling',
  new_experiences: 'Trying New Experiences',
  exploring_places: 'Exploring New Places',
  experimenting: 'Experimenting',

  meditation_contemplation:
    'Meditation / Contemplation',

  nature_observation:
    'Observing Nature',

  quiet_reflection:
    'Quiet Reflection',

  mindfulness:
    'Mindfulness',
};


// ======================================================
// MOTIVATION NAMES
// ======================================================

const motivationNames: any = {
  learning: 'Learning',
  achievement: 'Achievement',
  creativity: 'Creativity',
  competition: 'Competition',
  helping: 'Helping Others',
  exploration: 'Exploration',
  self_development: 'Self Development',
  recognition: 'Recognition',
  relaxation: 'Relaxation',
  inner_growth: 'Inner Growth',
  problem_solving: 'Problem Solving',
  collaboration: 'Collaboration',
};


// ======================================================
// ENGAGEMENT NAMES
// ======================================================

const engagementNames: any = {
  independent: 'Independently',
  collaborative: 'With Others',
  structured: 'In a Structured Way',
  experimental: 'By Experimenting',
  challenge: 'By Challenging Myself',
  mastery: 'Focused on Mastery',
  casual: 'Casually',
  regular: 'Regularly',
  responsibility: 'Taking Responsibility',
  helping: 'Helping Others',
  creative: 'Creatively',
  exploration: 'Exploring',
};


// ======================================================
// QUALITY NAMES
// ======================================================

const qualityNames: any = {
  creativity: 'Creativity',
  logical_thinking: 'Logical Thinking',
  problem_solving: 'Problem Solving',
  curiosity: 'Curiosity',
  discipline: 'Discipline',
  patience: 'Patience',
  concentration: 'Concentration',
  adaptability: 'Adaptability',
  communication: 'Communication',
  teamwork: 'Teamwork',
  leadership: 'Leadership',
  empathy: 'Empathy',
  reflection: 'Reflection',
  self_awareness: 'Self Awareness',
  organisation: 'Organisation',
  strategic_thinking: 'Strategic Thinking',
  initiative: 'Initiative',
  responsibility: 'Responsibility',
  service_orientation: 'Service Orientation',
  exploration: 'Exploration',
};


// ======================================================
// FIELD MAPPING
// ======================================================

const fieldMapping: any = {
  reading: 'Education / Research',
  research: 'Research / Analysis',
  mathematics: 'Mathematics / Engineering',
  science: 'Science / Research',

  coding: 'Technology / Software',
  technology: 'Technology / Innovation',

  cricket: 'Sports',
  football: 'Sports',

  drawing: 'Arts / Design',
  music: 'Music / Performing Arts',
  dance: 'Performing Arts',
  photography: 'Media / Creative Arts',

  teaching: 'Education',
  writing: 'Writing / Communication',
  public_speaking: 'Communication / Leadership',

  meditation: 'Wellness / Spirituality',
  spiritual_reading: 'Spirituality / Education',

  planning: 'Management',
  project_management: 'Management',
  event_organising: 'Management / Events',

  helping_people: 'Service / Social Development',
  volunteering: 'Social Service',

  data_analysis: 'Analytics / Technology',
  problem_solving: 'Analysis / Technology',

  travel: 'Travel / Exploration',
};


// ======================================================
// ROLE MAPPING
// ======================================================

const roleMapping: any = {
  reading: [
    'Researcher',
    'Teacher',
  ],

  research: [
    'Researcher',
    'Analyst',
  ],

  mathematics: [
    'Analyst',
    'Researcher',
  ],

  coding: [
    'Software Developer',
    'Technical Designer',
  ],

  cricket: [
    'Player',
    'Coach',
  ],

  football: [
    'Player',
    'Coach',
  ],

  drawing: [
    'Designer',
    'Artist',
  ],

  music: [
    'Musician',
    'Performer',
  ],

  dance: [
    'Dancer',
    'Choreographer',
  ],

  teaching: [
    'Teacher',
    'Mentor',
  ],

  writing: [
    'Writer',
    'Content Creator',
  ],

  public_speaking: [
    'Speaker',
    'Trainer',
  ],

  planning: [
    'Planner',
    'Coordinator',
  ],

  project_management: [
    'Project Lead',
    'Coordinator',
  ],

  meditation: [
    'Practitioner',
    'Teacher',
  ],

  helping_people: [
    'Mentor',
    'Support Facilitator',
  ],

  data_analysis: [
    'Data Analyst',
    'Research Analyst',
  ],
};


// ======================================================
// HELPER
// ======================================================

const getNames = (
  ids: string[],
  mapping: any,
) => {

  return ids
    .map(id => mapping[id])
    .filter(Boolean);

};


// ======================================================
// SCREEN
// ======================================================

const InterestProfileScreen = () => {

  const navigation = useNavigation();

  const route = useRoute<any>();
  const userId = Number(route.params?.userId);


  // ====================================================
  // DATA
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

  const selectedQualities =
    route.params?.selectedQualities ?? [];


  // ====================================================
  // DERIVED DATA
  // ====================================================

  const activityDisplayNames =
    selectedActivities.map(
      (id: string) =>
        activityNames[id] ?? id,
    );


  const motivationDisplayNames =
    getNames(
      selectedMotivations,
      motivationNames,
    );


  const engagementDisplayNames =
    getNames(
      selectedEngagementStyles,
      engagementNames,
    );


  const qualityDisplayNames =
    getNames(
      selectedQualities,
      qualityNames,
    );


  const fields: string[] = [];

  const roles: string[] = [];


  selectedActivities.forEach(
    (activityId: string) => {

      if (
        fieldMapping[activityId] &&
        !fields.includes(
          fieldMapping[activityId],
        )
      ) {
        fields.push(
          fieldMapping[activityId],
        );
      }


      const activityRoles =
        roleMapping[activityId] ?? [];


      activityRoles.forEach(
        (role: string) => {

          if (!roles.includes(role)) {
            roles.push(role);
          }

        },
      );

    },
  );


  // ====================================================
  // INTERESTS
  // ====================================================

  const allSpecificInterests: string[] = [];


  Object.values(
    selectedInterests,
  ).forEach(
    (values: any) => {

      values.forEach(
        (value: string) => {

          if (
            !allSpecificInterests.includes(
              value,
            )
          ) {
            allSpecificInterests.push(
              value,
            );
          }

        },
      );

    },
  );


  // ====================================================
  // DASHBOARD
  // ====================================================

  const handleDashboard = async () => {

    if (!Number.isInteger(userId) || userId <= 0) {
      Alert.alert('Unable to complete', 'Your user session was not found. Please reopen the Personality assessment from the dashboard.');
      return;
    }

    try {
      const personalityAnswers = [
        {
          step: 'ACTIVITY_TYPE',
          selectedTypes,
        },
        {
          step: 'ACTIVITY_SELECTION',
          selectedTypes,
          selectedActivities,
        },
        {
          step: 'SPECIFIC_INTEREST',
          selectedTypes,
          selectedActivities,
          selectedInterests,
        },
        {
          step: 'MOTIVATION',
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
        },
        {
          step: 'ENGAGEMENT_STYLE',
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
          selectedEngagementStyles,
        },
        {
          step: 'QUALITIES',
          selectedTypes,
          selectedActivities,
          selectedInterests,
          selectedMotivations,
          selectedEngagementStyles,
          selectedQualities,
        },
      ];

      const personalityResult = {
        selectedTypes,
        selectedActivities,
        selectedInterests,
        selectedMotivations,
        selectedEngagementStyles,
        selectedQualities,
        activityDisplayNames,
        motivationDisplayNames,
        engagementDisplayNames,
        qualityDisplayNames,
        specificInterests: allSpecificInterests,
        fields,
        roles,
      };

      const completionResponse = await completeAssessment({
        userId,
        assessmentType: 'PERSONALITY',
        answers: personalityAnswers,
        result: personalityResult,
      });

      if (
        !completionResponse ||
        completionResponse.status !== 'COMPLETED'
      ) {
        throw new Error(
          completionResponse?.message ||
          'The server did not confirm that the Personality assessment was completed.',
        );
      }

      console.log(
        'PERSONALITY assessment completed successfully',
      );

      navigation.navigate(
        'Dashboard' as never,
        {userId} as never,
      );

    } catch (error) {
      console.error('Failed to complete PERSONALITY assessment:', error);
      Alert.alert(
        'Completion Failed',
        error instanceof Error ? error.message : 'Unable to save your completed Personality assessment. Please try again.',
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

          <Text
            style={styles.headerTitle}>

            Your Interest Profile

          </Text>

        </View>


        {/* ========================================= */}
        {/* SUCCESS */}
        {/* ========================================= */}

        <View
          style={styles.successCard}>

          <View
            style={styles.successIcon}>

            <MaterialCommunityIcons
              name="check"
              size={32}
              color="#FFFFFF"
            />

          </View>


          <Text
            style={styles.successTitle}>

            Profile Completed

          </Text>


          <Text
            style={styles.successText}>

            Your activities and interests have
            been mapped into an initial profile.

          </Text>

        </View>


        {/* ========================================= */}
        {/* ACTIVITY AREAS */}
        {/* ========================================= */}

        <View
          style={styles.section}>

          <Text
            style={styles.sectionTitle}>

            Activity Areas

          </Text>


          <View
            style={styles.chipContainer}>

            {selectedTypes.map(
              (type: string) => (

                <View
                  key={type}
                  style={styles.chip}>

                  <Text
                    style={styles.chipText}>

                    {type}

                  </Text>

                </View>

              ),
            )}

          </View>

        </View>


        {/* ========================================= */}
        {/* ACTIVITIES */}
        {/* ========================================= */}

        <View
          style={styles.section}>

          <Text
            style={styles.sectionTitle}>

            Selected Activities

          </Text>


          {activityDisplayNames.map(
            (
              activity: string,
              index: number,
            ) => (

              <View
                key={`${activity}-${index}`}
                style={styles.listCard}>

                <View
                  style={styles.listIcon}>

                  <MaterialCommunityIcons
                    name="star-outline"
                    size={21}
                    color="#FF5A00"
                  />

                </View>


                <Text
                  style={styles.listText}>

                  {activity}

                </Text>

              </View>

            ),
          )}

        </View>


        {/* ========================================= */}
        {/* SPECIFIC INTERESTS */}
        {/* ========================================= */}

        {allSpecificInterests.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Specific Interests

            </Text>


            <View
              style={styles.chipContainer}>

              {allSpecificInterests.map(
                (
                  interest: string,
                  index: number,
                ) => (

                  <View
                    key={`${interest}-${index}`}
                    style={
                      styles.lightChip
                    }>

                    <Text
                      style={
                        styles.lightChipText
                      }>

                      {interest}

                    </Text>

                  </View>

                ),
              )}

            </View>

          </View>

        )}


        {/* ========================================= */}
        {/* MOTIVATIONS */}
        {/* ========================================= */}

        {motivationDisplayNames.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Key Motivations

            </Text>


            {motivationDisplayNames.map(
              (
                motivation: string,
                index: number,
              ) => (

                <View
                  key={`${motivation}-${index}`}
                  style={styles.simpleRow}>

                  <MaterialCommunityIcons
                    name="arrow-right-circle"
                    size={20}
                    color="#FF5A00"
                  />

                  <Text
                    style={
                      styles.simpleRowText
                    }>

                    {motivation}

                  </Text>

                </View>

              ),
            )}

          </View>

        )}


        {/* ========================================= */}
        {/* ENGAGEMENT */}
        {/* ========================================= */}

        {engagementDisplayNames.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Engagement Style

            </Text>


            {engagementDisplayNames.map(
              (
                style: string,
                index: number,
              ) => (

                <View
                  key={`${style}-${index}`}
                  style={styles.simpleRow}>

                  <MaterialCommunityIcons
                    name="account-check-outline"
                    size={20}
                    color="#FF5A00"
                  />

                  <Text
                    style={
                      styles.simpleRowText
                    }>

                    {style}

                  </Text>

                </View>

              ),
            )}

          </View>

        )}


        {/* ========================================= */}
        {/* QUALITIES */}
        {/* ========================================= */}

        {qualityDisplayNames.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Key Qualities

            </Text>


            <View
              style={styles.qualityGrid}>

              {qualityDisplayNames.map(
                (
                  quality: string,
                  index: number,
                ) => (

                  <View
                    key={`${quality}-${index}`}
                    style={
                      styles.qualityChip
                    }>

                    <MaterialCommunityIcons
                      name="check-circle-outline"
                      size={18}
                      color="#FF5A00"
                    />

                    <Text
                      style={
                        styles.qualityChipText
                      }>

                      {quality}

                    </Text>

                  </View>

                ),
              )}

            </View>

          </View>

        )}


        {/* ========================================= */}
        {/* FIELDS */}
        {/* ========================================= */}

        {fields.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Related Fields

            </Text>


            {fields.map(
              (
                field: string,
                index: number,
              ) => (

                <View
                  key={`${field}-${index}`}
                  style={
                    styles.fieldCard
                  }>

                  <MaterialCommunityIcons
                    name="briefcase-outline"
                    size={23}
                    color="#FF5A00"
                  />

                  <Text
                    style={
                      styles.fieldText
                    }>

                    {field}

                  </Text>

                </View>

              ),
            )}

          </View>

        )}


        {/* ========================================= */}
        {/* ROLES */}
        {/* ========================================= */}

        {roles.length > 0 && (

          <View
            style={styles.section}>

            <Text
              style={styles.sectionTitle}>

              Potential Roles

            </Text>


            {roles.map(
              (
                role: string,
                index: number,
              ) => (

                <View
                  key={`${role}-${index}`}
                  style={
                    styles.fieldCard
                  }>

                  <MaterialCommunityIcons
                    name="account-outline"
                    size={23}
                    color="#FF5A00"
                  />

                  <Text
                    style={
                      styles.fieldText
                    }>

                    {role}

                  </Text>

                </View>

              ),
            )}

          </View>

        )}


        {/* ========================================= */}
        {/* MODEL MESSAGE */}
        {/* ========================================= */}

        <View
          style={styles.modelCard}>

          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={25}
            color="#FF5A00"
          />


          <Text
            style={styles.modelText}>

            Your activity profile is an initial
            representation of your interests.
            Activities reveal qualities, which can
            later be connected to fields, roles and
            professions.

          </Text>

        </View>


        {/* ========================================= */}
        {/* DASHBOARD */}
        {/* ========================================= */}

        <TouchableOpacity
          style={
            styles.dashboardButton
          }
          onPress={
            handleDashboard
          }>

          <Text
            style={
              styles.dashboardButtonText
            }>

            Continue to Dashboard

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


export default InterestProfileScreen;


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
      alignItems: 'center',
      marginBottom: 20,
    },

    headerTitle: {
      fontSize: 23,
      fontWeight: '900',
      color: '#FF5A00',
    },


    // ==================================================
    // SUCCESS
    // ==================================================

    successCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#FFD7B0',
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
      elevation: 3,
    },

    successIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      backgroundColor: '#FF5A00',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },

    successTitle: {
      fontSize: 21,
      fontWeight: '900',
      color: '#2B211B',
      marginBottom: 6,
    },

    successText: {
      fontSize: 13,
      lineHeight: 19,
      textAlign: 'center',
      fontWeight: '600',
      color: '#6E625A',
    },


    // ==================================================
    // SECTION
    // ==================================================

    section: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#E8DDD5',
      padding: 16,
      marginBottom: 15,
      elevation: 2,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: '#2B211B',
      marginBottom: 13,
    },


    // ==================================================
    // CHIPS
    // ==================================================

    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    chip: {
      backgroundColor: '#FF5A00',
      borderRadius: 20,
      paddingHorizontal: 13,
      paddingVertical: 8,
    },

    chipText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#FFFFFF',
      textTransform: 'capitalize',
    },

    lightChip: {
      backgroundColor: '#FFF0DD',
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#FFD7B0',
    },

    lightChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#D94D00',
    },


    // ==================================================
    // LIST
    // ==================================================

    listCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF7ED',
      borderRadius: 13,
      padding: 11,
      marginBottom: 8,
    },

    listIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: '#FFE7CE',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },

    listText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '800',
      color: '#38302A',
    },


    // ==================================================
    // SIMPLE ROW
    // ==================================================

    simpleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },

    simpleRowText: {
      fontSize: 14,
      fontWeight: '700',
      color: '#38302A',
      marginLeft: 9,
    },


    // ==================================================
    // QUALITIES
    // ==================================================

    qualityGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    qualityChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF0DD',
      borderRadius: 20,
      paddingHorizontal: 11,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#FFD7B0',
    },

    qualityChipText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#D94D00',
      marginLeft: 5,
    },


    // ==================================================
    // FIELDS / ROLES
    // ==================================================

    fieldCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF7ED',
      borderRadius: 13,
      padding: 12,
      marginBottom: 8,
    },

    fieldText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#38302A',
      marginLeft: 10,
    },


    // ==================================================
    // MODEL CARD
    // ==================================================

    modelCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: '#FFF0DD',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#FFD7B0',
      padding: 14,
      marginBottom: 15,
    },

    modelText: {
      flex: 1,
      fontSize: 12,
      lineHeight: 18,
      fontWeight: '600',
      color: '#665D56',
      marginLeft: 9,
    },


    // ==================================================
    // DASHBOARD BUTTON
    // ==================================================

    dashboardButton: {
      height: 55,
      borderRadius: 15,
      backgroundColor: '#FF5A00',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },

    dashboardButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
      marginRight: 8,
    },

  });