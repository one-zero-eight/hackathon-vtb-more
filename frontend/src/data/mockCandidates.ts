import { Application } from "./mockVacancies";

export interface Candidate {
  id: number;
  fullName: string;
  email: string;
  cvFile: string;
  summary: string;
  vacancyId: number;
}

export const mockCandidate: Candidate = {
  id: 1,
  fullName: 'Иван Иванов',
  email: 'ivan.ivanov@email.com',
  cvFile: 'filepath/to/cv.pdf',
  summary: 'Опытный frontend-разработчик с 3-летним стажем. Специализируюсь на React, TypeScript и современных UI-фреймворках.',
  vacancyId: 1,
};