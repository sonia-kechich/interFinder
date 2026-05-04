import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { WORK_TYPE_COLORS } from '../../utils/constants/workType';
import { MOCK_APPLICATIONS } from '../../utils/mock/data';
import type { Application, ApplicationStatus } from '../../types';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { color: string; bg: string; icon: string }
> = {
  Draft: { color: colors.neutral[500], bg: colors.neutral[100], icon: '📝' },
  Applied: { color: colors.info.main, bg: colors.info.light + '44', icon: '📤' },
  'Under Review': { color: colors.accent[600], bg: colors.accent[100], icon: '👀' },
  Shortlisted: { color: colors.secondary[600], bg: colors.secondary[100], icon: '⭐' },
  'Interview Scheduled': { color: colors.primary[600], bg: colors.primary[100], icon: '📅' },
  'Interview Completed': { color: colors.primary[700], bg: colors.primary[100], icon: '✅' },
  'Offer Received': { color: colors.secondary[700], bg: colors.secondary[100], icon: '🎉' },
  Accepted: { color: colors.success.dark, bg: colors.success.light + '44', icon: '🏆' },
  Rejected: { color: colors.error.dark, bg: colors.error.light + '44', icon: '❌' },
  Withdrawn: { color: colors.neutral[400], bg: colors.neutral[100], icon: '↩️' },
};

const STATS = [
  { label: 'Total', value: MOCK_APPLICATIONS.length, icon: '📋' },
  {
    label: 'Active',
    value: MOCK_APPLICATIONS.filter(a =>
      ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled'].includes(a.status)
    ).length,
    icon: '🔄',
  },
  {
    label: 'Interviews',
    value: MOCK_APPLICATIONS.filter(a =>
      ['Interview Scheduled', 'Interview Completed'].includes(a.status)
    ).length,
    icon: '🎙',
  },
  {
    label: 'Offers',
    value: MOCK_APPLICATIONS.filter(a =>
      ['Offer Received', 'Accepted'].includes(a.status)
    ).length,
    icon: '🏆',
  },
];

function ApplicationItem({ item }: { item: Application }) {
  const cfg = STATUS_CONFIG[item.status];
  const workTypeColor = WORK_TYPE_COLORS[item.internship.workType];
  const applied = new Date(item.appliedDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>{item.internship.company.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.internship.title}
          </Text>
          <Text style={styles.cardCompany}>{item.internship.company.name}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={styles.statusIcon}>{cfg.icon}</Text>
          <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={[styles.workTypeChip, { backgroundColor: workTypeColor + '1E' }]}>
          <Text style={[styles.workTypeText, { color: workTypeColor }]}>
            {item.internship.workType}
          </Text>
        </View>
        <Text style={styles.dateText}>Applied {applied}</Text>
      </View>

      {item.notes && (
        <View style={styles.notesRow}>
          <Text style={styles.notesText} numberOfLines={2}>
            📌 {item.notes}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function ApplicationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FlatList
        data={MOCK_APPLICATIONS}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={styles.pageHeader}>
              <Text style={styles.pageTitle}>My Applications</Text>
              <Text style={styles.pageSubtitle}>Track your internship journey</Text>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
              {STATS.map(s => (
                <View key={s.label} style={styles.statCard}>
                  <Text style={styles.statIcon}>{s.icon}</Text>
                  <Text style={styles.statValue}>{s.value}</Text>
                  <Text style={styles.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Recent Activity</Text>
          </>
        }
        renderItem={({ item }) => <ApplicationItem item={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No applications yet</Text>
            <Text style={styles.emptyText}>
              Start exploring internships and apply to your first one!
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
  },
  pageHeader: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
  },
  pageTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  pageSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  statIcon: { fontSize: 20, marginBottom: 4 },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  statLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  cardMeta: { flex: 1 },
  cardTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  cardCompany: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: 4,
    maxWidth: 140,
  },
  statusIcon: { fontSize: 12 },
  statusText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
    flexShrink: 1,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  workTypeChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  workTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  dateText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  notesRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  notesText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
  },
  emptyIcon: { fontSize: 52, marginBottom: spacing.base },
  emptyTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
