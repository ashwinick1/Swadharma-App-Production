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
// SPECIFIC INTEREST DATA
// ======================================================

const specificInterestData: any = {

  // ----------------------------------------------------
  // READING
  // ----------------------------------------------------

  reading: {
    title: 'Reading',
    question: 'What kind of reading do you enjoy?',
    options: [
      'Fiction',
      'Philosophy',
      'Science',
      'History',
      'Biography',
      'Business',
      'Spirituality',
      'Technical Manuals',
      'Poetry',
      'Research Papers',
    ],
  },


  // ----------------------------------------------------
  // CRICKET
  // ----------------------------------------------------

  cricket: {
    title: 'Playing Cricket',
    question: 'Which aspects of cricket do you enjoy most?',
    options: [
      'Batting',
      'Bowling',
      'Fielding',
      'Strategy',
      'Competition',
      'Teamwork',
      'Skill Improvement',
    ],
  },


  // ----------------------------------------------------
  // FOOTBALL
  // ----------------------------------------------------

  football: {
    title: 'Playing Football',
    question: 'What do you enjoy most about football?',
    options: [
      'Scoring',
      'Passing',
      'Defending',
      'Teamwork',
      'Strategy',
      'Competition',
      'Physical Activity',
    ],
  },


  // ----------------------------------------------------
  // RESEARCH
  // ----------------------------------------------------

  research: {
    title: 'Research',
    question: 'What do you enjoy most about research?',
    options: [
      'Finding Information',
      'Analysing Data',
      'Discovering New Ideas',
      'Solving Problems',
      'Testing Ideas',
      'Deep Investigation',
      'Writing Findings',
    ],
  },


  // ----------------------------------------------------
  // MATHEMATICS
  // ----------------------------------------------------

  mathematics: {
    title: 'Solving Mathematical Problems',
    question: 'What do you enjoy most about mathematics?',
    options: [
      'Logical Problems',
      'Calculations',
      'Patterns',
      'Abstract Concepts',
      'Problem Solving',
      'Proofs',
      'Finding Efficient Solutions',
    ],
  },


  // ----------------------------------------------------
  // LEARNING
  // ----------------------------------------------------

  learning: {
    title: 'Learning New Concepts',
    question: 'What type of learning interests you most?',
    options: [
      'Understanding Concepts',
      'Practical Application',
      'Experimenting',
      'Deep Study',
      'Learning New Skills',
      'Teaching Others',
      'Exploring New Subjects',
    ],
  },


  // ----------------------------------------------------
  // HISTORY
  // ----------------------------------------------------

  history: {
    title: 'Studying History',
    question: 'What interests you most about history?',
    options: [
      'Ancient Civilisations',
      'People and Leaders',
      'Wars and Conflicts',
      'Culture and Society',
      'Historical Causes',
      'Historical Research',
      'Learning from the Past',
    ],
  },


  // ----------------------------------------------------
  // SCIENCE
  // ----------------------------------------------------

  science: {
    title: 'Learning Science',
    question: 'What part of science interests you most?',
    options: [
      'Experiments',
      'Understanding Nature',
      'Discovering How Things Work',
      'Technology',
      'Research',
      'Problem Solving',
      'Scientific Theories',
    ],
  },


  // ----------------------------------------------------
  // DRAWING
  // ----------------------------------------------------

  drawing: {
    title: 'Drawing / Painting',
    question: 'What do you enjoy most about drawing or painting?',
    options: [
      'Creating Images',
      'Colours',
      'Design',
      'Realistic Drawing',
      'Abstract Art',
      'Expressing Emotions',
      'Experimenting with Styles',
    ],
  },


  // ----------------------------------------------------
  // MUSIC
  // ----------------------------------------------------

  music: {
    title: 'Music',
    question: 'What aspect of music interests you most?',
    options: [
      'Singing',
      'Playing Instruments',
      'Composition',
      'Rhythm',
      'Classical Music',
      'Exploring Different Genres',
      'Performing',
    ],
  },


  // ----------------------------------------------------
  // DANCE
  // ----------------------------------------------------

  dance: {
    title: 'Dance',
    question: 'What interests you most about dance?',
    options: [
      'Performance',
      'Expression',
      'Choreography',
      'Rhythm',
      'Discipline',
      'Aesthetics',
      'Learning New Forms',
    ],
  },


  // ----------------------------------------------------
  // PHOTOGRAPHY
  // ----------------------------------------------------

  photography: {
    title: 'Photography',
    question: 'What do you enjoy most about photography?',
    options: [
      'People',
      'Nature',
      'Architecture',
      'Storytelling',
      'Composition',
      'Lighting',
      'Experimenting',
    ],
  },


  // ----------------------------------------------------
  // CRAFT
  // ----------------------------------------------------

  craft: {
    title: 'Craft / Handmade Work',
    question: 'What do you enjoy most about craft activities?',
    options: [
      'Creating Things',
      'Working with Materials',
      'Design',
      'Detail',
      'Traditional Crafts',
      'Experimenting',
      'Making Useful Objects',
    ],
  },


  // ----------------------------------------------------
  // STORY WRITING
  // ----------------------------------------------------

  story_writing: {
    title: 'Story Writing',
    question: 'What do you enjoy most about writing stories?',
    options: [
      'Creating Characters',
      'Building Stories',
      'Imagination',
      'Expressing Ideas',
      'Exploring Emotions',
      'Writing Dialogue',
      'Creating Different Worlds',
    ],
  },


  // ----------------------------------------------------
  // JOURNALING
  // ----------------------------------------------------

  journaling: {
    title: 'Journaling',
    question: 'What do you mainly use journaling for?',
    options: [
      'Self Reflection',
      'Recording Experiences',
      'Understanding Emotions',
      'Planning',
      'Gratitude',
      'Creative Expression',
      'Organising Thoughts',
    ],
  },


  // ----------------------------------------------------
  // SELF REFLECTION
  // ----------------------------------------------------

  self_reflection: {
    title: 'Self Reflection',
    question: 'What do you focus on during self-reflection?',
    options: [
      'Understanding Myself',
      'Understanding Emotions',
      'Learning from Experiences',
      'Improving Myself',
      'Understanding Behaviour',
      'Finding Purpose',
      'Making Better Decisions',
    ],
  },


  // ----------------------------------------------------
  // SOCIALISING
  // ----------------------------------------------------

  socialising: {
    title: 'Socialising',
    question: 'What do you enjoy most about social interaction?',
    options: [
      'Meeting New People',
      'Deep Conversations',
      'Sharing Ideas',
      'Having Fun',
      'Building Relationships',
      'Helping Others',
      'Learning from People',
    ],
  },


  // ----------------------------------------------------
  // GROUP ACTIVITIES
  // ----------------------------------------------------

  group_activities: {
    title: 'Group Activities',
    question: 'What role do you naturally enjoy in group activities?',
    options: [
      'Participating',
      'Organising',
      'Leading',
      'Supporting',
      'Sharing Ideas',
      'Coordinating',
      'Encouraging Others',
    ],
  },


  // ----------------------------------------------------
  // COMMUNITY
  // ----------------------------------------------------

  community: {
    title: 'Community Activities',
    question: 'What interests you most about community activities?',
    options: [
      'Helping People',
      'Organising Events',
      'Solving Community Problems',
      'Building Connections',
      'Teaching',
      'Volunteering',
      'Creating Awareness',
    ],
  },


  // ----------------------------------------------------
  // MEDITATION
  // ----------------------------------------------------

  meditation: {
    title: 'Meditation',
    question: 'What do you seek through meditation?',
    options: [
      'Peace',
      'Concentration',
      'Self Awareness',
      'Emotional Balance',
      'Spiritual Growth',
      'Clarity',
      'Inner Reflection',
    ],
  },


  // ----------------------------------------------------
  // PRAYER
  // ----------------------------------------------------

  prayer: {
    title: 'Prayer',
    question: 'What aspect of prayer is meaningful to you?',
    options: [
      'Devotion',
      'Gratitude',
      'Inner Peace',
      'Connection with the Divine',
      'Reflection',
      'Seeking Guidance',
      'Spiritual Discipline',
    ],
  },


  // ----------------------------------------------------
  // SPIRITUAL READING
  // ----------------------------------------------------

  spiritual_reading: {
    title: 'Spiritual Reading',
    question: 'What type of spiritual reading interests you?',
    options: [
      'Scriptures',
      'Philosophy',
      'Spiritual Teachings',
      'Meditation',
      'Self Knowledge',
      'Ethics',
      'Stories of Spiritual Teachers',
    ],
  },


  // ----------------------------------------------------
  // PLANNING
  // ----------------------------------------------------

  planning: {
    title: 'Planning',
    question: 'What do you enjoy most about planning?',
    options: [
      'Setting Goals',
      'Organising Tasks',
      'Creating Strategies',
      'Managing Time',
      'Preparing for Problems',
      'Improving Efficiency',
      'Coordinating People',
    ],
  },


  // ----------------------------------------------------
  // EVENT ORGANISING
  // ----------------------------------------------------

  event_organising: {
    title: 'Organising Events',
    question: 'Which part of event organisation interests you most?',
    options: [
      'Planning',
      'Coordination',
      'Communication',
      'Managing People',
      'Logistics',
      'Creative Planning',
      'Problem Solving',
    ],
  },


  // ----------------------------------------------------
  // PROJECT MANAGEMENT
  // ----------------------------------------------------

  project_management: {
    title: 'Managing Projects',
    question: 'What part of project management do you enjoy?',
    options: [
      'Planning',
      'Team Coordination',
      'Problem Solving',
      'Managing Deadlines',
      'Decision Making',
      'Resource Management',
      'Achieving Goals',
    ],
  },


  // ----------------------------------------------------
  // CODING
  // ----------------------------------------------------

  coding: {
    title: 'Coding / Programming',
    question: 'What do you enjoy most about programming?',
    options: [
      'Problem Solving',
      'Building Applications',
      'Logic',
      'Learning Technologies',
      'Debugging',
      'Designing Systems',
      'Automation',
    ],
  },


  // ----------------------------------------------------
  // TECHNOLOGY
  // ----------------------------------------------------

  technology: {
    title: 'Exploring Technology',
    question: 'What interests you most about technology?',
    options: [
      'Learning New Tools',
      'Understanding How Things Work',
      'Building Things',
      'Innovation',
      'Problem Solving',
      'Experimenting',
      'Future Technologies',
    ],
  },


  // ----------------------------------------------------
  // ELECTRONICS
  // ----------------------------------------------------

  electronics: {
    title: 'Electronics',
    question: 'What do you enjoy most about electronics?',
    options: [
      'Building Circuits',
      'Repairing Devices',
      'Understanding Components',
      'Experimenting',
      'Designing Systems',
      'Troubleshooting',
      'Automation',
    ],
  },


  // ----------------------------------------------------
  // PROBLEM SOLVING
  // ----------------------------------------------------

  problem_solving: {
    title: 'Problem Solving',
    question: 'What type of problems do you enjoy solving?',
    options: [
      'Logical Problems',
      'Technical Problems',
      'People Problems',
      'Strategic Problems',
      'Creative Problems',
      'Practical Problems',
      'Complex Problems',
    ],
  },


  // ----------------------------------------------------
  // DATA ANALYSIS
  // ----------------------------------------------------

  data_analysis: {
    title: 'Data Analysis',
    question: 'What do you enjoy most about data analysis?',
    options: [
      'Finding Patterns',
      'Working with Numbers',
      'Understanding Trends',
      'Finding Insights',
      'Building Reports',
      'Making Predictions',
      'Supporting Decisions',
    ],
  },


  // ----------------------------------------------------
  // STRATEGY
  // ----------------------------------------------------

  strategy: {
    title: 'Strategy / Planning',
    question: 'What do you enjoy most about strategy?',
    options: [
      'Thinking Ahead',
      'Competition',
      'Problem Solving',
      'Planning',
      'Decision Making',
      'Understanding Systems',
      'Finding Better Approaches',
    ],
  },


  // ----------------------------------------------------
  // PUBLIC SPEAKING
  // ----------------------------------------------------

  public_speaking: {
    title: 'Public Speaking',
    question: 'What do you enjoy most about public speaking?',
    options: [
      'Sharing Ideas',
      'Persuasion',
      'Teaching',
      'Inspiring People',
      'Storytelling',
      'Debate',
      'Leadership',
    ],
  },


  // ----------------------------------------------------
  // WRITING
  // ----------------------------------------------------

  writing: {
    title: 'Writing',
    question: 'What kind of writing interests you?',
    options: [
      'Articles',
      'Stories',
      'Technical Writing',
      'Poetry',
      'Research Writing',
      'Business Writing',
      'Creative Writing',
    ],
  },


  // ----------------------------------------------------
  // TEACHING
  // ----------------------------------------------------

  teaching: {
    title: 'Teaching',
    question: 'What do you enjoy most about teaching?',
    options: [
      'Explaining Concepts',
      'Helping People Learn',
      'Mentoring',
      'Creating Learning Material',
      'Answering Questions',
      'Encouraging Others',
      'Sharing Knowledge',
    ],
  },


  // ----------------------------------------------------
  // STORYTELLING
  // ----------------------------------------------------

  storytelling: {
    title: 'Storytelling',
    question: 'What do you enjoy most about storytelling?',
    options: [
      'Creating Stories',
      'Entertaining People',
      'Sharing Experiences',
      'Teaching Through Stories',
      'Expressing Emotions',
      'Connecting with People',
      'Inspiring Others',
    ],
  },


  // ----------------------------------------------------
  // LEADING TEAM
  // ----------------------------------------------------

  leading_team: {
    title: 'Leading a Team',
    question: 'What do you enjoy most about leading a team?',
    options: [
      'Setting Direction',
      'Motivating People',
      'Making Decisions',
      'Solving Problems',
      'Coordinating Work',
      'Developing People',
      'Achieving Goals',
    ],
  },


  // ----------------------------------------------------
  // DECISION MAKING
  // ----------------------------------------------------

  decision_making: {
    title: 'Decision Making',
    question: 'What do you consider when making decisions?',
    options: [
      'Logic',
      'Available Information',
      'Impact on People',
      'Long-term Results',
      'Risk',
      'Experience',
      'Values',
    ],
  },


  // ----------------------------------------------------
  // GUIDING PEOPLE
  // ----------------------------------------------------

  guiding_people: {
    title: 'Guiding Others',
    question: 'How do you enjoy helping others?',
    options: [
      'Giving Advice',
      'Teaching',
      'Mentoring',
      'Listening',
      'Solving Problems',
      'Encouraging',
      'Sharing Experience',
    ],
  },


  // ----------------------------------------------------
  // HELPING PEOPLE
  // ----------------------------------------------------

  helping_people: {
    title: 'Helping People',
    question: 'What kind of help do you enjoy providing?',
    options: [
      'Emotional Support',
      'Practical Help',
      'Teaching',
      'Problem Solving',
      'Guidance',
      'Listening',
      'Encouragement',
    ],
  },


  // ----------------------------------------------------
  // VOLUNTEERING
  // ----------------------------------------------------

  volunteering: {
    title: 'Volunteering',
    question: 'What motivates you to volunteer?',
    options: [
      'Helping People',
      'Serving the Community',
      'Learning',
      'Meeting People',
      'Making a Difference',
      'Supporting a Cause',
      'Personal Growth',
    ],
  },


  // ----------------------------------------------------
  // TRAVEL
  // ----------------------------------------------------

  travel: {
    title: 'Travelling',
    question: 'What do you enjoy most about travelling?',
    options: [
      'Exploring Places',
      'Learning Cultures',
      'Meeting People',
      'Adventure',
      'Nature',
      'Food',
      'History',
    ],
  },


  // ----------------------------------------------------
  // NEW EXPERIENCES
  // ----------------------------------------------------

  new_experiences: {
    title: 'Trying New Experiences',
    question: 'What attracts you to new experiences?',
    options: [
      'Learning',
      'Adventure',
      'Curiosity',
      'Challenge',
      'Meeting New People',
      'Exploration',
      'Personal Growth',
    ],
  },


  // ----------------------------------------------------
  // EXPLORING PLACES
  // ----------------------------------------------------

  exploring_places: {
    title: 'Exploring New Places',
    question: 'What do you enjoy discovering?',
    options: [
      'Nature',
      'Culture',
      'History',
      'Architecture',
      'People',
      'Food',
      'Local Traditions',
    ],
  },


  // ----------------------------------------------------
  // EXPERIMENTING
  // ----------------------------------------------------

  experimenting: {
    title: 'Experimenting',
    question: 'What attracts you to experimentation?',
    options: [
      'Discovering New Things',
      'Testing Ideas',
      'Learning',
      'Innovation',
      'Problem Solving',
      'Curiosity',
      'Improving Existing Things',
    ],
  },


  // ----------------------------------------------------
  // NATURE OBSERVATION
  // ----------------------------------------------------

  nature_observation: {
    title: 'Observing Nature',
    question: 'What do you enjoy observing in nature?',
    options: [
      'Plants',
      'Animals',
      'Landscapes',
      'Weather',
      'Natural Patterns',
      'Ecology',
      'Quiet Observation',
    ],
  },


  // ----------------------------------------------------
  // QUIET REFLECTION
  // ----------------------------------------------------

  quiet_reflection: {
    title: 'Quiet Reflection',
    question: 'What do you reflect on most?',
    options: [
      'My Experiences',
      'My Emotions',
      'My Goals',
      'My Values',
      'Life Questions',
      'Relationships',
      'Future Decisions',
    ],
  },


  // ----------------------------------------------------
  // MINDFULNESS
  // ----------------------------------------------------

  mindfulness: {
    title: 'Mindfulness',
    question: 'What do you focus on during mindfulness?',
    options: [
      'Breathing',
      'Body Awareness',
      'Thoughts',
      'Emotions',
      'Present Moment',
      'Sensations',
      'Awareness',
    ],
  },

  running: {
    title: 'Running',
    question: 'What do you enjoy most about running?',
    options: ['Fitness','Endurance','Speed','Competition','Personal Challenge','Mental Clarity','Outdoor Activity','Consistency'],
  },

  swimming: {
    title: 'Swimming',
    question: 'What do you enjoy most about swimming?',
    options: ['Fitness','Endurance','Technique','Relaxation','Competition','Strength','Water Activity','Personal Improvement'],
  },

  yoga: {
    title: 'Yoga',
    question: 'What do you enjoy most about yoga?',
    options: ['Physical Flexibility','Strength and Balance','Breathing Practices','Relaxation','Concentration','Mindfulness','Self Awareness','Spiritual Practice'],
  },

  gym: {
    title: 'Gym / Workout',
    question: 'What do you enjoy most about gym or workouts?',
    options: ['Strength Training','Fitness','Building Muscle','Improving Endurance','Physical Challenge','Weight Management','Performance Improvement','Consistency and Discipline'],
  },

  emotional_support: {
    title: 'Supporting Others Emotionally',
    question: 'What do you enjoy most about supporting others emotionally?',
    options: ['Listening','Understanding Feelings','Emotional Support','Encouragement','Empathy','Helping with Problems','Building Trust'],
  },

  networking: {
    title: 'Networking',
    question: 'What do you enjoy most about networking?',
    options: ['Meeting New People','Building Connections','Sharing Ideas','Professional Relationships','Learning from Others','Collaborating','Finding Opportunities'],
  },

  spiritual_practice: {
    title: 'Spiritual Practices',
    question: 'What interests you most about spiritual practices?',
    options: ['Meditation','Prayer','Self Discipline','Inner Peace','Self Awareness','Devotion','Reflection','Spiritual Growth'],
  },

  scheduling: {
    title: 'Scheduling Activities',
    question: 'What do you enjoy most about scheduling?',
    options: ['Organising Time','Planning Ahead','Setting Priorities','Managing Deadlines','Creating Routines','Coordinating Activities','Improving Efficiency'],
  },

  technical_projects: {
    title: 'Technical Projects',
    question: 'What do you enjoy most about technical projects?',
    options: ['Building Systems','Problem Solving','Designing Solutions','Experimenting','Learning Technologies','Debugging','Automation','Improving Existing Systems'],
  },

  logic: {
    title: 'Logical Reasoning',
    question: 'What do you enjoy most about logical reasoning?',
    options: ['Logical Problems','Patterns','Critical Thinking','Finding Connections','Analysing Information','Proof and Reasoning','Finding Efficient Solutions'],
  },

  taking_responsibility: {
    title: 'Taking Responsibility',
    question: 'What do you value when taking responsibility?',
    options: ['Accountability','Making Decisions','Completing Tasks','Helping Others','Solving Problems','Reliability','Achieving Goals'],
  },

  community_service: {
    title: 'Community Service',
    question: 'What do you enjoy most about community service?',
    options: ['Helping People','Serving the Community','Volunteering','Solving Community Problems','Teaching','Creating Awareness','Making a Difference'],
  },

  meditation_contemplation: {
    title: 'Meditation / Contemplation',
    question: 'What do you focus on during contemplation?',
    options: ['Inner Peace','Self Awareness','Quiet Reflection','Life Questions','Understanding Thoughts','Understanding Emotions','Finding Purpose','Mindfulness'],
  },

};


