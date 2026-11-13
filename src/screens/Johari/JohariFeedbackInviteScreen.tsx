import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation, useRoute} from '@react-navigation/native';

const feedbackTypeLabels: Record<string, string> = {
  family: 'Family',
  friend: 'Friend',
  mentor: 'Teacher / Mentor',
  colleague: 'Colleague',
  manager: 'Manager',
  client: 'Client',
};

const JohariFeedbackInviteScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const params = route.params as {
    selectedTraits?: string[];
    feedbackType?: string;
  };

  const feedbackType = params?.feedbackType ?? 'family';

  const [name, setName] = useState('');
  const [contact, setContact] = useState('');

  const feedbackTypeLabel =
    feedbackTypeLabels[feedbackType] ?? 'Feedback Provider';

  const handleSendInvitation = () => {
    const trimmedName = name.trim();
    const trimmedContact = contact.trim();

    if (!trimmedName) {
      Alert.alert(
        'Name Required',
        'Please enter the name of the person you want to invite.',
      );
      return;
    }

    if (!trimmedContact) {
      Alert.alert(
        'Contact Required',
        'Please enter an email address or mobile number.',
      );
      return;
    }

    Alert.alert(
      'Invitation Ready',
      `Feedback invitation prepared for ${trimmedName}.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}>

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

          <Text style={styles.headerTitle}>Johari Window</Text>
          <View style={styles.headerSpace} />
        </View>

        <View style={styles.progressHeader}>
          <Text style={styles.stepText}>Step 3 of 4</Text>
          <Text style={styles.progressText}>75%</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Invite for Feedback</Text>

          <Text style={styles.description}>
            Invite someone who knows you well to share their
            perspective about your strengths and qualities.
          </Text>
        </View>

        <View style={styles.typeCard}>
          <View style={styles.typeIcon}>
            <MaterialCommunityIcons
              name="account-heart-outline"
              size={25}
              color="#FF5A00"
            />
          </View>

          <View style={styles.typeInfo}>
            <Text style={styles.typeLabel}>Feedback From</Text>
            <Text style={styles.typeValue}>{feedbackTypeLabel}</Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Person Details</Text>

          <Text style={styles.inputLabel}>Name</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-outline"
              size={21}
              color="#8A7D73"
            />

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter their name"
              placeholderTextColor="#A99D94"
              style={styles.input}
              autoCapitalize="words"
            />
          </View>

          <Text style={styles.inputLabel}>Email or Mobile Number</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={21}
              color="#8A7D73"
            />

            <TextInput
              value={contact}
              onChangeText={setContact}
              placeholder="Enter email or mobile number"
              placeholderTextColor="#A99D94"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color="#FF5A00"
          />

          <Text style={styles.infoText}>
            The person you invite will provide feedback based on their
            own observations. Your answers will not be shown to them.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          activeOpacity={0.8}
          onPress={handleSendInvitation}>
          <MaterialCommunityIcons
            name="send-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.sendButtonText}>
            Send Feedback Request
          </Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          You can invite more people later to get a broader perspective.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JohariFeedbackInviteScreen;

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
    width: '75%',
    height: '100%',
    backgroundColor: '#FF5A00',
    borderRadius: 3,
  },

  titleSection: {
    marginBottom: 20,
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

  typeCard: {
    minHeight: 72,
    backgroundColor: '#FFF0E3',
    borderWidth: 1,
    borderColor: '#FFB98F',
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  typeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  typeInfo: {
    flex: 1,
  },

  typeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7A6A60',
    marginBottom: 2,
  },

  typeValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF5A00',
  },

  changeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF5A00',
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 17,
    borderWidth: 1,
    borderColor: '#E8DDD5',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 18,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4A4039',
    marginBottom: 7,
  },

  inputContainer: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#DDD1C8',
    borderRadius: 12,
    backgroundColor: '#FFFDFC',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#2B211B',
    marginLeft: 9,
    paddingVertical: 10,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF0E3',
    borderRadius: 13,
    padding: 13,
    marginTop: 14,
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: '#6E625A',
    marginLeft: 9,
  },

  sendButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: '#FF5A00',
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  sendButtonText: {
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
