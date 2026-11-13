
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation} from '@react-navigation/native';

interface BottomNavigationProps {
  userId?: number;
}

const BottomNavigation = ({
  userId,
}: BottomNavigationProps) => {
  const navigation = useNavigation<any>();

  const handleReport = () => {
    if (!userId) {
      console.log(
        'Swadharma Report: userId is missing',
      );
      return;
    }

    navigation.getParent()?.navigate(
      'SwadharmaReport',
      {
        userId,
      },
    );
  };

  const handleIDCard = () => {
    if (!userId) {
      console.log(
        'Swadharma ID Card: userId is missing',
      );
      return;
    }

    navigation.getParent()?.navigate(
      'SwadharmaIDCard',
      {
        userId,
      },
    );
  };

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="home"
          size={26}
          color="#FF6B00"
        />

        <Text
          style={[
            styles.label,
            styles.active,
          ]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Report */}
      <TouchableOpacity
        style={styles.item}
        onPress={handleReport}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="file-document-outline"
          size={24}
          color="#777"
        />

        <Text style={styles.label}>
          Report
        </Text>
      </TouchableOpacity>

      {/* ID Card */}
      <TouchableOpacity
        style={styles.item}
        onPress={handleIDCard}
        activeOpacity={0.8}>
        <MaterialCommunityIcons
          name="card-account-details-outline"
          size={24}
          color="#777"
        />

        <Text style={styles.label}>
          ID Card
        </Text>
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={styles.item}
        activeOpacity={0.8}>
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
