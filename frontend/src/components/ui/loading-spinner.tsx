import React from 'react';

interface LoadingSpinnerProps {
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  title = 'Загружаем...',
  description = 'Получаем информацию',
  size = 'md',
  className = '',
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const containerClasses = {
    sm: 'py-8',
    md: 'py-16',
    lg: 'py-20',
  };

  return (
    <div
      className={`container-w mx-auto ${containerClasses[size]} px-4 ${className}`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Современный спиннер */}
        <div className="relative">
          <div className="flex space-x-2">
            <div
              className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]`}
            ></div>
            <div
              className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]`}
            ></div>
            <div
              className={`${sizeClasses[size]} bg-indigo-600 rounded-full animate-bounce`}
            ></div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 animate-pulse">
            {title}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        <div className="w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
