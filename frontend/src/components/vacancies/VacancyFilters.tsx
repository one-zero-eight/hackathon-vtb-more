import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface FilterState {
  salaryRange: string[];
  city: string[];
  experienceRange: string[];
}

interface FilterOption {
  value: string;
  count: number;
}

interface VacancyFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filterOptions: {
    cities: FilterOption[];
    experienceRanges: FilterOption[];
    salaryRanges: FilterOption[];
  };
  expandedSections: {
    city: boolean;
    experienceRange: boolean;
    salaryRange: boolean;
  };
  setExpandedSections: React.Dispatch<
    React.SetStateAction<{
      city: boolean;
      experienceRange: boolean;
      salaryRange: boolean;
    }>
  >;
}

const VacancyFilters: React.FC<VacancyFiltersProps> = ({
  filters,
  setFilters,
  filterOptions,
  expandedSections,
  setExpandedSections,
}) => {
  const toggleFilter = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value],
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      salaryRange: [],
      city: [],
      experienceRange: [],
    });
  };

  const FilterSection = ({
    title,
    options,
    category,
    isExpanded,
    onToggle,
  }: {
    title: string;
    options: FilterOption[];
    category: keyof FilterState;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left font-semibold text-gray-900 dark:text-gray-100 mb-3 hover:text-gray-700 dark:hover:text-gray-300 transition-colors group"
      >
        <span className="text-base">{title}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
            {filters[category].length > 0 &&
              `(${filters[category].length} selected)`}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="space-y-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 pr-2">
          {options.map(option => {
            const isSelected = filters[category].includes(option.value);
            const isDisabled = option.count === 0;
            return (
              <label
                key={option.value}
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border hover:border-gray-200 dark:hover:border-gray-600'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() =>
                    !isDisabled && toggleFilter(category, option.value)
                  }
                  disabled={isDisabled}
                  className="border-gray-300 dark:border-gray-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600 disabled:opacity-50"
                />
                <span
                  className={`flex-1 text-sm ${isSelected ? 'text-indigo-900 dark:text-indigo-200 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  {option.value}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isSelected
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {option.count}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );

  const hasActiveFilters = Object.values(filters).some(
    filter => filter.length > 0
  );

  return (
    <div className="w-full lg:w-auto lg:flex-2 bg-white dark:bg-slate-800/30 rounded-2xl lg:rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-slate-700/30 lg:sticky lg:top-[100px] h-fit backdrop-blur-sm">
      <div className="mb-4 md:mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
            Фильтры
          </h3>
          {hasActiveFilters && (
            <span className="text-xs bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-full font-medium">
              Активно
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Уточните результаты поиска
        </p>
      </div>

      <FilterSection
        title="Город"
        options={filterOptions.cities}
        category="city"
        isExpanded={expandedSections.city}
        onToggle={() => toggleSection('city')}
      />

      <FilterSection
        title="Опыт работы"
        options={filterOptions.experienceRanges}
        category="experienceRange"
        isExpanded={expandedSections.experienceRange}
        onToggle={() => toggleSection('experienceRange')}
      />

      <FilterSection
        title="Зарплата"
        options={filterOptions.salaryRanges}
        category="salaryRange"
        isExpanded={expandedSections.salaryRange}
        onToggle={() => toggleSection('salaryRange')}
      />

      {/* Clear filters button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full mt-4 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          <X /> Очистить все фильтры
        </button>
      )}
    </div>
  );
};

export default VacancyFilters;
