import React from 'react';
import { Building2, Map, Calendar, Clock } from 'lucide-react';
import { type Application } from '@/data/mockVacancies';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ApplicationCardProps {
  application: Application;
  index: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  index,
}) => {
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pre_interview':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'waiting_for_interview':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'waiting_for_result':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Card className="w-full bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {application.vacancyTitle}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="text-xs font-semibold border-2"
              >
                {application.salary.toLocaleString()} ₽/мес
              </Badge>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
              >
                {application.statusText}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Company and Location */}
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 dark:text-gray-400 gap-2 sm:gap-4">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">{application.company}</span>
            </div>
            <div className="flex items-center">
              <Map className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm font-medium">{application.city}</span>
            </div>
          </div>

          {/* Application Date */}
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            <span className="text-sm">
              Подана заявка: {formatDate(application.appliedDate)}
            </span>
          </div>

          {/* Status Timeline */}
          <div className="pt-2">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3 h-3" />
              <span>Статус обновлен сегодня</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
