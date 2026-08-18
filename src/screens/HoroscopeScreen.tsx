import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const HoroscopeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Birth Details & Horoscope</Text>
    </View>
  );
};

export default HoroscopeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F2',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FF6B00',
  },
});