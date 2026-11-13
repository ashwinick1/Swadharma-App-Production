import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  startAssessment,
  saveAssessmentAnswers,
  completeAssessment,
} from '../services/api';

// ======================================================
// DOSHA QUESTIONS - 10 QUESTIONS FOR TESTING
// ======================================================

const questions = [
  {
    question:
      'How would you describe your body build?',
    options: [
      'Thin, light or slender',
      'Medium, muscular or well-proportioned',
      'Broad, solid or heavier build',
    ],
  },

  {
    question:
      'How is your appetite generally?',
    options: [
      'Irregular, changes frequently',
      'Strong and consistent',
      'Slow and steady',
    ],
  },

  {
    question:
      'How do you usually sleep?',
    options: [
      'Light sleep and may wake easily',
      'Moderate sleep and usually restful',
      'Deep sleep and difficult to wake',
    ],
  },

  {
    question:
      'How do you usually respond to stress?',
    options: [
      'I become anxious or restless',
      'I become irritated or intense',
      'I become quiet or withdrawn',
    ],
  },

  {
    question:
      'How would you describe your energy level?',
    options: [
      'Comes in bursts and changes often',
      'Strong and focused',
      'Steady but slower',
    ],
  },

  {
    question:
      'How do you usually speak?',
    options: [
      'Fast and talkative',
      'Clear, direct and confident',
      'Slow, calm and measured',
    ],
  },

  {
    question:
      'How do you handle changes in your routine?',
    options: [
      'I enjoy changes but can become unsettled',
      'I adapt quickly when I understand the reason',
      'I prefer familiar routines',
    ],
  },

  {
    question:
      'How do you usually learn something new?',
    options: [
      'Quickly, but I may forget quickly',
      'Quickly and remember important details',
      'Slowly, but remember for a long time',
    ],
  },

  {
    question:
      'How would you describe your skin?',
    options: [
      'Dry or tends to become dry',
      'Warm and sensitive',
      'Smooth, soft or slightly oily',
    ],
  },

  {
    question:
      'How do you generally handle physical activity?',
    options: [
      'I prefer light and varied activities',
      'I enjoy challenging activities',
      'I prefer moderate and steady activities',
    ],
  },
];

// ======================================================
// SCREEN
// ======================================================

const DoshaQuestionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // ====================================================
  // USER / ASSESSMENT
  // ====================================================

  const userId = route.params?.userId;

  const assessmentType = 'DOSHA';

  // ====================================================
  // CURRENT PAGE
  // ====================================================

  const [currentPage, setCurrentPage] =
    useState(0);

  // ====================================================
  // STORE ALL ANSWERS
  // ====================================================

  const [answers, setAnswers] = useState<
    (number | null)[]
  >(
    Array(questions.length).fill(null),
  );

  // ====================================================
  // START DOSHA ASSESSMENT
  // ====================================================

