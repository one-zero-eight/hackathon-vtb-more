import { useState, useMemo } from 'react';
import { components } from '@/api/types';

// Типы из API
export type VacancyResponse = components['schemas']['VacancyResponse'];

// Универсальный интерфейс для вакансии
export interface VacancyData {
  id: number;
  name: string;
  description: string;
  city: string;
  salary: number | null;
  required_experience: number;
  weekly_hours_occupancy: number;
  open_time: string;
  close_time: string | null;
  is_active: boolean;
  user_id: number;
}

interface FilterState {
  salaryRange: string[];
  city: string[];
  experienceRange: string[];
}

// Вспомогательные функции для фильтрации
const jobLevelRanges = [
  { value: '1-3 года', minExp: 1, maxExp: 3 },
  { value: '3-5 лет', minExp: 3, maxExp: 5 },
  { value: '5-7 лет', minExp: 5, maxExp: 7 },
  { value: '7-10 лет', minExp: 7, maxExp: 10 },
  { value: '10+ лет', minExp: 10, maxExp: 999 },
];

// Функция для форматирования опыта работы в диапазоны
export const formatExperienceRange = (years: number): string => {
  if (years === 0) return 'Без опыта';
  if (years >= 1 && years < 3) return '1-3 года';
  if (years >= 3 && years < 5) return '3-5 лет';
  if (years >= 5 && years < 7) return '5-7 лет';
  if (years >= 7 && years < 10) return '7-10 лет';
  if (years >= 10) return '10+ лет';
  return `${years} лет`;
};

export const useVacancyFilters = (vacancies: VacancyData[] = []) => {
  const [filters, setFilters] = useState<FilterState>({
    salaryRange: [],
    city: [],
    experienceRange: [],
  });

  const [searchQuery, setSearchQuery] = useState<string>('');

  const [expandedSections, setExpandedSections] = useState({
    salaryRange: true,
    city: true,
    experienceRange: true,
  });

  // Calculate filter options and counts
  const filterOptions = useMemo(() => {
    // Cities from vacancy data
    const cities = [...new Set(vacancies.map(v => v.city))];
    const cityCounts = cities.map(city => ({
      value: city,
      count: vacancies.filter(v => v.city === city).length,
    }));

    // Experience ranges
    const experienceRangeCounts = jobLevelRanges.map(level => ({
      value: level.value,
      count: vacancies.filter(v => {
        // Используем ту же логику, что и в фильтрации
        if (level.value === '1-3 года') {
          return v.required_experience >= 1 && v.required_experience < 3;
        } else if (level.value === '3-5 лет') {
          return v.required_experience >= 3 && v.required_experience < 5;
        } else if (level.value === '5-7 лет') {
          return v.required_experience >= 5 && v.required_experience < 7;
        } else if (level.value === '7-10 лет') {
          return v.required_experience >= 7 && v.required_experience < 10;
        } else if (level.value === '10+ лет') {
          return v.required_experience >= 10;
        }
        return false;
      }).length,
    }));

    // Salary ranges in RUB (adjusted for real data)
    const salaryRanges = [
      { value: '70 000 - 100 000 ₽', min: 0, max: 100000 },
      { value: '100 000 - 150 000 ₽', min: 100000, max: 150000 },
      { value: '150 000 - 200 000 ₽', min: 150000, max: 200000 },
      { value: '300 000 ₽ и выше', min: 300000, max: 999999999 },
    ];
    const salaryRangeCounts = salaryRanges.map(range => ({
      value: range.value,
      count: vacancies.filter(
        v => v.salary && v.salary >= range.min && v.salary <= range.max
      ).length,
    }));

    return {
      cities: cityCounts,
      experienceRanges: experienceRangeCounts,
      salaryRanges: salaryRangeCounts,
    };
  }, [vacancies]);

  // Filter vacancies based on selected filters and search query
  const filteredVacancies = useMemo(() => {
    return vacancies.filter(vacancy => {
      // Search by name and description
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const searchText = [vacancy.name, vacancy.description, vacancy.city]
          .join(' ')
          .toLowerCase();
        if (!searchText.includes(query)) {
          return false;
        }
      }

      // City filter
      if (filters.city.length > 0 && !filters.city.includes(vacancy.city)) {
        return false;
      }

      // Experience range filter
      if (filters.experienceRange.length > 0) {
        const matchesExperience = filters.experienceRange.some(range => {
          // Используем ту же логику, что и в filterOptions
          if (range === '1-3 года') {
            return (
              vacancy.required_experience >= 1 &&
              vacancy.required_experience < 3
            );
          } else if (range === '3-5 лет') {
            return (
              vacancy.required_experience >= 3 &&
              vacancy.required_experience < 5
            );
          } else if (range === '5-7 лет') {
            return (
              vacancy.required_experience >= 5 &&
              vacancy.required_experience < 7
            );
          } else if (range === '7-10 лет') {
            return (
              vacancy.required_experience >= 7 &&
              vacancy.required_experience < 10
            );
          } else if (range === '10+ лет') {
            return vacancy.required_experience >= 10;
          }
          return false;
        });
        if (!matchesExperience) return false;
      }

      // Salary range filter
      if (filters.salaryRange.length > 0) {
        const matchesSalary = filters.salaryRange.some(range => {
          if (!vacancy.salary) return false;
          switch (range) {
            case '70 000 - 100 000 ₽':
              return vacancy.salary >= 0 && vacancy.salary <= 100000;
            case '100 000 - 150 000 ₽':
              return vacancy.salary >= 100000 && vacancy.salary <= 150000;
            case '150 000 - 200 000 ₽':
              return vacancy.salary >= 150000 && vacancy.salary <= 200000;
            case '300 000 ₽ и выше':
              return vacancy.salary >= 300000;
            default:
              return false;
          }
        });
        if (!matchesSalary) return false;
      }

      return true;
    });
  }, [vacancies, filters, searchQuery]);

  // Функция для сброса всех фильтров
  const resetFilters = () => {
    setFilters({
      salaryRange: [],
      city: [],
      experienceRange: [],
    });
    setSearchQuery('');
  };

  // Проверка наличия активных фильтров
  const hasActiveFilters = useMemo(
    () =>
      Object.values(filters).some(f => f.length > 0) ||
      searchQuery.trim().length > 0,
    [filters, searchQuery]
  );

  return {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies,
    searchQuery,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
    formatExperienceRange,
  };
};
