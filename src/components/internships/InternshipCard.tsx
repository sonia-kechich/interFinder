import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { WORK_TYPE_COLORS } from '../../utils/constants/workType';
import type { Internship } from '../../types';

interface Props {
  internship: Internship;
  onPress: (internship: Internship) => void;
}

function daysAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

export default function InternshipCard({ internship, onPress }: Props) {
  const [saved, setSaved] = useState(internship.isSaved);
  const stipendText = internship.stipend
    ? `$${internship.stipend.toLocaleString()}/mo`
    : 'Unpaid';
  const workTypeColor = WORK_TYPE_COLORS[internship.workType];

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(internship)}
      activeOpacity={0.95}
    >
      {/* Company row */}
      <View style={styles.companyRow}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>{internship.company.name.charAt(0)}</Text>
        </View>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName} numberOfLines={1}>
            {internship.company.name}
          </Text>
          <Text style={styles.postedDate}>{daysAgo(internship.postedDate)}</Text>
        </View>
        <TouchableOpacity style={styles.saveBtn} onPress={() => setSaved(s => !s)}>
          <Text style={[styles.saveIcon, saved && styles.saveIconActive]}>
            {saved ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {internship.title}
      </Text>

      {/* Field badges */}
      <View style={styles.tagsRow}>
        {internship.field.slice(0, 2).map(f => (
          <View key={f} style={styles.fieldBadge}>
            <Text style={styles.fieldBadgeText}>{f}</Text>
          </View>
        ))}
        {internship.field.length > 2 && (
          <Text style={styles.moreFields}>+{internship.field.length - 2}</Text>
        )}
      </View>

      {/* Location & work type */}
      <View style={styles.detailRow}>
        <View style={styles.locationItem}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {internship.location}
          </Text>
        </View>
        <View
          style={[
            styles.workTypeBadge,
            { backgroundColor: workTypeColor + '1E' },
          ]}
        >
          <Text style={[styles.workTypeText, { color: workTypeColor }]}>
            {internship.workType}
          </Text>
        </View>
      </View>

      {/* Bottom: stipend + apply */}
      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.stipend}>{stipendText}</Text>
          <Text style={styles.duration}>{internship.duration}</Text>
        </View>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={() =>
            Alert.alert('Apply', `Applying to "${internship.title}" at ${internship.company.name}`)
          }
        >
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  logoBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logoText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary[600],
  },
  companyInfo: { flex: 1 },
  companyName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  postedDate: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  saveBtn: { padding: spacing.xs },
  saveIcon: { fontSize: 22, color: colors.neutral[400] },
  saveIconActive: { color: colors.error.main },
  title: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.xs,
    flexWrap: 'wrap',
  },
  fieldBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[50],
  },
  fieldBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.primary[600],
    fontWeight: typography.fontWeight.medium,
  },
  moreFields: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  locationItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  detailIcon: { fontSize: 12, marginRight: 4 },
  detailText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    flex: 1,
  },
  workTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  workTypeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semiBold,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  stipend: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  duration: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  applyBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  applyBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.inverse,
  },
});
