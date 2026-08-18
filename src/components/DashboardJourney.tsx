
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';


const DashboardJourney = () => {
  const navigation = useNavigation();
  return (
    <View>

     <View style={styles.journeyCard}>

  {/* Journey Top */}
  <View style={styles.journeyTop}>

    <View style={styles.progressCircle}>
      <Text style={styles.progressText}>45%</Text>
    </View>

    <View style={styles.content}>
      <Text style={styles.title}>Your Swadharma Journey</Text>

      <Text style={styles.description}>
        Complete assessments to discover your true self
      </Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>
          Continue Journey →
        </Text>
      </TouchableOpacity>
    </View>

  </View>

  {/* Progress Bar */}
  <View style={styles.progressBackground}>
    <View style={styles.progressFill} />
  </View>

  {/* Assessment Header */}
  <View style={styles.assessmentHeader}>
    <Text style={styles.assessmentTitle}>
      Your Assessments
    </Text>

    <TouchableOpacity>
      <Text style={styles.viewAll}>
        View All
      </Text>
    </TouchableOpacity>
  </View>

</View>
{/* Assessment Cards */}
<View style={styles.assessmentGrid}>

  {/* Horoscope */}
 <TouchableOpacity
  style={styles.assessmentCard}
  onPress={() => navigation.navigate('BirthDetails')}
>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/horoscope.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Horoscope
      </Text>

      <Text style={styles.cardSubtitle}>
        Birth details & horoscope
      </Text>

      <View style={styles.completedBadge}>
        <Text style={styles.completedText}>
          Completed
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>

  {/* Dosha */}
  {/* Dosha */}
<TouchableOpacity style={styles.assessmentCard}>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/dosha.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Dosha Assessment
      </Text>

      <Text style={styles.cardSubtitle}>
        Vata, Pitta, Kapha analysis
      </Text>

      <View style={styles.progressBadge}>
        <Text style={styles.progressTextBadge}>
          In Progress
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>

  {/* Guna */}
 
<TouchableOpacity style={styles.assessmentCard}>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/guna.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Guna Assessment
      </Text>

      <Text style={styles.cardSubtitle}>
        Sattva, Rajas, Tamas analysis
      </Text>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingText}>
          Not Started
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>

  {/* Personality */}
  <TouchableOpacity style={styles.assessmentCard}>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/personality.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Personality Test
      </Text>

      <Text style={styles.cardSubtitle}>
        Personality & interest mapping
      </Text>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingText}>
          Not Started
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>
{/* Johari Window */}
<TouchableOpacity style={styles.assessmentCard}>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/johari-window.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Johari Window
      </Text>

      <Text style={styles.cardSubtitle}>
        Self & peer awareness assessment
      </Text>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingText}>
          Not Started
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>
{/* Family Feedback */}
<TouchableOpacity style={styles.assessmentCard}>

  <View style={styles.cardRow}>

    <Image
      source={require('../assets/images/family-feedbck.png')}
      style={styles.cardIcon}
    />

    <View style={styles.cardContent}>

      <Text style={styles.cardTitle}>
        Family Feedback
      </Text>

      <Text style={styles.cardSubtitle}>
        Feedback from family members
      </Text>

      <View style={styles.pendingBadge}>
        <Text style={styles.pendingText}>
          Not Started
        </Text>
      </View>

    </View>

  </View>

</TouchableOpacity>

</View>

    </View>

  );
};

export default DashboardJourney;

const styles = StyleSheet.create({

  journeyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
   
    elevation: 3,
  },

  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
  },

  content: {
    flex: 1,
    marginLeft: 18,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#202020',
  },

  description: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },

  button: {
    marginTop: 16,
    backgroundColor: '#FF6B00',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },

  progressBackground: {
  height: 6,
  backgroundColor: '#F4D7C6',
  borderRadius: 10,
  marginTop: 18,
},

  progressFill: {
    width: '45%',
    height: '100%',
    backgroundColor: '#FF6B00',
    borderRadius: 10,
  },

  assessmentHeader: {
    marginTop: 28,
   
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  assessmentTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#202020',
  },

  viewAll: {
    color: '#FF6B00',
    fontWeight: '800',
    fontSize: 14,

  },
  journeyTop: {
  flexDirection: 'row',
  alignItems: 'center',
},
assessmentGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 15,
},

assessmentCard: {
  width: '48%',
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 12,
  marginBottom: 12,
  elevation: 3,
  minHeight: 135,
},


cardIcon: {
  width: 36,
  height: 36,
  resizeMode: 'contain',
  marginRight: 10,
},

cardTitle: {
  fontSize: 15,
  fontWeight: '800',
  color: '#202020',
},
cardSubtitle: {
  marginTop: 3,
  fontSize: 14,
  fontWeight: '700',
  color: '#666',
  lineHeight: 15,
},

completedBadge: {
  marginTop: 8,
  backgroundColor: '#E8F5E9',
  paddingVertical: 3,
  paddingHorizontal: 8,
  borderRadius: 14,
  alignSelf: 'flex-start',
},
completedText: {
  color: '#2E7D32',
  fontWeight: '700',
  fontSize: 12,
},

progressBadge: {
  marginTop: 8,
  backgroundColor: '#FFF3E0',
  paddingVertical: 3,
  paddingHorizontal: 8,
  borderRadius: 14,
  alignSelf: 'flex-start',
},


progressTextBadge: {
  color: '#EF6C00',
  fontWeight: '700',
  fontSize: 12,
},

pendingBadge: {
  marginTop: 8,
  backgroundColor: '#FBE9E7',
  paddingVertical: 3,
  paddingHorizontal: 8,
  borderRadius: 14,
  alignSelf: 'flex-start',
},

pendingText: {
  color: '#D84315',
  fontWeight: '700',
  fontSize: 12,
},
cardRow: {
  flexDirection: 'row',
  alignItems: 'flex-start',
},

cardContent: {
  flex: 1,
},
});