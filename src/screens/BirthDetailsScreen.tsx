import React, {useState} from 'react';

import {

  View,

  Text,

  StyleSheet,

  ScrollView,

  TouchableOpacity,

  Alert,

  TextInput,

} from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {SafeAreaView} from 'react-native-safe-area-context';

import HoroscopeStepper from '../components/HoroscopeStepper';

import AppLogoHeader from '../components/AppLogoHeader';

import {

  useNavigation,

  useRoute,

} from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';

import {

  saveHoroscope,

  getHoroscope,

  uploadHoroscope,

} from '../services/api';

import {

  pick,

  types,

} from '@react-native-documents/picker';

const BirthDetailsScreen = () => {

  const navigation = useNavigation();

  const route = useRoute<any>();

  const userId = route.params?.userId;

  // =====================================================

  // Birth Details

  // =====================================================

  const [dateOfBirth, setDateOfBirth] =

    useState('');

  const [selectedDate, setSelectedDate] =

    useState(new Date());

  const [showDatePicker, setShowDatePicker] =

    useState(false);

  const [timeOfBirth, setTimeOfBirth] =

    useState('');

  const [selectedTime, setSelectedTime] =

    useState(new Date());

  const [showTimePicker, setShowTimePicker] =

    useState(false);

  const [placeOfBirth, setPlaceOfBirth] =

    useState('');

  // =====================================================

  // Uploaded Horoscope File

  // =====================================================

  const [selectedFile, setSelectedFile] =

    useState<any>(null);

  // =====================================================

  // VIEW HOROSCOPE

  // Existing working functionality

  // =====================================================

  const handleViewHoroscope = async () => {

    console.log(

      'View Horoscope Clicked',

    );

    // ===================================================

    // Validate Date

    // ===================================================

    if (!dateOfBirth) {

      Alert.alert(

        'Required',

        'Please select Date of Birth',

      );

      return;

    }

    // ===================================================

    // Validate Time

    // ===================================================

    if (!timeOfBirth) {

      Alert.alert(

        'Required',

        'Please select Time of Birth',

      );

      return;

    }

    // ===================================================

    // Validate Place

    // ===================================================

    if (!placeOfBirth.trim()) {

      Alert.alert(

        'Required',

        'Please enter Place of Birth',

      );

      return;

    }

    try {

      // =================================================

      // STEP 1

      // Save Birth Details

      // =================================================

      console.log(

        'Saving birth details...',

      );

     const saveResponse =

  await saveHoroscope({

    userId,

    dateOfBirth,

    timeOfBirth,

    placeOfBirth:

      placeOfBirth.trim(),

  });

      console.log(

        'Save Response:',

        saveResponse,

      );

      // =================================================

      // STEP 2

      // Generate Horoscope

      // =================================================

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

      // =================================================

      // STEP 3

      // Navigate to View Horoscope

      // =================================================

      (navigation.navigate as any)(
      'ViewHoroscope',
      {
        horoscopeData:
          horoscopeResponse,
        userId,
      },
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

  // =====================================================

  // SELECT HOROSCOPE FILE

  //

  // Supported:

  // JPG

  // PNG

  // PDF

  //

  // Maximum size:

  // 10 MB

  // =====================================================

  const handleSelectHoroscopeFile =

    async () => {

      if (!userId) {

  Alert.alert(

    'Error',

    'User information is missing. Please login again.',

  );

  return;

}

      try {

        console.log(

          'Opening horoscope document picker...',

        );

        const [file] = await pick({

          type: [

            types.images,

            types.pdf,

          ],

          allowMultiSelection: false,

        });

        console.log(

          'Selected File:',

          file,

        );

        // =================================================

        // Check whether Android document provider

        // respected the requested file types

        // =================================================

        if (!file.hasRequestedType) {

          Alert.alert(

            'Invalid File',

            'Please select only a JPG, PNG, or PDF file.',

          );

          return;

        }

        // =================================================

        // File size validation

        // Maximum 10 MB

        // =================================================

        const maxFileSize =

          10 * 1024 * 1024;

        if (

          file.size !== null &&

          file.size > maxFileSize

        ) {

          Alert.alert(

            'File Too Large',

            'Please select a file smaller than 10 MB.',

          );

          return;

        }

        // =================================================

        // File extension validation

        // =================================================

        const fileName =

          file.name ?? '';

        const extension =

          fileName

            .split('.')

            .pop()

            ?.toLowerCase();

        const allowedExtensions = [

          'jpg',

          'jpeg',

          'png',

          'pdf',

        ];

        if (

          !extension ||

          !allowedExtensions.includes(

            extension,

          )

        ) {

          Alert.alert(

            'Invalid File',

            'Please select only JPG, PNG, or PDF files.',

          );

          return;

        }

        // =================================================

        // Save selected file

        // =================================================

        setSelectedFile(file);

        Alert.alert(

          'File Selected',

          `${fileName}\n\nReady to upload.`,

        );

      } catch (error: any) {

        console.log(

          'Document Picker Error:',

          error,

        );

        // =================================================

        // User cancelled picker

        // =================================================

        if (

          error?.code ===

            'OPERATION_CANCELED' ||

          error?.message

            ?.toLowerCase()

            ?.includes('cancel')

        ) {

          console.log(

            'User cancelled file selection',

          );

          return;

        }

        Alert.alert(

          'Error',

          'Unable to select the horoscope file. Please try again.',

        );

      }

    };

  // =====================================================

  // UPLOAD HOROSCOPE

  // =====================================================

  const handleUploadHoroscope =

    async () => {

      if (!selectedFile) {

        Alert.alert(

          'Required',

          'Please select a horoscope image or PDF first.',

        );

        return;

      }

      try {

        console.log(

          '====================================',

        );

        console.log(

          'Uploading Horoscope...',

        );

        console.log(

          'Selected File:',

          selectedFile,

        );

        console.log(

          'File URI:',

          selectedFile.uri,

        );

        console.log(

          'File Name:',

          selectedFile.name,

        );

        console.log(

          'File Type:',

          selectedFile.type,

        );

        console.log(

          '====================================',

        );

        // =================================================

        // Upload file to backend

        // =================================================

        const response =

          await uploadHoroscope(

            selectedFile,

          );

        console.log(

          'Horoscope Upload Response:',

          response,

        );

        // =================================================

        // Check response

        // =================================================

        if (

          !response ||

          !response.success

        ) {

          Alert.alert(

            'Upload Failed',

            response?.message ||

              'Unable to upload horoscope.',

          );

          return;

        }

        // =================================================

        // Upload successful

        // =================================================

        console.log(

          'Horoscope uploaded successfully.',

        );

        console.log(

          'Extracted Birth Details:',

          response?.birthDetails,

        );

        // =================================================

        // Navigate to Confirmation Screen

        // =================================================

        navigation.navigate(

          'HoroscopeConfirmation' as never,

          {

            dateOfBirth:

              response?.birthDetails

                ?.dateOfBirth || '',

            timeOfBirth:

              response?.birthDetails

                ?.timeOfBirth || '',

            placeOfBirth:

              response?.birthDetails

                ?.placeOfBirth || '',

            extractedText:

              response?.extractedText || '',

          } as never,

        );

      } catch (error) {

        console.log(

          'Horoscope Upload Error:',

          error,

        );

        Alert.alert(

          'Upload Failed',

          'Unable to upload horoscope. Please try again.',

        );

      }

    };

  // =====================================================

  // REMOVE SELECTED FILE

  // =====================================================

  const handleRemoveFile = () => {

    Alert.alert(

      'Remove File',

      'Do you want to remove the selected horoscope file?',

      [

        {

          text: 'Cancel',

          style: 'cancel',

        },

        {

          text: 'Remove',

          style: 'destructive',

          onPress: () => {

            setSelectedFile(null);

          },

        },

      ],

    );

  };

  // =====================================================

  // UI

  // =====================================================

  return (

    <SafeAreaView

      style={styles.container}>

      <ScrollView

        showsVerticalScrollIndicator={

          false

        }

        contentContainerStyle={

          styles.content

        }>

        {/* ========================= */}

        {/* Back Button */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* Logo */}

        {/* ========================= */}

        <AppLogoHeader />

        {/* ========================= */}

        {/* Stepper */}

        {/* ========================= */}

        <HoroscopeStepper

          currentStep={1}

        />

        {/* ========================= */}

        {/* Section Title */}

        {/* ========================= */}

        <Text

          style={styles.sectionTitle}>

          Birth Details

        </Text>

        {/* ========================= */}

        {/* Date of Birth */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* Time of Birth */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* Place of Birth */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* View Horoscope */}

        {/* ========================= */}

        <TouchableOpacity

          style={styles.saveButton}

          onPress={

            handleViewHoroscope

          }>

          <Text

            style={

              styles.saveButtonText

            }>

            View Horoscope

          </Text>

        </TouchableOpacity>

        {/* ========================= */}

        {/* OR Divider */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* Upload Horoscope */}

        {/* ========================= */}

        <View

          style={

            styles.uploadContainer

          }>

          <TouchableOpacity

            style={styles.uploadBox}

            onPress={

              handleSelectHoroscopeFile

            }>

            <MaterialCommunityIcons

              name="cloud-upload-outline"

              size={55}

              color="#FF6B00"

            />

            <Text

              style={

                styles.uploadHeading

              }>

              Upload Horoscope Image / PDF

            </Text>

            <Text

              style={

                styles.uploadSubtitle

              }>

              JPG • PNG • PDF

            </Text>

            <Text

              style={styles.uploadInfo}>

              Maximum Size 10 MB

            </Text>

          </TouchableOpacity>

        </View>

        {/* ========================= */}

        {/* Selected File */}

        {/* ========================= */}

        {selectedFile && (

          <View

            style={

              styles.selectedFileContainer

            }>

            <View

              style={

                styles.selectedFileInfo

              }>

              <MaterialCommunityIcons

                name={

                  selectedFile.name

                    ?.toLowerCase()

                    .endsWith('.pdf')

                    ? 'file-pdf-box'

                    : 'file-image-outline'

                }

                size={30}

                color="#FF6B00"

              />

              <View

                style={

                  styles.fileTextContainer

                }>

                <Text

                  style={

                    styles.selectedFileName

                  }

                  numberOfLines={1}>

                  {selectedFile.name}

                </Text>

                {selectedFile.size && (

                  <Text

                    style={

                      styles.selectedFileSize

                    }>

                    {(

                      selectedFile.size /

                      (1024 * 1024)

                    ).toFixed(2)}{' '}

                    MB

                  </Text>

                )}

              </View>

              <TouchableOpacity

                onPress={

                  handleRemoveFile

                }>

                <MaterialCommunityIcons

                  name="close-circle"

                  size={26}

                  color="#FF6B00"

                />

              </TouchableOpacity>

            </View>

            {/* ========================= */}

            {/* Upload Button */}

            {/* ========================= */}

            <TouchableOpacity

              style={

                styles.uploadButton

              }

              onPress={

                handleUploadHoroscope

              }>

              <Text

                style={

                  styles.uploadButtonText

                }>

                Upload Horoscope

              </Text>

            </TouchableOpacity>

          </View>

        )}

        {/* ========================= */}

        {/* Date Picker */}

        {/* ========================= */}

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

        {/* ========================= */}

        {/* Time Picker */}

        {/* ========================= */}

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

// =====================================================

// STYLES

// =====================================================

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

    color: '#202020',

    textAlign: 'center',

  },

  uploadSubtitle: {

    marginTop: 5,

    color: '#666',

    fontSize: 15,

  },

  uploadInfo: {

    marginTop: 5,

    color: '#999',

    fontSize: 14,

  },

  selectedFileContainer: {

    marginTop: 18,

    backgroundColor: '#FFFFFF',

    borderRadius: 14,

    padding: 15,

    elevation: 2,

  },

  selectedFileInfo: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  fileTextContainer: {

    flex: 1,

    marginLeft: 12,

    marginRight: 10,

  },

  selectedFileName: {

    fontSize: 16,

    fontWeight: '700',

    color: '#202020',

  },

  selectedFileSize: {

    marginTop: 4,

    fontSize: 13,

    color: '#777',

  },

  uploadButton: {

    height: 48,

    marginTop: 15,

    borderRadius: 12,

    backgroundColor: '#FF6B00',

    alignItems: 'center',

    justifyContent: 'center',

  },

  uploadButtonText: {

    color: '#FFFFFF',

    fontSize: 16,

    fontWeight: '700',

  },

  backContainer: {

    marginBottom: 10,

  },

});