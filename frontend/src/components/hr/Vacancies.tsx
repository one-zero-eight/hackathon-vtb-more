import React, { useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import SearchBar from '@/components/SearchBar';
import VacancyFilters from '@/components/vacancies/VacancyFilters';
import { Button } from '@/components/ui/button';
import { Filter, X, Users, Eye, Pencil, Archive } from 'lucide-react';
import { $api } from '@/api';
import { type HRVacancy, transformHRVacancyData } from '@/types/hr-vacancy';
import { LoadingSpinner, ErrorState } from '@/components/ui';
import {
  useVacancyFilters,
  formatExperienceRange,
} from '@/hooks/useVacancyFilters';

// Функция для преобразования HR вакансий в формат, совместимый с хуком
const transformToVacancyData = (hrVacancies: HRVacancy[]) => {
  return hrVacancies.map(vacancy => ({
    id: vacancy.id,
    name: vacancy.title,
    description: vacancy.description,
    city: vacancy.city,
    salary: vacancy.salary,
    required_experience: vacancy.requiredExperience,
    weekly_hours_occupancy: vacancy.weeklyHours,
    open_time: vacancy.openTime,
    close_time: vacancy.closeTime,
    is_active: vacancy.isActive,
    user_id: vacancy.userId,
  }));
};

export const Vacancies = () => {
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Получаем данные пользователя и вакансий
  const { data: user } = $api.useQuery('get', '/auth/me');
  const {
    data: vacancies,
    isLoading,
    isError,
  } = $api.useQuery('get', '/vacancy');

  // Фильтруем вакансии по текущему HR пользователю
  const baseVacancies = useMemo(() => {
    if (!vacancies || !user) return [];

    const hrVacancies = vacancies.filter(
      vacancy => vacancy.user_id === user.id
    );
    return transformHRVacancyData(hrVacancies);
  }, [vacancies, user]);

  // Преобразуем HR вакансии в формат, совместимый с хуком
  const vacancyData = useMemo(() => {
    return transformToVacancyData(baseVacancies);
  }, [baseVacancies]);

  // Используем хук для фильтрации
  const {
    filters,
    setFilters,
    expandedSections,
    setExpandedSections,
    filterOptions,
    filteredVacancies: filteredVacancyData,
    searchQuery,
    setSearchQuery,
    resetFilters,
    hasActiveFilters,
  } = useVacancyFilters(vacancyData);

  // Преобразуем отфильтрованные данные обратно в HR формат
  const filteredVacancies = useMemo(() => {
    return baseVacancies.filter(hrVacancy =>
      filteredVacancyData.some(vacancyData => vacancyData.id === hrVacancy.id)
    );
  }, [baseVacancies, filteredVacancyData]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
  };

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-6 md:gap-8">
        <LoadingSpinner
          title="Загружаем вакансии..."
          description="Получаем список ваших вакансий"
        />
      </div>
    );
  }

  // Показываем состояние ошибки
  if (isError) {
    return (
      <div className="w-full flex flex-col items-center gap-6 md:gap-8">
        <ErrorState
          title="Ошибка загрузки вакансий"
          description="Не удалось загрузить список вакансий. Попробуйте обновить страницу."
          emoji="😕"
          buttonText="Обновить страницу"
          onButtonClick={() => window.location.reload()}
        />
      </div>
    );
  }
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
      <SearchBar
        placeholder="🔍 Поиск по вашим вакансиям, навыкам, городам..."
        onSearch={handleSearch}
      />

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
            onClick={resetFilters}
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
          <HRVacancyList
            vacancies={filteredVacancies}
            totalCount={baseVacancies.length}
            onResetFilters={resetFilters}
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

function StatusBadge({
  status,
  statusText,
}: {
  status: HRVacancy['status'];
  statusText: string;
}) {
  const styles: Record<HRVacancy['status'], string> = {
    active: 'bg-green-100 text-green-700',
    draft: 'bg-gray-100 text-gray-700',
    closed: 'bg-red-100 text-red-700',
    archived: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium rounded-full ${styles[status]}`}
    >
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
        <div className="text-gray-400 dark:text-gray-500 text-4xl md:text-6xl mb-4">
          🔍
        </div>
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Ваши вакансии ({vacancies.length})
          </h2>
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
        <HRVacancyCard key={vacancy.id} vacancy={vacancy} index={index} />
      ))}
    </div>
  );
}

function HRVacancyCard({
  vacancy,
  index,
}: {
  vacancy: HRVacancy;
  index: number;
}) {
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
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {vacancy.title}
            </h3>
            <StatusBadge
              status={vacancy.status}
              statusText={vacancy.statusText}
            />
          </div>

          <div className="mb-3 md:mb-4">
            {vacancy.salary ? (
              <>
                <span className="text-2xl md:text-3xl font-bold text-green-600">
                  {vacancy.salary.toLocaleString()} ₽
                </span>
                <span className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-2">
                  за месяц
                </span>
              </>
            ) : (
              <span className="text-lg md:text-xl text-gray-500 dark:text-gray-400">
                Зарплата не указана
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded-full">
              {vacancy.type}
            </span>
            <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs md:text-sm font-medium rounded-full">
              {formatExperienceRange(vacancy.requiredExperience)}
            </span>
            <span className="px-2 md:px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm font-medium rounded-full">
              {vacancy.weeklyHours} ч/нед
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" /> {vacancy.applicationsCount} откликов
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {vacancy.viewsCount} просмотров
            </div>
          </div>
        </div>

        <div className="lg:ml-4 flex flex-col sm:flex-row gap-2 sm:items-start">
          <Link
            to="/hr/vacancies/$id/applicants"
            params={{ id: vacancy.id.toString() }}
            className="inline-flex"
          >
            <Button className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white">
              Кандидаты
            </Button>
          </Link>
          <Link
            to="/hr/vacancies/$id/update"
            params={{ id: vacancy.id.toString() }}
            className="inline-flex"
          >
            <Button variant="outline" className="gap-2">
              <Pencil className="w-4 h-4" /> Редактировать
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
