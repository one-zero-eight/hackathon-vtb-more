import React from 'react';
import {
  Map,
  Clock,
  Briefcase,
  DollarSign,
  Video,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
} from 'lucide-react';
import { type Application } from '@/types/application';
import { Card, CardContent } from '@/components/ui/card';
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

  const getStatusConfig = (
    status: Application['status'],
    originalStatus: string
  ) => {
    if (originalStatus === 'approved_for_interview') {
      return {
        icon: CheckCircle,
        color: 'text-emerald-600 dark:text-emerald-400',
        bgColor: '',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        text: 'Готово к интервью',
      };
    }

    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'text-amber-600 dark:text-amber-400',
          bgColor: '',
          borderColor: 'border-amber-200 dark:border-amber-800',
          text: 'На рассмотрении',
        };
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bgColor: '',
          borderColor: 'border-green-200 dark:border-green-800',
          text: 'Одобрена',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bgColor: '',
          borderColor: 'border-red-200 dark:border-red-800',
          text: 'Отклонена',
        };
      default:
        return {
          icon: ClockIcon,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: '',
          borderColor: 'border-gray-200 dark:border-gray-800',
          text: 'На рассмотрении',
        };
    }
  };

  const statusConfig = getStatusConfig(
    application.status,
    application.originalStatus
  );
  const isInterviewReady =
    application.originalStatus === 'approved_for_interview';
  const StatusIcon = statusConfig.icon;

  console.log(application.id);
  return (
    <Card className="group hover:shadow-md transition-all duration-200 bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-700/50 hover:border-gray-300 dark:hover:border-slate-600/70">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left side - Job info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex-shrink-0">
                <Briefcase className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {application.vacancyTitle}
              </h3>
            </div>
          </div>

          {/* Right side - Status and action */}
          <div className="flex flex-col items-end gap-3">
            {/* Status */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
            >
              <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {statusConfig.text}
              </span>
            </div>

            {/* Action button */}
            <div className="flex items-center">
              {isInterviewReady ? (
                <button
                  onClick={() =>
                    navigate({
                      to: '/interview/$applicationId',
                      params: { applicationId: application.id.toString() },
                    })
                  }
                  className="group/btn bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Начать интервью</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() =>
                    navigate({ to: `/user/vacancy/${application.vacancyId}` })
                  }
                  className="group/btn text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <span>Подробнее</span>
                  <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationCard;
