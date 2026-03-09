import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../store/ThemeContext';
import { useAlert } from '../../hooks/useAlert';
import { riskApi } from '../../api/risk';

const COMMON_SYMPTOMS = [
  { id: 'headache', label: 'Headache', icon: 'head-outline' },
  { id: 'nausea', label: 'Nausea/Vomiting', icon: 'medical-outline' },
  { id: 'fatigue', label: 'Fatigue', icon: 'battery-dead-outline' },
  { id: 'bleeding', label: 'Bleeding', icon: 'water-outline' },
  { id: 'cramping', label: 'Cramping', icon: 'fitness-outline' },
  { id: 'swelling', label: 'Swelling', icon: 'body-outline' },
  { id: 'reduced_movement', label: 'Reduced Baby Movement', icon: 'pause-circle-outline' },
  { id: 'fever', label: 'Fever', icon: 'thermometer-outline' },
  { id: 'dizziness', label: 'Dizziness', icon: 'sync-outline' },
  { id: 'back_pain', label: 'Back Pain', icon: 'body-outline' },
  { id: 'vision_changes', label: 'Vision Changes', icon: 'eye-outline' },
  { id: 'breathing_difficulty', label: 'Breathing Difficulty', icon: 'cloud-outline' },
];

const URGENCY_CONFIG = {
  EMERGENCY: {
    color: '#DC2626',
    bgColor: '#FEE2E2',
    darkBgColor: '#450A0A',
    icon: 'alert-circle',
    title: 'Emergency - Seek Immediate Care',
  },
  URGENT: {
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    darkBgColor: '#451A03',
    icon: 'warning',
    title: 'Urgent - See Doctor Today',
  },
  MODERATE: {
    color: '#3B82F6',
    bgColor: '#DBEAFE',
    darkBgColor: '#1E3A5F',
    icon: 'information-circle',
    title: 'Schedule Appointment Soon',
  },
  LOW: {
    color: '#10B981',
    bgColor: '#D1FAE5',
    darkBgColor: '#064E3B',
    icon: 'checkmark-circle',
    title: 'Monitor at Home',
  },
};

export default function SymptomCheckerScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const { alert, error } = useAlert();
  const styles = createStyles(colors, isDark);

  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(s => s !== symptomId)
        : [...prev, symptomId]
    );
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0 && !description.trim()) {
      alert('Missing Information', 'Please select symptoms or describe how you feel');
      return;
    }

    setLoading(true);
    try {
      const response = await riskApi.checkSymptoms({
        symptoms: selectedSymptoms,
        description: description.trim(),
      });
      setResult(response);
    } catch (err) {
      console.error('Symptom check error:', err);
      error('Error', 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setDescription('');
    setResult(null);
  };

  const handleEmergency = () => {
    alert(
      'Emergency Services',
      'If you are experiencing a medical emergency, please call emergency services immediately.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Emergency', onPress: () => console.log('Call emergency') },
      ]
    );
  };

  if (result) {
    const urgencyConfig = URGENCY_CONFIG[result.urgency as keyof typeof URGENCY_CONFIG] || URGENCY_CONFIG.MODERATE;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleReset} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Assessment Result</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Urgency Card */}
          <View style={[styles.urgencyCard, { backgroundColor: isDark ? urgencyConfig.darkBgColor : urgencyConfig.bgColor }]}>
            <Ionicons name={urgencyConfig.icon as any} size={48} color={urgencyConfig.color} />
            <Text style={[styles.urgencyTitle, { color: urgencyConfig.color }]}>
              {urgencyConfig.title}
            </Text>
          </View>

          {/* Assessment */}
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Assessment</Text>
            <Text style={styles.resultText}>{result.assessment}</Text>
          </View>

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Recommendations</Text>
              {result.recommendations.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Warning Signs */}
          {result.warningSignsToWatch && result.warningSignsToWatch.length > 0 && (
            <View style={styles.resultSection}>
              <Text style={styles.sectionTitle}>Watch For</Text>
              {result.warningSignsToWatch.map((sign: string, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Ionicons name="alert-circle" size={20} color="#F59E0B" />
                  <Text style={styles.warningText}>{sign}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {result.urgency === 'EMERGENCY' && (
              <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
                <Ionicons name="call" size={20} color="#FFF" />
                <Text style={styles.emergencyButtonText}>Call Emergency</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Check New Symptoms</Text>
            </TouchableOpacity>
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              This is not a medical diagnosis. Always consult with your healthcare provider for proper evaluation.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Symptom Checker</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <Ionicons name="medical" size={32} color={colors.primary} />
          <Text style={styles.introText}>
            Select your symptoms or describe how you're feeling. Our AI will help assess the urgency and provide guidance.
          </Text>
        </View>

        {/* Common Symptoms */}
        <Text style={styles.sectionTitle}>Common Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {COMMON_SYMPTOMS.map(symptom => (
            <TouchableOpacity
              key={symptom.id}
              style={[
                styles.symptomChip,
                selectedSymptoms.includes(symptom.id) && styles.symptomChipSelected,
              ]}
              onPress={() => toggleSymptom(symptom.id)}
            >
              <Ionicons
                name={symptom.icon as any}
                size={18}
                color={selectedSymptoms.includes(symptom.id) ? '#FFF' : colors.text}
              />
              <Text
                style={[
                  styles.symptomChipText,
                  selectedSymptoms.includes(symptom.id) && styles.symptomChipTextSelected,
                ]}
              >
                {symptom.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Describe Your Symptoms</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Tell us more about how you're feeling..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Ionicons name="search" size={20} color="#FFF" />
              <Text style={styles.submitButtonText}>Analyze Symptoms</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Emergency Notice */}
        <TouchableOpacity style={styles.emergencyNotice} onPress={handleEmergency}>
          <Ionicons name="alert-circle" size={20} color="#DC2626" />
          <Text style={styles.emergencyNoticeText}>
            If you're having a medical emergency, tap here or call emergency services immediately.
          </Text>
        </TouchableOpacity>
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
    scrollContent: {
      padding: 16,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    introCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 24,
    },
    introText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 8,
    },
    symptomsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 16,
    },
    symptomChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    symptomChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    symptomChipText: {
      fontSize: 13,
      color: colors.text,
    },
    symptomChipTextSelected: {
      color: '#FFF',
    },
    textInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 15,
      color: colors.text,
      minHeight: 100,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
    emergencyNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 20,
      padding: 12,
      backgroundColor: isDark ? '#450A0A' : '#FEE2E2',
      borderRadius: 8,
    },
    emergencyNoticeText: {
      flex: 1,
      fontSize: 13,
      color: '#DC2626',
    },
    urgencyCard: {
      borderRadius: 16,
      padding: 24,
      alignItems: 'center',
      marginBottom: 24,
    },
    urgencyTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginTop: 12,
      textAlign: 'center',
    },
    resultSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    resultText: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
    },
    recommendationItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 8,
    },
    recommendationText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    warningItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 8,
    },
    warningText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    actionButtons: {
      gap: 12,
      marginBottom: 16,
    },
    emergencyButton: {
      backgroundColor: '#DC2626',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emergencyButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: '600',
    },
    resetButton: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    resetButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    disclaimer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      padding: 12,
      backgroundColor: colors.card,
      borderRadius: 8,
    },
    disclaimerText: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 18,
    },
  });
