import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { useFilters } from '../../context/FilterContext';
import { DURATIONS, FIELDS, WORK_TYPES } from '../../utils/mock/data';
import { WORK_TYPE_COLORS, WORK_TYPE_ICONS } from '../../utils/constants/workType';
import type { WorkType } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PANEL_WIDTH = SCREEN_WIDTH * 0.82;

const STIPEND_OPTIONS: { label: string; value: number | null }[] = [
  { label: 'Any', value: null },
  { label: '$500+', value: 500 },
  { label: '$1,000+', value: 1000 },
  { label: '$2,000+', value: 2000 },
  { label: '$3,000+', value: 3000 },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export default function LeftFilterBar({ visible, onClose }: Props) {
  const { filters, setWorkTypes, setFields, setDurations, setMinStipend, resetFilters } =
    useFilters();
  const translateX = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: visible ? 0 : -PANEL_WIDTH,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, translateX, backdropOpacity]);

  const toggleWorkType = (wt: WorkType) =>
    setWorkTypes(
      filters.workTypes.includes(wt)
        ? filters.workTypes.filter(w => w !== wt)
        : [...filters.workTypes, wt]
    );

  const toggleField = (f: string) =>
    setFields(
      filters.fields.includes(f)
        ? filters.fields.filter(x => x !== f)
        : [...filters.fields, f]
    );

  const toggleDuration = (d: string) =>
    setDurations(
      filters.durations.includes(d)
        ? filters.durations.filter(x => x !== d)
        : [...filters.durations, d]
    );

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        {/* Panel */}
        <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filters</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
                <Text style={styles.resetText}>Reset all</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Work Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Work Type</Text>
              {WORK_TYPES.map(wt => {
                const isSelected = filters.workTypes.includes(wt);
                const color = WORK_TYPE_COLORS[wt];
                return (
                  <TouchableOpacity
                    key={wt}
                    style={[
                      styles.workTypeCard,
                      isSelected && { borderColor: color, backgroundColor: color + '14' },
                    ]}
                    onPress={() => toggleWorkType(wt)}
                  >
                    <Text style={styles.workTypeIcon}>{WORK_TYPE_ICONS[wt]}</Text>
                    <Text
                      style={[
                        styles.workTypeLabel,
                        isSelected && { color, fontWeight: typography.fontWeight.semiBold },
                      ]}
                    >
                      {wt}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkCircle, { backgroundColor: color }]}>
                        <Text style={styles.checkMark}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Field of Study */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Field of Study</Text>
              <View style={styles.chipsWrap}>
                {FIELDS.filter(f => f !== 'All Fields').map(f => {
                  const isSelected = filters.fields.includes(f);
                  return (
                    <TouchableOpacity
                      key={f}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => toggleField(f)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {f}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.divider} />

            {/* Duration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Duration</Text>
              {DURATIONS.map(d => {
                const isSelected = filters.durations.includes(d);
                return (
                  <TouchableOpacity
                    key={d}
                    style={styles.listRow}
                    onPress={() => toggleDuration(d)}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
                      {isSelected && <Text style={styles.checkboxMark}>✓</Text>}
                    </View>
                    <Text
                      style={[
                        styles.listRowText,
                        isSelected && styles.listRowTextActive,
                      ]}
                    >
                      {d}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.divider} />

            {/* Minimum Stipend */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Minimum Stipend</Text>
              <View style={styles.chipsWrap}>
                {STIPEND_OPTIONS.map(opt => {
                  const isSelected = filters.minStipend === opt.value;
                  return (
                    <TouchableOpacity
                      key={opt.label}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => setMinStipend(opt.value)}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={{ height: spacing['4xl'] }} />
          </ScrollView>

          {/* Footer apply button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} onPress={onClose}>
              <Text style={styles.applyBtnText}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.52)',
  },
  panel: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.background.primary,
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['4xl'],
    paddingBottom: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  resetBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  resetText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary[500],
    fontWeight: typography.fontWeight.medium,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  body: { flex: 1 },
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  workTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border.light,
    backgroundColor: colors.background.secondary,
    marginBottom: spacing.sm,
  },
  workTypeIcon: { fontSize: 20, marginRight: spacing.sm },
  workTypeLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    flex: 1,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { fontSize: 11, color: '#fff', fontWeight: '700' },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.xl,
  },
  chipsWrap: {
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
  chipText: { fontSize: typography.fontSize.sm, color: colors.text.secondary },
  chipTextSelected: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semiBold,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.border.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  checkboxActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[500],
  },
  checkboxMark: { fontSize: 11, color: '#fff', fontWeight: '700' },
  listRowText: { fontSize: typography.fontSize.sm, color: colors.text.secondary },
  listRowTextActive: {
    color: colors.text.primary,
    fontWeight: typography.fontWeight.medium,
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  applyBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
});
