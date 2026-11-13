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

import {useNavigation, useRoute} from '@react-navigation/native';


// ======================================================
// GUNA RESULT SCREEN
// ======================================================

const GunaResultScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();

  // ====================================================
  // GET RESULT FROM QUESTIONS SCREEN
  // ====================================================

  const gunaResult = route.params?.gunaResult;

  // ====================================================
  // RAW SCORES
  // 15 QUESTIONS × 10 = 150 MAXIMUM PER GUNA
  // ====================================================

  const rawScores = gunaResult?.rawScores ?? {
    sattva: gunaResult?.sattva ?? 0,
    rajas: gunaResult?.rajas ?? 0,
    tamas: gunaResult?.tamas ?? 0,
  };

  const sattvaRaw = Number(rawScores.sattva ?? 0);
  const rajasRaw = Number(rawScores.rajas ?? 0);
  const tamasRaw = Number(rawScores.tamas ?? 0);

  const totalScore = sattvaRaw + rajasRaw + tamasRaw;

  // Percentage is the share of the combined Guna score.
  // This matches the 45-question workbook approach:
  // Guna score ÷ total score × 100.
  const calculatePercentage = (score: number) => {
    if (totalScore === 0) {
      return 0;
    }

    return Number(((score / totalScore) * 100).toFixed(2));
  };

  const sattva = calculatePercentage(sattvaRaw);
  const rajas = calculatePercentage(rajasRaw);
  const tamas = calculatePercentage(tamasRaw);

  const scores = [
    {
      key: 'Sattva',
      score: sattvaRaw,
      percentage: sattva,
      description: 'Clarity, balance, peace and awareness',
      progressStyle: styles.sattvaProgress,
    },
    {
      key: 'Rajas',
      score: rajasRaw,
      percentage: rajas,
      description: 'Activity, ambition, drive and action',
      progressStyle: styles.rajasProgress,
    },
    {
      key: 'Tamas',
      score: tamasRaw,
      percentage: tamas,
      description: 'Rest, comfort, inactivity and resistance to action',
      progressStyle: styles.tamasProgress,
    },
  ];

  const rankedScores = [...scores].sort(
    (a, b) => b.score - a.score,
  );

  const primaryGuna =
    rankedScores[0]?.key ??
    gunaResult?.primaryGuna ??
    'Sattva';

  const primaryPercentage =
    rankedScores[0]?.percentage ??
    Number(gunaResult?.primaryPercentage ?? 0);

  // ====================================================
  // CONTINUE TO DASHBOARD
  // ====================================================

  const handleContinue = () => {
    navigation.navigate('Dashboard' as never);
  };

  // ====================================================
  // GUNA DESCRIPTION
  // ====================================================

  const getDescription = (guna: string) => {
    switch (guna) {
      case 'Sattva':
        return 'Your responses show stronger qualities of clarity, balance, peace and awareness.';

      case 'Rajas':
        return 'Your responses show stronger qualities of activity, ambition, drive and action.';

      case 'Tamas':
        return 'Your responses show stronger qualities of rest, comfort, inactivity and resistance to action.';

      default:
        return 'Your Guna assessment has been completed.';
    }
  };

  // ====================================================
  // UI
  // ====================================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>

            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color="#FF5A00"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Guna Result
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* ========================================= */}
        {/* SUCCESS */}
        {/* ========================================= */}

        <View style={styles.successCircle}>
          <MaterialCommunityIcons
            name="check"
            size={42}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>
          Your Guna Profile
        </Text>

        <Text style={styles.subtitle}>
          Your 45-question assessment has been completed successfully.
        </Text>

        {/* ========================================= */}
        {/* PRIMARY GUNA CARD */}
        {/* ========================================= */}

        <View style={styles.primaryCard}>
          <Text style={styles.primaryLabel}>
            Your Dominant Guna
          </Text>

          <Text style={styles.primaryGuna}>
            {primaryGuna}
          </Text>

          <Text style={styles.primaryPercentage}>
            {primaryPercentage.toFixed(2)}%
          </Text>

          <Text style={styles.primaryScore}>
            Score: {rankedScores[0]?.score ?? 0} / 150
          </Text>

          <Text style={styles.primaryDescription}>
            {getDescription(primaryGuna)}
          </Text>
        </View>

        {/* ========================================= */}
        {/* RESULT SUMMARY */}
        {/* ========================================= */}

        <Text style={styles.sectionTitle}>
          Your Guna Scores
        </Text>

        <Text style={styles.sectionSubtitle}>
          Each Guna is based on 15 questions, with a maximum score of 150.
          The percentage shows its share of your combined score.
        </Text>

        {/* ========================================= */}
        {/* SCORE CARDS */}
        {/* ========================================= */}

        {scores.map((item, index) => (
          <View style={styles.scoreCard} key={item.key}>
            <View style={styles.scoreHeader}>
              <View style={styles.nameBlock}>
                <View style={styles.nameRow}>
                  <Text style={styles.gunaName}>
                    {item.key}
                  </Text>

                  {index === 0 && item.score > 0 ? (
                    <View style={styles.dominantBadge}>
                      <Text style={styles.dominantBadgeText}>
                        Dominant
                      </Text>
                    </View>
                  ) : null}
                </View>

                <Text style={styles.scoreValue}>
                  {item.percentage.toFixed(2)}%
                </Text>
              </View>

              <Text style={styles.rawScore}>
                {item.score} / 150
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  item.progressStyle,
                  {
                    // Progress represents the actual score out of 150.
                    width: `${Math.min((item.score / 150) * 100, 100)}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.gunaDescription}>
              {item.description}
            </Text>
          </View>
        ))}

        {/* ========================================= */}
        {/* RANKING */}
        {/* ========================================= */}

        <Text style={styles.sectionTitle}>
          Guna Ranking
        </Text>

        <View style={styles.rankingCard}>
          {rankedScores.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.rankingRow,
                index === rankedScores.length - 1 &&
                  styles.rankingRowLast,
              ]}>

              <View style={styles.rankCircle}>
                <Text style={styles.rankText}>
                  {index + 1}
                </Text>
              </View>

              <Text style={styles.rankingName}>
                {item.key}
              </Text>

              <View style={styles.rankingScoreBlock}>
                <Text style={styles.rankingRawScore}>
                  {item.score} / 150
                </Text>

                <Text style={styles.rankingPercentage}>
                  {item.percentage.toFixed(2)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ========================================= */}
        {/* TOTAL SCORE */}
        {/* ========================================= */}

        <View style={styles.totalCard}>
          <View>
            <Text style={styles.totalLabel}>
              Combined Guna Score
            </Text>

            <Text style={styles.totalHint}>
              Sattva + Rajas + Tamas
            </Text>
          </View>

          <Text style={styles.totalValue}>
            {totalScore} / 450
          </Text>
        </View>

        {/* ========================================= */}
        {/* INFORMATION CARD */}
        {/* ========================================= */}

        <View style={styles.infoCard}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color="#FF5A00"
          />

          <Text style={styles.infoText}>
            Your Guna profile represents your current tendencies based on
            your responses. It is one part of your Swadharma journey.
            Continue with the other assessments to build a more complete
            understanding of yourself.
          </Text>
        </View>

        {/* ========================================= */}
        {/* CONTINUE */}
        {/* ========================================= */}

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}>

          <Text style={styles.continueButtonText}>
            Continue to Dashboard
          </Text>

          <MaterialCommunityIcons
            name="arrow-right"
            size={22}
            color="#FFFFFF"
          />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};


export default GunaResultScreen;

// ======================================================
// STYLES
// ======================================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        '#FFF7ED',
    },


    content: {
      padding: 20,
      paddingBottom: 40,
    },


    // ==================================================
    // HEADER
    // ==================================================

    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent:
        'space-between',
      marginBottom: 25,
    },


    backButton: {
      width: 40,
      height: 40,
      justifyContent:
        'center',
      alignItems:
        'flex-start',
    },


    headerTitle: {
      fontSize: 19,
      fontWeight: '900',
      color: '#FF5A00',
    },


    headerSpace: {
      width: 40,
    },


    // ==================================================
    // SUCCESS
    // ==================================================

    successCircle: {
      width: 82,
      height: 82,
      borderRadius: 41,

      backgroundColor:
        '#FF6B00',

      justifyContent:
        'center',

      alignItems:
        'center',

      alignSelf:
        'center',

      marginBottom: 18,

      elevation: 5,
    },


    // ==================================================
    // TITLE
    // ==================================================

    title: {
      fontSize: 26,
      fontWeight: '900',
      color: '#2B211B',
      textAlign: 'center',
    },


    subtitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#777777',
      textAlign: 'center',
      lineHeight: 21,
      marginTop: 7,
      marginBottom: 22,
    },


    // ==================================================
    // PRIMARY GUNA
    // ==================================================

    primaryCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 20,

      padding: 22,

      alignItems:
        'center',

      borderWidth: 1,

      borderColor:
        '#FFD7B0',

      elevation: 4,

      marginBottom: 25,
    },


    primaryLabel: {
      fontSize: 14,
      fontWeight: '800',
      color: '#777777',
      marginBottom: 5,
    },


    primaryGuna: {
      fontSize: 30,
      fontWeight: '900',
      color: '#FF5A00',
    },


    primaryPercentage: {
      fontSize: 22,
      fontWeight: '900',
      color: '#2B211B',
      marginTop: 2,
    },


    primaryDescription: {
      fontSize: 14,
      lineHeight: 21,
      fontWeight: '600',
      color: '#666666',
      textAlign: 'center',
      marginTop: 10,
    },


    // ==================================================
    // SECTION
    // ==================================================

    sectionTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: '#2B211B',
      marginBottom: 12,
    },


    // ==================================================
    // SCORE CARD
    // ==================================================

    scoreCard: {
      backgroundColor:
        '#FFFFFF',

      borderRadius: 18,

      padding: 18,

      marginBottom: 13,

      borderWidth: 1,

      borderColor:
        '#FFE0C2',

      elevation: 3,
    },


    scoreHeader: {
      flexDirection: 'row',
      justifyContent:
        'space-between',
      alignItems:
        'center',
      marginBottom: 10,
    },


    gunaName: {
      fontSize: 18,
      fontWeight: '900',
      color: '#2B211B',
    },


    scoreValue: {
      fontSize: 17,
      fontWeight: '900',
      color: '#FF5A00',
      marginTop: 2,
    },


    rawScore: {
      fontSize: 13,
      fontWeight: '700',
      color: '#888888',
    },


    primaryScore: {
      fontSize: 14,
      fontWeight: '800',
      color: '#777777',
      marginTop: 4,
    },

    sectionSubtitle: {
      fontSize: 13,
      lineHeight: 20,
      fontWeight: '600',
      color: '#777777',
      marginTop: -5,
      marginBottom: 15,
    },

    nameBlock: {
      flex: 1,
    },

    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },

    dominantBadge: {
      marginLeft: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: '#FFF0DD',
    },

    dominantBadgeText: {
      fontSize: 10,
      fontWeight: '900',
      color: '#FF5A00',
    },

    rankingCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 18,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#FFE0C2',
      elevation: 3,
      marginBottom: 15,
    },

    rankingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#F3E4D7',
    },

    rankingRowLast: {
      borderBottomWidth: 0,
    },

    rankCircle: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FFF0DD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },

    rankText: {
      fontSize: 14,
      fontWeight: '900',
      color: '#FF5A00',
    },

    rankingName: {
      flex: 1,
      fontSize: 16,
      fontWeight: '900',
      color: '#2B211B',
    },

    rankingScoreBlock: {
      alignItems: 'flex-end',
    },

    rankingRawScore: {
      fontSize: 13,
      fontWeight: '800',
      color: '#555555',
    },

    rankingPercentage: {
      fontSize: 12,
      fontWeight: '800',
      color: '#FF5A00',
      marginTop: 2,
    },

    totalCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 17,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: '#FFD7B0',
      marginBottom: 20,
    },

    totalLabel: {
      fontSize: 15,
      fontWeight: '900',
      color: '#2B211B',
    },

    totalHint: {
      fontSize: 12,
      fontWeight: '600',
      color: '#888888',
      marginTop: 3,
    },

    totalValue: {
      fontSize: 18,
      fontWeight: '900',
      color: '#FF5A00',
    },

    // ==================================================
    // PROGRESS BAR
    // ==================================================

    progressBackground: {
      height: 10,

      backgroundColor:
        '#FFE8D6',

      borderRadius: 10,

      overflow: 'hidden',
    },


    sattvaProgress: {
      height: '100%',

      backgroundColor:
        '#FF8A3D',

      borderRadius: 10,
    },


    rajasProgress: {
      height: '100%',

      backgroundColor:
        '#FF6B00',

      borderRadius: 10,
    },


    tamasProgress: {
      height: '100%',

      backgroundColor:
        '#D95F02',

      borderRadius: 10,
    },


    gunaDescription: {
      fontSize: 13,

      fontWeight: '600',

      color: '#777777',

      marginTop: 9,
    },


    // ==================================================
    // INFORMATION
    // ==================================================

    infoCard: {
      backgroundColor:
        '#FFF0DD',

      borderRadius: 16,

      padding: 16,

      flexDirection: 'row',

      alignItems:
        'flex-start',

      marginTop: 5,

      marginBottom: 22,

      borderWidth: 1,

      borderColor:
        '#FFD7B0',
    },


    infoText: {
      flex: 1,

      marginLeft: 10,

      fontSize: 13,

      lineHeight: 20,

      fontWeight: '600',

      color: '#5C4A3F',
    },


    // ==================================================
    // CONTINUE
    // ==================================================

    continueButton: {
      height: 56,

      borderRadius: 15,

      backgroundColor:
        '#FF5A00',

      flexDirection: 'row',

      justifyContent:
        'center',

      alignItems:
        'center',

      elevation: 4,
    },


    continueButtonText: {
      color: '#FFFFFF',

      fontSize: 16,

      fontWeight: '900',

      marginRight: 8,
    },

  });