import { components } from '@/api/types';

// Типы из API
export type VacancyResponse = components['schemas']['VacancyResponse'];
export type VacancyWithSkillsResponse =
  components['schemas']['VacancyWithSkillsResponse'];

// Интерфейс для HR вакансии в UI
export interface HRVacancy {
  id: number;
  title: string;
  description: string;
  city: string;
  salary: number | null;
  weeklyHours: number;
  requiredExperience: number;
  openTime: string;
  closeTime: string | null;
  isActive: boolean;
  userId: number;
  // Дополнительные поля для UI
  status: 'active' | 'archived';
  statusText: string;
}

// Функция для преобразования API данных в UI формат
export const transformHRVacancyData = (
  apiData: VacancyResponse[]
): HRVacancy[] => {
  return apiData.map(vacancy => ({
    id: vacancy.id,
    title: vacancy.name,
    description: vacancy.description,
    city: vacancy.city,
    salary: vacancy.salary,
    weeklyHours: vacancy.weekly_hours_occupancy,
    requiredExperience: vacancy.required_experience,
    openTime: vacancy.open_time,
    closeTime: vacancy.close_time,
    isActive: vacancy.is_active,
    userId: vacancy.user_id,
    // Определяем статус на основе is_active и close_time
    status: getVacancyStatus(vacancy),
    statusText: getVacancyStatusText(vacancy),
    // Пока что статические значения, позже можно добавить в API
  }));
};

// Функция для определения статуса вакансии
const getVacancyStatus = (vacancy: VacancyResponse): HRVacancy['status'] => {
  if (!vacancy.is_active) {
    return 'archived';
  }
  return 'active';
};

// Функция для получения текста статуса
const getVacancyStatusText = (vacancy: VacancyResponse): string => {
  const status = getVacancyStatus(vacancy);

  switch (status) {
    case 'active':
      return 'Активна';
    case 'archived':
      return 'Архив';
    default:
      return 'Неизвестно';
  }
};
