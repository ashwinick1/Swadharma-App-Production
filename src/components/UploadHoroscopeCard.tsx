import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const UploadHoroscopeCard = () => {
  return (
    <View style={styles.container}>

      <MaterialCommunityIcons
        name="cloud-upload-outline"
        size={55}
        color="#FF6B00"
      />

      

      <Text style={styles.subtitle}>
        Upload Image or PDF
      </Text>

      <Text style={styles.info}>
        JPG • PNG • PDF (Max 10 MB)
      </Text>

    </View>
  );
};

export default UploadHoroscopeCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#FF6B00',
    borderRadius: 16,
    backgroundColor: '#FFF8F2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 35,
    marginTop: 20,
  },

  title: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#666',
  },

  info: {
    marginTop: 5,
    fontSize: 13,
    color: '#999',
  },
});