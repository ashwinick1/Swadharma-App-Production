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
import DoshaAssessmentScreen from '../screens/DoshaAssessmentScreen';
import DoshaQuestionsScreen from '../screens/DoshaQuestionsScreen';
import DoshaResultScreen from '../screens/DoshaResultScreen';
import GunaAssessmentScreen from '../screens/GunaAssessmentScreen';
import GunaQuestionsScreen from '../screens/GunaQuestionsScreen';
import GunaResultScreen from '../screens/GunaResultScreen';
import ActivityTypeScreen from '../screens/Personality/ActivityTypeScreen';
import ActivitySelectionScreen from '../screens/Personality/ActivitySelectionScreen';
import SpecificInterestScreen from '../screens/Personality/SpecificInterestScreen';
import MotivationScreen from '../screens/Personality/MotivationScreen';
import EngagementStyleScreen from '../screens/Personality/EngagementStyleScreen';
import QualitiesScreen from '../screens/Personality/QualitiesScreen';
import InterestProfileScreen from '../screens/Personality/InterestProfileScreen';
import JohariIntroScreen from '../screens/Johari/JohariIntroScreen';
import JohariSelfAssessmentScreen from '../screens/Johari/JohariSelfAssessmentScreen';
import JohariFeedbackSetupScreen from '../screens/Johari/JohariFeedbackSetupScreen';
import JohariFeedbackInviteScreen from '../screens/Johari/JohariFeedbackInviteScreen';
import JohariFeedbackScreen from '../screens/Johari/JohariFeedbackScreen';
import FamilyMemberSelectionScreen from '../screens/FamilyFeedback/FamilyMemberSelectionScreen';
import FamilyFeedbackIntroScreen from '../screens/FamilyFeedback/FamilyFeedbackIntroScreen';
import FamilyFeedbackInviteScreen from '../screens/FamilyFeedback/FamilyFeedbackInviteScreen';
import FamilyFeedbackQuestionnaireScreen from '../screens/FamilyFeedback/FamilyFeedbackQuestionnaireScreen';
import FamilyFeedbackSummaryScreen from '../screens/FamilyFeedback/FamilyFeedbackSummaryScreen';
import AIInsightsScreen from '../screens/AIInsights/AIInsightsScreen';
import SwadharmaReportScreen from '../screens/SwadharmaReport/SwadharmaReportScreen';
import SwadharmaIDCardScreen from '../screens/SwadharmaIDCard/SwadharmaIDCardScreen';
import HoroscopeConfirmationScreen from '../screens/HoroscopeConfirmationScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
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
<Stack.Screen
  name="DoshaAssessment"
  component={DoshaAssessmentScreen}
/>
<Stack.Screen
  name="DoshaQuestions"
  component={DoshaQuestionsScreen}
/>
<Stack.Screen
  name="DoshaResult"
  component={DoshaResultScreen}
/>
<Stack.Screen
  name="GunaAssessment"
  component={GunaAssessmentScreen}
/>
<Stack.Screen
  name="GunaQuestions"
  component={GunaQuestionsScreen}
/>
<Stack.Screen
  name="GunaResult"
  component={GunaResultScreen}
/>
<Stack.Screen
  name="ActivityType"
  component={ActivityTypeScreen}
/>
<Stack.Screen
  name="ActivitySelection"
  component={ActivitySelectionScreen}
/>
<Stack.Screen
  name="SpecificInterest"
  component={SpecificInterestScreen}
/>
<Stack.Screen
  name="Motivation"
  component={MotivationScreen}
/>
<Stack.Screen
  name="EngagementStyle"
  component={EngagementStyleScreen}
/>
<Stack.Screen
  name="Qualities"
  component={QualitiesScreen}
/>
<Stack.Screen
  name="InterestProfile"
  component={InterestProfileScreen}
/>
<Stack.Screen
  name="JohariIntro"
  component={JohariIntroScreen}
/>
<Stack.Screen
  name="JohariSelfAssessment"
  component={JohariSelfAssessmentScreen}
/>
<Stack.Screen
  name="JohariFeedbackSetup"
  component={JohariFeedbackSetupScreen}
/>
<Stack.Screen
  name="JohariFeedbackInvite"
  component={JohariFeedbackInviteScreen}
/>
<Stack.Screen
  name="JohariFeedback"
  component={JohariFeedbackScreen}
/>
<Stack.Screen
          name="FamilyFeedbackIntro"
          component={FamilyFeedbackIntroScreen}
        />
        <Stack.Screen
          name="FamilyMemberSelection"
          component={FamilyMemberSelectionScreen}
        />
        <Stack.Screen
          name="FamilyFeedbackInvite"
          component={FamilyFeedbackInviteScreen}
        />
        <Stack.Screen
          name="FamilyFeedbackQuestionnaire"
          component={FamilyFeedbackQuestionnaireScreen}
        />
        <Stack.Screen
          name="FamilyFeedbackSummary"
          component={FamilyFeedbackSummaryScreen}
        />
<Stack.Screen
  name="AIInsights"
  component={AIInsightsScreen}
/>
<Stack.Screen
  name="SwadharmaReport"
  component={SwadharmaReportScreen}
/>
<Stack.Screen
  name="SwadharmaIDCard"
  component={SwadharmaIDCardScreen}
/>
<Stack.Screen
  name="HoroscopeConfirmation"
  component={HoroscopeConfirmationScreen}
  options={{headerShown: false}}
/>

<Stack.Screen
  name="HelpSupport"
  component={HelpSupportScreen}
/>
<Stack.Screen
  name="Notifications"
  component={NotificationsScreen}
/>

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
