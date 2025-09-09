import React from 'react';
import { Badge } from '@/components/ui/badge';
import { type Application } from '@/types/application';

interface ApplicationFiltersProps {
  selectedStatus: string | null;
  onStatusChange: (status: string | null) => void;
  applications: Application[];
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
      key: 'На рассмотрении',
      label: 'На рассмотрении',
      count: getStatusCount('На рассмотрении'),
    },
    {
      key: 'Одобрена',
      label: 'Одобрена',
      count:
        getStatusCount('Одобрена') +
        getStatusCount('Одобрена для собеседования') +
        getStatusCount('На собеседовании'),
    },
    {
      key: 'Отклонена',
      label: 'Отклонена',
      count:
        getStatusCount('Отклонена') +
        getStatusCount('Отклонена для собеседования'),
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
