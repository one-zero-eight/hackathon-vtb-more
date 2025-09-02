import React from 'react';
import { type Vacancy } from '@/data/mockVacancies';
import VacancyCard from './VacancyCard';

interface VacancyListProps {
  vacancies: Vacancy[];
  totalCount: number;
  onResetFilters: () => void;
}

const VacancyList: React.FC<VacancyListProps> = ({
  vacancies,
  totalCount,
  onResetFilters,
}) => {
  if (vacancies.length === 0) {
    return (
      <div className="w-full text-center py-16">
        <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
        <div className="text-gray-500 dark:text-gray-400 text-xl font-medium mb-2">
          Вакансии не найдены
        </div>
        <div className="text-gray-400 dark:text-gray-500 text-sm mb-6">
          Попробуйте изменить фильтры для получения результатов
        </div>
        <button
          onClick={onResetFilters}
          className="px-6 py-2 text-sm text-indigo-600 dark:text-indigo-400 border border-indigo-300 dark:border-indigo-600 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  return (
    <div className="flex-6 flex flex-col gap-4 min-h-[30vh] rounded-3xl items-center">
      <div className="w-full mb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Доступные вакансии ({vacancies.length})
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
        <VacancyCard key={vacancy.id} vacancy={vacancy} index={index} />
      ))}
    </div>
  );
};

export default VacancyList;
