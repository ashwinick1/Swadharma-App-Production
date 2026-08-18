import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  ImageBackground,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation<any>();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    loadApp();
  }, []);

  const loadApp = async () => {
    // Loading Dot 1
    setProgress(1);

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Loading Dot 2
    setProgress(2);

    const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Loading Dot 3
    setProgress(3);

    await new Promise(resolve => setTimeout(resolve, 1200));

    // Loading Dot 4
    setProgress(4);

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (isLoggedIn === 'true') {
      navigation.replace('Dashboard');
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor="#FFF9F4"
        barStyle="dark-content"
      />

      <ImageBackground
        source={require('../assets/images/swadhrma-flash.png')}
        style={styles.background}
        resizeMode="cover">

        <View style={styles.loaderContainer}>
          {[1, 2, 3, 4].map(item => (
            <View
              key={item}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    progress >= item ? '#FF7A00' : '#FFFFFF',
                },
              ]}
            />
          ))}
        </View>

      </ImageBackground>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  loaderContainer: {
    flexDirection: 'row',
    marginBottom: 35,
  },

  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#FF7A00',
  },
});