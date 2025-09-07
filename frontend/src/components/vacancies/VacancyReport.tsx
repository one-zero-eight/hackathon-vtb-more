import { useParams, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  MessageCircle,
  TrendingUp,
  Star,
  Target,
  Users,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockVacancies } from '@/data/mockVacancies';

export const VacancyReport = () => {
  const { id } = useParams({ from: '/user/vacancy/$id/report' });
  const navigate = useNavigate();

  const vacancy = mockVacancies.find(v => v.id === parseInt(id));

  // Mock data for the report
  const reportData = {
    status: 'accepted', // 'accepted' or 'rejected'
    hrMessage: `Здравствуйте! Спасибо за ваш интерес к позиции "${vacancy?.title}" и за время, которое вы уделили нашему процессу отбора.

Мы внимательно изучили ваше резюме и результаты аудио-интервью. Хотя ваши навыки и опыт впечатляют, на данный момент мы не можем предложить вам эту конкретную позицию.

Это не означает, что вы не подходите для работы в нашей компании. Возможно, в будущем у нас появятся более подходящие возможности, которые лучше соответствуют вашему профилю.

Мы ценим ваш интерес к TechCorp и желаем вам успехов в поиске подходящей позиции!`,

    skillsFeedback: [
      {
        skill: 'Python',
        currentLevel: 'Good',
        growthAreas: [
          'Продолжайте развивать навыки в области микросервисной архитектуры',
          'Изучите современные инструменты для CI/CD',
          'Углубите знания в области контейнеризации (Docker, Kubernetes)',
          'Практикуйтесь в написании более сложных unit-тестов',
        ],
        resources: [
          'Книга "Building Microservices" by Sam Newman',
          'Курс "Docker for Developers" на Udemy',
          'Документация Kubernetes',
        ],
      },
      {
        skill: 'SQL',
        currentLevel: 'Intermediate',
        growthAreas: [
          'Изучите продвинутые техники оптимизации запросов',
          'Освойте работу с NoSQL базами данных',
          'Изучите принципы проектирования баз данных',
          'Практикуйтесь в написании сложных аналитических запросов',
        ],
      },
      {
        skill: 'Коммуникация',
        currentLevel: 'Good',
        growthAreas: [
          'Развивайте навыки презентации технических решений',
          'Практикуйтесь в объяснении сложных концепций простым языком',
          'Изучите техники активного слушания',
          'Развивайте эмпатию в командной работе',
        ],
      },
    ],

    nextSteps: [
      'Продолжайте развивать технические навыки',
      'Изучайте новые технологии в вашей области',
      'Участвуйте в open-source проектах',
      'Следите за нашими новыми вакансиями',
    ],
  };

  if (!vacancy) {
    return (
      <div className="container-w mx-auto py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Вакансия не найдена
        </h1>
        <Button
          onClick={() => navigate({ to: '/user/vacancies' })}
          className="bg-primary hover:bg-primary/90"
        >
          Вернуться к списку вакансий
        </Button>
      </div>
    );
  }

  return (
    <div className="container-w mx-auto py-4 md:py-8 px-4">
      {/* Header with back button */}
      <div className="mb-6 md:mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: `/user/vacancy/${id}` })}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 md:p-3"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Назад к вакансии</span>
        </Button>
      </div>

      {/* Status Banner - Gentle rejection */}
      <div className="mb-8 p-6 rounded-2xl border-2 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
        <div className="flex  gap-4">
          <Heart className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Спасибо за вашу заявку!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Мы ценим ваш интерес к позиции "{vacancy.title}"
            </p>
            {/* Prominent status indicator */}
            <div className="mt-4">
              <span
                className={`inline-flex items-center px-4 py-2 rounded-xl text-base font-semibold shadow-lg ${
                  reportData.status === 'accepted'
                    ? 'bg-green-500 text-white border-2 border-green-400'
                    : 'bg-blue-500 text-white border-2 border-blue-400'
                }`}
              >
                {reportData.status === 'accepted'
                  ? '🎉 ПРИНЯТ НА РАБОТУ!'
                  : '📋 ЗАЯВКА РАССМОТРЕНА'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* HR Message */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Сообщение от HR
          </h2>
        </div>
        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {reportData.hrMessage}
            </p>
          </div>
        </div>
      </div>

      {/* Skills Growth Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Рекомендации по развитию навыков
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reportData.skillsFeedback.map((skill, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {skill.skill}
                </h3>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.currentLevel}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Области для роста:
                </h4>
                <ul className="space-y-2">
                  {skill.growthAreas.map((area, areaIndex) => (
                    <li
                      key={areaIndex}
                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-primary" />
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Рекомендации для дальнейшего развития
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-900/40 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.nextSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl"
              >
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center dark:text-black text-white text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => navigate({ to: `/user/vacancy/${id}` })}
          variant="outline"
          className="px-8 py-3"
        >
          Вернуться к вакансии
        </Button>
        <Button
          onClick={() => navigate({ to: '/user/vacancies' })}
          className="px-8 py-3 bg-primary hover:bg-primary/90"
        >
          К списку вакансий
        </Button>
      </div>
    </div>
  );
};