useEffect(() => {
  if (!userId) {
    Alert.alert(
      'Error',
      'User information is missing. Please login again.',
    );
    return;
  }

  const startDoshaAssessment =
    async () => {
      try {
        await startAssessment({
          userId,
          assessmentType,
        });

        console.log(
          'DOSHA assessment started successfully',
        );
      } catch (error) {
        console.error(
          'Failed to start DOSHA assessment:',
          error,
        );

        Alert.alert(
          'Error',
          'Unable to start the Dosha assessment. Please try again.',
        );
      }
    };

  startDoshaAssessment();
}, [userId]);
  // ======================================================
  // TWO QUESTIONS PER PAGE
  // ======================================================

  const firstQuestionIndex =
    currentPage * 2;

  const secondQuestionIndex =
    firstQuestionIndex + 1;

  const firstQuestion =
    questions[firstQuestionIndex];

  const secondQuestion =
    questions[secondQuestionIndex];

  // ======================================================
  // TOTAL PAGES
  // ======================================================

  const totalPages =
    Math.ceil(
      questions.length / 2,
    );

  // ======================================================
  // LAST PAGE
  // ======================================================

  const isLastPage =
    currentPage ===
    totalPages - 1;

  // ======================================================
  // PROGRESS %
  // ======================================================

  const progress =
    ((currentPage + 1) /
      totalPages) *
    100;

  // ======================================================
  // SELECT ANSWER
  // ======================================================

  const handleSelectAnswer = (
    questionIndex: number,
    answerIndex: number,
  ) => {
    const updatedAnswers = [
      ...answers,
    ];

    updatedAnswers[
      questionIndex
    ] = answerIndex;

    setAnswers(
      updatedAnswers,
    );
  };

  // ======================================================
  // CALCULATE DOSHA PERCENTAGES
  // ======================================================

  const calculateDoshaResult = () => {
    let vata = 0;
    let pitta = 0;
    let kapha = 0;

    answers.forEach(answer => {
      if (answer === 0) {
        vata++;
      }

      if (answer === 1) {
        pitta++;
      }

      if (answer === 2) {
        kapha++;
      }
    });

    const totalQuestions =
      questions.length;

    const vataPercentage =
      Math.round(
        (vata /
          totalQuestions) *
          100,
      );

    const pittaPercentage =
      Math.round(
        (pitta /
          totalQuestions) *
          100,
      );

    const kaphaPercentage =
      Math.round(
        (kapha /
          totalQuestions) *
          100,
      );

    // ==================================================
    // DETERMINE PRIMARY DOSHA
    // ==================================================

    let primaryDosha = 'Vata';

    let primaryPercentage =
      vataPercentage;

    if (
      pittaPercentage >
      primaryPercentage
    ) {
      primaryDosha =
        'Pitta';

      primaryPercentage =
        pittaPercentage;
    }

    if (
      kaphaPercentage >
      primaryPercentage
    ) {
      primaryDosha =
        'Kapha';

      primaryPercentage =
        kaphaPercentage;
    }

    return {
      vata: vataPercentage,
      pitta: pittaPercentage,
      kapha: kaphaPercentage,
      primaryDosha,
      primaryPercentage,
    };
  };

  // ======================================================
  // FORMAT ANSWERS FOR DATABASE
  // ======================================================

  const formatAnswersForDatabase =
    () => {
      return answers.map(
        (answer, index) => {
          return {
            questionId:
              index + 1,

            question:
              questions[index]
                .question,

            answer:
              answer !== null
                ? questions[index]
                    .options[
                    answer
                  ]
                : null,

            answerIndex:
              answer,

            dosha:
              answer === 0
                ? 'VATA'
                : answer === 1
                ? 'PITTA'
                : answer === 2
                ? 'KAPHA'
                : null,
          };
        },
      );
    };

  // ======================================================
  // NEXT / FINISH
  // ======================================================

 const handleNext =
  async () => {
    if (!userId) {
      Alert.alert(
        'Error',
        'User information is missing. Please login again.',
      );
      return;
    }
      const firstAnswer =
        answers[
          firstQuestionIndex
        ];

      const secondAnswer =
        answers[
          secondQuestionIndex
        ];

      // ==================================================
      // CHECK FIRST QUESTION
      // ==================================================

      if (
        firstAnswer === null
      ) {
        Alert.alert(
          'Select an Answer',
          `Please answer Question ${
            firstQuestionIndex + 1
          } before continuing.`,
        );

        return;
      }

      // ==================================================
      // CHECK SECOND QUESTION
      // ==================================================

      if (
        secondQuestionIndex <
          questions.length &&
        secondAnswer === null
      ) {
        Alert.alert(
          'Select an Answer',
          `Please answer Question ${
            secondQuestionIndex + 1
          } before continuing.`,
        );

        return;
      }

      // ==================================================
      // FORMAT ANSWERS
      // ==================================================

      const formattedAnswers =
        formatAnswersForDatabase();

      // ==================================================
      // SAVE ANSWERS
      // ==================================================

      try {
        await saveAssessmentAnswers(
          {
            userId,
            assessmentType,
            answers:
              formattedAnswers,
          },
        );

        console.log(
          'DOSHA answers saved successfully',
          formattedAnswers,
        );
      } catch (error) {
        console.error(
          'Failed to save DOSHA answers:',
          error,
        );

        Alert.alert(
          'Save Failed',
          'Unable to save your answers. Please check your internet connection and try again.',
        );

        return;
      }

      // ==================================================
      // FINISH
      // ==================================================

      if (isLastPage) {
        const doshaResult =
          calculateDoshaResult();

        console.log(
          'Dosha Answers:',
          answers,
        );

        console.log(
          'Dosha Result:',
          doshaResult,
        );

        // ==============================================
        // COMPLETE ASSESSMENT
        // ==============================================

        try {
          await completeAssessment(
            {
              userId,
              assessmentType,
              answers:
                formattedAnswers,
              result:
                doshaResult,
            },
          );

          console.log(
            'DOSHA assessment completed successfully',
          );
        } catch (error) {
          console.error(
            'Failed to complete DOSHA assessment:',
            error,
          );

          Alert.alert(
            'Completion Failed',
            'Your result could not be saved. Please try again.',
          );

          return;
        }

        // ==============================================
        // NAVIGATE TO DOSHA RESULT
        // ==============================================

        navigation.navigate(
          'DoshaResult' as never,
          {
            answers,
            doshaResult,
          } as never,
        );

        return;
      }

      // ==================================================
      // NEXT PAGE
      // ==================================================

      setCurrentPage(
        currentPage + 1,
      );
    };

  // ======================================================
  // PREVIOUS
  // ======================================================

  const handlePrevious =
    () => {
      if (
        currentPage === 0
      ) {
        navigation.goBack();
        return;
      }

      setCurrentPage(
        currentPage - 1,
      );
    };

  // ======================================================
  // RENDER QUESTION
  // ======================================================

  const renderQuestion = (
    question: any,
    questionIndex: number,
  ) => {
    if (!question) {
      return null;
    }

    return (
      <View
        style={
          styles.questionCard
        }
        key={questionIndex}>

        {/* Question Number */}

        <Text
          style={
            styles.questionNumber
          }>
          Question{' '}
          {questionIndex + 1}
        </Text>

        {/* Question */}

        <Text
          style={
            styles.questionText
          }>
          {question.question}
        </Text>

        {/* Instruction */}

        <Text
          style={
            styles.chooseText
          }>
          Choose the option that
          best describes you
        </Text>

        {/* Options */}

        <View
          style={
            styles.optionsContainer
          }>

          {question.options.map(
            (
              option: string,
              optionIndex: number,
            ) => {
              const isSelected =
                answers[
                  questionIndex
                ] ===
                optionIndex;

              return (
                <TouchableOpacity
                  key={
                    optionIndex
                  }
                  style={[
                    styles.optionCard,
                    isSelected &&
                      styles.selectedOption,
                  ]}
                  onPress={() =>
                    handleSelectAnswer(
                      questionIndex,
                      optionIndex,
                    )
                  }>

                  {/* Radio Circle */}

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

                  {/* Option Text */}

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

      </View>
    );
  };

  // ======================================================
  // UI
  // ======================================================

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

        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <View
          style={styles.header}>

          <TouchableOpacity
            onPress={
              handlePrevious
            }
            style={
              styles.backButton
            }>

            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF5A00"
            />

          </TouchableOpacity>

          <Text
            style={
              styles.headerTitle
            }>
            Dosha Assessment
          </Text>

          <View
            style={
              styles.headerSpace
            }
          />

        </View>

        {/* ========================= */}
        {/* PROGRESS */}
        {/* ========================= */}

        <View
          style={
            styles.progressSection
          }>

          <View
            style={
              styles.progressHeader
            }>

            <Text
              style={
                styles.questionCount
              }>

              Questions{' '}
              {firstQuestionIndex +
                1}

              {secondQuestionIndex <
              questions.length
                ? `–${
                    secondQuestionIndex +
                    1
                  }`
                : ''}{' '}

              of{' '}
              {questions.length}

            </Text>

            <Text
              style={
                styles.progressPercentage
              }>

              {Math.round(
                progress,
              )}
              %

            </Text>

          </View>

          {/* Progress Bar */}

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

        </View>

        {/* ========================= */}
        {/* QUESTION 1 */}
        {/* ========================= */}

        {renderQuestion(
          firstQuestion,
          firstQuestionIndex,
        )}

        {/* ========================= */}
        {/* QUESTION 2 */}
        {/* ========================= */}

        {secondQuestionIndex <
          questions.length &&
          renderQuestion(
            secondQuestion,
            secondQuestionIndex,
          )}

        {/* ========================= */}
        {/* BUTTONS */}
        {/* ========================= */}

        <View
          style={
            styles.buttonRow
          }>

          {/* Previous */}

          <TouchableOpacity
            style={
              styles.previousButton
            }
            onPress={
              handlePrevious
            }>

            <MaterialCommunityIcons
              name="arrow-left"
              size={21}
              color="#FF5A00"
            />

            <Text
              style={
                styles.previousButtonText
              }>
              Previous
            </Text>

          </TouchableOpacity>

          {/* Next / Finish */}

          <TouchableOpacity
            style={
              styles.nextButton
            }
            onPress={
              handleNext
            }>

            <Text
              style={
                styles.nextButtonText
              }>

              {isLastPage
                ? 'Finish'
                : 'Next'}

            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={21}
              color="#FFFFFF"
            />

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default DoshaQuestionsScreen;

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

    // =========================
    // HEADER
    // =========================

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
      fontSize: 19,
      fontWeight: '900',
      color: '#FF5A00',
    },

    headerSpace: {
      width: 40,
    },

    // =========================
    // PROGRESS
    // =========================

    progressSection: {
      marginBottom: 20,
    },

    progressHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginBottom: 9,
    },

    questionCount: {
      fontSize: 15,
      fontWeight: '800',
      color: '#2B211B',
    },

    progressPercentage: {
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
      height: '100%',
      backgroundColor:
        '#FF5A00',
      borderRadius: 10,
    },

    // =========================
    // QUESTION CARD
    // =========================

    questionCard: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,

      borderWidth: 1,
      borderColor: '#FFD7B0',

      elevation: 3,

      shadowColor: '#FF6B00',
      shadowOpacity: 0.08,
      shadowRadius: 5,

      shadowOffset: {
        width: 0,
        height: 2,
      },
    },

    questionNumber: {
      fontSize: 14,
      fontWeight: '900',
      color: '#FF5A00',
      marginBottom: 8,
    },

    questionText: {
      fontSize: 18,
      lineHeight: 25,
      fontWeight: '900',
      color: '#2B211B',
      marginBottom: 12,
    },

    chooseText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#665D56',
      marginBottom: 10,
    },

    // =========================
    // OPTIONS
    // =========================

    optionsContainer: {
      marginBottom: 2,
    },

    optionCard: {
      minHeight: 58,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 14,

      borderWidth: 1.5,
      borderColor: '#E8DDD5',

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: 13,
      paddingVertical: 9,

      marginBottom: 9,

      elevation: 1,
    },

    selectedOption: {
      backgroundColor:
        '#FFF0DD',
      borderColor: '#FF5A00',
      borderWidth: 2,
    },

    radioCircle: {
      width: 22,
      height: 22,
      borderRadius: 11,

      borderWidth: 2,
      borderColor: '#BDB5AE',

      justifyContent:
        'center',
      alignItems: 'center',

      marginRight: 11,
    },

    selectedRadio: {
      borderColor: '#FF5A00',
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
      fontSize: 15,
      lineHeight: 20,
      fontWeight: '700',
      color: '#38302A',
    },

    selectedOptionText: {
      color: '#D94D00',
      fontWeight: '900',
    },

    // =========================
    // BUTTONS
    // =========================

    buttonRow: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems: 'center',
      marginTop: 4,
    },

    previousButton: {
      width: '42%',
      height: 54,

      borderRadius: 14,

      borderWidth: 2,
      borderColor: '#FF5A00',

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',
    },

    previousButtonText: {
      color: '#FF5A00',
      fontSize: 16,
      fontWeight: '900',
      marginLeft: 7,
    },

    nextButton: {
      width: '54%',
      height: 54,

      borderRadius: 14,

      backgroundColor:
        '#FF5A00',

      flexDirection: 'row',
      justifyContent:
        'center',
      alignItems: 'center',

      elevation: 4,
    },

    nextButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '900',
      marginRight: 7,
    },
  });