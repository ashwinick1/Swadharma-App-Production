import React, {useState} from 'react';

import {
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {saveAssessmentAnswers} from '../../services/api';

const traits = [
  'Confident',
  'Helpful',
  'Creative',
  'Patient',
  'Responsible',
  'Adaptable',
  'Good Listener',
  'Analytical',
  'Calm',
  'Empathetic',
  'Communicative',
  'Organised',
  'Curious',
  'Independent',
  'Team Player',
  'Leadership',
  'Reliable',
  'Positive',
  'Problem Solver',
  'Open Minded',
];

const JohariSelfAssessmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const userId = route.params?.userId;

  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTrait = (trait: string) => {
    setSelectedTraits(previous => {
      if (previous.includes(trait)) {
        return previous.filter(item => item !== trait);
      }

      return [...previous, trait];
    });
  };

  const handleContinue = async () => {
    if (selectedTraits.length === 0) {
      Alert.alert(
        'Select Qualities',
        'Please select at least one quality before continuing.',
      );
      return;
    }

    if (!userId) {
      Alert.alert(
        'User ID Missing',
        'Unable to continue because the user ID was not received. Please go back and open Johari Window again from the Dashboard.',
      );
      console.log(
        'Johari Self Assessment: userId is missing',
      );
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      const stepAnswer = {
        step: 'SELF_ASSESSMENT',
        selectedTraits,
      };

      await saveAssessmentAnswers({
        userId,
        assessmentType: 'JOHARI',
        answers: [stepAnswer],
      });

      console.log(
        'JOHARI Self Assessment saved successfully',
      );

      navigation.navigate(
        'JohariFeedbackSetup' as never,
        {
          userId,
          selectedTraits,
        } as never,
      );
    } catch (error) {
      console.error(
        'Failed to save JOHARI Self Assessment:',
        error,
      );

      Alert.alert(
        'Unable to Continue',
        'We could not save your Johari assessment. Please check your internet connection and try again.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={27}
              color="#FF5A00"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Johari Window
          </Text>

          <View style={styles.headerSpace} />

        </View>

        {/* Progress */}
        <View style={styles.progressHeader}>

          <Text style={styles.stepText}>
            Step 1 of 2
          </Text>

          <Text style={styles.progressText}>
            50%
          </Text>

        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>

          <Text style={styles.title}>
            What Describes You?
          </Text>

          <Text style={styles.description}>
            Select the qualities that you feel best
            describe you. Choose honestly; there are
            no right or wrong answers.
          </Text>

        </View>

        {/* Selected count */}
        <View style={styles.countRow}>

          <Text style={styles.countLabel}>
            Qualities Selected
          </Text>

          <View style={styles.countBadge}>

            <Text style={styles.countText}>
              {selectedTraits.length}
            </Text>

          </View>

        </View>

        {/* Traits */}
        <View style={styles.grid}>

          {traits.map(trait => {

            const isSelected =
              selectedTraits.includes(trait);

            return (
              <TouchableOpacity
                key={trait}
                activeOpacity={0.8}
                onPress={() => toggleTrait(trait)}
                style={[
                  styles.traitCard,
                  isSelected &&
                    styles.selectedTraitCard,
                ]}>

                <Text
                  numberOfLines={1}
                  style={[
                    styles.traitText,
                    isSelected &&
                      styles.selectedTraitText,
                  ]}>

                  {trait}

                </Text>

                <View
                  style={[
                    styles.checkCircle,
                    isSelected &&
                      styles.selectedCheckCircle,
                  ]}>

                  {isSelected && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                  )}

                </View>

              </TouchableOpacity>
            );
          })}

        </View>

        {/* Continue */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            (selectedTraits.length === 0 || saving) &&
              styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={
            selectedTraits.length === 0 || saving
          }
          onPress={handleContinue}>

          <Text style={styles.continueText}>
            {saving ? 'Saving...' : 'Continue'}
          </Text>

          {!saving && (
            <MaterialCommunityIcons
              name="arrow-right"
              size={21}
              color="#FFFFFF"
            />
          )}

        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Select the qualities that genuinely describe you.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JohariSelfAssessmentScreen;

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
    marginBottom: 18,
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

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 7,
  },

  stepText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6E625A',
  },

  progressText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FF5A00',
  },

  progressTrack: {
    height: 5,
    backgroundColor: '#FFE1CC',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 25,
  },

  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 3,
  },

  titleSection: {
    marginBottom: 22,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 9,
  },

  description: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: '#5A4D45',
  },

  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  countLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A4039',
  },

  countBadge: {
    minWidth: 30,
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 15,
    backgroundColor: '#FFE4CE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  countText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FF5A00',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  traitCard: {
    width: '48%',
    minHeight: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD5',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectedTraitCard: {
    backgroundColor: '#FFF0E3',
    borderColor: '#FF5A00',
    borderWidth: 1.5,
  },

  traitText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    color: '#2B211B',
  },

  selectedTraitText: {
    color: '#FF5A00',
    fontWeight: '900',
  },

  checkCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D9CEC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexShrink: 0,
  },

  selectedCheckCircle: {
    backgroundColor: '#FF5A00',
    borderColor: '#FF5A00',
  },

  continueButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FF5A00',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  disabledButton: {
    backgroundColor: '#D8D0CA',
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
    marginTop: 11,
    fontSize: 11,
    fontWeight: '600',
    color: '#8A7D73',
  },
});