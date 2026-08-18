import React, {useEffect, useState} from 'react';
import {
  DrawerActions,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import DashboardJourney from '../components/DashboardJourney';
import AIInsightsCard from '../components/AIInsightsCard';
import BottomNavigation from '../components/BottomNavigation';
import {getUserProfile} from '../services/api';

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

const userId = route.params?.userId;
console.log('Dashboard userId:', userId);

const [user, setUser] = useState<any>(null);
useEffect(() => {
  if (userId) {
    loadProfile();
  }
}, [userId]);
const loadProfile = async () => {
  try {
    const response = await getUserProfile(userId);
     console.log('Profile Response:', response); 
    setUser(response);
  } catch (error) {
    console.log(error);
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Header */}
       <TouchableOpacity
  onPress={() =>
    navigation.dispatch(DrawerActions.openDrawer())
  }>
    <MaterialCommunityIcons
      name="menu"
      size={30}
      color="#FF6B00"
    />
  </TouchableOpacity>
        <View style={styles.headerContainer}>
          {/* Logo */}
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          {/* Right Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.notificationContainer}>
              <MaterialCommunityIcons
                name="bell-outline"
                size={26}
                color="#202020"
              />

              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileContainer}>
  {user?.profileImage ? (
    <Image
      source={{ uri: user.profileImage }}
      style={styles.profileImage}
    />
  ) : (
    <MaterialCommunityIcons
      name="account-outline"
      size={30}
      color="#FF6B00"
    />
  )}
</TouchableOpacity>

          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeContainer}>
  <Text style={styles.greeting}>
    Hi, {user?.firstName ?? 'User'} 
  </Text>

  <Text style={styles.welcomeTitle}>
    Welcome to Swadharma
  </Text>

  <Text style={styles.welcomeSubtitle}>
    Discover Your True Self
  </Text>
</View>
<View style={styles.quoteCard}>
  {/* Left Section */}
  <View style={styles.quoteLeft}>
   

    <View style={styles.quoteTextContainer}>
      <Text style={styles.quoteTitle}>
        Your Dharma is your greatest strength.
      </Text>

      <Text style={styles.quoteSubtitle}>
        Know yourself, live your purpose.
      </Text>
    </View>
  </View>

  {/* Right Image */}
  <Image
    source={require('../assets/images/quote_meditation.png')}
    style={styles.quoteImage}
  />
</View>
<DashboardJourney />
<AIInsightsCard />
<BottomNavigation />

      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F2',
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    width: 140,
    height: 60,
    resizeMode: 'contain',
  },

  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  notificationContainer: {
    marginRight: 18,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  welcomeContainer: {
    marginTop: 20,
    marginBottom: 25,
  },

  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B00',
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: '#777777',
    marginTop: 5,
    fontWeight: '800',
  },
  profileContainer: {
  width: 60,
  height: 60,
  borderRadius: 30,
  borderWidth: 2,
  borderColor: '#FF6B00',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 12,
},
quoteCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 16,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  elevation: 3,
},

quoteLeft: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  marginRight: 12,
},

quoteIcon: {
  fontSize: 34,
  color: '#FF6B00',
  marginRight: 12,
},

quoteTextContainer: {
  flex: 1,
},

quoteTitle: {
  fontSize: 16,
  fontWeight: '900',
  color: '#333',
},

quoteSubtitle: {
  marginTop: 4,
  fontSize: 14,
  color: '#666',
fontWeight: '900',
},

quoteImage: {
  width: 85,
  height: 60,
  resizeMode: 'contain',
},
greeting: {
  fontSize: 16,
  fontWeight: '900',
  color: '#FF6B00',
},
profileImage: {
  width: 56,
  height: 56,
  borderRadius: 28,
},
});