import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { WORK_TYPE_COLORS } from '../../utils/constants/workType';
import type { HomeStackParamList } from '../../navigation/types';

type DetailRoute = RouteProp<HomeStackParamList, 'InternshipDetail'>;

const TABS = ['Overview', 'Requirements', 'Benefits', 'Company'] as const;
type Tab = typeof TABS[number];

export default function InternshipDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<DetailRoute>();
  const { internship } = route.params;
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(internship.isSaved);

  const stipendText = internship.stipend
    ? `$${internship.stipend.toLocaleString()}/month`
    : 'Unpaid';

  const daysUntilDeadline = Math.ceil(
    (new Date(internship.deadline).getTime() - Date.now()) / 86_400_000
  );
  const deadlineLabel =
    daysUntilDeadline < 0
      ? 'Closed'
      : daysUntilDeadline === 0
      ? 'Closes today'
      : `${daysUntilDeadline}d left`;

  const workTypeColor = WORK_TYPE_COLORS[internship.workType];

  const META_ITEMS = [
    { icon: '📍', label: 'Location', value: internship.location },
    { icon: '🏷', label: 'Type', value: internship.workType },
    { icon: '💰', label: 'Stipend', value: stipendText },
    { icon: '⏱', label: 'Duration', value: internship.duration },
    { icon: '📅', label: 'Start', value: internship.startDate },
    { icon: '⏰', label: 'Deadline', value: deadlineLabel },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Nav bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {internship.title}
        </Text>
        <TouchableOpacity onPress={() => setSaved(s => !s)} style={styles.saveBtn}>
          <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>
            {saved ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Company header */}
        <View style={styles.companyHeader}>
          <View style={styles.companyLogo}>
            <Text style={styles.companyLogoText}>{internship.company.name.charAt(0)}</Text>
          </View>
          <View style={styles.companyInfo}>
            <View style={styles.companyNameRow}>
              <Text style={styles.companyName}>{internship.company.name}</Text>
              {internship.company.verified && <Text style={styles.verifiedBadge}>✔</Text>}
            </View>
            <Text style={styles.ratingText}>
              ⭐ {internship.company.rating.toFixed(1)} · {internship.company.industry}
            </Text>
          </View>
          <View style={[styles.workTypeBadge, { backgroundColor: workTypeColor + '1E' }]}>
            <Text style={[styles.workTypeText, { color: workTypeColor }]}>
              {internship.workType}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{internship.title}</Text>

        {/* Applicants */}
        <Text style={styles.applicants}>
          👥 {internship.applicantsCount.toLocaleString()} applicants
        </Text>

        {/* Meta grid */}
        <View style={styles.metaGrid}>
          {META_ITEMS.map(m => (
            <View key={m.label} style={styles.metaItem}>
              <Text style={styles.metaIcon}>{m.icon}</Text>
              <Text style={styles.metaLabel}>{m.label}</Text>
              <Text style={styles.metaValue} numberOfLines={1}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab content */}
        <View style={styles.tabContent}>
          {activeTab === 'Overview' && (
            <View>
              <Text style={styles.contentTitle}>About this Internship</Text>
              <Text style={styles.paragraph}>{internship.description}</Text>
              <Text style={styles.contentTitle}>Skills Required</Text>
              <View style={styles.chipsWrap}>
                {internship.skills.map(s => (
                  <View key={s} style={styles.chip}>
                    <Text style={styles.chipText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === 'Requirements' && (
            <View>
              <Text style={styles.contentTitle}>Requirements</Text>
              {internship.requirements.map((r, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{r}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Benefits' && (
            <View>
              <Text style={styles.contentTitle}>Benefits & Perks</Text>
              {internship.benefits.map((b, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bullet}>✓</Text>
                  <Text style={[styles.bulletText, { color: colors.success.dark }]}>{b}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === 'Company' && (
            <View>
              <Text style={styles.contentTitle}>{internship.company.name}</Text>
              <Text style={styles.paragraph}>{internship.company.description}</Text>
              <View style={styles.companyDetailRow}>
                <Text style={styles.detailLabel}>Industry</Text>
                <Text style={styles.detailValue}>{internship.company.industry}</Text>
              </View>
              <View style={styles.companyDetailRow}>
                <Text style={styles.detailLabel}>Size</Text>
                <Text style={styles.detailValue}>{internship.company.size} employees</Text>
              </View>
              <View style={styles.companyDetailRow}>
                <Text style={styles.detailLabel}>Headquarters</Text>
                <Text style={styles.detailValue}>{internship.company.location}</Text>
              </View>
              <View style={styles.companyDetailRow}>
                <Text style={styles.detailLabel}>Rating</Text>
                <Text style={styles.detailValue}>⭐ {internship.company.rating.toFixed(1)} / 5</Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky apply bar */}
      <View style={styles.applyBar}>
        <View>
          <Text style={styles.applyStipend}>{stipendText}</Text>
          <Text style={styles.applyDeadline}>Deadline: {deadlineLabel}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.applyBtn,
            daysUntilDeadline < 0 && { backgroundColor: colors.neutral[400] },
          ]}
          onPress={() =>
            daysUntilDeadline < 0
              ? Alert.alert('Closed', 'This internship is no longer accepting applications.')
              : Alert.alert(
                  'Apply',
                  `Applying to "${internship.title}" at ${internship.company.name}`
                )
          }
        >
          <Text style={styles.applyBtnText}>
            {daysUntilDeadline < 0 ? 'Closed' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  backIcon: { fontSize: 18, color: colors.text.primary },
  navTitle: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  saveBtn: { padding: spacing.xs },
  saveIcon: { fontSize: 24, color: colors.neutral[400] },
  saveIconActive: { color: colors.error.main },
  scroll: {
    paddingHorizontal: spacing.base,
  },
  companyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  companyLogo: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  companyLogoText: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  companyInfo: { flex: 1 },
  companyNameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  companyName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  verifiedBadge: {
    fontSize: 14,
    color: colors.info.main,
  },
  ratingText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  workTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  workTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  applicants: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginBottom: spacing.base,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  metaItem: {
    width: '47%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  metaIcon: { fontSize: 18, marginBottom: 4 },
  metaLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  tabsRow: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  tab: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
  },
  tabActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.semiBold,
  },
  tabContent: {
    paddingVertical: spacing.base,
  },
  contentTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  paragraph: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.base,
    marginBottom: spacing.base,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[700],
    fontWeight: typography.fontWeight.medium,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  bullet: {
    fontSize: typography.fontSize.base,
    color: colors.primary[500],
    lineHeight: typography.lineHeight.base,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: typography.lineHeight.base,
  },
  companyDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  detailLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  detailValue: {
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  applyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  applyStipend: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  applyDeadline: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  applyBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
});
