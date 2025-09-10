import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Brain,
  MapPin,
  FileText,
  TrendingUp,
  User,
  Calendar,
  Award,
} from 'lucide-react';
import { $api, apiFetch } from '@/api';
import { LoadingSpinner, ErrorState } from '../ui';
import type { components } from '@/api/types';
import { useQueryClient } from '@tanstack/react-query';

type PostInterviewResult = components['schemas']['PostInterviewResultResponse'];
type SkillResult = components['schemas']['SkillResultResponse'];
type InterviewMessage = components['schemas']['InterviewMessageResponse'];

const InterviewResults = () => {
  const { appId } = useParams({
    from: '/hr/interview-results/$appId',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [interviewData, setInterviewData] =
    useState<PostInterviewResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [vacancyId, setVacancyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchInterviewResults = async () => {
      try {
        setIsLoading(true);
        const response = await apiFetch.GET(
          '/postinterview/for_application/{application_id}',
          {
            params: {
              path: {
                application_id: Number(appId),
              },
            },
          }
        );

        if (response.data) {
          setInterviewData(response.data);

          // Fetch application data to get vacancy ID
          const appResponse = await apiFetch.GET(
            '/applications/{application_id}',
            {
              params: {
                path: {
                  application_id: Number(appId),
                },
              },
            }
          );

          if (appResponse.data) {
            setVacancyId(appResponse.data.vacancy_id);
          }
        } else {
          setError('Результаты интервью не найдены');
        }
      } catch (err) {
        console.error('Error fetching interview results:', err);
        setError('Ошибка при загрузке результатов интервью');
      } finally {
        setIsLoading(false);
      }
    };

    if (appId) {
      fetchInterviewResults();
    }
  }, [appId]);

  const handleGoBack = () => {
    if (vacancyId) {
      navigate({
        to: '/hr/vacancies/$id/applicants',
        params: { id: vacancyId.toString() },
      });
    } else {
      // Fallback to a general HR page if vacancy ID is not available
      navigate({ to: '/hr' });
    }
  };

  const handleHireDecision = async (hire: boolean) => {
    if (!appId) return;

    try {
      setIsUpdating(true);

      // Update application status
      const formData = new FormData();
      formData.append('status', hire ? 'approved' : 'rejected');

      await fetch(`${import.meta.env.VITE_API_URL}/applications/${appId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      // Update post-interview recommendation
      if (interviewData) {
        await apiFetch.PATCH('/postinterview/{result_id}', {
          params: {
            path: {
              result_id: interviewData.id,
            },
          },
          query: {
            is_recommended: hire,
          },
        });
      }

      // Update local state
      setInterviewData(prev =>
        prev ? { ...prev, is_recommended: hire } : null
      );

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['get', '/applications'] });
      queryClient.invalidateQueries({
        queryKey: ['get', '/applications/my/with_vacancies'],
      });
    } catch (error) {
      console.error('Error updating hire decision:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <LoadingSpinner
        title="Загрузка результатов интервью"
        description="Пожалуйста, подождите, пока загружаются данные..."
      />
    );
  }

  if (error || !interviewData) {
    return (
      <ErrorState
        title="Ошибка загрузки результатов"
        description={error || 'Результаты интервью не найдены'}
      />
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80)
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    if (score >= 60)
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
  };

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к заявкам
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Результаты интервью
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Заявка #{appId}
              </p>
            </div>
          </div>

          {/* Overall Result Badge and Action Buttons */}
          <div className="flex items-center gap-4">
            {interviewData.is_recommended ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 px-4 py-2 text-lg">
                <CheckCircle className="w-5 h-5 mr-2" />
                Рекомендован
              </Badge>
            ) : (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 px-4 py-2 text-lg">
                <XCircle className="w-5 h-5 mr-2" />
                Не рекомендован
              </Badge>
            )}

            {/* HR Override Buttons */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleHireDecision(true)}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isUpdating ? 'Обновление...' : 'Нанять'}
              </Button>
              <Button
                onClick={() => handleHireDecision(false)}
                disabled={isUpdating}
                variant="destructive"
                className="px-4 py-2"
              >
                <XCircle className="w-4 h-4 mr-2" />
                {isUpdating ? 'Обновление...' : 'Отклонить'}
              </Button>
            </div>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white dark:bg-slate-800 rounded-full shadow-lg">
                  <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Итоговый балл
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Общая оценка кандидата
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-6xl font-bold ${getScoreColor(interviewData.score)}`}
                >
                  {interviewData.score}
                </div>
                <div className="text-lg text-gray-600 dark:text-gray-400">
                  из 100 баллов
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skill Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Оценка навыков
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {interviewData.skill_scores.map((skill, index) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          Навык #{skill.skill_id}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Вес: {skill.weight}
                        </p>
                      </div>
                    </div>
                    <Badge className={getScoreBadgeColor(skill.score)}>
                      {skill.score} баллов
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Interview Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Резюме интервью
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interviewData.interview_summary}
                </p>
              </CardContent>
            </Card>

            {/* Candidate Response */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  Ответ кандидата
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interviewData.candidate_response}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Emotional Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Эмоциональный анализ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interviewData.emotional_analysis}
                </p>
              </CardContent>
            </Card>

            {/* Candidate Roadmap */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  План развития кандидата
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interviewData.candidate_roadmap}
                </p>
              </CardContent>
            </Card>

            {/* Overall Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-500" />
                  Общее резюме
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {interviewData.summary}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Interview Transcript */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gray-500" />
              Транскрипт интервью
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {interviewData.interview_transcript.map((message, index) => (
                <div key={message.id} className="flex gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === 'user'
                        ? 'bg-blue-100 dark:bg-blue-900/20'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {message.role === 'user' ? 'Кандидат' : 'Интервьюер'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-slate-800 p-3 rounded-lg">
                      {message.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewResults;
