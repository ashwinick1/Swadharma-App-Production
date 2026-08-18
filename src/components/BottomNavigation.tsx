import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

const BottomNavigation = () => {
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.item}>
        <MaterialCommunityIcons
          name="home"
          size={26}
          color="#FF6B00"
        />
        <Text style={[styles.label, styles.active]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color="#777"
        />
        <Text style={styles.label}>
          Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={24}
          color="#777"
        />
        <Text style={styles.label}>
          ID Card
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item}>
        <MaterialCommunityIcons
          name="account-circle-outline"
          size={26}
          color="#777"
        />
        <Text style={styles.label}>
          Profile
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default BottomNavigation;

const styles = StyleSheet.create({
  container: {
    height: 80,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    elevation: 12,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: -3,
    },
  },

  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    marginTop: 4,
    fontSize: 14,
    color: '#777',
    fontWeight: '800',
  },

  active: {
    color: '#FF6B00',
    fontWeight: '800',
  },
});