import { useState, useMemo } from 'react';
import type { Vacancy } from '@/data/mockVacancies';

interface FilterState {
  salaryRange: string[];
  city: string[];
  experienceRange: string[];
}

export const useVacancyFilters = (vacancies: Vacancy[] = []) => {
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
    const experienceRanges = [
      { value: '1-3 года', minExp: 1, maxExp: 3 },
      { value: '3-5 лет', minExp: 3, maxExp: 5 },
      { value: '5-7 лет', minExp: 5, maxExp: 7 },
    ];
    const experienceRangeCounts = experienceRanges.map(range => ({
      value: range.value,
      count: vacancies.filter(
        v =>
          v.required_experience != null &&
          v.required_experience >= range.minExp &&
          v.required_experience <= range.maxExp
      ).length,
    }));

    // Salary ranges in RUB (adjusted for real data)
    const salaryRanges = [
      { value: '400 000 - 600 000 ₽', min: 400000, max: 600000 },
      { value: '600 000 - 800 000 ₽', min: 600000, max: 800000 },
      { value: '800 000 ₽ и выше', min: 800000, max: 999999999 },
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
      // Search by name
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        if (!vacancy.name.toLowerCase().includes(query)) {
          return false;
        }
      }
      // City filter
      if (filters.city.length > 0) {
        if (!filters.city.includes(vacancy.city)) {
          return false;
        }
      }

      // Experience range filter
      if (filters.experienceRange.length > 0) {
        const matchesExperience = filters.experienceRange.some(range => {
          switch (range) {
            case '1-3 года':
              return (
                vacancy.required_experience != null &&
                vacancy.required_experience >= 1 &&
                vacancy.required_experience <= 3
              );
            case '3-5 лет':
              return (
                vacancy.required_experience != null &&
                vacancy.required_experience >= 3 &&
                vacancy.required_experience <= 5
              );
            case '5-7 лет':
              return (
                vacancy.required_experience != null &&
                vacancy.required_experience >= 5 &&
                vacancy.required_experience <= 7
              );
            default:
              return false;
          }
        });
        if (!matchesExperience) return false;
      }

      // Salary range filter
      if (filters.salaryRange.length > 0) {
        const matchesSalary = filters.salaryRange.some(range => {
          switch (range) {
            case '400 000 - 600 000 ₽':
              return (
                vacancy.salary &&
                vacancy.salary >= 400000 &&
                vacancy.salary <= 600000
              );
            case '600 000 - 800 000 ₽':
              return (
                vacancy.salary &&
                vacancy.salary >= 600000 &&
                vacancy.salary <= 800000
              );
            case '800 000 ₽ и выше':
              return vacancy.salary && vacancy.salary >= 800000;
            default:
              return false;
          }
        });
        if (!matchesSalary) return false;
      }

      return true;
    });
  }, [vacancies, filters, searchQuery]);

  return {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies,
    searchQuery,
    setSearchQuery,
  };
};
