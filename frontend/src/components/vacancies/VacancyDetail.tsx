import React from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Map,
  Building2,
  Calendar,
  Users,
  Star,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';
import { mockVacancies } from '@/data/mockVacancies';
import { Button } from '@/components/ui/button';

const VacancyDetail: React.FC = () => {
  const { id } = useParams({ from: '/user/vacancy/$id' });
  const navigate = useNavigate();

  const vacancy = mockVacancies.find(v => v.id === parseInt(id));

  if (!vacancy) {
    return (
      <div className="container-w mx-auto py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Вакансия не найдена
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
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

  return (
    <div className="container-w mx-auto py-8">
      {/* Header with back button */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/user/vacancies' })}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад к вакансиям
        </Button>
      </div>

      {/* Main vacancy card */}
      <div className="bg-white dark:bg-slate-900/40 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
        {/* Header section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {vacancy.title}
            </h1>

            {/* Salary - Prominent display */}
            <div className="mb-6">
              <span className="text-5xl font-bold text-green-600">
                {vacancy.money.toLocaleString()} ₽
              </span>
              <span className="text-xl text-gray-600 dark:text-gray-400 ml-3">
                за месяц
              </span>
            </div>

            {/* Company and location */}
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="text-lg">TechCorp</span>
              </div>
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                <span className="text-lg">{vacancy.city}</span>
              </div>
            </div>

            {/* Key details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Тип занятости
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {vacancy.type === 'Full-Time'
                      ? 'Полная занятость'
                      : 'Частичная занятость'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <Star className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Опыт работы
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {getExperienceText(vacancy.experience)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-100 dark:bg-slate-800/50 rounded-xl">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Дата публикации
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(vacancy.openTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply button */}
          <div className="ml-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white dark:text-black px-12 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300  cursor-pointer"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Откликнуться
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Описание вакансии
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
            {vacancy.description}
          </p>
        </div>

        {/* Skills section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Hard Skills */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Технические навыки
            </h3>
            <div className="flex flex-wrap gap-2">
              {vacancy.hardSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-full border border-blue-200 dark:border-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Личные качества
            </h3>
            <div className="flex flex-wrap gap-2">
              {vacancy.softSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full border border-green-200 dark:border-green-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-gray-100 dark:bg-slate-800/50 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Детали вакансии
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Дата открытия:
                </span>
                <span className="font-medium">
                  {formatDate(vacancy.openTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Дата закрытия:
                </span>
                <span className="font-medium">
                  {formatDate(vacancy.closingTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Опыт работы:
                </span>
                <span className="font-medium">
                  {getExperienceText(vacancy.experience)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Тип занятости:
                </span>
                <span className="font-medium">
                  {vacancy.type === 'Full-Time'
                    ? 'Полная занятость'
                    : 'Частичная занятость'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-100 dark:bg-slate-800/50 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              О компании
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Название:
                </span>
                <span className="font-medium">TechCorp</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Локация:
                </span>
                <span className="font-medium">{vacancy.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Размер команды:
                </span>
                <span className="font-medium">50-100 человек</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Тип компании:
                </span>
                <span className="font-medium">IT-компания</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VacancyDetail;
