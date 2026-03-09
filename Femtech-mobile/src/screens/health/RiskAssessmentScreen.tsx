import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { riskApi } from '../../api';

interface RiskAnalysis {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  riskFactors: string[];
  gestationalWeeks: number | null;
  summary: string;
  recommendations: string[];
  warningSignsToWatch: string[];
  nextSteps: string[];
}

export default function RiskAssessmentScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = createStyles(colors, isDark);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setError(null);
      const data = await riskApi.getAnalysis();
      setAnalysis(data);
    } catch (err: any) {
      setError('Failed to load risk assessment');
      console.error('Risk analysis error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalysis();
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
      default: return colors.textSecondary;
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'LOW': return 'checkmark-circle';
      case 'MEDIUM': return 'alert-circle';
      case 'HIGH': return 'warning';
      default: return 'help-circle';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Analyzing your health profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Risk Assessment</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle" size={48} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAnalysis}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : analysis ? (
          <>
            {/* Risk Level Card */}
            <View style={[styles.riskCard, { borderColor: getRiskColor(analysis.riskLevel) }]}>
              <View style={[styles.riskIconContainer, { backgroundColor: getRiskColor(analysis.riskLevel) + '20' }]}>
                <Ionicons
                  name={getRiskIcon(analysis.riskLevel)}
                  size={48}
                  color={getRiskColor(analysis.riskLevel)}
                />
              </View>
              <Text style={[styles.riskLevel, { color: getRiskColor(analysis.riskLevel) }]}>
                {analysis.riskLevel} RISK
              </Text>
              <Text style={styles.riskScore}>
                Score: {(analysis.riskScore * 100).toFixed(0)}%
              </Text>
              {analysis.gestationalWeeks && (
                <Text style={styles.gestationalWeeks}>
                  Week {analysis.gestationalWeeks} of pregnancy
                </Text>
              )}
            </View>

            {/* Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <View style={styles.card}>
                <Text style={styles.summaryText}>{analysis.summary}</Text>
              </View>
            </View>

            {/* Risk Factors */}
            {analysis.riskFactors.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Identified Risk Factors</Text>
                <View style={styles.card}>
                  {analysis.riskFactors.map((factor, index) => (
                    <View key={index} style={styles.factorRow}>
                      <Ionicons name="ellipse" size={8} color={getRiskColor(analysis.riskLevel)} />
                      <Text style={styles.factorText}>{factor}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              <View style={styles.card}>
                {analysis.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationRow}>
                    <View style={styles.recommendationNumber}>
                      <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Warning Signs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Warning Signs to Watch</Text>
              <View style={[styles.card, styles.warningCard]}>
                {analysis.warningSignsToWatch.map((sign, index) => (
                  <View key={index} style={styles.warningRow}>
                    <Ionicons name="warning" size={18} color="#F59E0B" />
                    <Text style={styles.warningText}>{sign}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Next Steps */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Next Steps</Text>
              <View style={styles.card}>
                {analysis.nextSteps.map((step, index) => (
                  <TouchableOpacity key={index} style={styles.nextStepRow}>
                    <Ionicons name="arrow-forward-circle" size={24} color={colors.primary} />
                    <Text style={styles.nextStepText}>{step}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimer}>
              <Ionicons name="information-circle" size={18} color={colors.textSecondary} />
              <Text style={styles.disclaimerText}>
                This assessment is for informational purposes only and does not replace professional medical advice. Always consult your healthcare provider.
              </Text>
            </View>

            <View style={{ height: 100 }} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    errorCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      color: colors.text,
      marginTop: 16,
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    riskCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      borderWidth: 2,
      marginBottom: 24,
    },
    riskIconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    riskLevel: {
      fontSize: 24,
      fontWeight: '700',
    },
    riskScore: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 8,
    },
    gestationalWeeks: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
    },
    summaryText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 24,
    },
    factorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    factorText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    recommendationRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 10,
    },
    recommendationNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    recommendationNumberText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    recommendationText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
      lineHeight: 22,
    },
    warningCard: {
      backgroundColor: isDark ? '#4E342E' : '#FFF8E1',
    },
    warningRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
    },
    warningText: {
      fontSize: 14,
      color: isDark ? '#FFB74D' : '#F57C00',
      marginLeft: 12,
      flex: 1,
    },
    nextStepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    nextStepText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 12,
      flex: 1,
    },
    disclaimer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
      backgroundColor: isDark ? '#1F2937' : '#F3F4F6',
      borderRadius: 12,
      marginTop: 8,
    },
    disclaimerText: {
      fontSize: 12,
      color: colors.textSecondary,
      marginLeft: 8,
      flex: 1,
      lineHeight: 18,
    },
  });
