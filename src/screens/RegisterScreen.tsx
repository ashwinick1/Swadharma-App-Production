import React, {useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';


import AppLogoHeader from '../components/AppLogoHeader';
import {
  registerUser,
  uploadProfileImage,
} from '../services/api';

const RegisterScreen = () => {
   const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
 const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [profileImage, setProfileImage] = useState(null);
  const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  console.log('launchImageLibrary =', launchImageLibrary);
console.log('launchCamera =', launchCamera);
   const uploadImage = () => {
  launchImageLibrary(
    {
      mediaType: 'photo',
      quality: 1,
    },
    async response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        try {
          console.log('Selected Image:', response.assets[0]);

          const result = await uploadProfileImage(
            response.assets[0],
          );

          console.log('Upload Result:', result);

          if (result.success) {
            setProfileImage(result.imageUrl);
          } else {
            Alert.alert('Upload Failed');
          }
        } catch (error) {
          console.log('UPLOAD ERROR:', error);
          Alert.alert('Image upload failed');
        }
      }
    },
  );
};

 const openCamera = () => {
  launchCamera(
    {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: true,
    },
    async response => {
      if (response.didCancel) {
        console.log('Camera cancelled');
      } else if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.assets?.length) {
        try {
          const result = await uploadProfileImage(
            response.assets[0],
          );

          console.log('Camera Upload:', result);

          if (result.success) {
            setProfileImage(result.imageUrl);
          } else {
            Alert.alert('Upload Failed');
          }
        } catch (error) {
          console.log(error);
          Alert.alert('Image upload failed');
        }
      }
    },
  );
};
const showImagePickerOptions = () => {
  console.log('Image Picker Clicked');

  Alert.alert(
    'Upload Profile Photo',
    'Choose an option',
    [
      {
        text: 'Camera',
        onPress: () => {
          console.log('Camera Selected');
          openCamera();
        },
      },
      {
        text: 'Gallery',
        onPress: () => {
          console.log('Gallery Selected');
          uploadImage();
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
  );
};
const handleRegister = async () => {

  if (firstName.trim() === '') {
    alert('Please enter your First Name');
    return;
  }

  if (lastName.trim() === '') {
  alert('Please enter your Last Name');
  return;
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email.trim() === '') {
    alert('Please enter your Email Address');
    return;
  }

  if (gender === '') {
  alert('Please select your Gender');
  return;
}

  if (!emailRegex.test(email)) {
    alert('Please enter a valid Email Address');
    return;
  }

  const mobileRegex = /^[0-9]{10}$/;

  if (mobileNumber.trim() === '') {
    alert('Please enter your Mobile Number');
    return;
  }

  if (!mobileRegex.test(mobileNumber)) {
    alert('Please enter a valid 10-digit Mobile Number');
    return;
  }
  if (country === '') {
  alert('Please select your Country');
  return;
}
if (state === '') {
  alert('Please select your State');
  return;
}
if (zipCode.trim() === '') {
  alert('Please enter your Zip Code');
  return;
}

const zipCodeRegex = /^[0-9]{6}$/;

if (!zipCodeRegex.test(zipCode)) {
  alert('Please enter a valid 6-digit Zip Code');
  return;
}
  try {
  const response = await registerUser({
    firstName,
    lastName,
    email,
    mobileNumber,
    gender,
    country,
    state,
    city,
    zipCode,
    dateOfBirth,
    profileImage,
  });

  console.log('API Response:', response);

  Alert.alert(
  'Success',
  'Registration completed successfully!',
  [
    {
      text: 'OK',
      onPress: () => {
  console.log('Clearing form...');

  setFirstName('');
  setLastName('');
  setEmail('');
  setMobileNumber('');
  setGender('');
  setCountry('');
  setState('');
  setCity('');
  setZipCode('');
  setDateOfBirth('');
  setSelectedDate(new Date());
  setProfileImage(null);
},
    },
  ],
);
} catch (error) {
  console.log(error);
  Alert.alert('Error', 'Registration failed');
}
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={styles.scrollContainer}>

        <AppLogoHeader />

        <View style={styles.content}>
          <Text style={styles.title}>Create Your Account</Text>

          <Text style={styles.subtitle}>
            Let's get to know you better
          </Text>
        </View>
      <View style={styles.profileContainer}>

  {/* Profile Image */}
 <TouchableOpacity
  style={styles.profileCircle}
  onPress={() =>
    Alert.alert(
      'Upload Profile Photo',
      'Choose an option',
      [
        {
          text: 'Gallery',
          onPress: uploadImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    )
  }>

 {profileImage ? (
  <Image
    source={{uri: profileImage}}
    style={styles.profileImage}
  />
) : (
  <MaterialCommunityIcons
    name="account"
    size={55}
    color="#FF7A00"
  />
)}
</TouchableOpacity>

  {/* Camera Button */}
  <TouchableOpacity
  style={styles.cameraButton}
  onPress={showImagePickerOptions}>

    <MaterialCommunityIcons
      name="camera"
      size={20}
      color="#fff"
    />
  </TouchableOpacity>



  <Text style={styles.uploadText}>
    Upload your profile photo
  </Text>

</View>
<View style={styles.formContainer}>

  {/* First Name & Last Name */}
  <View style={styles.row}>
    <View style={[styles.inputContainer, {marginRight: 10}]}>
      <Text style={styles.label}>First Name</Text>
      <TextInput
  placeholder="First Name"
  style={styles.input}
  value={firstName}
  onChangeText={setFirstName}
/>
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Last Name</Text>
      <TextInput
  placeholder="Last Name"
  style={styles.input}
  value={lastName}
  onChangeText={setLastName}
/>
    </View>
  </View>

  {/* Gender & DOB */}
  <View style={styles.row}>
    <View style={[styles.inputContainer, {marginRight: 10}]}>
      <Text style={styles.label}>Gender</Text>
      <Picker
  selectedValue={gender}
  onValueChange={(itemValue) => setGender(itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Select Gender" value="" />
  <Picker.Item label="Male" value="Male" />
  <Picker.Item label="Female" value="Female" />
  <Picker.Item label="Other" value="Other" />
</Picker>
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Date of Birth</Text>
      <TouchableOpacity
  style={styles.input}
  onPress={() => setShowDatePicker(true)}
>
  <Text
    style={{
      fontSize: 18,
      color: dateOfBirth ? '#000' : '#999',
    }}
  >
    {dateOfBirth || 'DD/MM/YYYY'}
  </Text>
</TouchableOpacity>
    </View>
  </View>

  {/* Email */}
  <View style={styles.singleField}>
    <Text style={styles.label}>Email Address</Text>
    <TextInput
  placeholder="Enter Email"
  keyboardType="email-address"
  style={styles.input}
  value={email}
  onChangeText={setEmail}
  autoCapitalize="none"
/>
  </View>

  {/* Mobile */}
  <View style={styles.singleField}>
    <Text style={styles.label}>Mobile Number</Text>
    <TextInput
  placeholder="Enter Mobile Number"
  keyboardType="phone-pad"
  style={styles.input}
  value={mobileNumber}
  onChangeText={setMobileNumber}
  maxLength={10}
/>
  </View>

  {/* Country */}
  <View style={styles.singleField}>
    <Text style={styles.label}>Country</Text>
    <Picker
  selectedValue={country}
  onValueChange={(itemValue) => setCountry(itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Select Country" value="" />
  <Picker.Item label="India" value="India" />
</Picker>
  </View>

  {/* State & City */}
  <View style={styles.row}>
    <View style={[styles.inputContainer, {marginRight: 10}]}>
      <Text style={styles.label}>State</Text>
     

  <Picker
  selectedValue={state}
  onValueChange={(itemValue) => setState(itemValue)}
  style={styles.picker}
>
  <Picker.Item label="Select State" value="" />
  {states.map((item) => (
    <Picker.Item key={item} label={item} value={item} />
  ))}
</Picker>
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>City</Text>
      <TextInput
  placeholder="City"
  style={styles.input}
  value={city}
  onChangeText={setCity}
/>
    </View>
  </View>

  {/* Zip Code */}
  <View style={styles.singleField}>
    <Text style={styles.label}>Zip Code</Text>
    <TextInput
  placeholder="Zip Code"
  keyboardType="number-pad"
  style={styles.input}
  value={zipCode}
  onChangeText={setZipCode}
/>
  </View>

  {/* Button */}
  <TouchableOpacity
  style={styles.createButton}
  onPress={handleRegister}>
  <Text style={styles.createButtonText}>
    Create Account
  </Text>
</TouchableOpacity>

  {/* Login */}
  <View style={styles.loginContainer}>
    <Text style={styles.loginText}>
      Already have an account?
    </Text>

    <TouchableOpacity
  onPress={() => navigation.navigate('Login')}>
  <Text style={styles.loginLink}>
    Login
  </Text>
</TouchableOpacity>
  </View>

</View>
{showDatePicker && (
  <DateTimePicker
    value={selectedDate}
    mode="date"
    display="calendar"
    maximumDate={new Date()}
    onChange={(event, date) => {
      setShowDatePicker(false);

      if (date) {
        setSelectedDate(date);

        const formattedDate =
          `${String(date.getDate()).padStart(2, '0')}/` +
          `${String(date.getMonth() + 1).padStart(2, '0')}/` +
          `${date.getFullYear()}`;

        setDateOfBirth(formattedDate);
      }
    }}
  />
)}

      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F4',
  },

  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  content: {
    paddingHorizontal: 30,
    marginTop: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#4A2C1D',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 12,
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
  profileContainer: {
  alignItems: 'center',
  marginTop: 30,
},

profileCircle: {
  width: 110,
  height: 110,
  borderRadius: 55,
  backgroundColor: '#F5F5F5',
  justifyContent: 'center',
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#FF7A00',
},

profileIcon: {
  width: 50,
  height: 50,
  resizeMode: 'contain',
},

uploadText: {
  marginTop: 12,
  fontSize: 15,
  color: '#666666',
},
formContainer: {
  paddingHorizontal: 25,
  marginTop: 30,
},

row: {
  flexDirection: 'row',
  marginBottom: 20,
},

inputContainer: {
  flex: 1,
},

singleField: {
  marginBottom: 20,
},

label: {
  fontSize: 18,
  fontWeight: '800',
  color: '#4A2C1D',
  marginBottom: 8,
},

input: {
  height: 50,
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#FF7A00',
  borderRadius: 10,
    fontSize: 18,
  paddingHorizontal: 15,
},

createButton: {
  backgroundColor: '#FF7A00',
  height: 52,
  borderRadius: 10,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 15,
},

createButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '800',
},

loginContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 25,
},

loginText: {
  color: '#666666',
  fontSize: 18,
  fontWeight:800,
},

loginLink: {
  color: '#FF7A00',
  fontSize: 18,
  fontWeight: '800',
},
 picker: {
    height: 80,
    fontSize: 18,
    fontWeight: '900',
    color: '#333',
  },
  profileImage: {
  width: 106,
  height: 106,
  borderRadius: 53,
},
cameraButton: {
  position: 'absolute',
  bottom: 45,
  right: 145,
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#FF7A00',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
  zIndex: 10,
},
});