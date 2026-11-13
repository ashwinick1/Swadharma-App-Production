import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

const strengths = [
  'Confident', 'Helpful', 'Creative', 'Patient', 'Responsible', 'Adaptable',
  'Good Listener', 'Analytical', 'Calm', 'Empathetic', 'Communicative',
  'Organised', 'Curious', 'Independent', 'Team Player', 'Leadership',
  'Reliable', 'Positive', 'Problem Solver', 'Open Minded',
];

const activities = [
  'Reading / Learning', 'Sports / Physical Activities', 'Music / Singing',
  'Drawing / Art / Craft', 'Dancing', 'Writing', 'Teaching / Explaining',
  'Helping Others', 'Social Activities', 'Organising Activities',
  'Technology / Computers', 'Travelling / Exploring',
  'Meditation / Spiritual Activities', 'Working with Nature', 'Other',
];

const questions = [
  {
    key: 'childhoodInterests',
    title: 'What activities did the person enjoy most during childhood?',
    description: 'Think about hobbies, games, subjects, or activities they naturally enjoyed.',
    placeholder: 'Describe their childhood interests...',
    section: 'Childhood Interests and Talents',
  },
  {
    key: 'childhoodTalents',
    title: 'What natural talents or special abilities did you notice during childhood?',
    description: 'Share specific abilities or examples you remember.',
    placeholder: 'Describe the talents you noticed...',
    section: 'Childhood Interests and Talents',
  },
  {
    key: 'childhoodCreativity',
    title: 'Was the person creative or imaginative as a child? Please share an example.',
    description: 'For example, inventing games, drawing, storytelling, or finding new ways to do things.',
    placeholder: 'Share an example...',
    section: 'Childhood Interests and Talents',
  },
  {
    key: 'childhoodSocialTraits',
    title: 'Did the person show leadership, enjoy helping others, or like solving problems during childhood?',
    description: 'Describe what you observed, with an example if possible.',
    placeholder: 'Describe their behaviour as a child...',
    section: 'Childhood Interests and Talents',
  },
  {
    key: 'childhoodLearning',
    title: 'What activities or skills did the person learn easily as a child?',
    description: 'Think about things they seemed to understand or do naturally.',
    placeholder: 'Describe skills they learned easily...',
    section: 'Childhood Interests and Talents',
  },
  {
    key: 'currentStrengths',
    title: 'What do you consider the person’s greatest strengths today?',
    description: 'Choose the qualities you naturally notice. You can select more than one.',
    placeholder: '',
    section: 'Current Personality and Strengths',
  },
  {
    key: 'currentTalents',
    title: 'What talents or abilities do you notice in the person now?',
    description: 'Share abilities you have observed repeatedly over time.',
    placeholder: 'Describe their current talents...',
    section: 'Current Personality and Strengths',
  },
  {
    key: 'challengeResponse',
    title: 'How does the person usually handle challenges or difficult situations?',
    description: 'For example, staying calm, asking for help, thinking carefully, or taking action.',
    placeholder: 'Describe how they respond to challenges...',
    section: 'Current Personality and Strengths',
  },
  {
    key: 'interpersonalBehaviour',
    title: 'How does the person behave when interacting with others or working in a group?',
    description: 'You may describe their communication, cooperation, or support for others.',
    placeholder: 'Describe their interactions with others...',
    section: 'Current Personality and Strengths',
  },
  {
    key: 'positiveQualities',
    title: 'What positive qualities do you appreciate most about the person?',
    description: 'Share the qualities you value most and, if possible, an example.',
    placeholder: 'Describe their positive qualities...',
    section: 'Current Personality and Strengths',
  },
  {
    key: 'continuingStrengths',
    title: 'Which childhood interests or strengths can you still see in the person today?',
    description: 'Think about interests or qualities that have stayed with them over time.',
    placeholder: 'Describe the strengths that remain...',
    section: 'Overall Family Observations',
  },
  {
    key: 'growthAndHiddenStrengths',
    title: 'What hidden strengths might the person not recognise, or what could they develop further?',
    description: 'Share a constructive observation about a strength or an area for personal growth.',
    placeholder: 'Share your observation...',
    section: 'Overall Family Observations',
  },
] as const;

type QuestionKey = (typeof questions)[number]['key'];
type Answers = Partial<Record<QuestionKey, string>>;

const FamilyFeedbackQuestionnaireScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as
    | {familyMemberType?: string; familyMemberTitle?: string}
    | undefined;
  const familyMemberTitle = params?.familyMemberTitle || 'Family Member';

  // Two questions are displayed per page, across six pages.
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
  const totalPages = 6;

  const setAnswer = (key: QuestionKey, value: string) => {
    setAnswers(previous => ({...previous, [key]: value}));
  };

  const toggleStrength = (strength: string) => {
    setSelectedStrengths(previous =>
      previous.includes(strength)
        ? previous.filter(item => item !== strength)
        : [...previous, strength],
    );
  };

  const canContinue = () => {
    const firstIndex = currentPage * 2;
    const pageQuestions = questions.slice(firstIndex, firstIndex + 2);
    return pageQuestions.every(question => {
      if (question.key === 'currentStrengths') return selectedStrengths.length > 0;
      return Boolean(answers[question.key]?.trim());
    });
  };

  const handlePrevious = () => {
    if (currentPage > 0) setCurrentPage(previous => previous - 1);
    else navigation.goBack();
  };

  const handleSubmit = () => {
    if (!canContinue()) return;

    const feedbackData = {
      familyMemberType: params?.familyMemberType,
      familyMemberTitle,
      answers: {
        ...answers,
        currentStrengths: selectedStrengths,
      },
      // Keep these existing keys for compatibility with the current summary screen.
      strengths: selectedStrengths,
      activities: activities.filter(activity => selectedStrengths.includes(activity)),
      childhoodInterests: answers.childhoodInterests || '',
      easyActivities: answers.childhoodLearning || '',
      enjoyedActivities: answers.currentTalents || '',
      naturalAbilities: answers.childhoodTalents || '',
      developmentAreas: answers.growthAndHiddenStrengths || '',
      unrecognisedQualities: answers.positiveQualities || '',
      familyBehaviour: answers.interpersonalBehaviour || '',
      additionalObservation: answers.continuingStrengths || '',
    };

    console.log('Family Feedback:', JSON.stringify(feedbackData, null, 2));
    navigation.navigate('FamilyFeedbackSummary' as never, {feedbackData} as never);
  };

  const renderStrengthOptions = () => (
    <View style={styles.optionsContainer}>
      {strengths.map(strength => {
        const selected = selectedStrengths.includes(strength);
        return (
          <TouchableOpacity
            key={strength}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => toggleStrength(strength)}
            activeOpacity={0.8}>
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
              {strength}
            </Text>
            <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
              {selected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderQuestion = (questionIndex: number) => {
    const question = questions[questionIndex];
    return (
      <View key={question.key} style={styles.singleQuestion}>
        <Text style={styles.questionNumber}>Question {questionIndex + 1} of 12</Text>
        <Text style={styles.questionTitle}>{question.title}</Text>
        <Text style={styles.questionDescription}>{question.description}</Text>
        {question.key === 'currentStrengths' ? (
          renderStrengthOptions()
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder={question.placeholder}
            placeholderTextColor="#999999"
            value={answers[question.key] || ''}
            onChangeText={value => setAnswer(question.key, value)}
            multiline
            textAlignVertical="top"
          />
        )}
      </View>
    );
  };

  const firstQuestionIndex = currentPage * 2;
  const visibleQuestions = questions.slice(firstQuestionIndex, firstQuestionIndex + 2);
  const sectionTitle = visibleQuestions[0]?.section;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handlePrevious} style={styles.backButton}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Feedback</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.stepText}>Questions {firstQuestionIndex + 1}-{firstQuestionIndex + visibleQuestions.length} of 12</Text>
          <Text style={styles.progressPercentage}>{Math.round(((currentPage + 1) / totalPages) * 100)}%</Text>
        </View>
        <View style={styles.progressBackground}>
          <View style={[styles.progressFill, {width: `${((currentPage + 1) / totalPages) * 100}%`}]} />
        </View>

        <View style={styles.memberBadge}>
          <Text style={styles.memberBadgeLabel}>Feedback from</Text>
          <Text style={styles.memberBadgeValue}>{familyMemberTitle}</Text>
        </View>

        <Text style={styles.title}>Tell Us What You Observe</Text>
        <Text style={styles.description}>
          Your observations help us understand this person’s childhood interests, natural talents, current strengths, and personality.
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
          {visibleQuestions.map(question => renderQuestion(questions.findIndex(item => item.key === question.key)))}
        </View>

        <View style={styles.pageIndicator}>
          {Array.from({length: totalPages}).map((_, index) => (
            <View key={index} style={[styles.pageDot, index === currentPage && styles.pageDotActive]} />
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Honest observations matter</Text>
          <Text style={styles.infoText}>
            There are no right or wrong answers. Your observations are one source of insight and will be considered alongside the person’s other assessments.
          </Text>
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity style={styles.previousButton} onPress={handlePrevious}>
            <Text style={styles.previousButtonText}>← Previous</Text>
          </TouchableOpacity>
          {currentPage < totalPages - 1 ? (
            <TouchableOpacity
              style={[styles.nextButton, !canContinue() && styles.nextButtonDisabled]}
              onPress={() => canContinue() && setCurrentPage(previous => previous + 1)}
              disabled={!canContinue()}>
              <Text style={styles.nextButtonText}>Next →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, !canContinue() && styles.nextButtonDisabled]}
              onPress={handleSubmit}
              disabled={!canContinue()}>
              <Text style={styles.nextButtonText}>Submit →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FamilyFeedbackQuestionnaireScreen;

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFF7ED'},
  container: {padding: 20, paddingBottom: 40},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20},
  backButton: {width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center'},
  backText: {fontSize: 32, color: '#202020', lineHeight: 34, marginTop: -3},
  headerTitle: {fontSize: 18, fontWeight: '800', color: '#202020'},
  headerSpace: {width: 40},
  progressContainer: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  stepText: {fontSize: 14, fontWeight: '700', color: '#666666'},
  progressPercentage: {fontSize: 14, fontWeight: '800', color: '#FF6B00'},
  progressBackground: {height: 7, backgroundColor: '#F4D7C6', borderRadius: 10, overflow: 'hidden', marginBottom: 18},
  progressFill: {height: '100%', backgroundColor: '#FF6B00', borderRadius: 10},
  memberBadge: {backgroundColor: '#FFF0E4', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 18, flexDirection: 'row', alignItems: 'center'},
  memberBadgeLabel: {fontSize: 13, fontWeight: '600', color: '#765846'},
  memberBadgeValue: {marginLeft: 6, fontSize: 14, fontWeight: '800', color: '#C84E00'},
  title: {fontSize: 25, fontWeight: '900', color: '#2B211B', marginBottom: 10},
  description: {fontSize: 15, lineHeight: 22, fontWeight: '600', color: '#666666', marginBottom: 20},
  questionCard: {backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18, elevation: 2},
  sectionTitle: {fontSize: 18, fontWeight: '900', color: '#C84E00', marginBottom: 18},
  singleQuestion: {marginBottom: 22},
  questionNumber: {fontSize: 14, fontWeight: '900', color: '#FF6B00', marginBottom: 7},
  questionTitle: {fontSize: 18, lineHeight: 24, fontWeight: '900', color: '#2B211B', marginBottom: 7},
  questionDescription: {fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#666666', marginBottom: 14},
  optionsContainer: {marginBottom: 8},
  option: {minHeight: 48, borderWidth: 1, borderColor: '#E9DDD5', borderRadius: 12, paddingHorizontal: 13, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  optionSelected: {borderColor: '#FF6B00', backgroundColor: '#FFF4EA'},
  optionText: {flex: 1, fontSize: 14, fontWeight: '700', color: '#2B211B', paddingRight: 10},
  optionTextSelected: {color: '#D95400', fontWeight: '800'},
  checkbox: {width: 23, height: 23, borderRadius: 6, borderWidth: 2, borderColor: '#CFCFCF', justifyContent: 'center', alignItems: 'center'},
  checkboxSelected: {backgroundColor: '#FF6B00', borderColor: '#FF6B00'},
  checkmark: {color: '#FFFFFF', fontSize: 15, fontWeight: '900'},
  textInput: {minHeight: 105, borderWidth: 1, borderColor: '#E5D9D0', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: '600', color: '#2B211B', backgroundColor: '#FFFDFC'},
  pageIndicator: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 18, marginBottom: 18},
  pageDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2D5CC', marginHorizontal: 4},
  pageDotActive: {width: 24, backgroundColor: '#FF6B00'},
  infoCard: {backgroundColor: '#FFF0E4', borderRadius: 16, padding: 16, marginBottom: 20},
  infoTitle: {fontSize: 16, fontWeight: '800', color: '#C84E00', marginBottom: 6},
  infoText: {fontSize: 14, lineHeight: 20, fontWeight: '600', color: '#6D4A38'},
  navigationButtons: {flexDirection: 'row', justifyContent: 'space-between', gap: 12},
  previousButton: {flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FF6B00', borderRadius: 14, paddingVertical: 15, alignItems: 'center'},
  previousButtonText: {color: '#FF6B00', fontSize: 15, fontWeight: '800'},
  nextButton: {flex: 1, backgroundColor: '#FF6B00', borderRadius: 14, paddingVertical: 15, alignItems: 'center'},
  nextButtonDisabled: {backgroundColor: '#D9D9D9'},
  nextButtonText: {color: '#FFFFFF', fontSize: 15, fontWeight: '800'},
});