import React, {useState, useCallback,useEffect} from 'react';
import {sendOtp, verifyOtp} from '../services/api';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {SafeAreaView} from 'react-native-safe-area-context';


import AppLogoHeader from '../components/AppLogoHeader';
import AppFooter from '../components/AppFooter';
import {useNavigation,useFocusEffect,useRoute} from '@react-navigation/native';

const LoginScreen = () => {
   const [identifier, setIdentifier] = useState('');
  const navigation = useNavigation<any>();
const route = useRoute<any>();
const [loading, setLoading] = useState(false);
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    setIdentifier('');
  });

  return unsubscribe;
}, [navigation]);

  const handleSendOtp = async () => {
    if (!identifier.trim()) {
  alert('Please enter your mobile number or email');
  return;
}

    try {
      const response = await sendOtp(identifier);

      if (response.success) {
        navigation.navigate('Otp', {
          identifier,
        });
      } else {
        alert(response.message);
      }
    } catch (error) {
      alert('Unable to connect to server');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
  <ScrollView
    showsVerticalScrollIndicator={false}
    contentContainerStyle={styles.scrollContainer}
  >

      <AppLogoHeader />

      <View style={styles.content}>

  <Text style={styles.title}>
    Welcome Back!
  </Text>

  <Text style={styles.subtitle}>
    Login to continue your journey of self-discovery
  </Text>

  {/* Login with Email */}
  <Text style={styles.sectionTitle}>
  Login With Mobile Number or Email
</Text>

<View style={styles.inputContainer}>
  <MaterialCommunityIcons
    name="account-outline"
    size={22}
    color="#777"
  />

  <TextInput
    placeholder="Enter mobile number or email"
    placeholderTextColor="#999"
    autoCapitalize="none"
    keyboardType="default"
    style={styles.textInput}
    value={identifier}
    onChangeText={setIdentifier}
  />
</View>
  

<TouchableOpacity
  style={styles.otpButton}
  activeOpacity={0.7}
  onPress={handleSendOtp}>
  <Text style={styles.otpButtonText}>
    Send OTP
  </Text>

  <MaterialCommunityIcons
    name="arrow-right"
    size={22}
    color="#FFFFFF"
  />
</TouchableOpacity>
<View style={styles.signupContainer}>
  <Text style={styles.signupText}>
    Don't have an account?
  </Text>

  <TouchableOpacity
  onPress={() => navigation.navigate('Register')}
>
  <Text style={styles.signupLink}>
    Sign Up
  </Text>
</TouchableOpacity>
</View>

</View>
<AppFooter />
    
  </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F4',
  },

  content: {
    paddingHorizontal: 30,
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#4A2C1D',
  },

  
   subtitle: {
  marginTop: 10,
  fontSize: 16,
  color: '#666666',
   fontWeight: '800',
  lineHeight: 20,
},
  

  sectionTitle: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '600',
    color: '#4A2C1D',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333333',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    color: '#FF7A00',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 5,
  },

  loginButton: {
    marginTop: 25,
    height: 55,
    backgroundColor: '#FF7A00',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  



mobileTitle: {
  marginBottom: 10,
  fontSize: 18,
  fontWeight: '600',
  color: '#4A2C1D',
},

countryCode: {
  marginLeft: 10,
  fontSize: 16,
  color: '#333',
  fontWeight: '600',
},

separator: {
  width: 1,
  height: 24,
  backgroundColor: '#CCCCCC',
  marginHorizontal: 10,
},

otpButton: {
  marginTop: 25,
  height: 55,
  backgroundColor: '#FF7A00',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
},

otpButtonText: {
  color: '#FFFFFF',
  fontSize: 18,
  fontWeight: '700',
  marginRight: 8,
},
signupContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 25,
  marginBottom: 20,
},

signupText: {
  fontSize: 18,
  fontWeight: '800',
  color: '#4A2C1D'
},

signupLink: {
  marginLeft: 6,
  fontSize: 18,
  fontWeight: '800',
  color: '#FF7A00',
},
scrollContainer: {
  flexGrow: 1,
  justifyContent: 'space-between',
  paddingBottom: 20,
},

});

export default LoginScreen;