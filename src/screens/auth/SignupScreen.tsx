import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { FIELDS } from '../../utils/mock/data';
import type { AuthStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const STEPS = ['Personal Info', 'Academic Info', 'Preferences'];

export default function SignupScreen() {
  const navigation = useNavigation<Nav>();
  const { login } = useAuth();
  const [step, setStep] = useState(0);

  // Step 1
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Step 2
  const [university, setUniversity] = useState('');
  const [selectedField, setSelectedField] = useState('');

  // Step 3 – work type preferences shown as chips
  const WORK_TYPES = ['Remote', 'Hybrid', 'On-site'];
  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>([]);

  const toggleWorkType = (wt: string) =>
    setSelectedWorkTypes(prev =>
      prev.includes(wt) ? prev.filter(x => x !== wt) : [...prev, wt]
    );

  const nextStep = () => {
    if (step === 0 && (!name.trim() || !email.trim() || !password.trim())) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      // TODO: Replace with real account-creation API call before production
      login(email, password);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => (step === 0 ? navigation.goBack() : setStep(s => s - 1))}
              style={styles.backBtn}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Account</Text>
            <View style={{ width: 36 }} />
          </View>

          {/* Step indicator */}
          <View style={styles.stepsRow}>
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <View style={styles.stepItem}>
                  <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
                    <Text style={[styles.stepDotText, i <= step && styles.stepDotTextActive]}>
                      {i + 1}
                    </Text>
                  </View>
                  <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>
                    {label}
                  </Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.stepLine, i < step && styles.stepLineActive]} />
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Step content */}
          {step === 0 && (
            <>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Alex Johnson"
                  placeholderTextColor={colors.text.disabled}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@university.edu"
                  placeholderTextColor={colors.text.disabled}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.text.disabled}
                  secureTextEntry
                />
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={styles.sectionTitle}>Academic Information</Text>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>University / College</Text>
                <TextInput
                  style={styles.input}
                  value={university}
                  onChangeText={setUniversity}
                  placeholder="e.g. MIT, Stanford, …"
                  placeholderTextColor={colors.text.disabled}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Field of Study</Text>
                <View style={styles.chipsContainer}>
                  {FIELDS.filter(f => f !== 'All Fields').map(f => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.chip, selectedField === f && styles.chipSelected]}
                      onPress={() => setSelectedField(f)}
                    >
                      <Text style={[styles.chipText, selectedField === f && styles.chipTextSelected]}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.sectionTitle}>Work Preferences</Text>
              <Text style={styles.helpText}>Select all work types you're open to:</Text>
              {WORK_TYPES.map(wt => {
                const icons: Record<string, string> = { Remote: '🏠', Hybrid: '🔀', 'On-site': '🏢' };
                const selected = selectedWorkTypes.includes(wt);
                return (
                  <TouchableOpacity
                    key={wt}
                    style={[styles.workTypeCard, selected && styles.workTypeCardSelected]}
                    onPress={() => toggleWorkType(wt)}
                  >
                    <Text style={styles.workTypeIcon}>{icons[wt]}</Text>
                    <Text style={[styles.workTypeLabel, selected && { color: colors.primary[600] }]}>
                      {wt}
                    </Text>
                    {selected && <Text style={styles.checkIcon}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </>
          )}

          <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
            <Text style={styles.nextBtnText}>
              {step === STEPS.length - 1 ? 'Create Account' : 'Continue →'}
            </Text>
          </TouchableOpacity>

          {step === 0 && (
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: colors.text.primary,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  stepItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.border.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  stepDotText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.tertiary,
  },
  stepDotTextActive: {
    color: colors.text.inverse,
  },
  stepLabel: {
    fontSize: 10,
    color: colors.text.tertiary,
  },
  stepLabelActive: {
    color: colors.primary[500],
    fontWeight: typography.fontWeight.semiBold,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.xs,
    marginBottom: spacing.xl,
  },
  stepLineActive: {
    backgroundColor: colors.primary[500],
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xl,
  },
  helpText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.md,
  },
  inputGroup: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border.main,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    backgroundColor: colors.background.secondary,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.main,
    backgroundColor: colors.background.secondary,
  },
  chipSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  chipTextSelected: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semiBold,
  },
  workTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.sm,
  },
  workTypeCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  workTypeIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  workTypeLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    flex: 1,
  },
  checkIcon: {
    fontSize: 16,
    color: colors.primary[500],
    fontWeight: '700',
  },
  nextBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  nextBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  loginText: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  loginLink: {
    fontSize: typography.fontSize.base,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.bold,
  },
});
