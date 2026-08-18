import React, {useState} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import HoroscopeStepper from '../components/HoroscopeStepper';
import AppLogoHeader from '../components/AppLogoHeader';
import {useNavigation} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

import {
  saveHoroscope,
  getHoroscope,
} from '../services/api';

const BirthDetailsScreen = () => {
  const navigation = useNavigation();

  const [dateOfBirth, setDateOfBirth] = useState('');
  const [selectedDate, setSelectedDate] =
    useState(new Date());
  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [selectedTime, setSelectedTime] =
    useState(new Date());
  const [showTimePicker, setShowTimePicker] =
    useState(false);

  const [placeOfBirth, setPlaceOfBirth] =
    useState('');

  const handleViewHoroscope = async () => {
    console.log('View Horoscope Clicked');

    // Validate Date
    if (!dateOfBirth) {
      Alert.alert(
        'Required',
        'Please select Date of Birth',
      );
      return;
    }

    // Validate Time
    if (!timeOfBirth) {
      Alert.alert(
        'Required',
        'Please select Time of Birth',
      );
      return;
    }

    // Validate Place
    if (!placeOfBirth.trim()) {
      Alert.alert(
        'Required',
        'Please enter Place of Birth',
      );
      return;
    }

    try {
      /*
       * STEP 1
       * Save Birth Details
       */

      console.log(
        'Saving birth details...',
      );

      const saveResponse =
        await saveHoroscope({
          userId: 1, // Temporary
          dateOfBirth,
          timeOfBirth,
          placeOfBirth:
            placeOfBirth.trim(),
        });

      console.log(
        'Save Response:',
        saveResponse,
      );

      /*
       * STEP 2
       * Generate Horoscope
       *
       * IMPORTANT:
       * Horoscope is calculated using
       * the birth details entered here.
       */

      console.log(
        'Getting horoscope...',
      );

      const horoscopeResponse =
        await getHoroscope({
          dateOfBirth,
          timeOfBirth,
          placeOfBirth:
            placeOfBirth.trim(),
        });

      console.log(
        'FULL HOROSCOPE DATA:',
        JSON.stringify(
          horoscopeResponse,
          null,
          2,
        ),
      );

      if (
        !horoscopeResponse ||
        !horoscopeResponse.success
      ) {
        Alert.alert(
          'Error',
          'No horoscope data received.',
        );
        return;
      }

      /*
       * STEP 3
       * Navigate to View Horoscope
       */

      navigation.navigate(
        'ViewHoroscope' as never,
        {
          horoscopeData:
            horoscopeResponse,
        } as never,
      );
    } catch (error) {
      console.log(
        'View Horoscope Error:',
        error,
      );

      Alert.alert(
        'Error',
        'Unable to generate horoscope. Please try again.',
      );
    }
  };

  return (
    <SafeAreaView
      style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }>

        {/* Back Button */}

        <View
          style={styles.backContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF6B00"
            />
          </TouchableOpacity>
        </View>

        {/* Logo */}

        <AppLogoHeader />

        {/* Stepper */}

        <HoroscopeStepper
          currentStep={1}
        />

        {/* Section Title */}

        <Text
          style={styles.sectionTitle}>
          Birth Details
        </Text>

        {/* Date of Birth */}

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() =>
            setShowDatePicker(true)
          }>

          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={22}
            color="#FF6B00"
          />

          <Text
            style={[
              styles.placeholder,
              {
                color: dateOfBirth
                  ? '#202020'
                  : '#777777',
              },
            ]}>
            {dateOfBirth ||
              'Select Date of Birth'}
          </Text>

        </TouchableOpacity>

        {/* Time of Birth */}

        <TouchableOpacity
          style={styles.inputBox}
          onPress={() =>
            setShowTimePicker(true)
          }>

          <MaterialCommunityIcons
            name="clock-outline"
            size={22}
            color="#FF6B00"
          />

          <Text
            style={[
              styles.placeholder,
              {
                color: timeOfBirth
                  ? '#202020'
                  : '#777777',
              },
            ]}>
            {timeOfBirth ||
              'Select Time of Birth'}
          </Text>

        </TouchableOpacity>

        {/* Place of Birth */}

        <View
          style={styles.inputBox}>

          <MaterialCommunityIcons
            name="map-marker-outline"
            size={22}
            color="#FF6B00"
          />

          <TextInput
            style={styles.textInput}
            placeholder="Enter Place of Birth"
            placeholderTextColor="#999"
            value={placeOfBirth}
            onChangeText={
              setPlaceOfBirth
            }
          />

        </View>

        {/* View Horoscope */}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={
            handleViewHoroscope
          }>

          <Text
            style={styles.saveButtonText}>
            View Horoscope
          </Text>

        </TouchableOpacity>

        {/* OR Divider */}

        <View
          style={
            styles.dividerContainer
          }>

          <View
            style={styles.divider}
          />

          <Text
            style={styles.orText}>
            OR
          </Text>

          <View
            style={styles.divider}
          />

        </View>

        {/* Upload Horoscope */}

        <View
          style={styles.uploadContainer}>

          <TouchableOpacity
            style={styles.uploadBox}>

            <MaterialCommunityIcons
              name="cloud-upload-outline"
              size={55}
              color="#FF6B00"
            />

            <Text
              style={styles.uploadHeading}>
              Upload Horoscope Image / PDF
            </Text>

            <Text
              style={styles.uploadSubtitle}>
              JPG • PNG • PDF
            </Text>

            <Text
              style={styles.uploadInfo}>
              Maximum Size 10 MB
            </Text>

          </TouchableOpacity>

        </View>

        {/* Date Picker */}

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="calendar"
            maximumDate={new Date()}
            onChange={(
              event,
              date,
            ) => {
              setShowDatePicker(
                false,
              );

              if (date) {
                setSelectedDate(
                  date,
                );

                // IMPORTANT:
                // Send YYYY-MM-DD
                // to backend/Prokerala

                const year =
                  date.getFullYear();

                const month =
                  String(
                    date.getMonth() + 1,
                  ).padStart(2, '0');

                const day =
                  String(
                    date.getDate(),
                  ).padStart(2, '0');

                const formattedDate =
                  `${year}-${month}-${day}`;

                setDateOfBirth(
                  formattedDate,
                );
              }
            }}
          />
        )}

        {/* Time Picker */}

        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={(
              event,
              time,
            ) => {
              setShowTimePicker(
                false,
              );

              if (time) {
                setSelectedTime(
                  time,
                );

                const hours =
                  String(
                    time.getHours(),
                  ).padStart(2, '0');

                const minutes =
                  String(
                    time.getMinutes(),
                  ).padStart(2, '0');

                const formattedTime =
                  `${hours}:${minutes}:00`;

                setTimeOfBirth(
                  formattedTime,
                );
              }
            }}
          />
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default BirthDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    marginBottom: 10,
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B00',
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 58,
    marginBottom: 15,
    elevation: 2,
  },

  placeholder: {
    marginLeft: 12,
    fontSize: 18,
    color: '#777',
    fontWeight: '800',
  },

  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 18,
    color: '#202020',
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },

  orText: {
    marginHorizontal: 15,
    color: '#FF6B00',
    fontWeight: '900',
    fontSize: 18,
  },

  uploadContainer: {
    marginTop: 5,
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF6B00',
    borderRadius: 16,
    backgroundColor: '#FFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
  },

  uploadHeading: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
  },

  uploadSubtitle: {
    marginTop: 5,
    color: '#666',
  },

  uploadInfo: {
    marginTop: 5,
    color: '#999',
  },

  backContainer: {
    marginBottom: 10,
  },
});