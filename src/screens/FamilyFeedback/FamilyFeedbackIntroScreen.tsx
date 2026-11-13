
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';
import {useNavigation, useRoute} from '@react-navigation/native';

const FamilyFeedbackIntroScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Get the logged-in user's ID from the previous screen.
  const userId =
    route.params?.userId ?? route.params?.participantId;

  const handleStart = () => {
    if (!userId) {
      Alert.alert(
        'User ID Missing',
        'The logged-in user ID was not passed to Family Feedback. Please check the Dashboard navigation.',
      );

      console.warn(
        'FamilyFeedbackIntroScreen: userId is missing.',
        route.params,
      );
      return;
    }

    navigation.navigate('FamilyMemberSelection', {
      userId,
      participantId: userId,
    });
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

          <Text style={styles.headerTitle}>Family Feedback</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Main */}
        <View style={styles.mainSection}>
          <Text style={styles.title}>
            Understand Yourself Through
            Your Family's Perspective
          </Text>

          <Text style={styles.description}>
            People who have known you for a long time can
            provide valuable insights into your natural
            qualities, interests, strengths and recurring
            patterns.
          </Text>
        </View>

        {/* What We Learn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What We'll Learn</Text>

          <View style={styles.item}>
            <View style={styles.checkCircle}>
              <MaterialCommunityIcons
                name="check"
                size={16}
                color="#FF5A00"
              />
            </View>
            <Text style={styles.itemText}>Your natural strengths</Text>
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
              Childhood interests and tendencies
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
              Activities you naturally enjoy
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
              Qualities your family notices
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
              Areas where you may need development
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
              Qualities you may not recognise in yourself
            </Text>
          </View>
        </View>

        {/* Important Note */}
        <View style={styles.noteCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color="#FF5A00"
          />

          <Text style={styles.noteText}>
            There are no right or wrong answers. Honest
            observations will help Swadharma build a more
            complete understanding of you.
          </Text>
        </View>

        {/* Start */}
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={handleStart}>
          <Text style={styles.startButtonText}>
            Start Family Feedback
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={21}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Your family's observations will become one of the
          evidence sources in your Swadharma profile.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FamilyFeedbackIntroScreen;

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
    marginBottom: 25,
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
    marginTop: 15,
    marginBottom: 25,
  },

  title: {
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#5A4D45',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8DDD5',
    padding: 18,
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 17,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: '#FFF0E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },

  itemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: '#4A4039',
  },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF0E3',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },

  noteText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: '#6E625A',
    marginLeft: 9,
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

  startButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginRight: 9,
  },

  bottomText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    color: '#8A7D73',
  },
});
