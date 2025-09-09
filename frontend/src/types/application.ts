import { components } from '@/api/types';

// API типы
export type ApplicationResponse = components['schemas']['ApplicationResponse'];
export type VacancyResponse = components['schemas']['VacancyResponse'];
export type ApplicationWithVacancyResponse =
  components['schemas']['ApplicationWithVacancyResponse'];

// Преобразованные типы для UI
export interface Application {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  city: string;
  salary: number | null;
  description: string;
  requiredExperience: number;
  weeklyHours: number;
  openTime: string;
  closeTime: string | null;
  isActive: boolean;
  status: OptimizedStatus; // Используем оптимизированные статусы
  statusText: string;
  originalStatus: string; // Сохраняем оригинальный статус для деталей
  cv: string;
  profileUrl?: string | null;
  githubStats?: components['schemas']['GithubStats'] | null;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  applications: Application[];
}

// Оптимизированные статусы для UI
export type OptimizedStatus = 'pending' | 'approved' | 'rejected';

// Функция для преобразования статуса API в оптимизированный статус
export const getOptimizedStatus = (status: string): OptimizedStatus => {
  switch (status) {
    case 'pending':
      return 'pending';
    case 'approved':
    case 'approved_for_interview':
    case 'in_interview':
      return 'approved';
    case 'rejected':
    case 'rejected_for_interview':
      return 'rejected';
    default:
      return 'pending';
  }
};

// Функция для преобразования статуса API в читаемый текст
export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'На рассмотрении';
    case 'approved':
      return 'Одобрена';
    case 'rejected':
      return 'Отклонена';
    case 'approved_for_interview':
      return 'Одобрена для собеседования';
    case 'rejected_for_interview':
      return 'Отклонена для собеседования';
    case 'in_interview':
      return 'На собеседовании';
    default:
      return 'На рассмотрении';
  }
};

// Функция для преобразования API данных в формат UI
export const transformApplicationData = (
  apiData: ApplicationWithVacancyResponse[]
): Application[] => {
  return apiData.map(item => ({
    id: item.application.id,
    vacancyId: item.application.vacancy_id,
    vacancyTitle: item.vacancy.name,
    city: item.vacancy.city,
    salary: item.vacancy.salary,
    description: item.vacancy.description,
    requiredExperience: item.vacancy.required_experience,
    weeklyHours: item.vacancy.weekly_hours_occupancy,
    openTime: item.vacancy.open_time,
    closeTime: item.vacancy.close_time,
    isActive: item.vacancy.is_active,
    status: getOptimizedStatus(item.application.status),
    statusText: getStatusText(item.application.status),
    originalStatus: item.application.status,
    cv: item.application.cv,
    profileUrl: item.application.profile_url,
    githubStats: item.application.github_stats,
  }));
};
