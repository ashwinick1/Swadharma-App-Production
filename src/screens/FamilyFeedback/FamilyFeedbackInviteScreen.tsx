
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {sendFamilyFeedbackInvitation} from '../../services/api';

const FamilyFeedbackInviteScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const params = route.params as
    | {
        familyMemberType?: string;
        familyMemberTitle?: string;
        userId?: number | string;
        participantId?: number | string;
      }
    | undefined;

  const familyMemberType = params?.familyMemberType ?? '';
  const familyMemberTitle =
    params?.familyMemberTitle ?? 'Family Member';

  const userId = params?.participantId ?? params?.userId;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendInvitation = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      Alert.alert(
        'Name Required',
        "Please enter the family member's name.",
      );
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(trimmedEmail)) {
      Alert.alert(
        'Invalid Email',
        'Please enter a valid email address.',
      );
      return;
    }

    if (
      userId === undefined ||
      userId === null ||
      String(userId).trim() === ''
    ) {
      Alert.alert(
        'User ID Missing',
        'Your logged-in user ID was not passed to this screen. Please check the previous screen navigation.',
      );
      console.warn('Family Feedback invitation: missing user ID', params);
      return;
    }

    const participantId = Number(userId);

    if (!Number.isSafeInteger(participantId) || participantId <= 0) {
      Alert.alert(
        'Invalid User ID',
        'The logged-in user ID is invalid. Please check the login response.',
      );
      console.warn('Family Feedback invitation: invalid user ID', userId);
      return;
    }

    try {
      setIsSending(true);

      await sendFamilyFeedbackInvitation({
        participantId,
        name: trimmedName,
        email: trimmedEmail,
        relationship: familyMemberTitle || familyMemberType,
      });

      Alert.alert(
        'Invitation Sent',
        `The Family Feedback invitation has been sent to ${trimmedEmail}. They can open the link in their email to complete the questionnaire.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      console.error(
        'Failed to send Family Feedback invitation:',
        error,
      );

      Alert.alert(
        'Invitation Failed',
        error?.message ||
          'Unable to send the invitation. Please check your internet connection and try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={isSending}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={26}
                color="#FF5A00"
              />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Family Feedback</Text>
            <View style={styles.headerSpace} />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Invite Your Family Member
          </Text>

          <Text style={styles.description}>
            Send a personal invitation so your family member can share
            their observations about your strengths, interests and behaviour.
          </Text>

          {/* Relationship */}
          <View style={styles.relationshipCard}>
            <Text style={styles.fieldLabel}>Relationship</Text>
            <Text style={styles.relationshipText}>
              {familyMemberTitle}
            </Text>
          </View>

          {/* Name */}
          <Text style={styles.fieldLabel}>
            Family Member's Name
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter full name"
            placeholderTextColor="#999"
            autoCapitalize="words"
            returnKeyType="next"
            editable={!isSending}
          />

          {/* Email */}
          <Text style={styles.fieldLabel}>Email Address</Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            editable={!isSending}
          />

          {/* Information */}
          <View style={styles.infoCard}>
            <MaterialCommunityIcons
              name="email-outline"
              size={23}
              color="#FF5A00"
            />

            <Text style={styles.infoText}>
              Your family member will receive an email containing a
              secure link to answer the Family Feedback questionnaire
              in their browser. Their submitted answers will be sent
              to the Swadharma backend.
            </Text>
          </View>

          {/* Send Invitation */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isSending && styles.disabledButton,
            ]}
            activeOpacity={0.85}
            onPress={handleSendInvitation}
            disabled={isSending}>

            {isSending ? (
              <>
                <ActivityIndicator
                  size="small"
                  color="#FFFFFF"
                />
                <Text style={styles.primaryButtonText}>
                  Sending Invitation...
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.primaryButtonText}>
                  Send Invitation
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={21}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>

          {/* Go Back */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            disabled={isSending}>
            <Text style={styles.secondaryButtonText}>
              Go Back
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default FamilyFeedbackInviteScreen;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF5A00',
  },
  headerSpace: {
    width: 40,
  },
  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: '#66574D',
    marginBottom: 25,
  },
  relationshipCard: {
    backgroundColor: '#FFF0E3',
    padding: 17,
    borderRadius: 14,
    marginBottom: 25,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#42352C',
    marginBottom: 9,
  },
  relationshipText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5A00',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8D9CD',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
    color: '#2B211B',
    marginBottom: 22,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF0E3',
    borderRadius: 14,
    padding: 15,
    marginTop: 5,
    marginBottom: 25,
  },
  infoText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 20,
    color: '#6E5949',
  },
  primaryButton: {
    backgroundColor: '#FF5A00',
    borderRadius: 14,
    paddingVertical: 17,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.65,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 10,
  },
  secondaryButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#66574D',
    fontSize: 15,
    fontWeight: '700',
  },
});
 5