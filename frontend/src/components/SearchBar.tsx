import { cn } from '@/lib/utils';
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  showIcon?: boolean;
  compact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Поиск вакансий, навыков, компаний...',
  onSearch,
  className,
  showIcon = true,
  compact = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    onSearch?.(query);
  };

  return (
    <div
      className={cn(
        'container-w w-full mx-auto flex items-center  gap-2 sm:gap-3',
        compact ? 'h-12 sm:h-14 md:h-16' : 'h-14 sm:h-16 md:h-20 lg:h-24',
        className
      )}
    >
      <form onSubmit={handleSubmit} className="flex w-full gap-2 sm:gap-3">
        <div className="relative flex-1">
          {showIcon && (
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          )}
          <input
            name="search"
            type="text"
            placeholder={placeholder}
            className={cn(
              'w-full bg-white/95 dark:bg-slate-900/90 border border-slate-600/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none',
              showIcon ? 'pl-10 sm:pl-12 md:pl-14' : 'pl-3 sm:pl-4',
              compact
                ? 'h-10 sm:h-12 pr-16 sm:pr-20 text-sm sm:text-base'
                : 'h-10 sm:h-12 md:h-14 lg:h-16 pr-20 sm:pr-24 md:pr-28 lg:pr-32 text-sm sm:text-base md:text-lg'
            )}
          />
        </div>
        <button
          type="submit"
          className={cn(
            'bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white rounded-lg sm:rounded-xl font-semibold transition-all duration-300 whitespace-nowrap',
            compact
              ? 'px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm'
              : 'px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base'
          )}
        >
          <span className="hidden xs:inline">Найти</span>
          <span className="xs:hidden">
            {' '}
            <Search className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
          </span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
