export interface Application {
  id: number;
  vacancyId: number;
  vacancyTitle: string;
  company: string;
  city: string;
  salary: number;
  appliedDate: string;
  status: 'pre_interview' | 'waiting_for_interview' | 'waiting_for_result';
  statusText: string;
}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  applications: Application[];
}

export interface HRVacancy {
  id: number;
  title: string;
  description: string;
  experience: number;
  city: string;
  money: number;
  hardSkills: string[];
  softSkills: string[];
  openTime: string;
  closingTime: string;
  type: 'Full-Time' | 'Part-Time';
  status: 'active' | 'draft' | 'closed' | 'archived';
  statusText: string;
  applicationsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface SkillWithScore {
  id: string;
  name: string;
  score: number;
  description: string;
}

export interface CreateVacancyForm {
  title: string;
  description: string;
  jobType: 'Full-Time' | 'Part-Time';
  salary: number;
  location: string;
  experience: number;
  skills: SkillWithScore[];
}
