import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OtpScreen from '../screens/OtpScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import DrawerNavigator from './DrawerNavigator';
import BirthDetailsScreen from '../screens/BirthDetailsScreen';
import ViewHoroscopeScreen from '../screens/ViewHoroscopeScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
      

<Stack.Screen
  name="Otp"
  component={OtpScreen}
/>
<Stack.Screen
  name="Register"
  component={RegisterScreen}
/>
<Stack.Screen
  name="Dashboard"
  component={DrawerNavigator}
/>
<Stack.Screen
  name="BirthDetails"
  component={BirthDetailsScreen}
/>
<Stack.Screen
  name="ViewHoroscope"
  component={ViewHoroscopeScreen}
/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;