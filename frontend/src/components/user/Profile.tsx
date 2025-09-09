import { useState, useMemo, useEffect } from 'react';
import { User, Mail, Briefcase, Edit3, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ApplicationCard from './ApplicationCard';
import ApplicationFilters from './ApplicationFilters';
import { $api } from '@/api';
import { ErrorState, LoadingSpinner } from '../ui';
import {
  transformApplicationData,
  type Application,
  type UserProfile,
} from '@/types/application';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
  });

  const { data: user, isLoading, error } = $api.useQuery('get', '/auth/me');
  const {
    data: applications,
    isLoading: applicationsLoading,
    error: applicationError,
  } = $api.useQuery('get', '/applications/my/with_vacancies');

  // Преобразуем данные API в формат UI
  const transformedApplications = useMemo(() => {
    if (!applications) return [];
    return transformApplicationData(applications);
  }, [applications]);

  // Создаем профиль пользователя из API данных
  const profile: UserProfile = useMemo(
    () => ({
      id: user?.id || 0,
      fullName: user?.name || '',
      email: user?.email || '',
      applications: transformedApplications,
    }),
    [user, transformedApplications]
  );
  useEffect(() => {
    if (user && !isLoading) {
      setEditForm({
        fullName: user.name,
        email: user.email,
      });
    }
  }, [user, isLoading]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      fullName: user?.name || '',
      email: user?.email || '',
    });
  };

  const handleSave = () => {
    // TODO: Реализовать обновление профиля через API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({
      fullName: user?.name || '',
      email: user?.email || '',
    });
  };

  const filteredApplications = useMemo(() => {
    if (!selectedStatus) return profile.applications;

    // Фильтруем по оптимизированным статусам
    return profile.applications.filter(app => {
      switch (selectedStatus) {
        case 'На рассмотрении':
          return app.status === 'pending';
        case 'Одобрена':
          return app.status === 'approved';
        case 'Отклонена':
          return app.status === 'rejected';
        default:
          return true;
      }
    });
  }, [profile.applications, selectedStatus]);

  if (isLoading || applicationsLoading) {
    return (
      <LoadingSpinner
        title="Загрузка профиля"
        description="Пожалуйста, подождите, пока загружаются данные пользователя..."
      />
    );
  }
  if (error || applicationError) {
    return (
      <ErrorState
        title="Ошибка загрузки данных пользователя"
        description=" Не удалось загрузить информацию о пользователе Проверьте подключение к интернету и попробуйте обновить страницу."
      />
    );
  }

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-w mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Профиль пользователя
            {isLoading && (
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                (Загрузка...)
              </span>
            )}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Управляйте своими данными и отслеживайте заявки на вакансии
          </p>
        </div>

        {/* Profile Information */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <User className="w-5 h-5" />
              Личная информация
            </CardTitle>
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Редактировать
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Отмена
                </button>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Полное имя
                </Label>
                {isEditing ? (
                  <Input
                    id="fullName"
                    value={editForm.fullName}
                    onChange={e =>
                      setEditForm(prev => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full"
                    placeholder="Введите ваше полное имя"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {profile.fullName}
                    </span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={e =>
                      setEditForm(prev => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full"
                    placeholder="Введите ваш email"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {profile.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Overview */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <Briefcase className="w-5 h-5" />
              Обзор заявок на вакансии
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Applications List */}
            <div className="space-y-4 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Мои заявки ({filteredApplications.length})
                </h3>

                {/* Filters */}
                <ApplicationFilters
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  applications={profile.applications}
                />
              </div>

              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">
                    {selectedStatus
                      ? `Нет заявок со статусом "${selectedStatus}"`
                      : 'У вас пока нет заявок на вакансии'}
                  </p>
                  <p className="text-sm">
                    {selectedStatus
                      ? 'Попробуйте выбрать другой фильтр'
                      : 'Начните поиск работы и подавайте заявки!'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredApplications.map((application, index) => (
                    <ApplicationCard
                      key={application.id}
                      application={application}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
