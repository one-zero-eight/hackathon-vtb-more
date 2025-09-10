import React, { useState } from 'react';
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
  Upload,
  Github,
  X,
} from 'lucide-react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  useToast,
  LoadingSpinner,
  ErrorState,
} from '@/components/ui';
import { $api } from '@/api';

const VacancyDetail: React.FC = () => {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Form state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
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

  const applicationMutation = $api.useMutation('post', '/applications');
  // Form handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCvFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!cvFile) {
      showToast('Пожалуйста загрузите резюме', 'error', 'top-left');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('file', cvFile);
      formData.append('vacancy_id', id || '');
      if (githubUsername) {
        formData.append('github', githubUsername);
      }

      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/applications`,
        {
          method: 'POST',
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showToast('Успешно откликнулись!', 'success', 'top-right');
      setOpen(false);
      // Reset form
      setCvFile(null);
      setGithubUsername('');
    } catch (error) {
      showToast('Произошла ошибка при отправке отклика', 'error', 'top-right');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Loading state

  const { data: applications, isLoading: applicationsLoading } = $api.useQuery(
    'get',
    '/applications/my'
  );

  const isApplied = applications?.find(item => item.vacancy_id == Number(id));

  if (isLoading || applicationsLoading) {
    return (
      <LoadingSpinner
        title="Загружаем вакансию"
        description="Получаем детальную информацию"
      />
    );
  }

  // Error state
  if (error || !vacancyDetail) {
    return (
      <ErrorState
        title="Вакансия не найдена"
        description="Запрашиваемая вакансия не существует или была удалена"
        emoji="😕"
        buttonText="Вернуться к списку вакансий"
        onButtonClick={() => navigate({ to: '/user/vacancies' })}
      />
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
            {isApplied ? (
              <Button
                size="lg"
                disabled
                className="w-full lg:w-auto bg-primary hover:bg-primary/90 px-6 md:px-8 lg:px-12 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
              >
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                Вы уже откликнулись
              </Button>
            ) : (
              <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                <DialogTrigger>
                  <Button
                    size="lg"
                    className="w-full lg:w-auto bg-primary hover:bg-primary/90 px-6 md:px-8 lg:px-12 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl shadow-lg cursor-pointer transition-all duration-300"
                  >
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Откликнуться
                  </Button>
                </DialogTrigger>
                <DialogContent className="">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                      Откликнуться на вакансию
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600">
                      Заполните данные для отправки отклика
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6 py-4">
                    {/* CV Upload */}
                    <div className="flex flex-col gap-3">
                      <label className="text-md font-medium text-gray-700 dark:text-gray-300">
                        CV файл <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileChange}
                          className="hidden"
                          id="cv-upload"
                        />
                        {cvFile ? (
                          <div className="w-full border-2 border-solid border-green-300 dark:border-green-600 rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                                    {cvFile.name}
                                  </p>
                                  <p className="text-xs text-green-600 dark:text-green-400">
                                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCvFile(null)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <label
                            htmlFor="cv-upload"
                            className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-primary transition-colors"
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <Upload className="w-8 h-8 text-gray-400" />
                              <div className="text-sm text-center text-gray-500">
                                <span className="font-medium">
                                  Нажмите для загрузки
                                </span>
                                <br />
                                <span>PDF (макс. 10MB)</span>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>

                    {/* GitHub URL */}
                    <div className="flex flex-col gap-3">
                      <label className="text-md font-medium text-gray-700 dark:text-gray-300 ">
                        GitHub URL (необязательно)
                      </label>
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={githubUsername}
                          onChange={e => setGithubUsername(e.target.value)}
                          placeholder="Введите ваш GitHub URL"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        onClick={handleSubmit}
                        disabled={!cvFile || isSubmitting}
                        className="bg-primary w-full hover:bg-primary/90  px-8"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Откликнуться
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
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
