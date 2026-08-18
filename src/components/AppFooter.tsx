import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const AppFooter = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/footer.png')}
        style={styles.footerImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  footerImage: {
    width: '100%',
    height: 260,
    resizeMode: 'cover',
  },
});

export default AppFooter;