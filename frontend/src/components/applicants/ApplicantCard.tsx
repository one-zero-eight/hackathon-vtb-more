import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileText, Eye, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { $api } from '@/api';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { convertScoreTo100 } from '@/lib/utils';
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
  postInterviewData?: any; // PostInterviewResultResponse
  isCompleted?: boolean;
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
  postInterviewData,
  isCompleted,
}: ApplicantCardProps) => {
  // Определяем цвет скора в зависимости от значения
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [localIsRecommended, setLocalIsRecommended] = useState(isRecommended);
  const [localPostInterviewData, setLocalPostInterviewData] =
    useState(postInterviewData);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalIsRecommended(isRecommended);
  }, [isRecommended]);

  useEffect(() => {
    setLocalPostInterviewData(postInterviewData);
  }, [postInterviewData]);
  const preIntMutate = $api.useMutation('patch', '/preinterview/{result_id}');

  const applicationMutate = $api.useMutation(
    'patch',
    '/applications/{application_id}'
  );

  const updatePreInterviewRecommendation = async (
    id: number,
    type: 'rec' | 'not-rec'
  ) => {
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
                ? parseInt(score.replace('%', '')) / 100
                : score / 100,
            is_recommended: type === 'rec',
            application_id: id,
          },
        },
      });

      // Update application status using direct fetch with FormData
      const formData = new FormData();
      formData.append(
        'status',
        type === 'rec' ? 'approved_for_interview' : 'rejected_for_interview'
      );

      await fetch(`${import.meta.env.VITE_API_URL}/applications/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
    }
  };

  const recomend = async (id: number, type: 'rec' | 'not-rec') => {
    try {
      if (isCompleted && postInterviewData && postInterviewData.id) {
        // For completed interviews, update post-interview recommendation
        const formData = new FormData();
        formData.append('is_recommended', type === 'rec' ? 'true' : 'false');

        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/postinterview/${postInterviewData.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          // Update local post-interview data immediately
          setLocalPostInterviewData({
            ...postInterviewData,
            is_recommended: type === 'rec',
          });
        } else {
          console.error(
            'Failed to update post-interview recommendation:',
            response.status,
            response.statusText
          );
          // Fall back to pre-interview logic if post-interview update fails
          await updatePreInterviewRecommendation(id, type);
        }
      } else {
        // For pre-interview, use existing logic
        await updatePreInterviewRecommendation(id, type);
      }

      // Update local state after successful API call
      setLocalIsRecommended(type === 'rec');

      // Invalidate applications queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['get', '/applications/my/with_vacancies'],
      });
      queryClient.invalidateQueries({ queryKey: ['get', '/applications'] });

      // Invalidate post-interview data if it exists
      if (isCompleted) {
        queryClient.invalidateQueries({
          queryKey: ['get', '/postinterview/for_application/{application_id}'],
        });
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
              <div className={`text-2xl font-bold `}>
                {isCompleted && (localPostInterviewData || postInterviewData)
                  ? convertScoreTo100(
                      (localPostInterviewData || postInterviewData)?.score
                    )
                  : typeof score === 'string'
                    ? score
                    : convertScoreTo100(score)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {isCompleted ? 'Итоговый балл' : 'Рейтинг'}
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
                    app_id: vac_id.toString(),
                    id: userId.toString(),
                  },
                })
              }
            >
              <Eye className="w-4 h-4 mr-1" />
              Профиль
            </Button>

            {/* Results button for completed interviews */}
            {isCompleted && (
              <Button
                variant="outline"
                size="lg"
                className="h-9 px-3 border-blue-800 text-blue-800 cursor-pointer dark:border-blue-800 hover:text-blue-800"
                onClick={() =>
                  navigate({
                    to: '/interview/interview-results/$appId',
                    params: {
                      appId: application_id?.toString() || vac_id.toString(),
                    },
                  })
                }
              >
                <FileText className="w-4 h-4 mr-1" />
                Результаты
              </Button>
            )}

            {/* Recommendation buttons - always show */}
            {localIsRecommended ? (
              <Button
                variant="outline"
                size="lg"
                className="h-9 px-3 border-red-800 text-red-800 cursor-pointer dark:border-red-800  hover:text-red-800"
                onClick={() => recomend(application_id || vac_id, 'not-rec')}
              >
                <X className="w-4 h-4 mr-1" />
                Не Рекомендовать
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="h-9 px-3 border-green-800 text-green-800 cursor-pointer dark:border-green-800  hover:text-green-800"
                onClick={() => recomend(application_id || vac_id, 'rec')}
              >
                <Check className="w-4 h-4 mr-1" />
                Рекомендовать
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ApplicantCard;
