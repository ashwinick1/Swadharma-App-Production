import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

const SideMenu = () => {
  return (
    <View style={styles.container}>

      {/* App Name */}
      <Text style={styles.appName}>
        SWADHARMA
      </Text>

      {/* Main Menu */}

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="map-marker-path"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          My Journey
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          Swadharma Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          Swadharma ID Card
        </Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* Secondary Menu */}

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="bell-outline"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialCommunityIcons
          name="help-circle-outline"
          size={24}
          color="#FF6B00"
        />
        <Text style={styles.menuText}>
          Help & Support
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
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

  logoutText: {
    marginLeft: 18,
    fontSize: 17,
    color: '#D84315',
    fontWeight: '700',
  },
});