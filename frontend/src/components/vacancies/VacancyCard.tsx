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
      className="w-[95%] bg-white dark:bg-slate-900/40 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-600/30 hover:shadow-md dark:hover:shadow-lg hover:border-gray-200 dark:hover:border-slate-500/50 transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm block"
      style={{
        animationDelay: `${index * 50}ms`,
        animation: 'fadeInUp 0.5s ease-out forwards',
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Job Title */}
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {vacancy.title}
          </h3>

          {/* Salary - Most Prominent */}
          <div className="mb-4">
            <span className="text-3xl font-bold text-green-600">
              {vacancy.money.toLocaleString()} ₽
            </span>
            <span className="text-lg text-gray-600 dark:text-gray-400 ml-2">
              за месяц
            </span>
          </div>

          {/* Company and Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
            <Building2 className="w-4 h-4 mr-1" />
            <span className="mr-2">TechCorp</span>
            <span className="mx-1">•</span>
            <Map className="w-4 h-4 mr-1" />
            <span>{vacancy.city}</span>
          </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
              {vacancy.type}
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-medium rounded-full">
              {vacancy.hardSkills[0]}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {vacancy.softSkills[1]}
            </span>
          </div>
        </div>

        {/* Apply Button */}
        <div className="ml-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-3 rounded-lg font-medium transition-colors cursor-pointer">
            Откликнуться
          </button>
        </div>
      </div>
    </Link>
  );
};

export default VacancyCard;
