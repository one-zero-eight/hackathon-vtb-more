import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { $api } from '@/api';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle,
  Building2,
  MapPin,
  Clock,
  DollarSign,
  User,
  Calendar as CalendarIcon,
  Target,
  Minus,
  ChevronDown,
} from 'lucide-react';

interface SkillForm {
  id: string;
  skillTypeId: number;
  skillTypeName: string;
  details: string;
  weight: number;
}

interface VacancyForm {
  name: string;
  description: string;
  salary: number | null;
  city: string;
  weekly_hours_occupancy: number | null;
  required_experience: number | null;
  open_time: string;
  close_time: string | null;
  is_active: boolean;
}

interface CreateProps {
  mode?: 'create' | 'update';
  vacancyId?: string;
}

const Create = ({ mode = 'create', vacancyId }: CreateProps) => {
  const navigate = useNavigate();

  // Состояние формы вакансии
  const [vacancyForm, setVacancyForm] = useState<VacancyForm>({
    name: '',
    description: '',
    salary: null,
    city: '',
    weekly_hours_occupancy: null,
    required_experience: null,
    open_time: new Date().toISOString(),
    close_time: null,
    is_active: true,
  });

  // Состояние навыков
  const [skills, setSkills] = useState<SkillForm[]>([]);
  const [availableSkillTypes, setAvailableSkillTypes] = useState<
    { id: number; name: string }[]
  >([]);

  // Состояние загрузки и ошибок
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Загружаем доступные типы навыков
  useEffect(() => {
    // Используем моковые типы навыков для демонстрации
    // В реальном приложении здесь был бы API запрос
    setAvailableSkillTypes([
      { id: 1, name: 'Технические навыки' },
      { id: 2, name: 'Мягкие навыки' },
      { id: 3, name: 'Опыт работы' },
      { id: 4, name: 'Образование' },
      { id: 5, name: 'Сертификации' },
    ]);
  }, []);

  const { data: vacancyData, isLoading: isLoadingVacancyData } = $api.useQuery(
    'get',
    '/vacancy/{vacancy_id}/with_skills',
    {
      params: {
        path: {
          vacancy_id: Number(vacancyId),
        },
      },
    }
  );
  // Загружаем данные вакансии для обновления
  useEffect(() => {
    if (mode === 'update' && vacancyData) {
      const vacancy = vacancyData?.vacancy;
      const skills = vacancyData?.skills;

      if (vacancy) {
        setVacancyForm({
          name: vacancy.name,
          description: vacancy.description,
          salary: vacancy.salary,
          city: vacancy.city,
          weekly_hours_occupancy: vacancy.weekly_hours_occupancy,
          required_experience: vacancy.required_experience,
          open_time: vacancy.open_time,
          close_time: vacancy.close_time,
          is_active: vacancy.is_active,
        });
      }

      if (skills) {
        setSkills(
          skills.map(skill => ({
            id: skill.id.toString(),
            skillTypeId: skill.skill_type_id,
            skillTypeName: 'Неизвестный тип', // Будет загружено из API
            details: skill.details,
            weight: skill.weight,
          }))
        );
      }
    }
  }, [mode, vacancyData]);

  // Получить доступные типы навыков (не использованные)
  const getAvailableSkillTypes = () => {
    if (!skillTypes) return [];
    const usedSkillTypeIds = skills.map(skill => skill.skillTypeId);
    return skillTypes.filter(
      skillType => !usedSkillTypeIds.includes(skillType.id)
    );
  };

  // Добавить навык
  const addSkill = () => {
    const availableTypes = getAvailableSkillTypes();
    if (availableTypes.length === 0) return;

    const newSkill: SkillForm = {
      id: Date.now().toString(),
      skillTypeId: availableTypes[0].id,
      skillTypeName: availableTypes[0].name,
      details: '',
      weight: 0,
    };
    setSkills([...skills, newSkill]);
  };

  // Удалить навык
  const removeSkill = (skillId: string) => {
    setSkills(skills.filter(skill => skill.id !== skillId));
  };

  // Обновить навык
  const updateSkill = (skillId: string, field: keyof SkillForm, value: any) => {
    setSkills(
      skills.map(skill => {
        if (skill.id === skillId) {
          if (field === 'skillTypeId') {
            const skillType = skillTypes?.find(st => st.id === value);
            return {
              ...skill,
              skillTypeId: value,
              skillTypeName: skillType?.name || '',
            };
          }
          return { ...skill, [field]: value };
        }
        return skill;
      })
    );
  };

  // Вычислить общий вес навыков
  const totalWeight = skills.reduce((sum, skill) => sum + skill.weight, 0);

  // Валидация формы
  const validateForm = (): string | null => {
    if (!vacancyForm.name.trim()) return 'Название вакансии обязательно';
    if (!vacancyForm.description.trim()) return 'Описание вакансии обязательно';
    if (!vacancyForm.city.trim()) return 'Город обязателен';
    if (vacancyForm.weekly_hours_occupancy == null)
      return 'Часы в неделю обязательны';
    if (vacancyForm.weekly_hours_occupancy <= 0)
      return 'Часы в неделю должны быть больше 0';
    if (vacancyForm.required_experience == null)
      return 'Требуемый опыт обязателен';
    if (vacancyForm.required_experience < 0)
      return 'Опыт работы не может быть отрицательным';

    if (skills.length === 0) return 'Добавьте хотя бы один навык';

    for (const skill of skills) {
      if (!skill.details.trim()) return 'Описание навыка обязательно';
      if (skill.weight <= 0) return 'Вес навыка должен быть больше 0';
    }

    if (totalWeight !== 100)
      return `Общий вес навыков должен быть 100 (текущий: ${totalWeight})`;

    return null;
  };
  const { data: user } = $api.useQuery('get', '/auth/me');
  const { data: skillTypes } = $api.useQuery('get', '/skills_type');
  const createMutation = $api.useMutation('post', '/vacancy/with_skills');
  const updateMutation = $api.useMutation('patch', '/vacancy/{vacancy_id}');
  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestData = {
        vacancy: {
          ...vacancyForm,
          weekly_hours_occupancy: vacancyForm.weekly_hours_occupancy as number,
          required_experience: vacancyForm.required_experience as number,
          open_time: vacancyForm.open_time,
          close_time: vacancyForm.close_time || null,
        },
        skills: skills.map(skill => ({
          skill_type_id: skill.skillTypeId,
          details: skill.details,
          weight: skill.weight,
        })),
      };

      if (mode === 'create') {
        await createMutation.mutateAsync({
          body: requestData,
        });
      } else {
        console.log(requestData);
        await updateMutation.mutateAsync({
          params: {
            path: {
              vacancy_id: Number(vacancyId),
            },
          },
          body: {
            name: requestData.vacancy.name,
            description: requestData.vacancy.description,
            salary: requestData.vacancy.salary,
            city: requestData.vacancy.city,
            weekly_hours_occupancy: requestData.vacancy.weekly_hours_occupancy,
            required_experience: requestData.vacancy.required_experience,
            open_time: requestData.vacancy.open_time,
            close_time: requestData.vacancy.close_time,
            is_active: requestData.vacancy.is_active,
            user_id: user?.id,
          },
        });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate({ to: '/hr/vacancies' });
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        mode === 'create'
          ? 'Ошибка при создании вакансии'
          : 'Ошибка при обновлении вакансии';
      setError(err.message || errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full flex flex-col items-center gap-6 md:gap-8">
        {/* Hero Section */}
        <div
          className="h-[200px] md:h-[250px] lg:h-[300px] relative container-w rounded-b-2xl md:rounded-b-3xl flex items-center justify-center"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80")`,
          }}
        />

        <div className="container-w">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-slate-900/40 rounded-2xl md:rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
              <div className="mb-8">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {mode === 'create'
                    ? 'Вакансия создана!'
                    : 'Вакансия обновлена!'}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {mode === 'create'
                    ? 'Ваша вакансия успешно создана и добавлена в систему.'
                    : 'Ваша вакансия успешно обновлена в системе.'}
                </p>
              </div>
              <Button
                onClick={() => navigate({ to: '/hr/vacancies' })}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
              >
                Вернуться к вакансиям
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
      {/* Hero Section */}
      <div
        className="h-[200px] md:h-[250px] lg:h-[300px] relative container-w rounded-b-2xl md:rounded-b-3xl flex items-center justify-center"
        style={{
          backgroundImage: `url("https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80")`,
        }}
      />

      {/* Header */}
      <div className="container-w">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/hr/vacancies' })}
          className="mb-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 md:p-3"
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-sm md:text-base">Назад к вакансиям</span>
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {mode === 'create'
              ? 'Создание новой вакансии'
              : 'Редактирование вакансии'}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {mode === 'create'
              ? 'Заполните информацию о вакансии и добавьте необходимые навыки'
              : 'Измените информацию о вакансии и обновите необходимые навыки'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-w">
        {mode === 'update' && isLoadingVacancyData ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Загрузка данных вакансии...
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Основная информация о вакансии */}
            <div className="bg-white dark:bg-slate-900/40 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
              <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                  <Building2 className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
                  Основная информация
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Заполните основную информацию о вакансии
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label
                    htmlFor="name"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Название вакансии *
                  </Label>
                  <Input
                    id="name"
                    value={vacancyForm.name}
                    onChange={e =>
                      setVacancyForm({ ...vacancyForm, name: e.target.value })
                    }
                    placeholder="Например: Frontend разработчик"
                    className="h-12 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="city"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Город *
                  </Label>
                  <Input
                    id="city"
                    value={vacancyForm.city}
                    onChange={e =>
                      setVacancyForm({ ...vacancyForm, city: e.target.value })
                    }
                    placeholder="Например: Москва"
                    className="h-12 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="salary"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Зарплата (₽)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    value={vacancyForm.salary || ''}
                    onChange={e =>
                      setVacancyForm({
                        ...vacancyForm,
                        salary: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="Например: 150000"
                    className="h-12 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="weekly_hours"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Часов в неделю *
                  </Label>
                  <Input
                    id="weekly_hours"
                    type="number"
                    value={vacancyForm.weekly_hours_occupancy ?? ''}
                    onChange={e =>
                      setVacancyForm({
                        ...vacancyForm,
                        weekly_hours_occupancy: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    min="1"
                    max="168"
                    placeholder="Например: 40"
                    className="h-12 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="experience"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Требуемый опыт (лет) *
                  </Label>
                  <Input
                    id="experience"
                    type="number"
                    value={vacancyForm.required_experience ?? ''}
                    onChange={e =>
                      setVacancyForm({
                        ...vacancyForm,
                        required_experience: e.target.value
                          ? Number(e.target.value)
                          : null,
                      })
                    }
                    min="0"
                    placeholder="Например: 3"
                    className="h-12 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="close_time"
                    className="text-base font-semibold text-gray-900 dark:text-gray-100"
                  >
                    Дата закрытия
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-12 w-full justify-start text-left font-normal bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 hover:bg-gray-100 dark:hover:bg-slate-700/50"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {vacancyForm.close_time ? (
                          new Date(vacancyForm.close_time).toLocaleDateString(
                            'ru-RU',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Выберите дату
                          </span>
                        )}
                        <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          vacancyForm.close_time
                            ? new Date(vacancyForm.close_time)
                            : undefined
                        }
                        onSelect={date => {
                          if (date) {
                            setVacancyForm({
                              ...vacancyForm,
                              close_time: date.toISOString(),
                            });
                          } else {
                            setVacancyForm({
                              ...vacancyForm,
                              close_time: null,
                            });
                          }
                        }}
                        disabled={date => date < new Date()}
                        initialFocus
                        captionLayout="dropdown"
                        className="rounded-xl"
                        classNames={{}}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <Label
                  htmlFor="description"
                  className="text-base font-semibold text-gray-900 dark:text-gray-100"
                >
                  Описание вакансии *
                </Label>
                <Textarea
                  id="description"
                  value={vacancyForm.description}
                  onChange={e =>
                    setVacancyForm({
                      ...vacancyForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Подробно опишите обязанности, требования и условия работы..."
                  rows={6}
                  className="bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 resize-none"
                  required
                />
              </div>
            </div>

            {/* Навыки */}
            <div className="bg-white dark:bg-slate-900/40 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-slate-600/30 backdrop-blur-sm">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-start sm:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                      <Target className="w-6 h-6 md:w-7 md:h-7 text-indigo-600" />
                      Навыки и требования
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Добавьте необходимые навыки и установите их важность
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 w-full">
                    {/* Простой линейный прогресс */}
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            totalWeight === 100
                              ? 'bg-green-500'
                              : totalWeight > 100
                                ? 'bg-red-500'
                                : 'bg-indigo-500'
                          }`}
                          style={{ width: `${Math.min(totalWeight, 100)}%` }}
                        />
                      </div>
                      <span
                        className={`text-lg font-medium ${
                          totalWeight === 100
                            ? 'text-green-600 dark:text-green-400'
                            : totalWeight > 100
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {totalWeight}/100
                      </span>
                    </div>

                    <Button
                      type="button"
                      onClick={addSkill}
                      disabled={getAvailableSkillTypes().length === 0}
                      className="w-full sm:w-auto sm:ml-auto flex-shrink-0 bg-indigo-600 text-white px-8 py-5 rounded-lg font-semibold shadow-lg hover:bg-indigo-500 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Добавить навык
                      {getAvailableSkillTypes().length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                          {getAvailableSkillTypes().length}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {skills.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Навыки не добавлены</p>
                  <p className="text-sm">
                    Нажмите "Добавить навык" чтобы начать
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8">
                  {skills.map((skill, index) => (
                    <div
                      key={skill.id}
                      className="p-4 sm:p-6 lg:p-8 border-2 border-gray-200 dark:border-slate-600 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-900/50"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                              {index + 1}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Навык {index + 1}
                          </h4>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSkill(skill.id)}
                          className="text-lg bg-red-500 dark:hover:bg-red-100 dark:hover:text-red-500 cursor-pointer px-6 py-4"
                        >
                          <Trash2 className="w-5 h-5" /> Удалить
                        </Button>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Тип навыка
                          </Label>
                          <Select
                            value={skill.skillTypeId.toString()}
                            onValueChange={value =>
                              updateSkill(
                                skill.id,
                                'skillTypeId',
                                Number(value)
                              )
                            }
                          >
                            <SelectTrigger className=" !h-12 w-full bg-gray-50 dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-lg text-base transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500 cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg shadow-lg">
                              {(() => {
                                const availableTypes = getAvailableSkillTypes();
                                const currentSkillType = skillTypes?.find(
                                  st => st.id === skill.skillTypeId
                                );
                                const allOptions = currentSkillType
                                  ? [
                                      currentSkillType,
                                      ...availableTypes.filter(
                                        st => st.id !== skill.skillTypeId
                                      ),
                                    ]
                                  : availableTypes;

                                return allOptions.map(skillType => (
                                  <SelectItem
                                    key={skillType.id}
                                    value={skillType.id.toString()}
                                    className="hover:bg-indigo-50 h-12 dark:hover:bg-indigo-900/30 focus:bg-indigo-50 dark:focus:bg-indigo-900/30 text-gray-900 dark:text-gray-100 cursor-pointer text-md"
                                  >
                                    {skillType.name}
                                  </SelectItem>
                                ));
                              })()}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Описание навыка
                          </Label>
                          <Textarea
                            value={skill.details}
                            onChange={e =>
                              updateSkill(skill.id, 'details', e.target.value)
                            }
                            placeholder="Например: Опыт работы с React, знание современных фреймворков, умение работать с API..."
                            rows={4}
                            className="bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 resize-none"
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <Label className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            Вес (баллы)
                          </Label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="flex-1 flex flex-col sm:flex-row gap-2">
                              <Input
                                type="number"
                                value={skill.weight}
                                onChange={e =>
                                  updateSkill(
                                    skill.id,
                                    'weight',
                                    Number(e.target.value)
                                  )
                                }
                                min="1"
                                max="100"
                                placeholder="20"
                                className="h-12 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 rounded-xl text-base transition-all duration-200 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                required
                              />
                              <div className="w-full sm:w-16 h-12 flex items-center  border-gray-200 dark:border-slate-600  justify-center border-2 rounded-xl bg-white dark:bg-slate-800 ">
                                %
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  updateSkill(
                                    skill.id,
                                    'weight',
                                    Math.min(100, skill.weight + 5)
                                  )
                                }
                                className="w-10 h-8 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 15l7-7 7 7"
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  updateSkill(
                                    skill.id,
                                    'weight',
                                    Math.max(0, skill.weight - 5)
                                  )
                                }
                                className="w-10 h-8 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                              >
                                <svg
                                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Общий вес всех навыков должен быть 100 баллов
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ошибки */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/hr/vacancies' })}
                className="w-full sm:w-auto border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={
                  isLoading ||
                  totalWeight !== 100 ||
                  (mode === 'update' && isLoadingVacancyData)
                }
                className="w-full sm:w-auto min-w-[200px] bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {mode === 'create' ? 'Создание...' : 'Обновление...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'create'
                      ? 'Создать вакансию'
                      : 'Обновить вакансию'}
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Create;
