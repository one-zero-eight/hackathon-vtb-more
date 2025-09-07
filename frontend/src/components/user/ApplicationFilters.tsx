import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ApplicationFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  applications: any[];
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
  selectedStatus,
  onStatusChange,
  applications,
}) => {
  const getStatusCount = (status: string) => {
    return applications.filter(app => app.statusText === status).length;
  };

  const filters = [
    { key: null, label: 'Все', count: applications.length },
    {
      key: 'Предварительная проверка',
      label: 'На проверке',
      count: getStatusCount('Предварительная проверка'),
    },
    {
      key: 'Ожидаем интервью',
      label: 'Ожидают интервью',
      count: getStatusCount('Ожидаем интервью'),
    },
    {
      key: 'Ожидаем результат',
      label: 'Ожидают результат',
      count: getStatusCount('Ожидаем результат'),
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter.key || 'all'}
          onClick={() => onStatusChange(filter.key)}
          className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedStatus === filter.key
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
          }`}
        >
          {filter.label}
          <Badge
            variant="secondary"
            className={`ml-2 ${
              selectedStatus === filter.key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {filter.count}
          </Badge>
        </button>
      ))}
    </div>
  );
};

export default ApplicationFilters;
