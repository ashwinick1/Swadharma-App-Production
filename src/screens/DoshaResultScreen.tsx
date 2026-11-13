import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons';

import {useNavigation, useRoute} from '@react-navigation/native';

const DoshaResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // ======================================================
  // GET RESULT FROM DOSHA QUESTIONS SCREEN
  // ======================================================

  const doshaResult =
    route.params?.doshaResult;

  console.log(
    'DOSHA RESULT:',
    JSON.stringify(
      doshaResult,
      null,
      2,
    ),
  );


  const vata =
    doshaResult?.vata ?? 0;

  const pitta =
    doshaResult?.pitta ?? 0;

  const kapha =
    doshaResult?.kapha ?? 0;

  const primaryDosha =
    doshaResult?.primaryDosha ?? '-';

  const primaryPercentage =
    doshaResult?.primaryPercentage ?? 0;

 

  const getDescription = () => {
    if (primaryDosha === 'Vata') {
      return 'Vata is associated with movement, creativity, flexibility and adaptability.';
    }

    if (primaryDosha === 'Pitta') {
      return 'Pitta is associated with focus, determination, energy and transformation.';
    }

    if (primaryDosha === 'Kapha') {
      return 'Kapha is associated with stability, calmness, strength and endurance.';
    }

    return 'Your Dosha result will appear here.';
  };

 

  const renderDoshaCard = (
    name: string,
    percentage: number,
    description: string,
  ) => {
    return (
      <View style={styles.doshaCard}>

        <View style={styles.doshaHeader}>

          <Text style={styles.doshaName}>
            {name}
          </Text>

          <Text style={styles.doshaPercentage}>
            {percentage}%
          </Text>

        </View>

        {/* Progress */}

        <View
          style={
            styles.doshaProgressBackground
          }>

          <View
            style={[
              styles.doshaProgressFill,
              {
                width: `${percentage}%`,
              },
            ]}
          />

        </View>

        <Text style={styles.doshaDescription}>
          {description}
        </Text>

      </View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          styles.content
        }>

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() =>
              navigation.goBack()
            }
            style={styles.backButton}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF5A00"
            />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Dosha Result
          </Text>

          <View
            style={styles.headerSpace}
          />

        </View>


        <View style={styles.titleSection}>

          <Text style={styles.title}>
            Your Dosha Result
          </Text>

          <Text style={styles.subtitle}>
            Based on your assessment answers
          </Text>

        </View>

        {/* ================================================= */}
        {/* PRIMARY DOSHA */}
        {/* ================================================= */}

        <View
          style={styles.primaryCard}>

          <Text
            style={styles.primarySmallTitle}>
            Your Primary Dosha
          </Text>

          <Text
            style={styles.primaryDosha}>
            {primaryDosha}
          </Text>

          <Text
            style={styles.primaryPercentage}>
            {primaryPercentage}%
          </Text>

          <Text
            style={styles.primaryDescription}>
            {getDescription()}
          </Text>

        </View>

       

        <Text style={styles.sectionTitle}>
          Dosha Breakdown
        </Text>

        {/* VATA */}

        {renderDoshaCard(
          'Vata',
          vata,
          'Movement, creativity and adaptability',
        )}

        {/* PITTA */}

        {renderDoshaCard(
          'Pitta',
          pitta,
          'Focus, determination and transformation',
        )}

        {/* KAPHA */}

        {renderDoshaCard(
          'Kapha',
          kapha,
          'Stability, calmness and endurance',
        )}

      

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() =>
            navigation.navigate(
              'Dashboard' as never,
            )
          }>

          <Text
            style={styles.continueButtonText}>
            Continue to Dashboard
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={21}
            color="#FFFFFF"
          />

        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
};

export default DoshaResultScreen;


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
    marginBottom: 22,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#FF5A00',
  },

  headerSpace: {
    width: 40,
  },

  // ====================================================
  // TITLE
  // ====================================================

  titleSection: {
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#2B211B',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '900',
    color: '#777777',
    textAlign: 'center',
  },

  // ====================================================
  // PRIMARY DOSHA
  // ====================================================

  primaryCard: {
    backgroundColor: '#FF5A00',
    borderRadius: 22,
    padding: 24,
    alignItems: 'center',
    marginBottom: 25,
    elevation: 5,
  },

  primarySmallTitle: {
    color: '#FFF4EA',
    fontSize: 18,
    fontWeight: '800',
  },

  primaryDosha: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '900',
    marginTop: 8,
  },

  primaryPercentage: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },

  primaryDescription: {
    color: '#FFF4EA',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },

  // ====================================================
  // SECTION
  // ====================================================

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2B211B',
    marginBottom: 12,
  },

  // ====================================================
  // DOSHA CARD
  // ====================================================

  doshaCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 18,
  padding: 18,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#FFD7B0',
  elevation: 3,

},
  doshaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  doshaName: {
    fontSize: 19,
    fontWeight: '900',
    color: '#2B211B',
  },

  doshaPercentage: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FF5A00',
  },

  doshaProgressBackground: {
  height: 10,
  backgroundColor: '#FFE3CE',
  borderRadius: 10,
  overflow: 'hidden',
  marginTop: 12,
},

doshaProgressFill: {
  height: '100%',
  backgroundColor: '#FF5A00',
  borderRadius: 10,
},

  doshaDescription: {
    fontSize: 16,
    fontWeight: '800',
    color: '#777777',
    marginTop: 9,
  },

  // ====================================================
  // NOTE
  // ====================================================

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    backgroundColor: '#FFF0DD',

    borderRadius: 16,

    padding: 15,

    marginTop: 8,
    marginBottom: 20,
  },

  noteText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '800',
    color: '#5F5147',
    marginLeft: 10,
  },

  // ====================================================
  // CONTINUE BUTTON
  // ====================================================

  continueButton: {
    height: 55,

    backgroundColor: '#FF5A00',

    borderRadius: 14,

    flexDirection: 'row',

    justifyContent: 'center',

    alignItems: 'center',

    elevation: 4,
  },

  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginRight: 8,
  },

});