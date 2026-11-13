import React, {useCallback, useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {CommonActions} from '@react-navigation/native';

import {DrawerContentComponentProps} from '@react-navigation/drawer';

import {getUnreadNotificationCount} from '../services/api';

// =====================================================
// PROPS
// =====================================================
type SideMenuProps = DrawerContentComponentProps & {
  userId?: number | string;
  rootNavigation?: any;
};

// =====================================================
// SIDE MENU
// =====================================================
const SideMenu = ({
  navigation,
  userId,
  rootNavigation,
}: SideMenuProps) => {
  const [unreadCount, setUnreadCount] = useState(0);

  // ROOT NAVIGATION
  const mainNavigation =
    rootNavigation ?? navigation.getParent();

  // =====================================================
  // LOAD UNREAD NOTIFICATION COUNT
  // =====================================================
  const loadUnreadCount = useCallback(async () => {
    const numericUserId = Number(userId);

    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await getUnreadNotificationCount(numericUserId);

      console.log(
        'SideMenu unread notification response:',
        response,
      );

      const count = Number(
        response?.unreadCount ??
          response?.count ??
          response?.data?.unreadCount ??
          0,
      );

      setUnreadCount(
        Number.isFinite(count) && count > 0 ? count : 0,
      );
    } catch (error) {
      console.error(
        'Failed to load unread notification count:',
        error,
      );
    }
  }, [userId]);

  // =====================================================
  // LOAD WHEN DRAWER OPENS OR STATE CHANGES
  // =====================================================
  useEffect(() => {
    loadUnreadCount();

    const unsubscribe = navigation.addListener(
      'state',
      () => {
        loadUnreadCount();
      },
    );

    return unsubscribe;
  }, [navigation, loadUnreadCount]);

  // =====================================================
  // DASHBOARD
  // =====================================================
  const handleDashboard = () => {
    navigation.navigate('Dashboard', {
      userId,
      scrollToJourney: false,
    });

    navigation.closeDrawer();
  };

  // =====================================================
  // MY JOURNEY
  // =====================================================
  const handleMyJourney = () => {
    navigation.navigate('Dashboard', {
      userId,
      scrollToJourney: true,
    });

    navigation.closeDrawer();
  };

  // =====================================================
  // SWADHARMA REPORT
  // =====================================================
  const handleReport = () => {
    if (!mainNavigation) {
      Alert.alert(
        'Navigation Error',
        'Main navigation is unavailable.',
      );
      return;
    }

    navigation.closeDrawer();

    mainNavigation.navigate('SwadharmaReport', {
      userId,
    });
  };

  // =====================================================
  // SWADHARMA ID CARD
  // =====================================================
  const handleIDCard = () => {
    if (!mainNavigation) {
      Alert.alert(
        'Navigation Error',
        'Main navigation is unavailable.',
      );
      return;
    }

    navigation.closeDrawer();

    mainNavigation.navigate('SwadharmaIDCard', {
      userId,
    });
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================
  const handleNotifications = () => {
    if (!mainNavigation) {
      Alert.alert(
        'Navigation Error',
        'Main navigation is unavailable.',
      );
      return;
    }

    navigation.closeDrawer();

    mainNavigation.navigate('Notifications', {
      userId,
    });
  };

  // =====================================================
  // HELP & SUPPORT
  // =====================================================
  const handleHelpSupport = () => {
    if (!mainNavigation) {
      Alert.alert(
        'Navigation Error',
        'Main navigation is unavailable.',
      );
      return;
    }

    navigation.closeDrawer();

    mainNavigation.navigate('HelpSupport', {
      userId,
    });
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',

          onPress: () => {
            if (!mainNavigation) {
              Alert.alert(
                'Navigation Error',
                'Unable to return to Login.',
              );
              return;
            }

            mainNavigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: 'Login',
                  },
                ],
              }),
            );
          },
        },
      ],
    );
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <View style={styles.container}>

      {/* APP NAME */}
      <Text style={styles.appName}>
        SWADHARMA
      </Text>

      {/* DASHBOARD */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleDashboard}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* MY JOURNEY */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleMyJourney}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="map-marker-path"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          My Journey
        </Text>
      </TouchableOpacity>

      {/* SWADHARMA REPORT */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleReport}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          Swadharma Report
        </Text>
      </TouchableOpacity>

      {/* SWADHARMA ID CARD */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleIDCard}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          Swadharma ID Card
        </Text>
      </TouchableOpacity>

      {/* DIVIDER */}
      <View style={styles.divider} />

      {/* NOTIFICATIONS */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleNotifications}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          Notifications
        </Text>

        {/* DYNAMIC UNREAD COUNT */}
        {unreadCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}

      </TouchableOpacity>

      {/* HELP & SUPPORT */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleHelpSupport}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="help-circle-outline"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.menuText}>
          Help & Support
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleLogout}
        activeOpacity={0.7}>

        <MaterialCommunityIcons
          name="logout"
          size={24}
          color="#FF6B00"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default SideMenu;

// =====================================================
// STYLES
// =====================================================
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 70,
    paddingHorizontal: 25,
  },

  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FF6B00',
    marginBottom: 35,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },

  menuText: {
    marginLeft: 18,
    fontSize: 17,
    color: '#202020',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 15,
  },

  // NOTIFICATION COUNT BADGE
  countBadge: {
    marginLeft: 'auto',
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: '#E85B00',
    alignItems: 'center',
    justifyContent: 'center',
  },

  countBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },

  logoutText: {
    marginLeft: 18,
    fontSize: 17,
    color: '#D84315',
    fontWeight: '700',
  },

});