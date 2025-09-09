import React, { useMemo, useState, useEffect } from 'react';
import ApplicantCard from './ApplicantCard';
import { Button } from '@/components/ui/button';
import SearchBar from '../SearchBar';
import { $api } from '@/api';
import { useParams } from '@tanstack/react-router';

type Applicant = {
  id: number;
  fullName: string;
  score: number | null;
  profileUrl: string;
  reportUrl?: string;
  status: string;
  userId: number;
  isRecommended?: boolean;
  reason?: string | null;
};

// Удаляем моковые данные - будем использовать реальные данные из API

const TABS = [
  { key: 'interview', label: 'Ожидают интервью' },
  { key: 'decision', label: 'Ожидают результат' },
] as const;

const Applicants = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'decision'>(
    'interview'
  );
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
  const [preInterviewData, setPreInterviewData] = useState<Record<number, any>>(
    {}
  );
  const [isLoadingPreInterviews, setIsLoadingPreInterviews] = useState(false);

  // Загружаем pre-interview данные для всех заявок
  useEffect(() => {
    if (!vacancyApplications || vacancyApplications.length === 0) {
      setPreInterviewData({});
      return;
    }

    const loadPreInterviewData = async () => {
      setIsLoadingPreInterviews(true);
      const data: Record<number, any> = {};

      // Загружаем данные для каждой заявки параллельно
      const promises = vacancyApplications.map(async app => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/preinterview/for_application/${app.id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            data[app.id] = result;
            console.log(
              `Loaded pre-interview data for application ${app.id}:`,
              result
            );
          } else {
            console.log(
              `No pre-interview data for application ${app.id}, status: ${response.status}`
            );
            // Не сохраняем данные для заявок без pre-interview
          }
        } catch (error) {
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

  // Создаем объект пользователей для быстрого поиска
  const usersMap = useMemo(() => {
    if (!users) return {};
    return users.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<number, any>
    );
  }, [users]);

  // Функция для получения скора из pre-interview данных или GitHub статистики
  const getScore = (applicationId: number, githubStats: any) => {
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

  // Преобразуем заявки в формат Applicant (ТОЛЬКО те, у кого есть pre-interview данные)
  const allApplicants = useMemo(() => {
    if (!vacancyApplications || !usersMap) return [];

    const applicants = vacancyApplications
      .filter(app => {
        // Показываем ТОЛЬКО заявки с pre-interview данными
        const hasPreInterviewData = preInterviewData[app.id];
        return hasPreInterviewData;
      })
      .map(app => {
        const user = usersMap[app.user_id];
        const score = getScore(app.id, app.github_stats);
        const recommendationInfo = getRecommendationInfo(app.id);

        const applicant = {
          id: app.id,
          fullName: user?.name || 'Неизвестный пользователь',
          score: score,
          profileUrl: app.profile_url || `/profile/${app.user_id}`,
          reportUrl: `/report/${app.id}`,
          status: app.status,
          userId: app.user_id,
          isRecommended: recommendationInfo.isRecommended,
          reason: recommendationInfo.reason,
        };

        console.log(`Created applicant for ${app.id}:`, applicant);
        return applicant;
      });

    console.log(
      'All applicants created (only with pre-interview data):',
      applicants
    );
    return applicants;
  }, [vacancyApplications, usersMap, preInterviewData]);

  // Разделяем заявки по статусам
  const applicantsInterview = useMemo(() => {
    // Все заявки с pre-interview данными показываем в "Ожидают интервью"
    return allApplicants;
  }, [allApplicants]);

  const applicantsDecision = useMemo(() => {
    // Заявки с результатами после завершения интервью (пока пустой, так как все заявки с pre-interview данными)
    return [];
  }, []);

  // Получаем текущий список заявок в зависимости от активной вкладки
  const currentApplicants = useMemo(() => {
    return activeTab === 'interview' ? applicantsInterview : applicantsDecision;
  }, [activeTab, applicantsInterview, applicantsDecision]);

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

  // Состояние загрузки
  const isLoading =
    isLoadingApplications || isLoadingUsers || isLoadingPreInterviews;

  const handleApprove = () => {
    // Placeholder action
    console.log('Approved ids:', selectedIds);
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center gap-6 md:gap-8">
        <div className="container-w mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Загрузка заявок...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
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
                tab.key === 'interview' ? countInterview : countDecision;
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
            onClick={handleApprove}
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
                key={applicant.id}
                checked={selectedIds.includes(applicant.id)}
                onCheck={val => toggleSelect(applicant.id, Boolean(val))}
                fullName={applicant.fullName}
                score={applicant.score !== null ? `${applicant.score}%` : 'N/A'}
                profileUrl={applicant.profileUrl}
                reportUrl={applicant.reportUrl}
                status={applicant.status}
                isRecommended={applicant.isRecommended}
                reason={applicant.reason}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
