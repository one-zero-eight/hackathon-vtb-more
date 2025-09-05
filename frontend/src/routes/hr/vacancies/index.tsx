import React, { useMemo, useState } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import SearchBar from '@/components/SearchBar';
import VacancyFilters from '@/components/vacancies/VacancyFilters';
import { Button } from '@/components/ui/button';
import { Filter, X, Users, Eye, Pencil, Archive } from 'lucide-react';
import { type HRVacancy, mockHRVacancies } from '@/data/mockVacancies';

export const Route = createFileRoute('/hr/vacancies/')({
  component: RouteComponent,
});

type FilterState = {
  employmentType: string[];
  categories: string[];
  jobLevel: string[];
  salaryRange: string[];
};

// Вспомогательные функции для соответствия вариантам фильтров
const jobLevelRanges = [
  { value: 'Начинающий', minExp: 0, maxExp: 1 },
  { value: 'Средний уровень', minExp: 2, maxExp: 3 },
  { value: 'Старший уровень', minExp: 4, maxExp: 5 },
  { value: 'Директор', minExp: 6, maxExp: 8 },
  { value: 'Вице-президент и выше', minExp: 9, maxExp: 999 },
];

const toEnglishEmploymentType = (ru: string) =>
  ru === 'Полная занятость' ? 'Full-Time' : 'Part-Time';

