
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

type FeedbackData = {
  familyMemberType?: string;
  familyMemberTitle?: string;
  strengths?: string[];
  activities?: string[];
  childhoodInterests?: string;
  easyActivities?: string;
  enjoyedActivities?: string;
  naturalAbilities?: string;
  developmentAreas?: string;
  unrecognisedQualities?: string;
  familyBehaviour?: string;
  additionalObservation?: string;
};

const FamilyFeedbackSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params as
    | {feedbackData?: FeedbackData}
    | undefined;

  const feedbackData = params?.feedbackData;

  const [submitted, setSubmitted] = React.useState(false);

  const sections = [
    {
      title: '1. Strongest Qualities',
      value: feedbackData?.strengths,
    },
    {
      title: '2. Activities They Enjoy',
      value: feedbackData?.activities,
    },
    {
      title: '3. Childhood Interests',
      value: feedbackData?.childhoodInterests,
    },
    {
      title: '4. Activities That Come Naturally',
      value: feedbackData?.easyActivities,
    },
    {
      title: '5. Activities That Make Them Happy',
      value: feedbackData?.enjoyedActivities,
    },
    {
      title: '6. Natural Abilities',
      value: feedbackData?.naturalAbilities,
    },
    {
      title: '7. Areas for Development',
      value: feedbackData?.developmentAreas,
    },
    {
      title: '8. Qualities They May Not Recognise',
      value: feedbackData?.unrecognisedQualities,
    },
    {
      title: '9. Behaviour with Family and Others',
      value: feedbackData?.familyBehaviour,
    },
    {
      title: '10. Additional Observations',
      value: feedbackData?.additionalObservation,
    },
  ];

  const handleSubmit = () => {
    Alert.alert(
      'Submit Feedback',
      'Are you sure you want to submit your family feedback?',
      [
        {
          text: 'Review Again',
          style: 'cancel',
        },
        {
          text: 'Submit',
          onPress: () => {
            // Frontend-only confirmation.
            // Backend submission will be connected later.
            setSubmitted(true);
          },
        },
      ],
    );
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Text style={styles.successCheck}>✓</Text>
          </View>

          <Text style={styles.successTitle}>
            Feedback Completed!
          </Text>

          <Text style={styles.successDescription}>
            Your family feedback answers have been reviewed.
            Backend submission will be connected in the next step.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.primaryButtonText}>
              Back to Questionnaire
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Family Feedback
          </Text>

          <View style={styles.headerSpace} />
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.stepText}>
            Final Step
          </Text>
          <Text style={styles.progressPercentage}>
            Review
          </Text>
        </View>

        <View style={styles.progressBackground}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.title}>
          Review Your Answers
        </Text>

        <Text style={styles.description}>
          Please check your responses before submitting your
          family feedback.
        </Text>

        <View style={styles.memberCard}>
          <Text style={styles.memberLabel}>
            Feedback for
          </Text>
          <Text style={styles.memberValue}>
            {feedbackData?.familyMemberTitle || 'Family Member'}
          </Text>
        </View>

        {sections.map((section, index) => {
          const hasAnswer = Array.isArray(section.value)
            ? section.value.length > 0
            : typeof section.value === 'string' &&
              section.value.trim().length > 0;

          return (
            <View key={section.title} style={styles.answerCard}>
              <Text style={styles.questionTitle}>
                {section.title}
              </Text>

              <Text style={styles.answerText}>
                {hasAnswer
                  ? Array.isArray(section.value)
                    ? section.value.join(', ')
                    : section.value
                  : 'No answer provided'}
              </Text>
            </View>
          );
        })}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Before submitting
          </Text>
          <Text style={styles.infoText}>
            Review all your answers carefully. Once the backend
            is connected, this step will submit your responses
            to the server.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>
            Submit Feedback
          </Text>
          <Text style={styles.buttonArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryButtonText}>
            Go Back to Questionnaire
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FamilyFeedbackSummaryScreen;

const styles = StyleSheet.create({
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
    marginBottom: 25,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 32,
    lineHeight: 36,
    color: '#FF5A00',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF5A00',
  },
  headerSpace: {
    width: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#66574D',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5A00',
  },
  progressBackground: {
    height: 7,
    backgroundColor: '#F1DFCF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 10,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#66574D',
    marginBottom: 22,
  },
  memberCard: {
    backgroundColor: '#FFF0E3',
    borderRadius: 14,
    padding: 16,
    marginBottom: 18,
  },
  memberLabel: {
    fontSize: 13,
    color: '#66574D',
    marginBottom: 5,
  },
  memberValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FF5A00',
  },
  answerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D9CD',
  },
  questionTitle: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    color: '#2B211B',
    marginBottom: 9,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#66574D',
  },
  infoCard: {
    backgroundColor: '#FFF0E3',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 22,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#C84E00',
    marginBottom: 7,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6D4A38',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A00',
    borderRadius: 14,
    paddingVertical: 17,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
  buttonArrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#66574D',
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#E1F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  successCheck: {
    fontSize: 42,
    fontWeight: '900',
    color: '#23834A',
  },
  successTitle: {
    fontSize: 25,
    fontWeight: '900',
    color: '#2B211B',
    textAlign: 'center',
    marginBottom: 12,
  },
  successDescription: {
    fontSize: 15,
    lineHeight: 23,
    color: '#66574D',
    textAlign: 'center',
    marginBottom: 28,
  },
});
