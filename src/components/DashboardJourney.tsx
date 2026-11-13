import React, {
  useCallback,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

import {
  getAssessmentStatuses,
  getCompleteSwadharmaReport,
} from '../services/api';

interface DashboardJourneyProps {

  userId?: number;

}

const DashboardJourney = ({

  userId,

}: DashboardJourneyProps) => {

  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [statuses, setStatuses] = useState<any>({

    HOROSCOPE: 'NOT_STARTED',

    DOSHA: 'NOT_STARTED',

    GUNA: 'NOT_STARTED',

    PERSONALITY: 'NOT_STARTED',

    JOHARI: 'NOT_STARTED',

    FAMILY_FEEDBACK: 'NOT_STARTED',

  });

  // =====================================================

  // LOAD ASSESSMENT STATUS

  // =====================================================

  const loadAssessmentStatus = useCallback(async () => {

    if (!userId) {

      console.log(

        'DashboardJourney: userId is missing',

      );

      setLoading(false);

      return;

    }

try {

  setLoading(true);

  console.log(

    'DashboardJourney loading for userId:',

    userId,

  );

  // -----------------------------------------------

  // Get assessment statuses

  // -----------------------------------------------

  const statusResponse =

    await getAssessmentStatuses(userId);

  console.log(

    'Assessment Status Response:',

    statusResponse,

  );

  // -----------------------------------------------

  // Get complete report

  // Horoscope is stored separately

  // -----------------------------------------------

  const reportResponse =

    await getCompleteSwadharmaReport(userId);

  console.log(

    'Complete Report Response:',

    reportResponse,

  );

  const report =

    reportResponse?.report;

  // -----------------------------------------------

  // Horoscope status

  // -----------------------------------------------

  let horoscopeStatus =
        'NOT_STARTED';

      if (report?.horoscope) {
        horoscopeStatus =
          'COMPLETED';
      }

      // -----------------------------------------------
      // Build final statuses
      // -----------------------------------------------

      setStatuses({

    HOROSCOPE:

      horoscopeStatus,

    DOSHA:

      statusResponse?.DOSHA ??

      'NOT_STARTED',

    GUNA:

      statusResponse?.GUNA ??

      'NOT_STARTED',

    PERSONALITY:

      statusResponse?.PERSONALITY ??

      'NOT_STARTED',

    JOHARI:

      statusResponse?.JOHARI ??

      'NOT_STARTED',

    FAMILY_FEEDBACK:

      statusResponse?.FAMILY_FEEDBACK ??

      'NOT_STARTED',

  });

  } catch (error) {

      console.error(

        'Dashboard Assessment Status Error:',

        error,

      );

    } finally {

      setLoading(false);

    }

  }, [userId]);

  // =====================================================

  // REFRESH WHEN DASHBOARD COMES INTO FOCUS

  // =====================================================

  useFocusEffect(

    useCallback(() => {

      loadAssessmentStatus();

    }, [loadAssessmentStatus]),

  );

  // =====================================================

  // ASSESSMENT DEFINITIONS

  // =====================================================

  const assessments = [

    {

      id: 'HOROSCOPE',

      title: 'Horoscope',

      subtitle:

        'Birth details & horoscope',

      icon: require('../assets/images/horoscope.png'),

      route: 'BirthDetails',

    },

    {

      id: 'DOSHA',

      title: 'Dosha Assessment',

      subtitle:

        'Vata, Pitta, Kapha analysis',

      icon: require('../assets/images/dosha.png'),

      route: 'DoshaAssessment',

    },

    {

      id: 'GUNA',

      title: 'Guna Assessment',

      subtitle:

        'Sattva, Tejas, Tamas analysis',

      icon: require('../assets/images/guna.png'),

      route: 'GunaAssessment',

    },

    {

      id: 'PERSONALITY',

      title: 'Personality Test',

      subtitle:

        'Personality & interest mapping',

      icon: require('../assets/images/personality.png'),

      route: 'ActivityType',

    },

    {

      id: 'JOHARI',

      title: 'Johari Window',

      subtitle:

        'Self & peer awareness assessment',

      icon: require('../assets/images/johari-window\.png'),

      route: 'JohariIntro',

    },

    {

      id: 'FAMILY_FEEDBACK',

      title: 'Family Feedback',

      subtitle:

        'Feedback from family members',

      icon: require('../assets/images/family-feedbck.png'),

      route: 'FamilyFeedbackIntro',

    },

  ];

  // =====================================================

  // CALCULATE JOURNEY PROGRESS

  // =====================================================

  const totalAssessments =

    assessments.length;

  const completedAssessments =

    assessments.filter(

      assessment =>

        statuses[assessment.id] ===

        'COMPLETED',

    ).length;

  const progress =

    totalAssessments === 0

      ? 0

      : Math.round(

          (completedAssessments /

            totalAssessments) *

            100,

        );

  // =====================================================

  // GET STATUS

  // =====================================================

  const getStatus = (

    assessmentId: string,

  ) => {

    return (

      statuses[assessmentId] ??

      'NOT_STARTED'

    );

  };

  // =====================================================

  // STATUS DISPLAY

  // =====================================================

  const renderStatusBadge = (

    status: string,

  ) => {

    if (status === 'COMPLETED') {

      return (

        <View

          style={

            styles.completedBadge

          }>

          <Text

            style={

              styles.completedText

            }>

            Completed

          </Text>

        </View>

      );

    }

    if (status === 'IN_PROGRESS') {

      return (

        <View

          style={

            styles.progressBadge

          }>

          <Text

            style={

              styles.progressTextBadge

            }>

            In Progress

          </Text>

        </View>

      );

    }

    return (

      <View

        style={

          styles.pendingBadge

        }>

        <Text

          style={

            styles.pendingText

          }>

          Not Started

        </Text>

      </View>

    );

  };

  // =====================================================

  // LOADING

  // =====================================================

  if (loading) {

    return (

      <View

        style={

          styles.loadingContainer

        }>

        <ActivityIndicator

          size="small"

          color="#FF6B00"

        />

      </View>

    );

  }

  // =====================================================

  // UI

  // =====================================================

  return (

    <View>

      {/* ========================================== */}

      {/* JOURNEY CARD */}

      {/* ========================================== */}

      <View

        style={

          styles.journeyCard

        }>

        {/* Journey Top */}

        <View

          style={

            styles.journeyTop

          }>

          {/* Progress Circle */}

          <View

            style={

              styles.progressCircle

            }>

            <Text

              style={

                styles.progressText

              }>

              {progress}%

            </Text>

          </View>

          <View

            style={

              styles.content

            }>

            <Text

              style={

                styles.title

              }>

              Your Swadharma Journey

            </Text>

            <Text

              style={

                styles.description

              }>

              Complete assessments to

              discover your true self

            </Text>

            <TouchableOpacity

              style={

                styles.button

              }

              onPress={() => {

                /*

                 * Continue Journey takes the user

                 * to the first incomplete assessment.

                 */

                const nextAssessment =

                  assessments.find(

                    assessment =>

                      getStatus(

                        assessment.id,

                      ) !==

                      'COMPLETED',

                  );

                if (

                  nextAssessment &&

                  userId

                ) {

                  navigation.navigate(

                    nextAssessment.route as never,

                    {

                      userId,

                    } as never,

                  );

                }

              }}

              activeOpacity={0.8}>

              <Text

                style={

                  styles.buttonText

                }>

                Continue Journey →

              </Text>

            </TouchableOpacity>

          </View>

        </View>

        {/* ====================================== */}

        {/* PROGRESS BAR */}

        {/* ====================================== */}

        <View

          style={

            styles.progressBackground

          }>

          <View

            style={[

              styles.progressFill,

              {

                width: `${progress}%`,

              },

            ]}

          />

        </View>

        {/* ====================================== */}

        {/* ASSESSMENT HEADER */}

        {/* ====================================== */}

        <View

          style={

            styles.assessmentHeader

          }>

          <Text

            style={

              styles.assessmentTitle

            }>

            Your Assessments

          </Text>

          <TouchableOpacity>

            <Text

              style={

                styles.viewAll

              }>

              View All

            </Text>

          </TouchableOpacity>

        </View>

      </View>

      {/* ========================================== */}

      {/* ASSESSMENT CARDS */}

      {/* ========================================== */}

      <View

        style={

          styles.assessmentGrid

        }>

        {assessments.map(

          assessment => {

            const status =

              getStatus(

                assessment.id,

              );

            return (

              <TouchableOpacity

                key={

                  assessment.id

                }

                style={

                  styles.assessmentCard

                }

                onPress={() => {

                  if (!userId) {

                    console.log(

                      'Cannot open assessment: userId is missing',

                    );

                    return;

                  }

                  navigation.navigate(

                    assessment.route as never,

                    {

                      userId,

                    } as never,

                  );

                }}

                activeOpacity={0.8}>

                <View

                  style={

                    styles.cardRow

                  }>

                  <Image

                    source={

                      assessment.icon

                    }

                    style={

                      styles.cardIcon

                    }

                  />

                  <View

                    style={

                      styles.cardContent

                    }>

                    <Text

                      style={

                        styles.cardTitle

                      }>

                      {

                        assessment.title

                      }

                    </Text>

                    <Text

                      style={

                        styles.cardSubtitle

                      }>

                      {

                        assessment.subtitle

                      }

                    </Text>

                    {renderStatusBadge(

                      status,

                    )}

                  </View>

                </View>

              </TouchableOpacity>

            );

          },

        )}

      </View>

    </View>

  );

};

export default DashboardJourney;

const styles = StyleSheet.create({

  // =====================================================

  // LOADING

  // =====================================================

  loadingContainer: {

    minHeight: 280,

    justifyContent: 'center',

    alignItems: 'center',

  },

  // =====================================================

  // JOURNEY CARD

  // =====================================================

  journeyCard: {

    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 18,

    elevation: 3,

  },

  journeyTop: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  // =====================================================

  // PROGRESS CIRCLE

  // =====================================================

  progressCircle: {

    width: 70,

    height: 70,

    borderRadius: 45,

    borderWidth: 8,

    borderColor: '#FF6B00',

    justifyContent: 'center',

    alignItems: 'center',

  },

  progressText: {

    fontSize: 18,

    fontWeight: '700',

    color: '#202020',

  },

  // =====================================================

  // CONTENT

  // =====================================================

  content: {

    flex: 1,

    marginLeft: 18,

  },

  title: {

    fontSize: 18,

    fontWeight: '800',

    color: '#202020',

  },

  description: {

    marginTop: 4,

    fontSize: 14,

    color: '#666',

    lineHeight: 20,

  },

  // =====================================================

  // CONTINUE BUTTON

  // =====================================================

  button: {

    marginTop: 16,

    backgroundColor: '#FF6B00',

    borderRadius: 12,

    paddingVertical: 12,

    alignItems: 'center',

  },

  buttonText: {

    color: '#FFF',

    fontWeight: '700',

    fontSize: 15,

  },

  // =====================================================

  // PROGRESS BAR

  // =====================================================

  progressBackground: {

    height: 6,

    backgroundColor: '#F4D7C6',

    borderRadius: 10,

    marginTop: 18,

    overflow: 'hidden',

  },

  progressFill: {

    height: '100%',

    backgroundColor: '#FF6B00',

    borderRadius: 10,

  },

  // =====================================================

  // ASSESSMENT HEADER

  // =====================================================

  assessmentHeader: {

    marginTop: 28,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

  },

  assessmentTitle: {

    fontSize: 16,

    fontWeight: '800',

    color: '#202020',

  },

  viewAll: {

    color: '#FF6B00',

    fontWeight: '800',

    fontSize: 14,

  },

  // =====================================================

  // GRID

  // =====================================================

  assessmentGrid: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    marginTop: 15,

  },

  // =====================================================

  // CARD

  // =====================================================

  assessmentCard: {

    width: '48%',

    backgroundColor: '#FFFFFF',

    borderRadius: 16,

    padding: 12,

    marginBottom: 12,

    elevation: 3,

    minHeight: 135,

  },

  cardRow: {

    flexDirection: 'row',

    alignItems: 'flex-start',

  },

  cardIcon: {

    width: 36,

    height: 36,

    resizeMode: 'contain',

    marginRight: 10,

  },

  cardContent: {

    flex: 1,

  },

  cardTitle: {

    fontSize: 15,

    fontWeight: '800',

    color: '#202020',

  },

  cardSubtitle: {

    marginTop: 3,

    fontSize: 14,

    fontWeight: '700',

    color: '#666',

    lineHeight: 15,

  },

  // =====================================================

  // COMPLETED

  // =====================================================

  completedBadge: {

    marginTop: 8,

    backgroundColor: '#E8F5E9',

    paddingVertical: 3,

    paddingHorizontal: 8,

    borderRadius: 14,

    alignSelf: 'flex-start',

  },

  completedText: {

    color: '#2E7D32',

    fontWeight: '700',

    fontSize: 12,

  },

  // =====================================================

  // IN PROGRESS

  // =====================================================

  progressBadge: {

    marginTop: 8,

    backgroundColor: '#FFF3E0',

    paddingVertical: 3,

    paddingHorizontal: 8,

    borderRadius: 14,

    alignSelf: 'flex-start',

  },

  progressTextBadge: {

    color: '#EF6C00',

    fontWeight: '700',

    fontSize: 12,

  },

  // =====================================================

  // NOT STARTED

  // =====================================================

  pendingBadge: {

    marginTop: 8,

    backgroundColor: '#FBE9E7',

    paddingVertical: 3,

    paddingHorizontal: 8,

    borderRadius: 14,

    alignSelf: 'flex-start',

  },

  pendingText: {

    color: '#D84315',

    fontWeight: '700',

    fontSize: 12,

  },

});