// ======================================================
// SCREEN
// ======================================================

const SpecificInterestScreen = () => {

  const navigation = useNavigation();

  const route = useRoute<any>();
  const userId = Number(route.params?.userId);


  // ====================================================
  // RECEIVED DATA
  // ====================================================

  const selectedTypes =
    route.params?.selectedTypes ?? [];

  const selectedActivities =
    route.params?.selectedActivities ?? [];


  // ====================================================
  // SELECTED INTERESTS
  // ====================================================

  const [
    selectedInterests,
    setSelectedInterests,
  ] = useState<{
    [key: string]: string[];
  }>({});


  // ====================================================
  // TOGGLE INTEREST
  // ====================================================

  const toggleInterest = (
    activityId: string,
    option: string,
  ) => {

    setSelectedInterests(
      previous => {

        const current =
          previous[activityId] ?? [];


        if (
          current.includes(option)
        ) {

          return {
            ...previous,
            [activityId]:
              current.filter(
                item =>
                  item !== option,
              ),
          };

        }


        return {
          ...previous,
          [activityId]: [
            ...current,
            option,
          ],
        };

      },
    );

  };


  // ====================================================
  // TOTAL SELECTED
  // ====================================================

  const totalSelected =
    Object.values(
      selectedInterests,
    ).reduce(
      (
        total: number,
        values: string[],
      ) =>
        total + values.length,
      0,
    );


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
        step: 'SPECIFIC_INTEREST',
        selectedTypes,
        selectedActivities,
        selectedInterests,
      };

      await saveAssessmentStep({
        userId,
        assessmentType: 'PERSONALITY',
        stepAnswer,
      });

      console.log(
        'PERSONALITY Step 3 saved successfully',
      );

      navigation.navigate(
        'Motivation' as never,
        {
          userId,
          selectedTypes,
          selectedActivities,
          selectedInterests,
        } as never,
      );

    } catch (error) {
      console.error('Failed to save PERSONALITY Step 3:', error);
      Alert.alert(
        'Save Failed',
        error instanceof Error ? error.message : 'Unable to save your specific interests. Please try again.',
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

              Step 3 of 6

            </Text>


            <Text
              style={styles.progressText}>

              50%

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

            Explore Your Interests

          </Text>


          <Text
            style={styles.subtitle}>

            Tell us which specific parts of
            each activity interest you most.
            There are no right or wrong answers.

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

            Interests Selected

          </Text>


          <View
            style={
              styles.countBadge
            }>

            <Text
              style={
                styles.countText
              }>

              {totalSelected}

            </Text>

          </View>

        </View>


        {/* ========================================= */}
        {/* ACTIVITY QUESTIONS */}
        {/* ========================================= */}

        {selectedActivities.map(
          (activityId: string) => {

            const data =
              specificInterestData[
                activityId
              ];


            // If activity doesn't have
            // specific questions yet

            if (!data) {
              return null;
            }


            return (

              <View
                key={activityId}
                style={
                  styles.activitySection
                }>


                {/* ACTIVITY TITLE */}

                <View
                  style={
                    styles.activityHeader
                  }>

                  <View
                    style={
                      styles.activityIcon
                    }>

                    <MaterialCommunityIcons
                      name="star-outline"
                      size={23}
                      color="#FF5A00"
                    />

                  </View>


                  <Text
                    style={
                      styles.activityTitle
                    }>

                    {data.title}

                  </Text>

                </View>


                {/* QUESTION */}

                <Text
                  style={
                    styles.questionText
                  }>

                  {data.question}

                </Text>


                {/* OPTIONS */}

                {data.options.map(
                  (
                    option: string,
                  ) => {

                    const isSelected =
                      (
                        selectedInterests[
                          activityId
                        ] ?? []
                      ).includes(
                        option,
                      );


                    return (

                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.optionCard,

                          isSelected &&
                            styles.selectedOption,
                        ]}
                        onPress={() =>
                          toggleInterest(
                            activityId,
                            option,
                          )
                        }
                        activeOpacity={
                          0.8
                        }>


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


                        {/* TEXT */}

                        <Text
                          style={[
                            styles.optionText,

                            isSelected &&
                              styles.selectedOptionText,
                          ]}>

                          {option}

                        </Text>

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

            totalSelected === 0 &&
              styles.disabledButton,
          ]}
          disabled={
            totalSelected === 0
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

          Select the options that genuinely
          interest you.

        </Text>


      </ScrollView>

    </SafeAreaView>
  );
};


export default SpecificInterestScreen;


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
      width: '50%',
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
    // ACTIVITY SECTION
    // ==================================================

    activitySection: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 18,

      padding: 16,

      marginBottom: 16,

      borderWidth: 1,

      borderColor:
        '#FFD7B0',

      elevation: 3,
    },


    activityHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },


    activityIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,

      backgroundColor:
        '#FFF0DD',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 10,
    },


    activityTitle: {
      flex: 1,

      fontSize: 18,

      fontWeight: '900',

      color: '#2B211B',
    },


    questionText: {
      fontSize: 15,

      lineHeight: 21,

      fontWeight: '800',

      color: '#4A4039',

      marginBottom: 12,
    },


    // ==================================================
    // OPTIONS
    // ==================================================

    optionCard: {
      minHeight: 54,

      backgroundColor:
        '#FFFDFC',

      borderRadius: 14,

      borderWidth: 1.5,

      borderColor:
        '#E8DDD5',

      flexDirection: 'row',

      alignItems:
        'center',

      paddingHorizontal: 13,

      marginBottom: 9,
    },


    selectedOption: {
      backgroundColor:
        '#FFF0DD',

      borderColor:
        '#FF5A00',

      borderWidth: 2,
    },


    radioCircle: {
      width: 22,
      height: 22,

      borderRadius: 11,

      borderWidth: 2,

      borderColor:
        '#BDB5AE',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 12,
    },


    selectedRadio: {
      borderColor:
        '#FF5A00',
    },


    radioDot: {
      width: 11,
      height: 11,

      borderRadius: 6,

      backgroundColor:
        '#FF5A00',
    },


    optionText: {
      flex: 1,

      fontSize: 14,

      lineHeight: 20,

      fontWeight: '700',

      color: '#38302A',
    },


    selectedOptionText: {
      color: '#D94D00',

      fontWeight: '900',
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

      marginTop: 5,

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