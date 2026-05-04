import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../styles/colors';
import { typography, spacing, borderRadius } from '../../styles/typography';
import { useAuth } from '../../context/AuthContext';
import { useFilters } from '../../context/FilterContext';
import InternshipCard from '../../components/internships/InternshipCard';
import LeftFilterBar from '../../components/filters/LeftFilterBar';
import { MOCK_INTERNSHIPS, FIELDS } from '../../utils/mock/data';
import type { Internship } from '../../types';
import type { HomeStackParamList } from '../../navigation/types';

type Nav = NativeStackNavigationProp<HomeStackParamList, 'Home'>;

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { filters, setSearchQuery, activeFilterCount } = useFilters();
  const [filterBarOpen, setFilterBarOpen] = useState(false);
  const [selectedField, setSelectedField] = useState('All Fields');

  const internships = useMemo(
    () =>
      MOCK_INTERNSHIPS.filter(i => {
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          if (
            !i.title.toLowerCase().includes(q) &&
            !i.company.name.toLowerCase().includes(q)
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
        if (selectedField !== 'All Fields' && !i.field.includes(selectedField)) return false;
        return true;
      }),
    [filters, selectedField]
  );

  const firstName = user?.name.split(' ')[0] ?? 'there';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LeftFilterBar visible={filterBarOpen} onClose={() => setFilterBarOpen(false)} />

      <FlatList
        data={internships}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>
                  {greeting()}, {firstName} 👋
                </Text>
                <Text style={styles.subtitle}>Find your perfect internship</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name.charAt(0) ?? 'U'}</Text>
              </View>
            </View>

            {/* Search row */}
            <View style={styles.searchRow}>
              <TouchableOpacity
                style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
                onPress={() => setFilterBarOpen(true)}
              >
                <Text
                  style={[
                    styles.filterIcon,
                    activeFilterCount > 0 && { color: colors.text.inverse },
                  ]}
                >
                  ⚙
                </Text>
                {activeFilterCount > 0 && (
                  <View style={styles.filterBadge}>
                    <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search internships, companies…"
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

            {/* Field carousel */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.fieldsScroll}
            >
              {FIELDS.map(f => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.fieldChip,
                    selectedField === f && styles.fieldChipSelected,
                  ]}
                  onPress={() => setSelectedField(f)}
                >
                  <Text
                    style={[
                      styles.fieldChipText,
                      selectedField === f && styles.fieldChipTextSelected,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Results header */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                {internships.length} internship{internships.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <InternshipCard
            internship={item}
            onPress={i => navigation.navigate('InternshipDetail', { internship: i })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔎</Text>
            <Text style={styles.emptyTitle}>No internships found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search query</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => setFilterBarOpen(true)}>
              <Text style={styles.emptyBtnText}>Adjust Filters</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
  },
  greeting: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.base,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: { fontSize: 16, marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.text.primary,
  },
  clearIcon: { fontSize: 14, color: colors.text.tertiary, paddingHorizontal: spacing.xs },
  fieldsScroll: {
    paddingBottom: spacing.base,
    gap: spacing.sm,
  },
  fieldChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  fieldChipSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  fieldChipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  fieldChipTextSelected: {
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.semiBold,
  },
  resultsHeader: {
    marginBottom: spacing.md,
  },
  resultsCount: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.primary,
  },
  empty: {
    alignItems: 'center',
    paddingTop: spacing['4xl'],
    paddingHorizontal: spacing['2xl'],
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
    marginBottom: spacing.xl,
  },
  emptyBtn: {
    backgroundColor: colors.primary[500],
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  emptyBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text.inverse,
  },
});
