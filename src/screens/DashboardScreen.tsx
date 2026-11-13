import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import DashboardJourney from '../components/DashboardJourney';
import AIInsightsCard from '../components/AIInsightsCard';
import BottomNavigation from '../components/BottomNavigation';

import {
  getUserProfile,
  getUnreadNotificationCount,
} from '../services/api';

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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // =====================================================
  // USER ID
  // =====================================================
  const userId = route.params?.userId;

  console.log('Dashboard userId:', userId);

  // =====================================================
  // USER PROFILE
  // =====================================================
  const [user, setUser] = useState<any>(null);

  // =====================================================
  // UNREAD NOTIFICATION COUNT
  // =====================================================
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState(0);

  // =====================================================
  // SCROLL REFERENCES
  // =====================================================
  const scrollViewRef = useRef<ScrollView>(null);
  const journeySectionY = useRef(0);
  const journeyLayoutReady = useRef(false);
  const pendingJourneyScroll = useRef(false);

  // =====================================================
  // LOAD USER PROFILE
  // =====================================================
  useEffect(() => {
    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await getUserProfile(userId);
      console.log('Profile Response:', response);
      setUser(response?.user ?? response?.data?.user ?? response);
    } catch (error) {
      console.log('Failed to load profile:', error);
    }
  };

  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // Refresh each time Dashboard becomes active again.
  // =====================================================
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadNotificationCount = async () => {
        const numericUserId = Number(userId);

        if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
          if (isActive) {
            setUnreadNotificationCount(0);
          }
          return;
        }

        try {
          const response = await getUnreadNotificationCount(numericUserId);

          console.log(
            'Dashboard unread notification response:',
            response,
          );

          const count = Number(
            response?.unreadCount ??
              response?.count ??
              response?.data?.unreadCount ??
              0,
          );

          if (isActive) {
            setUnreadNotificationCount(
              Number.isFinite(count) && count > 0 ? count : 0,
            );
          }
        } catch (error) {
          console.error(
            'Dashboard notification count error:',
            error,
          );
          // Keep the last successful count if the API is temporarily unavailable.
        }
      };

      loadNotificationCount();

      return () => {
        isActive = false;
      };
    }, [userId]),
  );

  // =====================================================
  // OPEN NOTIFICATIONS
  // Dashboard is inside Drawer; Notifications is in root Stack.
  // =====================================================
  const handleOpenNotifications = () => {
    const rootNavigation = navigation.getParent();

    if (!rootNavigation) {
      console.error('Root Stack navigation is unavailable.');
      return;
    }

    rootNavigation.navigate('Notifications', {userId});
  };

  // =====================================================
  // SCROLL TO MY JOURNEY SECTION
  // =====================================================
  const scrollToJourney = () => {
    requestAnimationFrame(() => {
      if (!scrollViewRef.current || !journeyLayoutReady.current) {
        return;
      }

      console.log(
        'Scrolling to Your Swadharma Journey:',
        journeySectionY.current,
      );

      scrollViewRef.current.scrollTo({
        y: Math.max(0, journeySectionY.current - 10),
        animated: true,
      });

      pendingJourneyScroll.current = false;

      // Reset parameter so it can be triggered again.
      navigation.setParams({
        scrollToJourney: false,
      });
    });
  };

  // =====================================================
  // HANDLE JOURNEY SECTION LAYOUT
  // =====================================================
  const handleJourneyLayout = (event: any) => {
    journeySectionY.current = event.nativeEvent.layout.y;
    journeyLayoutReady.current = true;

    if (pendingJourneyScroll.current) {
      scrollToJourney();
    }
  };

  // =====================================================
  // LISTEN FOR MY JOURNEY SIDEBAR CLICK
  // =====================================================
  useEffect(() => {
    if (route.params?.scrollToJourney === true) {
      console.log(
        'My Journey menu clicked. Scrolling to journey section.',
      );

      pendingJourneyScroll.current = true;
      scrollToJourney();
    }
  }, [route.params?.scrollToJourney]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* HEADER */}
        <TouchableOpacity
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <MaterialCommunityIcons
            name="menu"
            size={30}
            color="#FF6B00"
          />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          {/* LOGO */}
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />

          {/* RIGHT ICONS */}
          <View style={styles.rightIcons}>
            {/* NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.notificationContainer}
              onPress={handleOpenNotifications}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={
                unreadNotificationCount > 0
                  ? `Notifications, ${unreadNotificationCount} unread`
                  : 'Notifications'
              }>
              <MaterialCommunityIcons
                name="bell-outline"
                size={26}
                color="#202020"
              />

              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationCount > 9
                      ? '9+'
                      : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {/* PROFILE */}
            <TouchableOpacity style={styles.profileContainer}>
              {user?.profileImage ? (
                <Image
                  source={{uri: user.profileImage}}
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

        {/* WELCOME SECTION */}
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

        {/* QUOTE CARD */}
        <View style={styles.quoteCard}>
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

          <Image
            source={require('../assets/images/quote_meditation.png')}
            style={styles.quoteImage}
          />
        </View>

        {/* YOUR SWADHARMA JOURNEY */}
        <View onLayout={handleJourneyLayout}>
          <DashboardJourney userId={userId} />
        </View>

        {/* AI INSIGHTS */}
        <AIInsightsCard userId={userId} />

        {/* BOTTOM NAVIGATION */}
        <BottomNavigation userId={userId} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;

// =====================================================
// STYLES
// =====================================================
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
    padding: 5,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
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

  greeting: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FF6B00',
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

  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
});