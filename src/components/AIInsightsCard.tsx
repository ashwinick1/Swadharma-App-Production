import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

const AIInsightsCard = () => {
  return (
    <View style={styles.card}>

      {/* Header */}
      

        <View style={styles.headerText}>
          <Text style={styles.title}>AI Insights</Text>

          <Text style={styles.subtitle}>
            Personalized guidance powered by AI
          </Text>
        </View>

   

      {/* Divider */}
      <View style={styles.divider} />

      {/* Description */}
      <Text style={styles.description}>
        Complete your Swadharma assessments to unlock AI-powered insights about
        your personality, strengths, career path, relationships, and life
        purpose.
      </Text>

      {/* Button */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          View AI Insights
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default AIInsightsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FF6B00',
    borderRadius: 20,
    padding: 18,
    marginTop: 18,
    elevation: 4,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  subtitle: {
    marginTop: 3,
    color: '#FFE8D8',
    fontSize: 17,
     fontWeight: '900',
  },

  divider: {
    height: 5,
    backgroundColor: '#FFFFFF',
    marginVertical: 15,
  },

  description: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
     fontWeight: '900',
  },

  button: {
    marginTop: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FF6B00',
    fontWeight: '700',
    fontSize: 18,
  },
});