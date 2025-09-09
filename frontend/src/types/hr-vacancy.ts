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
  status: 'active' | 'draft' | 'closed' | 'archived';
  statusText: string;
  applicationsCount: number;
  viewsCount: number;
  hardSkills: string[];
  softSkills: string[];
  type: 'Full-Time' | 'Part-Time';
  createdBy: string;
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
    applicationsCount: Math.floor(Math.random() * 50) + 1,
    viewsCount: Math.floor(Math.random() * 200) + 10,
    hardSkills: [], // Пока что пустой массив, позже можно добавить из API
    softSkills: [], // Пока что пустой массив, позже можно добавить из API
    type: vacancy.weekly_hours_occupancy >= 40 ? 'Full-Time' : 'Part-Time',
    createdBy: 'HR Manager', // Пока что статическое значение
  }));
};

// Функция для определения статуса вакансии
const getVacancyStatus = (vacancy: VacancyResponse): HRVacancy['status'] => {
  if (!vacancy.is_active) {
    return 'archived';
  }

  if (vacancy.close_time && new Date(vacancy.close_time) < new Date()) {
    return 'closed';
  }

  return 'active';
};

// Функция для получения текста статуса
const getVacancyStatusText = (vacancy: VacancyResponse): string => {
  const status = getVacancyStatus(vacancy);

  switch (status) {
    case 'active':
      return 'Активна';
    case 'draft':
      return 'Черновик';
    case 'closed':
      return 'Закрыта';
    case 'archived':
      return 'Архив';
    default:
      return 'Неизвестно';
  }
};
