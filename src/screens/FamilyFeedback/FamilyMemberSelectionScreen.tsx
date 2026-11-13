
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';

const familyMembers = [
  {
    id: 'parent',
    title: 'Parent',
    description: 'Mother or Father',
  },
  {
    id: 'sibling',
    title: 'Sibling',
    description: 'Brother or Sister',
  },
  {
    id: 'spouse',
    title: 'Spouse',
    description: 'Husband or Wife',
  },
  {
    id: 'grandparent',
    title: 'Grandparent',
    description: 'Grandmother or Grandfather',
  },
  {
    id: 'other',
    title: 'Other Family Member',
    description: 'Someone from your close family',
  },
];

const FamilyMemberSelectionScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // Read the logged-in user's ID from the previous screen.
  const userId =
    route.params?.userId ?? route.params?.participantId;

  const handleContinue = () => {
    if (!selectedMember) {
      Alert.alert(
        'Select a Family Member',
        'Please select a family member before continuing.',
      );
      return;
    }

    const member = familyMembers.find(
      item => item.id === selectedMember,
    );

    if (!userId) {
      Alert.alert(
        'User ID Missing',
        'Your user ID was not passed to this screen. Please check the previous screen navigation.',
      );

      console.warn(
        'Family Feedback: userId is missing.',
        route.params,
      );
      return;
    }

    navigation.navigate('FamilyFeedbackInvite', {
      familyMemberType: selectedMember,
      familyMemberTitle: member?.title,
      userId: userId,
      participantId: userId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Family Feedback</Text>
          <View style={styles.headerSpace} />
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeading}>
            <Text style={styles.progressLabel}>Step 1 of 3</Text>
            <Text style={styles.progressPercentage}>33%</Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Who would you like to invite?
        </Text>

        <Text style={styles.description}>
          Select a family member who knows you well and can share
          their observations about your strengths, interests and behaviour.
        </Text>

        {/* Family member options */}
        <View style={styles.optionsContainer}>
          {familyMembers.map(member => {
            const isSelected = selectedMember === member.id;

            return (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberCard,
                  isSelected && styles.selectedMemberCard,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedMember(member.id)}>
                <View style={styles.memberTextContainer}>
                  <Text
                    style={[
                      styles.memberTitle,
                      isSelected && styles.selectedMemberTitle,
                    ]}>
                    {member.title}
                  </Text>

                  <Text style={styles.memberDescription}>
                    {member.description}
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioOuter,
                    isSelected && styles.radioOuterSelected,
                  ]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Information card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Why family feedback?
          </Text>

          <Text style={styles.infoText}>
            Someone close to you may notice strengths and behavioural
            patterns that you might not recognise yourself.
          </Text>
        </View>

        {/* Continue */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !selectedMember && styles.disabledButton,
          ]}
          activeOpacity={0.85}
          disabled={!selectedMember}
          onPress={handleContinue}>
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Text style={styles.arrowText}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FamilyMemberSelectionScreen;

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
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
  progressSection: {
    marginBottom: 28,
  },
  progressHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#66574D',
  },
  progressPercentage: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF5A00',
  },
  progressTrack: {
    height: 7,
    backgroundColor: '#F1DFCF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    lineHeight: 33,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#66574D',
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D9CD',
    borderRadius: 14,
    padding: 17,
    marginBottom: 12,
  },
  selectedMemberCard: {
    borderColor: '#FF5A00',
    borderWidth: 2,
    backgroundColor: '#FFF0E3',
  },
  memberTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  memberTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2B211B',
    marginBottom: 5,
  },
  selectedMemberTitle: {
    color: '#FF5A00',
  },
  memberDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#76665A',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CDBEB2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#FF5A00',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF5A00',
  },
  infoCard: {
    backgroundColor: '#FFF0E3',
    borderRadius: 14,
    padding: 16,
    marginBottom: 25,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#42352C',
    marginBottom: 7,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6E5949',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5A00',
    borderRadius: 14,
    paddingVertical: 17,
  },
  disabledButton: {
    backgroundColor: '#D9C5B5',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
});