function RouteComponent() {
  // Имитация текущего HR: фильтрация по createdBy при необходимости
  const currentHRName = undefined as string | undefined; // например: 'Иван Петров'

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

  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [query, setQuery] = useState('');

  const baseVacancies = useMemo(() => {
    const list = currentHRName
      ? mockHRVacancies.filter(v => v.createdBy === currentHRName)
      : mockHRVacancies;
    return list;
  }, [currentHRName]);

  const filterOptions = useMemo(() => {
    const employmentTypes = [...new Set(baseVacancies.map(v => v.type))];
    const employmentTypeCounts = employmentTypes.map(type => ({
      value: type === 'Full-Time' ? 'Полная занятость' : 'Частичная занятость',
      count: baseVacancies.filter(v => v.type === type).length,
    }));

    const allSkills = baseVacancies.flatMap(v => v.hardSkills);
    const skillCounts = allSkills.reduce(
      (acc, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([skill]) => skill);
    const categoryCounts = topSkills.map(category => ({
      value: category,
      count: baseVacancies.filter(v => v.hardSkills.includes(category)).length,
    }));

    const jobLevelCounts = jobLevelRanges.map(level => ({
      value: level.value,
      count: baseVacancies.filter(
        v => v.experience >= level.minExp && v.experience <= level.maxExp
      ).length,
    }));

    const salaryRanges = [
      { value: '70 000 - 100 000 ₽', min: 0, max: 100 },
      { value: '100 000 - 150 000 ₽', min: 100, max: 150 },
      { value: '150 000 - 200 000 ₽', min: 150, max: 200 },
      { value: '300 000 ₽ и выше', min: 300, max: 999999 },
    ];
    const salaryRangeCounts = salaryRanges.map(range => ({
      value: range.value,
      count: baseVacancies.filter(
        v => v.money >= range.min && v.money <= range.max
      ).length,
    }));

    return {
      employmentTypes: employmentTypeCounts,
      categories: categoryCounts,
      jobLevels: jobLevelCounts,
      salaryRanges: salaryRangeCounts,
    };
  }, [baseVacancies]);

  const filteredVacancies = useMemo(() => {
    return baseVacancies.filter(vacancy => {
      // Поиск
      if (query.trim().length > 0) {
        const q = query.toLowerCase();
        const text = [
          vacancy.title,
          vacancy.description,
          vacancy.city,
          vacancy.createdBy,
          ...vacancy.hardSkills,
          ...vacancy.softSkills,
        ]
          .join(' ')
          .toLowerCase();
        if (!text.includes(q)) return false;
      }

      // Тип занятости
      if (
        filters.employmentType.length > 0 &&
        !filters.employmentType
          .map(toEnglishEmploymentType)
          .includes(vacancy.type)
      ) {
        return false;
      }

      // Категории (по hardSkills)
      if (
        filters.categories.length > 0 &&
        !filters.categories.some(cat => vacancy.hardSkills.includes(cat))
      ) {
        return false;
      }

      // Уровень
      if (filters.jobLevel.length > 0) {
        const matchesJobLevel = filters.jobLevel.some(level => {
          const range = jobLevelRanges.find(j => j.value === level);
          if (!range) return false;
          return (
            vacancy.experience >= range.minExp &&
            vacancy.experience <= range.maxExp
          );
        });
        if (!matchesJobLevel) return false;
      }

      // Зарплата
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
  }, [baseVacancies, filters, query]);

  const handleSearch = (q: string) => {
    setQuery(q);
  };

  const handleResetFilters = () => {
    setFilters({
      employmentType: [],
      categories: [],
      jobLevel: [],
      salaryRange: [],
    });
  };

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some(f => f.length > 0) || query.trim().length > 0,
    [filters, query]
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
      <SearchBar placeholder="🔍 Поиск по вашим вакансиям, навыкам, городам..." onSearch={handleSearch} />

      {/* HR actions */}
      <div className="container-w -mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link to="/hr/vacancies/create" className="inline-flex">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Создать вакансию
            </Button>
          </Link>
          <Link to="/hr/vacancies/archieve" className="inline-flex">
            <Button variant="outline" className="gap-2">
              <Archive className="w-4 h-4" /> Архив
            </Button>
          </Link>
        </div>
        {hasActiveFilters && (
          <button
            onClick={() => {
              setQuery('');
              handleResetFilters();
            }}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Очистить поиск и фильтры
          </button>
        )}
      </div>

      {/* Mobile Filters Button */}
      <div className="container-w md:hidden">
        <Button
          onClick={() => setIsFiltersModalOpen(true)}
          className="w-full bg-white dark:bg-slate-800/40 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-slate-600/30 hover:bg-gray-50 dark:hover:bg-slate-700/40"
        >
          <Filter className="w-4 h-4 mr-2" />
          Фильтры {hasActiveFilters && `(${Object.values(filters).flat().length})`}
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
          <HRVacancyList
            vacancies={filteredVacancies}
            totalCount={baseVacancies.length}
            onResetFilters={() => {
              setQuery('');
              handleResetFilters();
            }}
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Фильтры</h3>
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
              <Button onClick={() => setIsFiltersModalOpen(false)} className="w-full bg-primary hover:bg-primary/90">
                Применить фильтры
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, statusText }: { status: HRVacancy['status']; statusText: string }) {
  const styles: Record<HRVacancy['status'], string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    closed: 'bg-red-100 text-red-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${styles[status]}`}>
      {statusText}
    </span>
  );
}

function HRVacancyList({
  vacancies,
  totalCount,
  onResetFilters,
}: {
  vacancies: HRVacancy[];
  totalCount: number;
  onResetFilters: () => void;
}) {
  if (vacancies.length === 0) {
    return (
      <div className="w-full text-center py-8 md:py-16">
        <div className="text-gray-400 dark:text-gray-500 text-4xl md:text-6xl mb-4">🔍</div>
        <div className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium mb-2">
          Вакансии не найдены
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm mb-6">
          Попробуйте изменить фильтры или запрос поиска
        </div>
        <button
          onClick={onResetFilters}
          className="px-6 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          Сбросить
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 min-h-[30vh] rounded-2xl md:rounded-3xl items-center">
      <div className="w-full mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Ваши вакансии ({vacancies.length})</h2>
          <div className="flex items-center space-x-4">
            {vacancies.length !== totalCount && (
              <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                Показано {vacancies.length} из {totalCount} результатов
              </span>
            )}
          </div>
        </div>
      </div>

      {vacancies.map((vacancy, index) => (
        <HRVacancyCard key={vacancy.id} vacancy={vacancy} index={index} />)
      )}
    </div>
  );
}

function HRVacancyCard({ vacancy, index }: { vacancy: HRVacancy; index: number }) {
  return (
    <div
      className="w-full md:w-[95%] bg-white dark:bg-slate-900/40 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-slate-600/30 hover:shadow-md dark:hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-500/50 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{vacancy.title}</h3>
            <StatusBadge status={vacancy.status} statusText={vacancy.statusText} />
          </div>

          <div className="mb-3 md:mb-4">
            <span className="text-2xl md:text-3xl font-bold text-green-600">{vacancy.money.toLocaleString()} ₽</span>
            <span className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-2">за месяц</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded-full">{vacancy.type}</span>
            <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 text-xs md:text-sm font-medium rounded-full">{vacancy.hardSkills[0]}</span>
            {vacancy.softSkills[1] && (
              <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs md:text-sm font-medium rounded-full">{vacancy.softSkills[1]}</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1"><Users className="w-4 h-4" /> {vacancy.applicationsCount} откликов</div>
            <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {vacancy.viewsCount} просмотров</div>
          </div>
        </div>

        <div className="lg:ml-4 flex flex-col sm:flex-row gap-2 sm:items-start">
          <Link to="/hr/vacancies/$id/applicants" params={{ id: vacancy.id.toString() }} className="inline-flex">
            <Button className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">Кандидаты</Button>
          </Link>
          <Link to="/hr/vacancies/$id/update" params={{ id: vacancy.id.toString() }} className="inline-flex">
            <Button variant="outline" className="gap-2"><Pencil className="w-4 h-4" /> Редактировать</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
