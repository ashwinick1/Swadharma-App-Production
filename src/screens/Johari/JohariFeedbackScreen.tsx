import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {useNavigation, useRoute} from '@react-navigation/native';

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

const ratingOptions = [1, 2, 3, 4, 5];

const JohariFeedbackScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params as {
    selectedTraits?: string[];
    feedbackType?: string;
  };

  const feedbackType =
    params?.feedbackType ?? 'Feedback Provider';

  const [ratings, setRatings] = useState<Record<string, number>>(
    {},
  );

  const [strengths, setStrengths] = useState('');
  const [naturalAbilities, setNaturalAbilities] = useState('');
  const [blindSpot, setBlindSpot] = useState('');

  const setRating = (
    trait: string,
    rating: number,
  ) => {
    setRatings(previous => ({
      ...previous,
      [trait]: rating,
    }));
  };

  const allTraitsRated = traits.every(
    trait => ratings[trait] !== undefined,
  );

  const handleSubmit = () => {
    if (!allTraitsRated) {
      return;
    }

    // Backend submission will be added later.
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            Step 4 of 4
          </Text>

          <Text style={styles.progressText}>
            100%
          </Text>

        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {/* Title */}
        <View style={styles.titleSection}>

          <Text style={styles.title}>
            How Do You See This Person?
          </Text>

          <Text style={styles.description}>
            Your honest perspective can help identify
            strengths and qualities that the person may
            or may not recognise in themselves.
          </Text>

        </View>

        {/* Feedback Type */}
        <View style={styles.feedbackTypeCard}>

          <MaterialCommunityIcons
            name="account-heart-outline"
            size={23}
            color="#FF5A00"
          />

          <Text style={styles.feedbackTypeText}>
            Feedback from: {feedbackType}
          </Text>

        </View>

        {/* Rating Section */}
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Rate the Qualities
          </Text>

          <Text style={styles.sectionDescription}>
            Rate how strongly each quality describes this
            person.
          </Text>

        </View>

        <View style={styles.ratingCard}>

          {traits.map((trait, index) => {

            const selectedRating =
              ratings[trait];

            return (
              <View
                key={trait}
                style={[
                  styles.traitRow,
                  index === traits.length - 1 &&
                    styles.lastTraitRow,
                ]}>

                <Text style={styles.traitName}>
                  {trait}
                </Text>

                <View style={styles.ratingOptions}>

                  {ratingOptions.map(rating => {

                    const isSelected =
                      selectedRating === rating;

                    return (
                      <TouchableOpacity
                        key={rating}
                        activeOpacity={0.8}
                        onPress={() =>
                          setRating(trait, rating)
                        }
                        style={[
                          styles.ratingCircle,
                          isSelected &&
                            styles.selectedRatingCircle,
                        ]}>

                        <Text
                          style={[
                            styles.ratingText,
                            isSelected &&
                              styles.selectedRatingText,
                          ]}>
                          {rating}
                        </Text>

                      </TouchableOpacity>
                    );
                  })}

                </View>

              </View>
            );
          })}

          <View style={styles.ratingLegend}>

            <Text style={styles.legendText}>
              1 = Low
            </Text>

            <Text style={styles.legendText}>
              5 = Very High
            </Text>

          </View>

        </View>

        {/* Observations */}
        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Your Observations
          </Text>

          <Text style={styles.sectionDescription}>
            Share examples or observations that support
            your feedback.
          </Text>

        </View>

        <View style={styles.inputCard}>

          <Text style={styles.inputLabel}>
            What strengths do you notice in this person?
          </Text>

          <TextInput
            value={strengths}
            onChangeText={setStrengths}
            placeholder="Write your observations..."
            placeholderTextColor="#A99D94"
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Text style={styles.inputLabel}>
            What does this person seem naturally good at?
          </Text>

          <TextInput
            value={naturalAbilities}
            onChangeText={setNaturalAbilities}
            placeholder="Write your observations..."
            placeholderTextColor="#A99D94"
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

          <Text style={styles.inputLabel}>
            Is there a quality they may not recognise in
            themselves?
          </Text>

          <TextInput
            value={blindSpot}
            onChangeText={setBlindSpot}
            placeholder="Share your perspective..."
            placeholderTextColor="#A99D94"
            multiline
            textAlignVertical="top"
            style={styles.textArea}
          />

        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !allTraitsRated &&
              styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={!allTraitsRated}
          onPress={handleSubmit}>

          <MaterialCommunityIcons
            name="check-circle-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.submitText}>
            Submit Feedback
          </Text>

        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Please answer independently. The person's
          self-assessment is not shown to you.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JohariFeedbackScreen;

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
    width: '100%',
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 3,
  },

  titleSection: {
    marginBottom: 18,
  },

  title: {
    fontSize: 25,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 9,
  },

  description: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: '#5A4D45',
  },

  feedbackTypeCard: {
    minHeight: 50,
    backgroundColor: '#FFF0E3',
    borderWidth: 1,
    borderColor: '#FFB98F',
    borderRadius: 13,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  feedbackTypeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FF5A00',
    marginLeft: 9,
  },

  sectionHeader: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 4,
  },

  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: '#6E625A',
  },

  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD5',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingTop: 4,
    marginBottom: 22,
  },

  traitRow: {
    minHeight: 61,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E7E1',
    justifyContent: 'center',
  },

  lastTraitRow: {
    borderBottomWidth: 0,
  },

  traitName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2B211B',
    marginBottom: 7,
  },

  ratingOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#D9CEC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },

  selectedRatingCircle: {
    backgroundColor: '#FF5A00',
    borderColor: '#FF5A00',
  },

  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6E625A',
  },

  selectedRatingText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },

  ratingLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },

  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8A7D73',
  },

  inputCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD5',
    borderRadius: 16,
    padding: 16,
  },

  inputLabel: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '800',
    color: '#4A4039',
    marginBottom: 8,
  },

  textArea: {
    minHeight: 85,
    borderWidth: 1,
    borderColor: '#DDD1C8',
    borderRadius: 12,
    backgroundColor: '#FFFDFC',
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: '#2B211B',
    marginBottom: 17,
  },

  submitButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FF5A00',
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  disabledButton: {
    backgroundColor: '#D8D0CA',
    elevation: 0,
  },

  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    marginLeft: 9,
  },

  bottomText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: '#8A7D73',
  },
});