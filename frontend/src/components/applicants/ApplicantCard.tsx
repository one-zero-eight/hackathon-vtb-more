import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileText, Eye, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { $api } from '@/api';
import { useState } from 'react';
interface ApplicantCardProps {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  fullName: string;
  score: number | string;
  status?: string;
  isRecommended?: boolean;
  userId: number;
  vac_id: number;
  application_id?: number;
}

const ApplicantCard = ({
  checked,
  onCheck,
  fullName,
  score,
  isRecommended,
  userId,
  vac_id,
  application_id,
}: ApplicantCardProps) => {
  // Определяем цвет скора в зависимости от значения
  const navigate = useNavigate();
  const [localIsRecommended, setLocalIsRecommended] = useState(isRecommended);

  const preIntMutate = $api.useMutation('patch', '/preinterview/{result_id}');

  const recomend = async (id: number, type: 'rec' | 'not-rec') => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/preinterview/for_application/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        await preIntMutate.mutateAsync({
          params: {
            path: {
              result_id: data.id,
            },
            query: {
              score:
                typeof score === 'string'
                  ? parseInt(score.replace('%', ''))
                  : score,
              is_recommended: type === 'rec',
              application_id: id,
            },
          },
        });
        // Update local state after successful API call
        setLocalIsRecommended(type === 'rec');
      }
    } catch (error) {
      console.error('Error updating recommendation:', error);
    }
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
              {localIsRecommended !== undefined && (
                <div className="mt-2">
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                      localIsRecommended
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 dark:from-green-900/20 dark:to-emerald-900/20 dark:text-green-300 dark:border-green-700'
                        : 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200 dark:from-red-900/20 dark:to-rose-900/20 dark:text-red-300 dark:border-red-700'
                    }`}
                  >
                    {localIsRecommended ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>
                      {localIsRecommended ? 'Рекомендован' : 'Не рекомендован'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Центральная часть - скор */}
          <div className="flex items-center mx-4">
            <div className="text-center">
              <div className={`text-2xl font-bold `}>{score}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Рейтинг
              </div>
            </div>
          </div>

          {/* Правая часть - действия */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="lg"
              className="h-9 px-3 border-gray-300 dark:border-slate-600 hover:bg-gray-50 text-md dark:hover:bg-slate-800"
              onClick={() =>
                navigate({
                  to: '/user/vacancy/$app_id/$id',
                  params: {
                    id: userId.toString(),
                    app_id: vac_id.toString(),
                  },
                })
              }
            >
              <Eye className="w-4 h-4 mr-1" />
              Профиль
            </Button>

            {localIsRecommended ? (
              <Button
                variant="outline"
                size="lg"
                className="h-9 px-3 border-red-800 text-red-800 cursor-pointer dark:border-red-800  hover:text-red-800"
                onClick={() => recomend(application_id || vac_id, 'not-rec')}
              >
                <X className="w-4 h-4 mr-1" />
                Не Рекомендоать
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-9 px-3 border-green-800 text-green-800 cursor-pointer dark:border-green-800  hover:text-green-800"
                onClick={() => recomend(application_id || vac_id, 'rec')}
              >
                <Check className="w-4 h-4 mr-1" />
                Рекомендоать
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
