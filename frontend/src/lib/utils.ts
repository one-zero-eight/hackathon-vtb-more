import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Преобразует балл из диапазона 0-1 в 100-балльную систему
 * @param score - балл в диапазоне 0-1
 * @returns балл в диапазоне 0-100, округленный до целого
 */
export function convertScoreTo100(score: number): number {
  return Math.round(score * 100);
}

/**
 * Преобразует балл из диапазона 0-1 в 100-балльную систему с процентом
 * @param score - балл в диапазоне 0-1
 * @returns строка вида "50%"
 */
export function convertScoreToPercentage(score: number): string {
  return `${convertScoreTo100(score)}%`;
}
