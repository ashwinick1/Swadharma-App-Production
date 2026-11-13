import React, {useEffect, useState} from 'react';

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
// GUNA QUESTIONS
// ======================================================
//
// 45 QUESTIONS
//
// Sattva = 15 questions
// Rajas  = 15 questions
// Tamas  = 15 questions
//
// 2 questions are displayed on each screen.
// Total = 23 screens.
//
// Each question is scored from 0 to 10.
// Each Guna therefore has a maximum score of 150.
// ======================================================

const questions = [
  {
    question: "I have the right thoughts in my mind.",
    guna: "Sattva",
  },
  {
    question: "My behaviour is balanced.",
    guna: "Sattva",
  },
  {
    question: "I experience profound peace.",
    guna: "Sattva",
  },
  {
    question: "I speak gently.",
    guna: "Sattva",
  },
  {
    question: "I speak pleasantly to others.",
    guna: "Sattva",
  },
  {
    question: "I have good thoughts.",
    guna: "Sattva",
  },
  {
    question: "I think peacefully.",
    guna: "Sattva",
  },
  {
    question: "I read good books.",
    guna: "Sattva",
  },
  {
    question: "My company is virtuous and positive.",
    guna: "Sattva",
  },
  {
    question: "My intellect is sharp.",
    guna: "Sattva",
  },
  {
    question: "I remain clear in my thoughts, free from any doubt or confusion.",
    guna: "Sattva",
  },
  {
    question: "I see things as they are, without imposing my own perceptions on them.",
    guna: "Sattva",
  },
  {
    question: "I don't get disturbed by surrounding events or circumstances.",
    guna: "Sattva",
  },
  {
    question: "I prioritise others over myself.",
    guna: "Sattva",
  },
  {
    question: "My daily routine is balanced and disciplined.",
    guna: "Sattva",
  },
  {
    question: "I experience physical and mental instability.",
    guna: "Rajas",
  },
  {
    question: "I have endless plans.",
    guna: "Rajas",
  },
  {
    question: "I am diligent, and strive to complete any task that comes my way. I feel a sense of guilt if I take enough rest.",
    guna: "Rajas",
  },
  {
    question: "I expect immediate results for my efforts; I don't like waiting.",
    guna: "Rajas",
  },
  {
    question: "I feel sorrow if my desires are not fulfilled.",
    guna: "Rajas",
  },
  {
    question: "I have endless desires; as soon as one is fulfilled, another one emerges.",
    guna: "Rajas",
  },
  {
    question: "I believe all is well if the result is good. If the result is favourable, then any means are acceptable.",
    guna: "Rajas",
  },
  {
    question: "I feel that nobody questions a winner, and nobody asks a successful person what mistakes they made. Everything is considered right for them.",
    guna: "Rajas",
  },
  {
    question: "My mind is outward-focused.",
    guna: "Rajas",
  },
  {
    question: "I lack self-reflection; I seldom sit down to contemplate myself.",
    guna: "Rajas",
  },
  {
    question: "I use harsh words while speaking.",
    guna: "Rajas",
  },
  {
    question: "I am passionate; whenever I undertake a task, I engage with it completely.",
    guna: "Rajas",
  },
  {
    question: "I give more importance to myself than others.",
    guna: "Rajas",
  },
  {
    question: "I experience anger.",
    guna: "Rajas",
  },
  {
    question: "I feel unrest.",
    guna: "Rajas",
  },
  {
    question: "I experience fatigue.",
    guna: "Tamas",
  },
  {
    question: "I feel a lack of energy.",
    guna: "Tamas",
  },
  {
    question: "I eat excessively.",
    guna: "Tamas",
  },
  {
    question: "I sleep more than necessary.",
    guna: "Tamas",
  },
  {
    question: "I procrastinate; today's work is postponed to tomorrow, and day after tomorrow.",
    guna: "Tamas",
  },
  {
    question: "I lack self-confidence.",
    guna: "Tamas",
  },
  {
    question: "I am dissatisfied with the world.",
    guna: "Tamas",
  },
  {
    question: "I have too many expectations from the world.",
    guna: "Tamas",
  },
  {
    question: "I feel a lack of competence in my abilities.",
    guna: "Tamas",
  },
  {
    question: "I am afraid of dreaming big.",
    guna: "Tamas",
  },
  {
    question: "I know that I can't work too hard.",
    guna: "Tamas",
  },
  {
    question: "I believe in shortcuts to success.",
    guna: "Tamas",
  },
  {
    question: "I can't work without supervision; I need someone to give me instructions to work; I don't work on my own.",
    guna: "Tamas",
  },
  {
    question: "I need someone to tell me what to do; I can't decide on my own.",
    guna: "Tamas",
  },
  {
    question: "I prefer a comfortable life.",
    guna: "Tamas",
  }
];


