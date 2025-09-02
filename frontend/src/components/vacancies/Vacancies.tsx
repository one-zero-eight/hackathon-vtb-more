import React from 'react';
import { mockVacancies } from '@/data/mockVacancies';
import { useVacancyFilters } from '@/hooks/useVacancyFilters';
import SearchBar from '../SearchBar';
import VacancyFilters from './VacancyFilters';
import VacancyList from './VacancyList';

const Vacancies: React.FC = () => {
  const {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies,
  } = useVacancyFilters();

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleResetFilters = () => {
    setFilters({
      employmentType: [],
      categories: [],
      jobLevel: [],
      salaryRange: [],
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Hero Section */}
      <div
        className="h-[400px] relative container-w rounded-b-3xl flex items-center justify-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80")`,
        }}
      />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Main Content */}
      <div className="container-w h-auto flex gap-8">
        {/* Filters Sidebar */}
        <VacancyFilters
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
          expandedSections={expandedSections}
          setExpandedSections={setExpandedSections}
        />

        {/* Vacancy List */}
        <VacancyList
          vacancies={filteredVacancies}
          totalCount={mockVacancies.length}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

export default Vacancies;
