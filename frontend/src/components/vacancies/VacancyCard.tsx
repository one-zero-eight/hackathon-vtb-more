import React from 'react';
import { Map, Building2 } from 'lucide-react';
import { type Vacancy } from '@/data/mockVacancies';
import { Link } from '@tanstack/react-router';

interface VacancyCardProps {
  vacancy: Vacancy;
  index: number;
}

const VacancyCard: React.FC<VacancyCardProps> = ({ vacancy, index }) => {
  return (
    <Link
      to="/user/vacancy/$id"
      params={{ id: vacancy.id.toString() }}
      className="w-full md:w-[95%] bg-white dark:bg-slate-900/40 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-slate-600/30 hover:shadow-md dark:hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-500/50 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm block"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
      }}
    >
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
        <div className="flex-1">
          {/* Job Title */}
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {vacancy.name}
          </h3>

          {/* Salary - Most Prominent */}
          <div className="mb-3 md:mb-4">
            <span className="text-2xl md:text-3xl font-bold text-green-600">
              {vacancy.salary} ₽
            </span>
            <span className="text-base md:text-lg text-gray-600 dark:text-gray-400 ml-2">
              за месяц
            </span>
          </div>

          {/* Company and Location */}
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 dark:text-gray-400 mb-3 md:mb-4 gap-2 sm:gap-4">
            <div className="flex items-center">
              <Building2 className="w-4 h-4 mr-1" />
              <span className="text-sm md:text-base">TechCorp</span>
            </div>
            <div className="flex items-center">
              <Map className="w-4 h-4 mr-1" />
              <span className="text-sm md:text-base">{vacancy.city}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 text-xs md:text-sm font-medium rounded-full">
              {vacancy.weekly_hours_occupancy} часов в неделю
            </span>
            <span className="px-2 md:px-3 py-1 bg-orange-100 text-orange-700 text-xs md:text-sm font-medium rounded-full">
              Опыт работы : {vacancy.required_experience} года
            </span>
            {/* <span className="px-2 md:px-3 py-1 bg-blue-100 text-blue-700 text-xs md:text-sm font-medium rounded-full">
              {new Date(vacancy.open_time).toLocaleDateString("ru-Ru")}
            </span> */}
          </div>
        </div>

        {/* Apply Button */}
        <div className="lg:ml-4 self-stretch lg:self-auto">
          <button className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 md:px-12 py-2 md:py-3 rounded-lg font-medium transition-colors cursor-pointer text-sm md:text-base">
            Откликнуться
          </button>
        </div>
      </div>
    </Link>
  );
};

export default VacancyCard;