// ======================================================
// ANSWER OPTIONS
// ======================================================
//
// 0 = Never
// 1 = Almost never
// 2 = Very rarely
// 3 = Rarely
// 4 = Occasionally
// 5 = Sometimes
// 6 = Moderately often
// 7 = Often
// 8 = Very often
// 9 = Almost always
// 10 = Always
// ======================================================

const answerOptions = [
  {
    label: 'Never',
    score: 0,
  },

  {
    label: 'Almost never',
    score: 1,
  },

  {
    label: 'Very rarely',
    score: 2,
  },

  {
    label: 'Rarely',
    score: 3,
  },

  {
    label: 'Occasionally',
    score: 4,
  },

  {
    label: 'Sometimes',
    score: 5,
  },

  {
    label: 'Moderately often',
    score: 6,
  },

  {
    label: 'Often',
    score: 7,
  },

  {
    label: 'Very often',
    score: 8,
  },

  {
    label: 'Almost always',
    score: 9,
  },

  {
    label: 'Always',
    score: 10,
  },
];


// ======================================================
// SCREEN
// ======================================================

const GunaQuestionsScreen = () => {

  const navigation = useNavigation();
  const route = useRoute<any>();

  // ====================================================
  // USER / ASSESSMENT
  // ====================================================

  const userId = route.params?.userId;

  const assessmentType = 'GUNA';

  // ====================================================
  // START GUNA ASSESSMENT
  // ====================================================

  useEffect(() => {
    if (!userId) {
      Alert.alert(
        'Error',
        'User information is missing. Please login again.',
      );

      return;
    }

    const startGunaAssessment = async () => {
      try {
        await startAssessment({
          userId,
          assessmentType,
        });

        console.log(
          'GUNA assessment started successfully',
          userId,
        );
      } catch (error) {
        console.error(
          'Failed to start GUNA assessment:',
          error,
        );

        Alert.alert(
          'Error',
          'Unable to start the Guna assessment. Please try again.',
        );
      }
    };

    startGunaAssessment();
  }, [userId]);

  // ====================================================
  // CURRENT SCREEN
  // ====================================================

  const [currentScreen, setCurrentScreen] =
    useState(0);


  // ====================================================
  // ANSWERS
  // ====================================================
  //
  // Each position stores the selected
  // answer option index.
  //
  // Example:
  //
  // answers[0] = 7
  // means Question 1 = "Often"
  //
  // ====================================================

  const [answers, setAnswers] =
    useState<(number | null)[]>(
      Array(questions.length).fill(null),
    );


  // ====================================================
  // TWO QUESTIONS PER SCREEN
  // ====================================================

  const firstQuestionIndex =
    currentScreen * 2;

  const secondQuestionIndex =
    firstQuestionIndex + 1;


  const firstQuestion =
    questions[firstQuestionIndex];

  const secondQuestion =
    questions[secondQuestionIndex];


  // ====================================================
  // TOTAL SCREENS
  // ====================================================

  const totalScreens =
    Math.ceil(
      questions.length / 2,
    );


  // ====================================================
  // PROGRESS
  // ====================================================

  const progress =
    ((currentScreen + 1) /
      totalScreens) *
    100;


  // ====================================================
  // SELECT ANSWER
  // ====================================================

  const handleSelectAnswer = (
    questionIndex: number,
    optionIndex: number,
  ) => {

    const updatedAnswers = [
      ...answers,
    ];

    updatedAnswers[questionIndex] =
      optionIndex;

    setAnswers(
      updatedAnswers,
    );
  };


  // ====================================================
  // CALCULATE RESULT
  // ====================================================

  const calculateResult = (
    allAnswers: (number | null)[],
  ) => {

    let sattvaScore = 0;

    let rajasScore = 0;

    let tamasScore = 0;


    // ==================================================
    // ADD SCORES
    // ==================================================

    allAnswers.forEach(
      (
        answerIndex,
        questionIndex,
      ) => {

        if (
          answerIndex === null
        ) {
          return;
        }


        const questionData =
          questions[
            questionIndex
          ];


        const score =
          answerOptions[
            answerIndex
          ]?.score ?? 0;


        // ==============================================
        // SATTVA
        // ==============================================

        if (
          questionData.guna ===
          'Sattva'
        ) {

          sattvaScore +=
            score;

        }


        // ==============================================
        // RAJAS
        // ==============================================

        if (
          questionData.guna ===
          'Rajas'
        ) {

          rajasScore +=
            score;

        }


        // ==============================================
        // TAMAS
        // ==============================================

        if (
          questionData.guna ===
          'Tamas'
        ) {

          tamasScore +=
            score;

        }

      },
    );


    // ==================================================
    // TOTAL SCORE
    // ==================================================

    const totalScore =
      sattvaScore +
      rajasScore +
      tamasScore;


    // ==================================================
    // PERCENTAGES
    // ==================================================

    let sattvaPercentage = 0;

    let rajasPercentage = 0;

    let tamasPercentage = 0;


    if (
      totalScore > 0
    ) {

      sattvaPercentage =
        Math.round(
          (
            sattvaScore /
            totalScore
          ) * 100,
        );


      rajasPercentage =
        Math.round(
          (
            rajasScore /
            totalScore
          ) * 100,
        );


      tamasPercentage =
        Math.round(
          (
            tamasScore /
            totalScore
          ) * 100,
        );

    }


    // ==================================================
    // PRIMARY GUNA
    // ==================================================

    let primaryGuna =
      'Sattva';

    let primaryPercentage =
      sattvaPercentage;


    if (
      rajasPercentage >
      primaryPercentage
    ) {

      primaryGuna =
        'Rajas';

      primaryPercentage =
        rajasPercentage;

    }


    if (
      tamasPercentage >
      primaryPercentage
    ) {

      primaryGuna =
        'Tamas';

      primaryPercentage =
        tamasPercentage;

    }


    // ==================================================
    // RESULT
    // ==================================================

    return {

      sattva:
        sattvaPercentage,

      rajas:
        rajasPercentage,

      tamas:
        tamasPercentage,

      primaryGuna,

      primaryPercentage,

      rawScores: {

        sattva:
          sattvaScore,

        rajas:
          rajasScore,

        tamas:
          tamasScore,

      },

      totalScore,

    };
  };


  // ====================================================
  // NEXT / FINISH
  // ====================================================

  const handleNext = async () => {

    // ==================================================
    // QUESTIONS ON CURRENT SCREEN ARE MANDATORY
    // ==================================================

    const firstAnswer =
      answers[firstQuestionIndex];

    const secondAnswer =
      secondQuestionIndex < questions.length
        ? answers[secondQuestionIndex]
        : null;

    // ==================================================
    // CHECK FIRST QUESTION
    // ==================================================

    if (firstAnswer === null) {
      Alert.alert(
        'Select an Answer',
        'Please answer the question before continuing.',
      );

      return;
    }

    // ==================================================
    // CHECK SECOND QUESTION
    // ==================================================

    // The final screen contains only Question 45.
    // Therefore Question 46 should not be required.

    if (
      secondQuestionIndex < questions.length &&
      secondAnswer === null
    ) {
      Alert.alert(
        'Select an Answer',
        'Please answer both questions before continuing.',
      );

      return;
    }

    // ==================================================
    // FORMAT ANSWERS FOR DATABASE
    // ==================================================

    const formattedAnswers =
      answers.map(
        (answer, index) => ({
          questionId: index + 1,

          question:
            questions[index].question,

          guna:
            questions[index].guna,

          answerIndex:
            answer,

          answer:
            answer !== null
              ? answerOptions[answer].label
              : null,

          score:
            answer !== null
              ? answerOptions[answer].score
              : null,
        }),
      );

    // ==================================================
    // SAVE ANSWERS
    // ==================================================

    try {
      await saveAssessmentAnswers({
        userId,
        assessmentType,
        answers: formattedAnswers,
      });

      console.log(
        'GUNA answers saved successfully',
        formattedAnswers,
      );
    } catch (error) {
      console.error(
        'Failed to save GUNA answers:',
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

    if (
      currentScreen ===
      totalScreens - 1
    ) {

      // ==================================================
      // CALCULATE FINAL RESULT
      // ==================================================

      const result =
        calculateResult(answers);

      console.log(
        'GUNA ANSWERS:',
        answers,
      );

      console.log(
        'GUNA RESULT:',
        result,
      );

      // ==================================================
      // COMPLETE ASSESSMENT
      // ==================================================

      try {
        await completeAssessment({
          userId,
          assessmentType,
          answers: formattedAnswers,
          result,
        });

        console.log(
          'GUNA assessment completed successfully',
        );
      } catch (error) {
        console.error(
          'Failed to complete GUNA assessment:',
          error,
        );

        Alert.alert(
          'Completion Failed',
          'Your Guna result could not be saved. Please try again.',
        );

        return;
      }

      // ==================================================
      // GO TO RESULT SCREEN
      // ==================================================

      navigation.navigate(
        'GunaResult' as never,
        {
          answers,
          gunaResult: result,
          userId,
        } as never,
      );

      return;
    }

    // ==================================================
    // NEXT SCREEN
    // ==================================================

    setCurrentScreen(
      currentScreen + 1,
    );
  };


  // ====================================================
  // PREVIOUS
  // ====================================================

  const handlePrevious = () => {

    if (
      currentScreen === 0
    ) {

      navigation.goBack();

      return;
    }


    setCurrentScreen(
      currentScreen - 1,
    );
  };


  // ====================================================
  // RENDER OPTIONS
  // ====================================================

  const renderOptions = (
    questionIndex: number,
  ) => {

    return (

      <View
        style={
          styles.optionsContainer
        }>

        {
          answerOptions.map(
            (
              option,
              index,
            ) => {

              const isSelected =
                answers[
                  questionIndex
                ] === index;


              return (

                <TouchableOpacity
                  key={index}

                  style={[
                    styles.optionCard,

                    isSelected &&
                      styles.selectedOption,
                  ]}

                  onPress={() =>
                    handleSelectAnswer(
                      questionIndex,
                      index,
                    )
                  }>


                  {/* RADIO */}

                  <View
                    style={[
                      styles.radioCircle,

                      isSelected &&
                        styles.selectedRadio,
                    ]}>

                    {
                      isSelected && (
                        <View
                          style={
                            styles.radioDot
                          }
                        />
                      )
                    }

                  </View>


                  {/* OPTION TEXT */}

                  <Text
                    style={[
                      styles.optionText,

                      isSelected &&
                        styles.selectedOptionText,
                    ]}>

                    {
                      option.label
                    }

                  </Text>


                  {/* SCORE */}

                  <Text
                    style={[
                      styles.scoreText,

                      isSelected &&
                        styles.selectedScoreText,
                    ]}>

                    {
                      option.score
                    }

                  </Text>

                </TouchableOpacity>

              );

            },
          )
        }

      </View>
    );
  };


  // ====================================================
  // UI
  // ====================================================

  return (

    <SafeAreaView
      style={
        styles.container
      }>

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
          style={
            styles.header
          }>


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

            Guna Assessment

          </Text>


          <View
            style={
              styles.headerSpace
            }
          />

        </View>


        {/* ========================================= */}
        {/* PROGRESS */}
        {/* ========================================= */}

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

              {firstQuestionIndex + 1}

              –

              {Math.min(
                secondQuestionIndex + 1,
                questions.length,
              )}

              {' '}of{' '}

              {questions.length}

            </Text>


            <Text
              style={
                styles.progressPercentage
              }>

              {Math.round(
                progress,
              )}%

            </Text>

          </View>


          <View
            style={
              styles.progressBackground
            }>

            <View
              style={[
                styles.progressFill,

                {
                  width:
                    `${progress}%`,
                },
              ]}
            />

          </View>

        </View>


        {/* ========================================= */}
        {/* QUESTION 1 */}
        {/* ========================================= */}

        <View
          style={
            styles.questionCard
          }>


          <Text
            style={
              styles.questionNumber
            }>

            Question{' '}

            {firstQuestionIndex + 1}

          </Text>


          <Text
            style={
              styles.questionText
            }>

            {
              firstQuestion.question
            }

          </Text>


          <Text
            style={
              styles.chooseText
            }>

            How often does this describe you?

          </Text>


          {
            renderOptions(
              firstQuestionIndex,
            )
          }

        </View>


        {/* ========================================= */}
        {/* QUESTION 2 */}
        {/* ========================================= */}

        {secondQuestion && (
          <View
            style={
              styles.questionCard
            }>


            <Text
              style={
                styles.questionNumber
              }>

              Question{' '}

              {secondQuestionIndex + 1}

            </Text>


            <Text
              style={
                styles.questionText
              }>

              {
                secondQuestion.question
              }

            </Text>


            <Text
              style={
                styles.chooseText
              }>

              How often does this describe you?

            </Text>


            {
              renderOptions(
                secondQuestionIndex,
              )
            }

          </View>
        )}


        {/* ========================================= */}
        {/* BUTTONS */}
        {/* ========================================= */}

        <View
          style={
            styles.buttonRow
          }>


          {/* PREVIOUS */}

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


          {/* NEXT / FINISH */}

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

              {
                currentScreen ===
                totalScreens - 1

                  ? 'Finish'

                  : 'Next'
              }

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


export default GunaQuestionsScreen;


// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({

    // ==================================================
    // CONTAINER
    // ==================================================

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

      alignItems:
        'center',

      justifyContent:
        'space-between',

      marginBottom: 22,
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


    // ==================================================
    // PROGRESS
    // ==================================================

    progressSection: {
      marginBottom: 20,
    },


    progressHeader: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 9,
    },


    questionCount: {
      fontSize: 14,

      fontWeight: '800',

      color: '#2B211B',
    },


    progressPercentage: {
      fontSize: 14,

      fontWeight: '800',

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


    // ==================================================
    // QUESTION CARD
    // ==================================================

    questionCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 20,

      padding: 18,

      marginBottom: 15,

      borderWidth: 1,

      borderColor:
        '#FFD7B0',

      elevation: 4,

      shadowColor:
        '#FF6B00',

      shadowOpacity: 0.08,

      shadowRadius: 6,

      shadowOffset: {
        width: 0,

        height: 3,
      },
    },


    questionNumber: {
      fontSize: 13,

      fontWeight: '900',

      color: '#FF5A00',

      marginBottom: 7,
    },


    questionText: {
      fontSize: 17,

      lineHeight: 24,

      fontWeight: '900',

      color: '#2B211B',

      marginBottom: 10,
    },


    chooseText: {
      fontSize: 13,

      fontWeight: '700',

      color: '#777777',

      marginBottom: 12,
    },


    // ==================================================
    // OPTIONS
    // ==================================================

    optionsContainer: {
      marginTop: 2,
    },


    optionCard: {
      minHeight: 48,

      backgroundColor:
        '#FFFFFF',

      borderRadius: 13,

      borderWidth: 1.5,

      borderColor:
        '#E8DDD5',

      flexDirection: 'row',

      alignItems:
        'center',

      paddingHorizontal: 12,

      marginBottom: 8,
    },


    selectedOption: {
      backgroundColor:
        '#FFF0DD',

      borderColor:
        '#FF5A00',

      borderWidth: 2,
    },


    radioCircle: {
      width: 21,

      height: 21,

      borderRadius: 11,

      borderWidth: 2,

      borderColor:
        '#BDB5AE',

      justifyContent:
        'center',

      alignItems:
        'center',

      marginRight: 11,
    },


    selectedRadio: {
      borderColor:
        '#FF5A00',
    },


    radioDot: {
      width: 10,

      height: 10,

      borderRadius: 5,

      backgroundColor:
        '#FF5A00',
    },


    optionText: {
      flex: 1,

      fontSize: 14,

      fontWeight: '700',

      color: '#38302A',
    },


    selectedOptionText: {
      color: '#D94D00',

      fontWeight: '900',
    },


    scoreText: {
      fontSize: 13,

      fontWeight: '800',

      color: '#999999',

      marginLeft: 8,
    },


    selectedScoreText: {
      color: '#FF5A00',

      fontWeight: '900',
    },


    // ==================================================
    // BUTTONS
    // ==================================================

    buttonRow: {
      flexDirection: 'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginTop: 5,
    },


    previousButton: {
      width: '42%',

      height: 54,

      borderRadius: 14,

      borderWidth: 2,

      borderColor:
        '#FF5A00',

      backgroundColor:
        '#FFFFFF',

      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems:
        'center',
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

      alignItems:
        'center',

      elevation: 4,
    },


    nextButtonText: {
      color: '#FFFFFF',

      fontSize: 16,

      fontWeight: '900',

      marginRight: 7,
    },

  });