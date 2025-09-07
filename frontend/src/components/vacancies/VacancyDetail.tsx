import React from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import {
  Map,
  Building2,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { $api } from '@/api';

const VacancyDetail: React.FC = () => {
  const { id } = useParams({ from: '/user/vacancy/$id/' });
  const navigate = useNavigate();

  const {
    data: vacancyDetail,
    isLoading,
    error,
  } = $api.useQuery('get', '/vacancy/{vacancy_id}/with_skills', {
    params: {
      path: { vacancy_id: Number(id) },
    },
  });

  const { data: skillTypes } = $api.useQuery('get', '/skills_type');
  // Loading state
  if (isLoading) {
    return (
      <div className="container-w mx-auto py-16 px-4">
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          {/* Современный спиннер */}
          <div className="relative">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"></div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 animate-pulse">
              Загружаем вакансию
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Получаем детальную информацию
            </p>
          </div>

          <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !vacancyDetail) {
    return (
      <div className="container-w   mx-auto py-8 md:py-16 text-center px-4">
        <div className="text-4xl md:text-6xl mb-4">😕</div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Вакансия не найдена
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">
          Запрашиваемая вакансия не существует или была удалена
        </p>
        <Button
          onClick={() => navigate({ to: '/user/vacancies' })}
          className="bg-primary hover:bg-primary/90"
        >
          Вернуться к списку вакансий
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getExperienceText = (years: number) => {
    if (years === 0) return 'Без опыта';
    if (years === 1) return '1 год';
    if (years < 5) return `${years} года`;
    return `${years} лет`;
  };

  const { vacancy, skills } = vacancyDetail;

  return (
    <div className="container-w  mx-auto py-4 md:py-8 px-4">
      {/* Header with back button */}
      <div className="mb-6 md:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/user/vacancies' })}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 md:p-3"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Назад к вакансиям</span>
        </Button>
      </div>

      {/* Main vacancy card */}
      <div className="bg-white dark:bg-slate-900/40 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
        {/* Header section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {vacancy.name}
            </h1>

            {/* Salary - Prominent display */}
            <div className="mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">
                {vacancy.salary
                  ? vacancy.salary.toLocaleString()
                  : 'По договоренности'}{' '}
                ₽
              </span>
              <span className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 ml-2 md:ml-3">
                за месяц
              </span>
            </div>

            {/* Company and location */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 text-gray-600 dark:text-gray-400 mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <Map className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base lg:text-lg">
                  {vacancy.city}
                </span>
              </div>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
              <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Часов в неделю
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                    {vacancy.weekly_hours_occupancy} ч/нед
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Опыт работы
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                    {getExperienceText(vacancy.required_experience)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl sm:col-span-2 lg:col-span-1">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <div>
                  <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                    Дата публикации
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm md:text-base">
                    {formatDate(vacancy.open_time)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <div className="lg:ml-8 self-stretch lg:self-auto space-y-3">
            <Button
              size="lg"
              className="w-full lg:w-auto bg-primary hover:bg-primary/90 px-6 md:px-8 lg:px-12 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
              Откликнуться
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
            Описание вакансии
          </h2>
          <p className="text-gray-700 bg-gray-100 dark:bg-slate-800/50 p-4 md:p-6 rounded-xl dark:text-gray-300 text-sm md:text-base lg:text-lg leading-relaxed">
            {vacancy.description}
          </p>
        </div>

        {/* Skills section */}
        {skills && skills.length > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 md:mb-6">
              Требуемые навыки
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {skills.map(skill => (
                <div
                  key={skill.id}
                  className="bg-gray-100 dark:dark:bg-slate-800/50 p-4 md:p-6 rounded-xl   shadow-sm "
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {skillTypes?.find(item => item.id === skill.skill_type_id)
                        ?.name || `Навык типа ${skill.skill_type_id}`}
                    </h3>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {skill.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VacancyDetail;
