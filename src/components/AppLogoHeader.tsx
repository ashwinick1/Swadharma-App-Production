import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const AppLogoHeader = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  alignItems: 'center',
},

  logo: {
    width: 300,
    height: 180,
    resizeMode: 'contain',
  },
});

export default AppLogoHeader;