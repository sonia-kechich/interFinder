import React, { createContext, useContext, useState, useMemo } from 'react';
import type { FilterState, WorkType } from '../types';

interface FilterContextValue {
  filters: FilterState;
  activeFilterCount: number;
  setSearchQuery: (q: string) => void;
  setWorkTypes: (wt: WorkType[]) => void;
  setFields: (f: string[]) => void;
  setDurations: (d: string[]) => void;
  setMinStipend: (s: number | null) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  workTypes: [],
  fields: [],
  durations: [],
  minStipend: null,
};

const FilterContext = createContext<FilterContextValue>({
  filters: DEFAULT_FILTERS,
  activeFilterCount: 0,
  setSearchQuery: () => {},
  setWorkTypes: () => {},
  setFields: () => {},
  setDurations: () => {},
  setMinStipend: () => {},
  resetFilters: () => {},
});

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const activeFilterCount = useMemo(
    () =>
      filters.workTypes.length +
      filters.fields.length +
      filters.durations.length +
      (filters.minStipend !== null ? 1 : 0),
    [filters]
  );

  const setSearchQuery = (searchQuery: string) =>
    setFilters(f => ({ ...f, searchQuery }));
  const setWorkTypes = (workTypes: WorkType[]) =>
    setFilters(f => ({ ...f, workTypes }));
  const setFields = (fields: string[]) =>
    setFilters(f => ({ ...f, fields }));
  const setDurations = (durations: string[]) =>
    setFilters(f => ({ ...f, durations }));
  const setMinStipend = (minStipend: number | null) =>
    setFilters(f => ({ ...f, minStipend }));
  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  return (
    <FilterContext.Provider
      value={{
        filters,
        activeFilterCount,
        setSearchQuery,
        setWorkTypes,
        setFields,
        setDurations,
        setMinStipend,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
