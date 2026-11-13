import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useRoute } from "@react-navigation/native";

import { getCompleteSwadharmaReport, getAiInsights } from "../../services/api";

interface SwadharmaReportRouteParams {
  userId?: number;
}

const SwadharmaReportScreen = () => {
  const route = useRoute<any>();

  const userId = route.params?.userId;

  const [report, setReport] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [aiInsights, setAiInsights] = useState<any>(null);

  const [aiCoverage, setAiCoverage] = useState<Record<string, boolean>>({});

  const [aiLoading, setAiLoading] = useState(false);

  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    loadReport();
  }, [userId]);

  const loadAiAnalysis = async () => {
    if (!userId) {
      setAiError("Unable to identify the logged-in user.");
      return;
    }

    try {
      setAiLoading(true);
      setAiError(null);

      const response = await getAiInsights(userId);

      if (response?.success && response?.insights) {
        setAiInsights(response.insights);
        setAiCoverage(response.sourceCoverage || {});
      } else {
        throw new Error("AI analysis could not be generated.");
      }
    } catch (err) {
      console.error("Swadharma AI report error:", err);
      setAiError(
        "Unable to generate the AI Final Analysis Report. Please check your connection and AI configuration, then try again.",
      );
    } finally {
      setAiLoading(false);
    }
  };

  const loadReport = async () => {
    if (!userId) {
      setError("Unable to identify the logged-in user.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getCompleteSwadharmaReport(userId);

      if (response?.success && response?.report) {
        setReport(response.report);
        // Generate the AI report independently so an AI error does not hide
        // the participant's already-saved assessment results.
        void loadAiAnalysis();
      } else {
        throw new Error("Complete report could not be loaded.");
      }
    } catch (err) {
      console.error("Complete Report Error:", err);
      setError("Unable to load complete report.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#E88A3D" />

        <Text style={styles.loadingText}>Loading your complete report...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No report available.</Text>
      </View>
    );
  }

  const horoscope = report.horoscope;

  const dosha = report.dosha;

  const guna = report.guna;

  const personality = report.personality;

  const johari = report.johari;

  const familyFeedback = report.familyFeedback;

  const missingSources = Object.entries(aiCoverage)
    .filter(([, available]) => !available)
    .map(([source]) => source.replace(/([A-Z])/g, " $1"));

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Page Title */}

      <Text style={styles.title}>Complete Swadharma Report</Text>

      <Text style={styles.subtitle}>
        Your complete assessment results and personalized recommendations
      </Text>

      {/* ====================================== */}
      {/* AI FINAL ANALYSIS REPORT */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>AI Final Analysis Report</Text>

        <Text style={styles.aiIntro}>
          Recommendations are generated from the saved assessment data available
          for this participant.
        </Text>

        {aiLoading ? (
          <View style={styles.aiLoadingRow}>
            <ActivityIndicator size="small" color="#E88A3D" />
            <Text style={styles.emptyText}>
              Analysing assessments and preparing career recommendations...
            </Text>
          </View>
        ) : null}

        {aiError ? (
          <>
            <Text style={styles.errorText}>{aiError}</Text>
            <TouchableOpacity
              style={styles.aiButton}
              onPress={loadAiAnalysis}
              activeOpacity={0.8}
            >
              <Text style={styles.aiButtonText}>Try AI Analysis Again</Text>
            </TouchableOpacity>
          </>
        ) : null}

        {aiInsights ? (
          <>
            <Text style={styles.subSectionTitle}>Overall Analysis</Text>
            <Text style={styles.aiBody}>
              {aiInsights.summary || "Not available."}
            </Text>

            <Text style={styles.subSectionTitle}>Key Strengths</Text>
            <StringList
              items={aiInsights.strengths}
              emptyText="No strengths were identified from the available data."
            />

            <Text style={styles.subSectionTitle}>
              Personality and Interests
            </Text>
            <Text style={styles.aiBody}>
              {aiInsights.personalityInsights || "Not available."}
            </Text>
            <Text style={styles.aiBody}>
              {aiInsights.interestsInsights ||
                "Interest details are not available yet."}
            </Text>

            <Text style={styles.subSectionTitle}>Work Style</Text>
            <Text style={styles.aiBody}>
              {aiInsights.workStyle || "Not available."}
            </Text>

            <Text style={styles.subSectionTitle}>
              Dosha and Guna Reflection
            </Text>
            <Text style={styles.aiBody}>
              {aiInsights.doshaInsights || "Dosha insights are not available."}
            </Text>
            <Text style={styles.aiBody}>
              {aiInsights.gunaInsights || "Guna insights are not available."}
            </Text>

            <Text style={styles.subSectionTitle}>Horoscope Reflection</Text>
            <Text style={styles.aiBody}>
              {aiInsights.horoscopeInsights ||
                "Horoscope insights are not available."}
            </Text>

            <Text style={styles.subSectionTitle}>Johari Feedback Insights</Text>
            <Text style={styles.aiBody}>
              {aiInsights.johariInsights ||
                "Johari feedback insights are not available."}
            </Text>

            <Text style={styles.subSectionTitle}>Family Feedback Insights</Text>
            <Text style={styles.aiBody}>
              {aiInsights.familyFeedbackInsights ||
                "Family feedback insights are not available."}
            </Text>

            <Text style={styles.subSectionTitle}>
              Recommended Professions and Paths
            </Text>
            {Array.isArray(aiInsights.careerRecommendations) &&
            aiInsights.careerRecommendations.length > 0 ? (
              aiInsights.careerRecommendations.map(
                (recommendation: any, index: number) => (
                  <View
                    key={`${recommendation.profession || "career"}-${index}`}
                    style={styles.recommendationCard}
                  >
                    <Text style={styles.recommendationTitle}>
                      {index + 1}.{" "}
                      {recommendation.profession || "Career direction"}
                    </Text>
                    <Text style={styles.aiBody}>
                      {recommendation.whyItMayFit || "Reasoning not provided."}
                    </Text>

                    <Text style={styles.recommendationLabel}>
                      Evidence from assessments
                    </Text>
                    <StringList
                      items={recommendation.supportingEvidence}
                      emptyText="No specific supporting evidence was returned."
                    />

                    <Text style={styles.recommendationLabel}>
                      Skills to develop
                    </Text>
                    <StringList
                      items={recommendation.skillsToDevelop}
                      emptyText="No skill suggestions available."
                    />

                    <Text style={styles.recommendationLabel}>
                      Suggested first steps
                    </Text>
                    <StringList
                      items={recommendation.firstSteps}
                      emptyText="No first steps available."
                    />
                  </View>
                ),
              )
            ) : (
              <StringList
                items={aiInsights.careerDirections}
                emptyText="Career recommendations are not available yet."
              />
            )}

            <Text style={styles.subSectionTitle}>Growth Areas</Text>
            <StringList
              items={aiInsights.growthAreas}
              emptyText="No growth areas were identified from the available data."
            />

            <Text style={styles.subSectionTitle}>Skill Development Plan</Text>
            <StringList
              items={aiInsights.skillDevelopmentPlan}
              emptyText="A skill development plan is not available yet."
            />

            <Text style={styles.subSectionTitle}>Overall Guidance</Text>
            <Text style={styles.aiBody}>
              {aiInsights.overallGuidance || "Not available."}
            </Text>

            {missingSources.length > 0 ? (
              <Text style={styles.coverageNote}>
                Some inputs were missing or incomplete:{" "}
                {missingSources.join(", ")}. Recommendations are preliminary and
                should be reviewed alongside the participant's interests,
                education, skills, and choices.
              </Text>
            ) : null}

            {Array.isArray(aiInsights.limitations) &&
            aiInsights.limitations.length > 0 ? (
              <>
                <Text style={styles.subSectionTitle}>
                  Notes and Limitations
                </Text>
                <StringList items={aiInsights.limitations} emptyText="" />
              </>
            ) : null}

            <TouchableOpacity
              style={[styles.aiButton, aiLoading && styles.aiButtonDisabled]}
              onPress={loadAiAnalysis}
              disabled={aiLoading}
              activeOpacity={0.8}
            >
              <Text style={styles.aiButtonText}>
                {aiLoading ? "Generating..." : "Regenerate Final Analysis"}
              </Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>

      {/* ====================================== */}
      {/* HOROSCOPE */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Horoscope</Text>

        {horoscope ? (
          <>
            <ReportRow label="Date of Birth" value={horoscope.dateOfBirth} />

            <ReportRow label="Time of Birth" value={horoscope.timeOfBirth} />

            <ReportRow label="Place of Birth" value={horoscope.placeOfBirth} />

            <ReportRow label="Status" value={horoscope.horoscopeStatus} />

            {/* Horoscope Data */}

            {horoscope.horoscopeData ? (
              <View style={styles.nestedContainer}>
                <Text style={styles.subSectionTitle}>Horoscope Details</Text>

                <ResultObject data={horoscope.horoscopeData} />
              </View>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyText}>Horoscope not available.</Text>
        )}
      </View>

      {/* ====================================== */}
      {/* DOSHA */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dosha Assessment</Text>

        {dosha ? (
          <>
            <ReportRow label="Status" value={dosha.status} />

            {dosha.result ? (
              <ResultObject data={dosha.result} />
            ) : (
              <Text style={styles.emptyText}>Dosha result not available.</Text>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Dosha assessment not completed.</Text>
        )}
      </View>

      {/* ====================================== */}
      {/* GUNA */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Guna Assessment</Text>

        {guna ? (
          <>
            <ReportRow label="Status" value={guna.status} />

            {guna.result ? (
              <ResultObject data={guna.result} />
            ) : (
              <Text style={styles.emptyText}>Guna result not available.</Text>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>Guna assessment not completed.</Text>
        )}
      </View>

      {/* ====================================== */}
      {/* PERSONALITY */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personality & Interest</Text>

        {personality ? (
          <>
            <ReportRow label="Status" value={personality.status} />

            {personality.result ? (
              <ResultObject data={personality.result} />
            ) : (
              <Text style={styles.emptyText}>
                Personality result not available.
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Personality assessment not completed.
          </Text>
        )}
      </View>

      {/* ====================================== */}
      {/* JOHARI WINDOW */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Johari Window</Text>
        {johari ? (
          <>
            <ReportRow label="Status" value={johari.status} />
            {johari.result ? <ResultObject data={johari.result} /> : null}
            {johari.answers ? (
              <View style={styles.nestedContainer}>
                <Text style={styles.subSectionTitle}>
                  Saved Self and External Feedback
                </Text>
                <ResultObject data={johari.answers} />
              </View>
            ) : null}
            {!johari.result && !johari.answers ? (
              <Text style={styles.emptyText}>
                Johari feedback has not been saved yet.
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Johari assessment has not been saved yet.
          </Text>
        )}
      </View>

      {/* ====================================== */}
      {/* FAMILY FEEDBACK */}
      {/* ====================================== */}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Family Feedback</Text>
        {familyFeedback ? (
          <>
            <ReportRow label="Status" value={familyFeedback.status} />
            {familyFeedback.result ? (
              <ResultObject data={familyFeedback.result} />
            ) : null}
            {familyFeedback.answers ? (
              <View style={styles.nestedContainer}>
                <Text style={styles.subSectionTitle}>Submitted Feedback</Text>
                <ResultObject data={familyFeedback.answers} />
              </View>
            ) : null}
            {!familyFeedback.result && !familyFeedback.answers ? (
              <Text style={styles.emptyText}>
                Family feedback has not been submitted yet.
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.emptyText}>
            Family feedback has not been submitted yet.
          </Text>
        )}
      </View>

      {/* ====================================== */}
      {/* DOWNLOAD REPORT */}
      {/* ====================================== */}

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => {
          console.log("Download Report pressed");
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.downloadButtonText}>Download Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const StringList = ({
  items,
  emptyText,
}: {
  items?: unknown;
  emptyText: string;
}) => {
  if (!Array.isArray(items) || items.length === 0) {
    return emptyText ? <Text style={styles.emptyText}>{emptyText}</Text> : null;
  }

  return (
    <View style={styles.stringList}>
      {items.map((item, index) => (
        <View key={`${String(item)}-${index}`} style={styles.stringListRow}>
          <Text style={styles.listBullet}>•</Text>
          <Text style={styles.aiBody}>
            {typeof item === "string" ? item : JSON.stringify(item)}
          </Text>
        </View>
      ))}
    </View>
  );
};

/* ========================================== */
/* REPORT ROW */
/* ========================================== */

const ReportRow = ({ label, value }: { label: string; value: any }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>
        {value !== null && value !== undefined && value !== ""
          ? String(value)
          : "-"}
      </Text>
    </View>
  );
};

/* ========================================== */
/* RESULT OBJECT */
/* ========================================== */

const ResultObject = ({ data }: { data: any }) => {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data !== "object") {
    return <ReportRow label="" value={String(data)} />;
  }

  if (Array.isArray(data)) {
    return (
      <View>
        {data.map((item, index) => (
          <View key={index} style={styles.arrayItem}>
            {typeof item === "object" ? (
              <ResultObject data={item} />
            ) : (
              <Text style={styles.arrayText}>• {String(item)}</Text>
            )}
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {Object.entries(data).map(([key, value]) => {
        if (value === null || value === undefined) {
          return null;
        }

        if (typeof value === "object") {
          return (
            <View key={key} style={styles.nestedContainer}>
              <Text style={styles.subSectionTitle}>{formatLabel(key)}</Text>

              <ResultObject data={value} />
            </View>
          );
        }

        return (
          <ReportRow key={key} label={formatLabel(key)} value={String(value)} />
        );
      })}
    </View>
  );
};

/* ========================================== */
/* FORMAT LABEL */
/* ========================================== */

const formatLabel = (value: string) => {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
};

export default SwadharmaReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F3",
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#FFF9F3",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#6B625C",
    textAlign: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#B54A3A",
    textAlign: "center",
  },

  title: {
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '900',
    color: '#30251F',
    marginBottom: 8,
  },

   subtitle: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '600',
    color: '#514239',
    marginBottom: 24,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F2D8C4",
    elevation: 2,
    shadowColor: "#D8752C",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },

 sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '900',
    color: '#B94D08',
    marginBottom: 18,
    includeFontPadding: true,
  },

    subSectionTitle: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '900',
    color: '#A84408',
    marginTop: 16,
    marginBottom: 10,
    includeFontPadding: true,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#F5EAE2",
  },

  label: {
    flex: 1,
    fontSize: 14,
    color: "#766A62",
    fontWeight: "600",
    marginRight: 10,
  },

  value: {
    flex: 1,
    fontSize: 15,
    color: "#3D3028",
    fontWeight: "700",
    textAlign: "right",
  },

  nestedContainer: {
    marginTop: 8,
    marginBottom: 5,
  },

  arrayItem: {
    marginBottom: 6,
  },

   arrayText: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '600',
    color: '#30251F',
    includeFontPadding: true,
  },
 
  emptyText: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: '600',
    color: '#514239',
    includeFontPadding: true,
  },

  aiIntro: {
    fontSize: 14,
    lineHeight: 21,
    color: "#766A62",
    marginBottom: 12,
  },

   aiBody: {
    fontSize: 17,
    lineHeight: 28,
    fontWeight: '600',
    color: '#30251F',
    marginBottom: 12,
    includeFontPadding: true,
  },

  aiLoadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },

  stringList: {
    marginBottom: 8,
  },

  stringListRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },

  listBullet: {
    fontSize: 16,
    lineHeight: 22,
    color: "#E36F1E",
    marginRight: 8,
  },

   recommendationCard: {
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#E8C7AD',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  recommendationTitle: {
    fontSize: 21,
    lineHeight: 30,
    fontWeight: '900',
    color: '#281E18',
    marginBottom: 12,
    includeFontPadding: true,
  },
  recommendationLabel: {
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '900',
    color: '#963D08',
    marginTop: 12,
    marginBottom: 8,
    includeFontPadding: true,
  },

  coverageNote: {
    fontSize: 13,
    lineHeight: 19,
    color: "#766A62",
    backgroundColor: "#FFF1E6",
    borderRadius: 10,
    padding: 11,
    marginTop: 10,
  },

  aiButton: {
    backgroundColor: "#FFF0E3",
    borderWidth: 1,
    borderColor: "#E36F1E",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: 12,
  },

  aiButtonDisabled: {
    opacity: 0.6,
  },

  aiButtonText: {
    color: "#C75B13",
    fontSize: 14,
    fontWeight: "800",
  },

  downloadButton: {
    backgroundColor: "#FF6B00",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#D8752C",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },
});