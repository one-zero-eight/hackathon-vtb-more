import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '🔍 Поиск вакансий, навыков, компаний...',
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    onSearch?.(query);
  };

  return (
    <div className="container-w mx-auto h-16 md:h-20 lg:h-24 flex items-center px-3 md:px-4 gap-2">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <input
          name="search"
          type="text"
          placeholder={placeholder}
          className="flex-1 h-10 md:h-12 lg:h-14 pl-12 md:pl-16 pr-24 md:pr-32 text-base md:text-lg bg-white/95 dark:bg-slate-900/90 border border-slate-600/50 focus:border-primary/60 focus:ring-2 focus:ring-primary/30 rounded-xl md:rounded-2xl shadow-md placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white transition-all duration-300 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-indigo-600 cursor-pointer hover:bg-indigo-700 text-white px-4 md:px-6 lg:px-8 py-2 md:py-3 rounded-lg md:rounded-xl font-semibold transition-all duration-300 text-sm md:text-base"
        >
          Найти
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
