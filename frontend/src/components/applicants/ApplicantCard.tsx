import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileText, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
interface ApplicantCardProps {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  fullName: string;
  score: number | string;
  profileUrl: string;
  reportUrl?: string;
  status?: string;
  isRecommended?: boolean;
  reason?: string | null;
}

const ApplicantCard = ({
  checked,
  onCheck,
  fullName,
  score,
  profileUrl,
  reportUrl,
  status,
  isRecommended,
  reason,
}: ApplicantCardProps) => {
  // Определяем цвет скора в зависимости от значения
  const getScoreColor = (score: number | string) => {
    if (score === 'N/A') return 'text-gray-500 dark:text-gray-400';

    const numScore =
      typeof score === 'string' ? parseInt(score.replace('%', '')) : score;
    if (numScore >= 90) return 'text-green-600 dark:text-green-400';
    if (numScore >= 80) return 'text-blue-600 dark:text-blue-400';
    if (numScore >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 mb-3 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Левая часть - чекбокс и имя */}
          <div className="flex items-center flex-1 min-w-0">
            <Checkbox
              checked={checked}
              onCheckedChange={onCheck}
              className="mr-4 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                {fullName}
              </h3>

              {/* Отображение информации о рекомендации */}
              {isRecommended !== undefined && (
                <div className="mt-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      isRecommended
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-700'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-700'
                    }`}
                  >
                    {isRecommended ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>
                      {isRecommended ? 'Рекомендован' : 'Не рекомендован'}
                    </span>
                  </div>
                  {reason && (
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 max-w-xs truncate">
                      {reason}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Центральная часть - скор */}
          <div className="flex items-center mx-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Рейтинг
              </div>
            </div>
          </div>

          {/* Правая часть - действия */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-9 px-3 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              <Link to={profileUrl} title="Просмотр профиля">
                <Eye className="w-4 h-4 mr-1" />
                Профиль
              </Link>
            </Button>

            {reportUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="h-9 px-3 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                <Link to={reportUrl} title="Просмотр отчета">
                  <FileText className="w-4 h-4 mr-1" />
                  Отчет
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Top row - checkbox and name */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center flex-1 min-w-0">
              <Checkbox
                checked={checked}
                onCheckedChange={onCheck}
                className="mr-3 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {fullName}
                </h3>
              </div>
            </div>

            {/* Score on mobile */}
            <div className="text-center ml-3">
              <div
                className={`text-xl sm:text-2xl font-bold ${getScoreColor(score)}`}
              >
                {score}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Рейтинг
              </div>
            </div>
          </div>

          {/* Recommendation info */}
          {isRecommended !== undefined && (
            <div className="mb-3 bg-re">
              <div
                className={`inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                  isRecommended
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-700'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-700'
                }`}
              >
                {isRecommended ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                <span className="">
                  {isRecommended ? 'Рекомендован' : 'Не рекомендован'}
                </span>
                {/* <span className="sm:hidden">
                  {isRecommended ? 'Рек.' : 'Не рек.'}
                </span> */}
              </div>
              {reason && (
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {reason}
                </div>
              )}
            </div>
          )}

          {/* Actions row */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex-1 h-8 sm:h-9 px-2 sm:px-3 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs sm:text-sm"
            >
              <Link to={profileUrl} title="Просмотр профиля">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Профиль</span>
                <span className="sm:hidden">Проф.</span>
              </Link>
            </Button>

            {reportUrl && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 h-8 sm:h-9 px-2 sm:px-3 border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-xs sm:text-sm"
              >
                <Link to={reportUrl} title="Просмотр отчета">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Отчет</span>
                  <span className="sm:hidden">Отч.</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
