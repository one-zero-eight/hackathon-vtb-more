import React, { useMemo, useState, useEffect } from 'react';
import ApplicantCard from './ApplicantCard';
import { Button } from '@/components/ui/button';
import SearchBar from '../SearchBar';
import { $api, apiFetch } from '@/api';
import { useParams } from '@tanstack/react-router';
import type { components } from '@/api/types';
import { LoadingSpinner } from '../ui';

const TABS = [
  { key: 'interview', label: 'Ожидают интервью' },
  { key: 'decision', label: 'Ожидают результат' },
  { key: 'completed', label: 'Завершенные интервью' },
] as const;

const Applicants = () => {
  const [activeTab, setActiveTab] = useState<
    'interview' | 'decision' | 'completed'
  >('interview');
  const { id } = useParams({ from: '/hr/vacancies/$id/applicants' });
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<'name' | 'score'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Получаем заявки для конкретной вакансии
  const { data: applications, isLoading: isLoadingApplications } =
    $api.useQuery('get', '/applications');

  // Получаем всех пользователей
  const { data: users, isLoading: isLoadingUsers } = $api.useQuery(
    'get',
    '/users'
  );

  // Фильтруем заявки по вакансии
  const vacancyApplications = useMemo(() => {
    if (!applications || !id) return [];
    return applications.filter(app => app.vacancy_id === Number(id));
  }, [applications, id]);

  // Создаем Map для хранения pre-interview данных
  const [preInterviewData, setPreInterviewData] = useState<
    Record<number, components['schemas']['PreInterviewResponse']>
  >({});
  const [isLoadingPreInterviews, setIsLoadingPreInterviews] = useState(false);

  // Создаем Map для хранения post-interview данных
  const [postInterviewData, setPostInterviewData] = useState<
    Record<number, components['schemas']['PostInterviewResultResponse']>
  >({});
  const [isLoadingPostInterviews, setIsLoadingPostInterviews] = useState(false);

  // Загружаем pre-interview данные для всех заявок
  useEffect(() => {
    if (!vacancyApplications || vacancyApplications.length === 0) {
      setPreInterviewData({});
      return;
    }

    const loadPreInterviewData = async () => {
      setIsLoadingPreInterviews(true);
      const data: Record<
        number,
        components['schemas']['PreInterviewResponse']
      > = {};

      // Загружаем данные для каждой заявки параллельно
      const promises = vacancyApplications.map(async app => {
        try {
          const response = await apiFetch.GET(
            '/preinterview/for_application/{application_id}',
            {
              params: {
                path: {
                  application_id: app.id,
                },
              },
            }
          );

          if (response.data) {
            data[app.id] = response.data;
            console.log(
              `Loaded pre-interview data for application ${app.id}:`,
              response.data
            );
          } else {
            console.log(
              `No pre-interview data for application ${app.id}, status: ${response.response?.status}`
            );
            // Не сохраняем данные для заявок без pre-interview
          }
        } catch (error: any) {
          console.warn(
            `Failed to load pre-interview data for application ${app.id}:`,
            error
          );
        }
      });

      await Promise.all(promises);
      console.log('All pre-interview data loaded:', data);
      setPreInterviewData(data);
      setIsLoadingPreInterviews(false);
    };

    loadPreInterviewData();
  }, [vacancyApplications]);

  // Загружаем post-interview данные для всех заявок
  useEffect(() => {
    if (!vacancyApplications || vacancyApplications.length === 0) {
      setPostInterviewData({});
      return;
    }

    const loadPostInterviewData = async () => {
      setIsLoadingPostInterviews(true);
      const data: Record<
        number,
        components['schemas']['PostInterviewResultResponse']
      > = {};

      // Загружаем данные для каждой заявки параллельно
      const promises = vacancyApplications.map(async app => {
        try {
          const response = await apiFetch.GET(
            '/postinterview/for_application/{application_id}',
            {
              params: {
                path: {
                  application_id: app.id,
                },
              },
            }
          );

          if (response.data) {
            data[app.id] = response.data;
            console.log(
              `Loaded post-interview data for application ${app.id}:`,
              response.data
            );
          } else {
            console.log(
              `No post-interview data for application ${app.id}, status: ${response.response?.status}`
            );
          }
        } catch (error: any) {
          console.warn(
            `Failed to load post-interview data for application ${app.id}:`,
            error
          );
        }
      });

      await Promise.all(promises);
      console.log('All post-interview data loaded:', data);
      setPostInterviewData(data);
      setIsLoadingPostInterviews(false);
    };

    loadPostInterviewData();
  }, [vacancyApplications]);

  // Создаем объект пользователей для быстрого поиска
  const usersMap = useMemo(() => {
    if (!users) return {};
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<number, components['schemas']['UserResponse']>
    );
  }, [users]);

  // Функция для получения скора из pre-interview данных или GitHub статистики
  const getScore = (
    applicationId: number,
    githubStats: components['schemas']['GithubStats'] | null | undefined
  ) => {
    // Сначала ищем pre-interview данные для этой заявки
    const preInterviewDataForApp = preInterviewData[applicationId];

    // Добавляем отладочную информацию
    console.log(`Application ${applicationId}:`, {
      preInterviewData: preInterviewDataForApp,
      hasScore: preInterviewDataForApp?.score !== undefined,
      score: preInterviewDataForApp?.score,
      githubStats,
    });

    if (preInterviewDataForApp?.score !== undefined) {
      return preInterviewDataForApp.score;
    }

    // Если нет pre-interview данных, используем GitHub статистику
    if (!githubStats) return null; // Не показываем скор если нет данных

    // Конвертируем rank в числовое значение
    const rankScores: Record<string, number> = {
      'A+': 100,
      A: 90,
      'B+': 80,
      B: 70,
      'C+': 60,
      C: 50,
      'D+': 40,
      D: 30,
      'E+': 20,
      E: 10,
      F: 0,
    };

    const baseScore = rankScores[githubStats.rank] || 0;
    const progressBonus = (githubStats.rank_progress || 0) * 0.1; // 10% бонус за прогресс

    return Math.min(100, Math.round(baseScore + progressBonus));
  };

  // Функция для получения информации о рекомендации
  const getRecommendationInfo = (applicationId: number) => {
    const preInterviewDataForApp = preInterviewData[applicationId];

    return {
      isRecommended: preInterviewDataForApp?.is_recommended || false,
      reason: preInterviewDataForApp?.reason || null,
    };
  };

  // Преобразуем заявки в формат Applicant
  const allApplicants = useMemo(() => {
    if (!vacancyApplications || !usersMap) return [];

    const applicants = vacancyApplications.map(app => {
      const user = usersMap[app.user_id];
      const score = getScore(app.id, app.github_stats);
      const recommendationInfo = getRecommendationInfo(app.id);
      const postInterviewDataForApp = postInterviewData[app.id];

      const applicant = {
        id: app.id,
        fullName: user?.name || 'Неизвестный пользователь',
        score: score,
        user_id: app.user_id,
        status: app.status,
        userId: app.user_id,
        isRecommended: recommendationInfo.isRecommended,
        reason: recommendationInfo.reason,
        postInterviewData: postInterviewDataForApp,
        isCompleted: postInterviewDataForApp !== undefined,
      };

      console.log(`Created applicant for ${app.id}:`, applicant);
      return applicant;
    });

    console.log('All applicants created:', applicants);
    return applicants;
  }, [vacancyApplications, usersMap, preInterviewData, postInterviewData]);

  // Разделяем заявки по статусам
  const applicantsInterview = useMemo(() => {
    // Показываем заявки с pre-interview данными в "Ожидают интервью"
    const filtered = allApplicants.filter(app => {
      const hasPreInterviewData = preInterviewData[app.id] !== undefined;
      return hasPreInterviewData;
    });
    console.log('applicantsInterview filtered:', filtered);
    return filtered;
  }, [allApplicants, preInterviewData]);

  const applicantsDecision = useMemo(() => {
    // Показываем заявки БЕЗ pre-interview данных в "Ожидают результат"
    const filtered = allApplicants.filter(app => {
      const hasPreInterviewData = preInterviewData[app.id] !== undefined;
      const hasPostInterviewData = postInterviewData[app.id] !== undefined;
      console.log(
        `Application ${app.id}: hasPreInterviewData = ${hasPreInterviewData}, hasPostInterviewData = ${hasPostInterviewData}`
      );
      return !hasPreInterviewData && !hasPostInterviewData;
    });
    console.log('applicantsDecision filtered:', filtered);
    return filtered;
  }, [allApplicants, preInterviewData, postInterviewData]);

  const applicantsCompleted = useMemo(() => {
    // Показываем заявки с post-interview данными в "Завершенные интервью"
    const filtered = allApplicants.filter(app => {
      const hasPostInterviewData = postInterviewData[app.id] !== undefined;
      return hasPostInterviewData;
    });
    console.log('applicantsCompleted filtered:', filtered);
    return filtered;
  }, [allApplicants, postInterviewData]);

  // Получаем текущий список заявок в зависимости от активной вкладки
  const currentApplicants = useMemo(() => {
    switch (activeTab) {
      case 'interview':
        return applicantsInterview;
      case 'decision':
        return applicantsDecision;
      case 'completed':
        return applicantsCompleted;
      default:
        return applicantsInterview;
    }
  }, [activeTab, applicantsInterview, applicantsDecision, applicantsCompleted]);

  const applicants = useMemo(() => {
    const filtered = currentApplicants.filter(a =>
      a.fullName.toLowerCase().includes(query.trim().toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'name') {
        return sortDir === 'asc'
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      }
      // score
      const aScore = a.score ?? 0;
      const bScore = b.score ?? 0;
      return sortDir === 'asc' ? aScore - bScore : bScore - aScore;
    });
    return sorted;
  }, [currentApplicants, query, sortDir, sortKey]);

  const toggleSelect = (id: number, checked?: boolean) => {
    setSelectedIds(prev => {
      const isChecked = checked ?? !prev.includes(id);
      if (isChecked) {
        return [...prev, id];
      }
      return prev.filter(x => x !== id);
    });
  };

  const countInterview = applicantsInterview.length;
  const countDecision = applicantsDecision.length;
  const countCompleted = applicantsCompleted.length;

  // Состояние загрузки
  const isLoading =
    isLoadingApplications ||
    isLoadingUsers ||
    isLoadingPreInterviews ||
    isLoadingPostInterviews;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
      <div className="container-w mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            Заявки на вакансию #{id}
          </h1>
        </div>

        {/* Search */}
        <div className="w-full">
          <SearchBar
            placeholder="Выберите кандидатов..."
            onSearch={setQuery}
            className="!px-0 !w-full max-w-none"
          />
        </div>

        {/* Tabs row with Approve on right */}
        <div className="flex items-end justify-between mb-2 border-b border-slate-700/60">
          <nav className="flex gap-6">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              const count =
                tab.key === 'interview'
                  ? countInterview
                  : tab.key === 'decision'
                    ? countDecision
                    : countCompleted;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 -mb-px text-sm md:text-base font-medium transition-colors flex items-center gap-2 border-b-2
                    ${
                      isActive
                        ? 'border-indigo-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-slate-500'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full text-xs font-semibold
                      ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-700 text-gray-100'}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer px-4 md:px-6 lg:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-300 dark:border-indigo-600 border-indigo-600"
          >
            Утвердить
          </Button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {applicants.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Нет заявок в этом разделе
            </div>
          ) : (
            applicants.map(applicant => (
              <ApplicantCard
                vac_id={applicant.id}
                key={applicant.id}
                userId={applicant.userId}
                checked={selectedIds.includes(applicant.id)}
                onCheck={val => toggleSelect(applicant.id, Boolean(val))}
                fullName={applicant.fullName}
                score={applicant.score !== null ? `${applicant.score}%` : 'N/A'}
                status={applicant.status}
                isRecommended={applicant.isRecommended}
                postInterviewData={applicant.postInterviewData}
                isCompleted={applicant.isCompleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
