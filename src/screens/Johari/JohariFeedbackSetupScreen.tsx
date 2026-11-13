import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {useNavigation, useRoute} from '@react-navigation/native';

const feedbackTypes = [
  {
    id: 'family',
    title: 'Family',
    description: 'Parent, sibling or close family member',
    icon: 'account-group-outline',
  },
  {
    id: 'friend',
    title: 'Friend',
    description: 'Someone who knows you well',
    icon: 'account-heart-outline',
  },
  {
    id: 'mentor',
    title: 'Teacher / Mentor',
    description: 'Someone who has guided or taught you',
    icon: 'school-outline',
  },
  {
    id: 'colleague',
    title: 'Colleague',
    description: 'Someone you work or collaborate with',
    icon: 'account-multiple-outline',
  },
  {
    id: 'manager',
    title: 'Manager',
    description: 'Your manager or team lead',
    icon: 'briefcase-account-outline',
  },
  {
    id: 'client',
    title: 'Client',
    description: 'Someone you provide services to',
    icon: 'account-tie-outline',
  },
];

const JohariFeedbackSetupScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const params = route.params as {
    selectedTraits?: string[];
  };

  const selectedTraits = params?.selectedTraits ?? [];

  const handleContinue = () => {
    if (!selectedType) {
      return;
    }

    navigation.navigate(
      'JohariFeedbackInvite' as never,
      {
        selectedTraits,
        feedbackType: selectedType,
      } as never,
    );
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
            Step 2 of 4
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
            Who Knows You Well?
          </Text>

          <Text style={styles.description}>
            Feedback from people who know you can help
            reveal strengths and qualities that you may
            not notice yourself.
          </Text>

        </View>

        {/* Section title */}
        <Text style={styles.sectionTitle}>
          Choose a person to provide feedback
        </Text>

        {/* Feedback types */}
        <View style={styles.list}>

          {feedbackTypes.map(type => {

            const isSelected =
              selectedType === type.id;

            return (
              <TouchableOpacity
                key={type.id}
                activeOpacity={0.8}
                onPress={() =>
                  setSelectedType(type.id)
                }
                style={[
                  styles.feedbackCard,
                  isSelected &&
                    styles.selectedFeedbackCard,
                ]}>

                <View style={styles.iconContainer}>

                  <MaterialCommunityIcons
                    name={type.icon as any}
                    size={25}
                    color={
                      isSelected
                        ? '#FF5A00'
                        : '#6E625A'
                    }
                  />

                </View>

                <View style={styles.feedbackInfo}>

                  <Text
                    style={[
                      styles.feedbackTitle,
                      isSelected &&
                        styles.selectedFeedbackTitle,
                    ]}>
                    {type.title}
                  </Text>

                  <Text style={styles.feedbackDescription}>
                    {type.description}
                  </Text>

                </View>

                <View
                  style={[
                    styles.radio,
                    isSelected &&
                      styles.selectedRadio,
                  ]}>

                  {isSelected && (
                    <View style={styles.radioDot} />
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
            !selectedType &&
              styles.disabledButton,
          ]}
          activeOpacity={0.8}
          disabled={!selectedType}
          onPress={handleContinue}>

          <Text style={styles.continueText}>
            Continue
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={21}
            color="#FFFFFF"
          />

        </TouchableOpacity>

        <Text style={styles.bottomText}>
          You can invite different people later to get
          a broader perspective.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JohariFeedbackSetupScreen;

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
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
    color: '#5A4D45',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 14,
  },

  list: {
    width: '100%',
  },

  feedbackCard: {
    minHeight: 70,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DDD5',
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  selectedFeedbackCard: {
    backgroundColor: '#FFF0E3',
    borderColor: '#FF5A00',
    borderWidth: 1.5,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  feedbackInfo: {
    flex: 1,
  },

  feedbackTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 3,
  },

  selectedFeedbackTitle: {
    color: '#FF5A00',
  },

  feedbackDescription: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    color: '#6E625A',
  },

  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D9CEC5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  selectedRadio: {
    borderColor: '#FF5A00',
  },

  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#FF5A00',
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
    marginTop: 12,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: '#8A7D73',
  },
});