import React, { useState } from 'react';
import { mockVacancies } from '@/data/mockVacancies';
import { useVacancyFilters } from '@/hooks/useVacancyFilters';
import SearchBar from '../SearchBar';
import VacancyFilters from './VacancyFilters';
import VacancyList from './VacancyList';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

const Vacancies: React.FC = () => {
  const {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies,
  } = useVacancyFilters();

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

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

  const hasActiveFilters = Object.values(filters).some(
    filter => filter.length > 0
  );

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
      {/* Hero Section */}
      <div
        className="h-[250px] md:h-[300px] lg:h-[400px] relative container-w rounded-b-2xl md:rounded-b-3xl flex items-center justify-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80")`,
        }}
      />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Mobile Filters Button */}
      <div className="container-w md:hidden">
        <Button
          onClick={() => setIsFiltersModalOpen(true)}
          className="w-full bg-white dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600/30 hover:bg-gray-50 dark:hover:bg-slate-700/40"
        >
          <Filter className="w-4 h-4 mr-2" />
          Фильтры{' '}
          {hasActiveFilters && `(${Object.values(filters).flat().length})`}
        </Button>
      </div>

      {/* Main Content */}
      <div className="container-w h-auto flex flex-col lg:flex-row gap-6 md:gap-8">
        {/* Desktop Filters Sidebar */}
        <div className="hidden lg:block">
          <VacancyFilters
            filters={filters}
            setFilters={setFilters}
            filterOptions={filterOptions}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
          />
        </div>

        {/* Vacancy List */}
        <div className="flex-1">
          <VacancyList
            vacancies={filteredVacancies}
            totalCount={mockVacancies.length}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isFiltersModalOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsFiltersModalOpen(false)}
          />

          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Фильтры
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFiltersModalOpen(false)}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Filters Content */}
            <VacancyFilters
              filters={filters}
              setFilters={setFilters}
              filterOptions={filterOptions}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
            />

            {/* Apply Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                onClick={() => setIsFiltersModalOpen(false)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                Применить фильтры
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vacancies;
