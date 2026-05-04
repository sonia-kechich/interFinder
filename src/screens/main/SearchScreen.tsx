import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { useFilters } from '../../context/FilterContext';
import InternshipCard from '../../components/internships/InternshipCard';
import LeftFilterBar from '../../components/filters/LeftFilterBar';
import { MOCK_INTERNSHIPS } from '../../utils/mock/data';
import type { Internship } from '../../types';
import type { SearchStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<SearchStackParamList, 'Search'>;

type SortKey = 'recent' | 'stipend' | 'applicants' | 'deadline';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recent', label: 'Recent' },
  { key: 'stipend', label: 'Stipend' },
  { key: 'applicants', label: 'Popular' },
  { key: 'deadline', label: 'Deadline' },
];

export default function SearchScreen() {
  const navigation = useNavigation<Nav>();
  const { filters, setSearchQuery, activeFilterCount } = useFilters();
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const [sort, setSort] = useState<SortKey>('recent');

  const results = useMemo(() => {
    let data = MOCK_INTERNSHIPS.filter(i => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        if (
          !i.title.toLowerCase().includes(q) &&
          !i.company.name.toLowerCase().includes(q) &&
          !i.field.some((f: string) => f.toLowerCase().includes(q))
        )
          return false;
      }
      if (filters.workTypes.length > 0 && !filters.workTypes.includes(i.workType)) return false;
      if (
        filters.fields.length > 0 &&
        !i.field.some((f: string) => filters.fields.includes(f))
      )
        return false;
      if (filters.durations.length > 0 && !filters.durations.includes(i.duration)) return false;
      if (
        filters.minStipend !== null &&
        (i.stipend === null || i.stipend < filters.minStipend)
      )
        return false;
      return true;
    });

    data = [...data].sort((a, b) => {
      switch (sort) {
        case 'stipend':
          return (b.stipend ?? 0) - (a.stipend ?? 0);
        case 'applicants':
          return b.applicantsCount - a.applicantsCount;
        case 'deadline':
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default: // recent
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
      }
    });

    return data;
  }, [filters, sort]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LeftFilterBar visible={filterBarOpen} onClose={() => setFilterBarOpen(false)} />

      {/* Search bar row */}
      <View style={styles.searchRow}>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterBarOpen(true)}
        >
          <Text style={[styles.filterIcon, activeFilterCount > 0 && { color: '#fff' }]}>⚙</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Text style={styles.searchIconText}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search internships, skills, companies…"
            placeholderTextColor={colors.text.disabled}
            value={filters.searchQuery}
            onChangeText={setSearchQuery}
          />
          {filters.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortScroll}
      >
        {SORT_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.sortChip, sort === opt.key && styles.sortChipActive]}
            onPress={() => setSort(opt.key)}
          >
            <Text style={[styles.sortChipText, sort === opt.key && styles.sortChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {results.length} result{results.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <InternshipCard
            internship={item}
            onPress={i => navigation.navigate('InternshipDetail', { internship: i })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try a different keyword or adjust your filters.
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterBtnActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  filterIcon: { fontSize: 20, color: colors.text.secondary },
  filterBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  searchIconText: { fontSize: 16, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  clearIcon: { fontSize: 14, color: colors.text.tertiary, paddingHorizontal: spacing.xs },
  sortScroll: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  sortChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border.light,
    backgroundColor: colors.background.primary,
  },
  sortChipActive: {
    borderColor: colors.primary[500],
    backgroundColor: colors.primary[50],
  },
  sortChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
  },
  sortChipTextActive: {
    color: colors.primary[600],
    fontWeight: typography.fontWeight.semiBold,
  },
  resultsHeader: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['3xl'],
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
