import React from 'react';
import { Button } from './button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  emoji?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Что-то пошло не так',
  description = 'Произошла ошибка при загрузке данных',
  emoji = '😕',
  buttonText = 'Попробовать снова',
  onButtonClick,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      className={`container-w mx-auto py-8 md:py-16 text-center px-4 ${className}`}
    >
      <div className="text-4xl md:text-6xl mb-4">{emoji}</div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm md:text-base">
        {description}
      </p>
      {onButtonClick && (
        <Button
          onClick={onButtonClick}
          className="bg-primary hover:bg-primary/90"
        >
          {buttonText}
        </Button>
      )}
    </div>
  );
}
