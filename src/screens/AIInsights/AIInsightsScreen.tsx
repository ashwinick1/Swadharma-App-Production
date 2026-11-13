import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  useRoute,
} from '@react-navigation/native';

import {getAiInsights} from '../../services/api';

type AIInsights = {
  summary: string;
  strengths: string[];
  personalityInsights: string;
  workStyle: string;
  gunaInsights: string;
  doshaInsights: string;
  horoscopeInsights: string;
  careerDirections: string[];
  potentialRoles: string[];
  growthAreas: string[];
  overallGuidance: string;
};

interface AIInsightsRouteParams {
  userId?: number;
}

const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    if (
      part.startsWith('**') &&
      part.endsWith('**')
    ) {
      return (
        <Text
          key={index}
          style={styles.boldText}>
          {part.slice(2, -2)}
        </Text>
      );
    }

    return (
      <Text key={index}>
        {part}
      </Text>
    );
  });
};

const AIInsightsScreen = () => {
  const route = useRoute<any>();

  const userId =
    route.params?.userId;

  const [insights, setInsights] =
    useState<AIInsights | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [userId]);

  const loadInsights = async () => {
    if (!userId) {
      console.log(
        'AI Insights: userId is missing',
      );

      setError(
        'Unable to identify the logged-in user.',
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log(
        'Loading AI insights for userId:',
        userId,
      );

      const response =
        await getAiInsights(userId);

      console.log(
        'AI Insights Response:',
        response,
      );

      if (
        response?.success &&
        response?.insights
      ) {
        setInsights(
          response.insights,
        );
      } else {
        throw new Error(
          'AI insights could not be loaded.',
        );
      }
    } catch (err) {
      console.error(
        'AI Insights Error:',
        err,
      );

      setError(
        'Unable to load AI insights. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={
          styles.centerContainer
        }>
        <ActivityIndicator
          size="large"
          color="#E88A3D"
        />

        <Text
          style={
            styles.loadingText
          }>
          Generating your AI insights...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={
          styles.centerContainer
        }>
        <Text
          style={
            styles.errorText
          }>
          {error}
        </Text>
      </View>
    );
  }

  if (!insights) {
    return (
      <View
        style={
          styles.centerContainer
        }>
        <Text
          style={
            styles.errorText
          }>
          No insights available.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={
        styles.contentContainer
      }
      showsVerticalScrollIndicator={false}>

      {/* Page Title */}

      <Text style={styles.title}>
        AI Insights
      </Text>

      <Text style={styles.subtitle}>
        Personalized guidance based on your
        Swadharma assessments
      </Text>

      {/* Overall Profile */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Your Overall Profile
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.summary,
          )}
        </Text>
      </View>

      {/* Strengths */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Your Strengths
        </Text>

        {insights.strengths.map(
          (strength, index) => (
            <View
              key={index}
              style={
                styles.listItem
              }>
              <Text
                style={
                  styles.bullet
                }>
                •
              </Text>

              <Text
                style={
                  styles.listText
                }>
                {renderBoldText(
                  strength,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      {/* Personality */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Personality Insights
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.personalityInsights,
          )}
        </Text>
      </View>

      {/* Work Style */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Work Style
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.workStyle,
          )}
        </Text>
      </View>

      {/* Guna */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Guna Insights
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.gunaInsights,
          )}
        </Text>
      </View>

      {/* Dosha */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Dosha Insights
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.doshaInsights,
          )}
        </Text>
      </View>

      {/* Horoscope */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Horoscope Insights
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.horoscopeInsights,
          )}
        </Text>
      </View>

      {/* Career Directions */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Career Directions
        </Text>

        {insights.careerDirections.map(
          (career, index) => (
            <View
              key={index}
              style={
                styles.listItem
              }>
              <Text
                style={
                  styles.bullet
                }>
                •
              </Text>

              <Text
                style={
                  styles.listText
                }>
                {renderBoldText(
                  career,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      {/* Potential Roles */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Potential Roles
        </Text>

        {insights.potentialRoles.map(
          (role, index) => (
            <View
              key={index}
              style={
                styles.listItem
              }>
              <Text
                style={
                  styles.bullet
                }>
                •
              </Text>

              <Text
                style={
                  styles.listText
                }>
                {renderBoldText(
                  role,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      {/* Growth Areas */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Growth Areas
        </Text>

        {insights.growthAreas.map(
          (area, index) => (
            <View
              key={index}
              style={
                styles.listItem
              }>
              <Text
                style={
                  styles.bullet
                }>
                •
              </Text>

              <Text
                style={
                  styles.listText
                }>
                {renderBoldText(
                  area,
                )}
              </Text>
            </View>
          ),
        )}
      </View>

      {/* Overall Guidance */}

      <View style={styles.card}>
        <Text
          style={
            styles.sectionTitle
          }>
          Overall Guidance
        </Text>

        <Text
          style={
            styles.description
          }>
          {renderBoldText(
            insights.overallGuidance,
          )}
        </Text>
      </View>

    </ScrollView>
  );
};

export default AIInsightsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F3',
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#FFF9F3',
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#6B625C',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    color: '#B54A3A',
    textAlign: 'center',
  },

  title: {
    fontSize: 29,
    fontWeight: '900',
    color: '#3D3028',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 16,
    color: '#766A62',
    lineHeight: 21,
    marginBottom: 22,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F2D8C4',
    elevation: 2,
    shadowColor: '#D8752C',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    color: '#E36F1E',
    marginBottom: 12,
  },

  description: {
    fontSize: 16,
    lineHeight: 23,
    color: '#514842',
    fontWeight: '700',
  },

  boldText: {
    fontWeight: '800',
    color: '#D85F12',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 11,
  },

  bullet: {
    fontSize: 17,
    color: '#E88A3D',
    marginRight: 9,
    lineHeight: 22,
  },

  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#514842',
    fontWeight: '600',
  },
});