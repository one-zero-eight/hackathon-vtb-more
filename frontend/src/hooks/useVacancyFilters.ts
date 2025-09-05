import { useState, useMemo } from 'react';
import { mockVacancies } from '@/data/mockVacancies';

interface FilterState {
  employmentType: string[];
  categories: string[];
  jobLevel: string[];
  salaryRange: string[];
}

export const useVacancyFilters = () => {
  const [filters, setFilters] = useState<FilterState>({
    employmentType: [],
    categories: [],
    jobLevel: [],
    salaryRange: [],
  });

  const [expandedSections, setExpandedSections] = useState({
    employmentType: true,
    categories: true,
    jobLevel: true,
    salaryRange: true,
  });

  // Calculate filter options and counts
  const filterOptions = useMemo(() => {
    const employmentTypes = [...new Set(mockVacancies.map(v => v.type))];
    const employmentTypeCounts = employmentTypes.map(type => ({
      value: type === 'Full-Time' ? 'Полная занятость' : 'Частичная занятость',
      count: mockVacancies.filter(v => v.type === type).length,
    }));

    // Extract categories from hardSkills and job titles - limit to most common
    const allSkills = mockVacancies.flatMap(v => v.hardSkills);
    const skillCounts = allSkills.reduce(
      (acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Get top 8 most common skills as categories
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill]) => skill);

    const categoryCounts = topSkills.map(category => ({
      value: category,
      count: mockVacancies.filter(v => v.hardSkills.includes(category)).length,
    }));

    // Job levels based on experience
    const jobLevels = [
      { value: 'Начинающий', minExp: 0, maxExp: 1 },
      { value: 'Средний уровень', minExp: 2, maxExp: 3 },
      { value: 'Старший уровень', minExp: 4, maxExp: 5 },
      { value: 'Директор', minExp: 6, maxExp: 8 },
      { value: 'Вице-президент и выше', minExp: 9, maxExp: 999 },
    ];
    const jobLevelCounts = jobLevels.map(level => ({
      value: level.value,
      count: mockVacancies.filter(
        v => v.experience >= level.minExp && v.experience <= level.maxExp
      ).length,
    }));

    // Salary ranges in RUB
    const salaryRanges = [
      { value: '70 000 - 100 000 ₽', min: 0, max: 100 },
      { value: '100 000 - 150 000 ₽', min: 100, max: 150 },
      { value: '150 000 - 200 000 ₽', min: 150, max: 200 },
      { value: '300 000 ₽ и выше', min: 300, max: 999999 },
    ];
    const salaryRangeCounts = salaryRanges.map(range => ({
      value: range.value,
      count: mockVacancies.filter(
        v => v.money >= range.min && v.money <= range.max
      ).length,
    }));

    return {
      employmentTypes: employmentTypeCounts,
      categories: categoryCounts,
      jobLevels: jobLevelCounts,
      salaryRanges: salaryRangeCounts,
    };
  }, []);

  // Filter vacancies based on selected filters
  const filteredVacancies = useMemo(() => {
    return mockVacancies.filter(vacancy => {
      // Employment type filter
      if (
        filters.employmentType.length > 0 &&
        !filters.employmentType.includes(vacancy.type)
      ) {
        return false;
      }

      // Categories filter
      if (
        filters.categories.length > 0 &&
        !filters.categories.some(cat => vacancy.hardSkills.includes(cat))
      ) {
        return false;
      }

      // Job level filter
      if (filters.jobLevel.length > 0) {
        const matchesJobLevel = filters.jobLevel.some(level => {
          switch (level) {
            case 'Entry Level':
              return vacancy.experience >= 0 && vacancy.experience <= 1;
            case 'Mid Level':
              return vacancy.experience >= 2 && vacancy.experience <= 3;
            case 'Senior Level':
              return vacancy.experience >= 4 && vacancy.experience <= 5;
            case 'Director':
              return vacancy.experience >= 6 && vacancy.experience <= 8;
            case 'VP or Above':
              return vacancy.experience >= 9;
            default:
              return false;
          }
        });
        if (!matchesJobLevel) return false;
      }

      // Salary range filter
      if (filters.salaryRange.length > 0) {
        const matchesSalary = filters.salaryRange.some(range => {
          switch (range) {
            case '70 000 - 100 000 ₽':
              return vacancy.money >= 0 && vacancy.money <= 100;
            case '100 000 - 150 000 ₽':
              return vacancy.money >= 100 && vacancy.money <= 150;
            case '150 000 - 200 000 ₽':
              return vacancy.money >= 150 && vacancy.money <= 200;
            case '300 000 ₽ и выше':
              return vacancy.money >= 300;
            default:
              return false;
          }
        });
        if (!matchesSalary) return false;
      }

      return true;
    });
  }, [filters]);

  return {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies,
  };
};
