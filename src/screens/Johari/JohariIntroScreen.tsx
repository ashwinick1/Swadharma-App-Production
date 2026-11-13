import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

const JohariIntroScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const userId = route.params?.userId;

  const handleStart = () => {
    if (!userId) {
      console.log('Johari Intro: userId is missing');
      return;
    }

    navigation.navigate(
      'JohariSelfAssessment' as never,
      {
        userId,
      } as never,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={27}
              color="#FF5A00"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Johari Window
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Main */}
        <View style={styles.mainSection}>

          <Text style={styles.title}>
            Understand Yourself Better
          </Text>

          <Text style={styles.description}>
            Discover how you see yourself and how others
            see you through self-awareness and feedback.
          </Text>

        </View>

        {/* Discover Card */}
        <View style={styles.card}>

          <Text style={styles.cardTitle}>
            What you'll discover
          </Text>

          <View style={styles.item}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check"
                size={16}
                color="#FF5A00"
              />
            </View>

            <Text style={styles.itemText}>
              How you see yourself
            </Text>
          </View>

          <View style={styles.item}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check"
                size={16}
                color="#FF5A00"
              />
            </View>

            <Text style={styles.itemText}>
              How others see you
            </Text>
          </View>

          <View style={styles.item}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check"
                size={16}
                color="#FF5A00"
              />
            </View>

            <Text style={styles.itemText}>
              Strengths others recognise
            </Text>
          </View>

          <View style={styles.item}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check"
                size={16}
                color="#FF5A00"
              />
            </View>

            <Text style={styles.itemText}>
              Areas you may not notice yourself
            </Text>
          </View>

        </View>

        {/* Start */}
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={handleStart}>

          <Text style={styles.startText}>
            Start Assessment
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={22}
            color="#FFFFFF"
          />

        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Answer honestly. There are no right or wrong answers.
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

export default JohariIntroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF7ED',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FF5A00',
  },

  headerSpace: {
    width: 40,
  },

  mainSection: {
    marginBottom: 25,
    marginTop: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2B211B',
    lineHeight: 34,
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    color: '#6E625A',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E8DDD5',
    marginBottom: 22,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 15,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },

  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#FFF0DD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  itemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4039',
  },

  startButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#FF5A00',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },

  startText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 8,
  },

  bottomText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '800',
    color: '#8A7D73',
  },
});