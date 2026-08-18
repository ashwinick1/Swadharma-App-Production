import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import React, {useState, useEffect,useRef} from 'react';
import {useRoute} from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
   TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import AppLogoHeader from '../components/AppLogoHeader';
import {useNavigation} from '@react-navigation/native';
import {sendOtp, verifyOtp} from '../services/api';

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const identifier = route.params?.identifier ?? '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [timer, setTimer] = useState(60);
const [canResend, setCanResend] = useState(false);
  useEffect(() => {
  if (timer === 0) {
    setCanResend(true);
    return;
  }

  const interval = setInterval(() => {
    setTimer(prev => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer]);

  const handleVerifyOtp = async () => {
  const enteredOtp = otp.join('');

  if (enteredOtp.length !== 6) {
    alert('Please enter all 6 digits');
    return;
  }

  try {
    const response = await verifyOtp(identifier, enteredOtp);
    console.log('OTP Response:', JSON.stringify(response, null, 2));

   if (response.success) {
  if (response.isRegistered) {
    navigation.reset({
  index: 0,
  routes: [
    {
      name: 'Dashboard',
      params: {
        userId: response.userId,
      },
    },
  ],
});
  } else {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Register',
          params: {
            identifier,
          },
        },
      ],
    });
  }
} else {
  alert(response.message);
}
  } catch (error) {
    console.log(error);
    alert('Unable to verify OTP');
  }
};
 const handleResendOtp = async () => {
  if (!canResend) {
    return;
  }

  try {
   const response = await sendOtp(identifier);

    if (response.success) {
      alert('OTP sent successfully');

      // Restart timer
      setTimer(60);
      setCanResend(false);

      // Clear OTP boxes
      setOtp(['', '', '', '', '', '']);

      // Focus first input
      inputRefs.current[0]?.focus();
    } else {
      alert(response.message);
    }
  } catch (error) {
    alert('Unable to resend OTP');
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>

     
        <View style={styles.backContainer}>
<TouchableOpacity onPress={() => navigation.goBack()}>
  <MaterialCommunityIcons
    name="arrow-left"
    size={28}
    color="#4A2C1D"
  />
</TouchableOpacity>
</View>
   <AppLogoHeader />
        <View style={styles.content}>
          <Text style={styles.title}>
            Verify Your Mobile Number
          </Text>

          <Text style={styles.subtitle}>
            Enter the 6-digit OTP sent to your registered mobile number or email.
          </Text>
        </View>
<View style={styles.mobileContainer}>
<Text style={styles.mobileNumber}>
  {identifier.includes('@') ? identifier : `+91 ${identifier}`}
</Text>

<TouchableOpacity onPress={() => navigation.goBack()}>
  <Text style={styles.changeText}>Change</Text>
</TouchableOpacity>
</View>
<View style={styles.otpContainer}>
  {otp.map((digit, index) => (
    <TextInput
      key={index}
      ref={ref => {
        inputRefs.current[index] = ref;
      }}
      style={styles.otpInput}
      keyboardType="number-pad"
      maxLength={1}
      value={digit}
      onChangeText={text => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
          inputRefs.current[index + 1]?.focus();
        }
      }}
      onKeyPress={({nativeEvent}) => {
        if (
          nativeEvent.key === 'Backspace' &&
          !otp[index] &&
          index > 0
        ) {
          inputRefs.current[index - 1]?.focus();
        }
      }}
    />
  ))}
</View>
<View style={styles.resendContainer}>
  <Text style={styles.infoText}>
    Didn't receive the code?
  </Text>

  <View style={styles.timerRow}>
   <Text style={styles.timerText}>
  00:{timer.toString().padStart(2, '0')}
</Text>

    <TouchableOpacity
  disabled={!canResend}
  onPress={handleResendOtp}>
  <Text
    style={[
      styles.resendText,
      {
        opacity: canResend ? 1 : 0.5,
      },
    ]}>
    Resend OTP
  </Text>
</TouchableOpacity>
  </View>
</View>
<TouchableOpacity
  style={styles.verifyButton}
  onPress={handleVerifyOtp}>
  <Text style={styles.verifyButtonText}>
    Verify OTP
  </Text>
</TouchableOpacity>
<View style={styles.signupContainer}>
  <Text style={styles.signupText}>
    Don't have an account?
  </Text>

<TouchableOpacity
  onPress={() => navigation.navigate('Register')}>
  <Text style={styles.signupLink}>Sign Up</Text>
</TouchableOpacity>
</View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: 20,
    fontWeight: '800',
    color: '#4A2C1D',
    marginTop: 20,
    
  textAlign: 'center',
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '800',
    color: '#666666',
    lineHeight: 22,
  },
  mobileContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 20,
},

mobileNumber: {
  fontSize: 18,
  fontWeight: '700',
  color: '#4A2C1D',
},

changeText: {
  marginLeft: 15,
  color: '#FF7A00',
  fontSize: 16,
  fontWeight: '600',
},
backContainer: {
  paddingHorizontal: 20,
  marginTop: 10,
},
otpContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 30,
},

otpInput: {
  width: 45,
  height: 50,
  marginHorizontal: 5,   // Small gap between boxes
  borderWidth: 2,
  borderColor: '#FF7A00',
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
  textAlign: 'center',
  fontSize: 20,
  fontWeight: '700',
},
resendContainer: {
  marginTop: 30,
  alignItems: 'center',
},

infoText: {
  fontSize: 18,
  color: '#666666',
  fontWeight:900,
},

timerRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},

timerText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#4A2C1D',
},

resendText: {
  marginLeft: 20,
  fontSize: 18,
  fontWeight: '800',
  color: '#FF7A00',
},
verifyButton: {
  backgroundColor: '#FF7A00',
  marginTop: 35,
  marginHorizontal: 30,
  borderRadius: 10,
  height: 52,
  justifyContent: 'center',
  alignItems: 'center',
},

verifyButtonText: {
  color: '#FFFFFF',
  fontSize: 17,
  fontWeight: '700',
},
signupContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 25,
},

signupText: {
  fontSize: 18,
  color: '#666666',
  fontWeight: '800',
},

signupLink: {
  fontSize: 18,
  fontWeight: '800',
  color: '#FF7A00',
},
});

export default OtpScreen;