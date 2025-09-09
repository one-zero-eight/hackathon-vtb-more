import React from 'react';
import {
  Map,
  Calendar,
  Clock,
  Info,
  Briefcase,
  DollarSign,
  Users,
} from 'lucide-react';
import { type Application } from '@/types/application';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '../ui';
import { useNavigate } from '@tanstack/react-router';

interface ApplicationCardProps {
  application: Application;
  index: number;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  index,
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };
  return (
    <Card className="w-full bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 flex justify-between items-center">
            <CardTitle className="text-lg md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {application.vacancyTitle}
            </CardTitle>
            <div className="flex items-center gap-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}
                title={
                  application.originalStatus !== application.statusText
                    ? `Детальный статус: ${application.originalStatus}`
                    : undefined
                }
              >
                {application.statusText}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex gap-2">
          {' '}
          <button
            onClick={() =>
              navigate({ to: `/user/vacancy/${application.vacancyId}` })
            }
            className={`px-4 py-2 cursor-pointer rounded-lg text-md font-medium transition-all duration-200 bg-blue-950 hover:bg-blue-900 text-white shadow-md `}
          >
            Перейти к вакансии
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
