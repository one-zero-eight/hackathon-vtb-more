import React from 'react';
import { useParams } from '@tanstack/react-router';
import { $api } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  FileText,
  User,
  Download,
  TrendingUp,
  Target,
  Clock,
  Calendar,
} from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { convertScoreTo100, convertScoreToPercentage } from '@/lib/utils';

const Report = () => {
  const { app_id, id } = useParams({ strict: false });
  const navigate = useNavigate();

  const {
    data: reportData,
    isLoading,
    error,
  } = $api.useQuery('get', '/postinterview/for_application/{application_id}', {
    params: {
      path: {
        application_id: Number(app_id),
      },
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="container-w mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Загрузка отчета...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
        <div className="container-w mx-auto">
          <div className="text-center py-12">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Ошибка загрузки отчета
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Не удалось загрузить данные отчета
            </p>
            <Button
              onClick={() => navigate({ to: '/hr/vacancies' })}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к вакансиям
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    const score100 = convertScoreTo100(score);
    if (score100 >= 90) return 'text-green-600 dark:text-green-400';
    if (score100 >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score100 >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    const score100 = convertScoreTo100(score);
    if (score100 >= 90)
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
    if (score100 >= 80)
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
    if (score100 >= 70)
      return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-w mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: '/hr/vacancies' })}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад к вакансиям
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                Отчет по интервью
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Детальный анализ кандидата
              </p>
            </div>
          </div>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4 mr-2" />
            Скачать PDF
          </Button>
        </div>

        {/* Main Recommendation Card */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <User className="w-6 h-6 text-indigo-600" />
                Рекомендация
              </CardTitle>
              <Badge
                className={`px-4 py-2 text-sm font-semibold ${
                  reportData.is_recommended
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                }`}
              >
                {reportData.is_recommended ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Рекомендован
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Не рекомендован
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <div
                className={`p-6 rounded-xl border-2 ${getScoreBgColor(reportData.score)}`}
              >
                <div className="text-center">
                  <div
                    className={`text-4xl font-bold ${getScoreColor(reportData.score)} mb-2`}
                  >
                    {convertScoreToPercentage(reportData.score)}
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Общий балл
                  </div>
                </div>
              </div>

              {/* Interview Date */}
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600">
                <div className="text-center">
                  <Calendar className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {new Date().toLocaleDateString('ru-RU')}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Дата интервью
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {reportData.interview_transcript.length * 2} мин
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Длительность
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Scores */}
        {reportData.skill_scores && reportData.skill_scores.length > 0 && (
          <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Target className="w-6 h-6 text-indigo-600" />
                Оценка по навыкам
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportData.skill_scores.map((skill, index) => (
                  <div
                    key={skill.skill_id}
                    className={`p-4 rounded-xl border-2 ${getScoreBgColor(skill.score)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Навык {index + 1}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Вес: {skill.weight}%
                      </div>
                    </div>
                    <div
                      className={`text-2xl font-bold ${getScoreColor(skill.score)}`}
                    >
                      {convertScoreToPercentage(skill.score)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interview Summary */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              Резюме интервью
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reportData.interview_summary}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Response */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-indigo-600" />
              Ответ кандидата
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reportData.candidate_response}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Analysis */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Star className="w-6 h-6 text-indigo-600" />
              Эмоциональный анализ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reportData.emotional_analysis}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Candidate Roadmap */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <Target className="w-6 h-6 text-indigo-600" />
              План развития кандидата
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reportData.candidate_roadmap}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Full Interview Transcript */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" />
              Полная расшифровка интервью
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.interview_transcript.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl ${
                    message.role === 'user'
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-white'
                      }`}
                    >
                      {message.role === 'user' ? 'К' : 'И'}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {message.role === 'user' ? 'Кандидат' : 'Интервьюер'}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {message.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-200 dark:border-slate-600/30 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <FileText className="w-6 h-6 text-indigo-600" />
              Общее резюме
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {reportData.summary}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
