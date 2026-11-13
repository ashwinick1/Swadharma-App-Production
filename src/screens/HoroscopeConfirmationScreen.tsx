import React, {useState} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {useNavigation, useRoute} from '@react-navigation/native';

import {getHoroscope} from '../services/api';

const ORANGE = '#FF6B00';
const BACKGROUND = '#FFF8F2';

const HoroscopeConfirmationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const {
    dateOfBirth: extractedDateOfBirth,
    timeOfBirth: extractedTimeOfBirth,
    placeOfBirth: extractedPlaceOfBirth,
    extractedText,
  } = route.params || {};

  const [dateOfBirth, setDateOfBirth] = useState(
    extractedDateOfBirth || '',
  );

  const [timeOfBirth, setTimeOfBirth] = useState(
    extractedTimeOfBirth || '',
  );

  const [placeOfBirth, setPlaceOfBirth] = useState(
    extractedPlaceOfBirth || '',
  );

  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!dateOfBirth.trim()) {
      Alert.alert(
        'Required',
        'Please enter your date of birth.',
      );
      return;
    }

    if (!timeOfBirth.trim()) {
      Alert.alert(
        'Required',
        'Please enter your time of birth.',
      );
      return;
    }

    if (!placeOfBirth.trim()) {
      Alert.alert(
        'Required',
        'Please enter your place of birth.',
      );
      return;
    }

    try {
      setLoading(true);

      const response = await getHoroscope({
        dateOfBirth: dateOfBirth.trim(),
        timeOfBirth: timeOfBirth.trim(),
        placeOfBirth: placeOfBirth.trim(),
      });

      console.log(
        'Confirmed Horoscope Response:',
        response,
      );

      if (response?.success) {
        navigation.navigate(
          'ViewHoroscope',
          {
            horoscopeData: response,
          },
        );
      } else {
        Alert.alert(
          'Horoscope Error',
          response?.message ||
            'Unable to generate horoscope. Please try again.',
        );
      }
    } catch (error) {
      console.log(
        'Confirm Horoscope Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to generate horoscope. Please check your details and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* Header */}

          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>
                ‹
              </Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Confirm Birth Details
            </Text>

            <View style={styles.headerSpacer} />
          </View>

          {/* Title */}

          <Text style={styles.title}>
            Verify Your Birth Details
          </Text>

          <Text style={styles.description}>
            We extracted information from your
            uploaded horoscope. Please check the
            details below and correct them if
            necessary.
          </Text>

          {/* Information */}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              Please verify your details
            </Text>

            <Text style={styles.infoText}>
              Handwritten or scanned horoscopes may
              not always be read correctly. Please
              confirm the details before generating
              your horoscope.
            </Text>
          </View>

          {/* Date */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Date of Birth
            </Text>

            <TextInput
              style={styles.input}
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.helperText}>
              Example: 1995-08-15
            </Text>
          </View>

          {/* Time */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Time of Birth
            </Text>

            <TextInput
              style={styles.input}
              value={timeOfBirth}
              onChangeText={setTimeOfBirth}
              placeholder="HH:mm:ss"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.helperText}>
              Example: 10:30:00
            </Text>
          </View>

          {/* Place */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Place of Birth
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.placeInput,
              ]}
              value={placeOfBirth}
              onChangeText={setPlaceOfBirth}
              placeholder="Enter place of birth"
              placeholderTextColor="#999"
            />
          </View>


          {/* Confirm */}

          <TouchableOpacity
            style={[
              styles.confirmButton,
              loading &&
                styles.disabledButton,
            ]}
            onPress={handleConfirm}
            disabled={loading}>

            <Text style={styles.confirmButtonText}>
              {loading
                ? 'Generating Horoscope...'
                : 'Confirm & View Horoscope'}
            </Text>

          </TouchableOpacity>

          {/* Back */}

          <TouchableOpacity
            style={styles.backAction}
            onPress={() => navigation.goBack()}>

            <Text style={styles.backActionText}>
              Go Back
            </Text>

          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HoroscopeConfirmationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backText: {
    fontSize: 38,
    color: ORANGE,
    lineHeight: 40,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },

  headerSpacer: {
    width: 40,
  },

  title: {
    marginTop: 15,
    fontSize: 25,
    fontWeight: '700',
    color: '#222',
  },

  description: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: '#666',
  },

  infoBox: {
    marginTop: 22,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF0E5',
    borderWidth: 1,
    borderColor: '#FFD3B5',
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8A3B00',
    marginBottom: 6,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#704B35',
  },

  fieldContainer: {
    marginTop: 22,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#E2D3C8',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#222',
  },

  placeInput: {
    minHeight: 52,
  },

  helperText: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },

  extractedBox: {
    marginTop: 24,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5DED8',
  },

  extractedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
  },

  extractedText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#777',
  },

  confirmButton: {
    marginTop: 30,
    height: 52,
    borderRadius: 10,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  backAction: {
    marginTop: 15,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backActionText: {
    color: ORANGE,
    fontSize: 15,
    fontWeight: '600',
  },
});