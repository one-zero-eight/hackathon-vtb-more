import React, { useMemo, useState } from 'react';
import ApplicantCard from './ApplicantCard';
import { Button } from '@/components/ui/button';
import SearchBar from '../SearchBar';

type Applicant = {
  id: number;
  fullName: string;
  score: number;
  profileUrl: string;
  reportUrl?: string;
};

const mockApplicantsInterview: Applicant[] = [
  {
    id: 1,
    fullName: 'Иван Иванов',
    score: 87,
    profileUrl: '/profile/1',
    reportUrl: '/report/1',
  },
  {
    id: 3,
    fullName: 'Алексей Смирнов',
    score: 73,
    profileUrl: '/profile/3',
    reportUrl: '/report/3',
  },
  { id: 4, fullName: 'Дмитрий Кузнецов', score: 65, profileUrl: '/profile/4' },
  {
    id: 5,
    fullName: 'Екатерина Соколова',
    score: 91,
    profileUrl: '/profile/5',
    reportUrl: '/report/5',
  },
  { id: 6, fullName: 'Сергей Васильев', score: 78, profileUrl: '/profile/6' },
  {
    id: 7,
    fullName: 'Ольга Морозова',
    score: 84,
    profileUrl: '/profile/7',
    reportUrl: '/report/7',
  },
  { id: 8, fullName: 'Павел Новиков', score: 69, profileUrl: '/profile/8' },
  {
    id: 9,
    fullName: 'Наталья Козлова',
    score: 88,
    profileUrl: '/profile/9',
    reportUrl: '/report/9',
  },
];

const mockApplicantsDecision: Applicant[] = [
  { id: 2, fullName: 'Мария Петрова', score: 92, profileUrl: '/profile/2' },
  { id: 10, fullName: 'Илья Медведев', score: 81, profileUrl: '/profile/10' },
  {
    id: 11,
    fullName: 'Анна Орлова',
    score: 76,
    profileUrl: '/profile/11',
    reportUrl: '/report/11',
  },
  { id: 12, fullName: 'Виктор Павлов', score: 64, profileUrl: '/profile/12' },
  {
    id: 13,
    fullName: 'Юлия Семёнова',
    score: 89,
    profileUrl: '/profile/13',
    reportUrl: '/report/13',
  },
  { id: 14, fullName: 'Роман Фёдоров', score: 71, profileUrl: '/profile/14' },
];

const TABS = [
  { key: 'interview', label: 'Ожидают интервью' },
  { key: 'decision', label: 'Ожидают результат' },
] as const;

const Applicants = () => {
  const [activeTab, setActiveTab] = useState<'interview' | 'decision'>(
    'interview'
  );
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<'name' | 'score'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const allApplicants =
    activeTab === 'interview'
      ? mockApplicantsInterview
      : mockApplicantsDecision;

  const applicants = useMemo(() => {
    const filtered = allApplicants.filter(a =>
      a.fullName.toLowerCase().includes(query.trim().toLowerCase())
    );
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'name') {
        return sortDir === 'asc'
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName);
      }
      // score
      return sortDir === 'asc'
        ? a.score - (b.score as number)
        : (b.score as number) - a.score;
    });
    return sorted;
  }, [allApplicants, query, sortDir, sortKey]);

  const toggleSort = (key: 'name' | 'score') => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelect = (id: number, checked?: boolean) => {
    setSelectedIds(prev => {
      const isChecked = checked ?? !prev.includes(id);
      if (isChecked) {
        return [...prev, id];
      }
      return prev.filter(x => x !== id);
    });
  };

  const countInterview = mockApplicantsInterview.length;
  const countDecision = mockApplicantsDecision.length;

  const handleApprove = () => {
    // Placeholder action
    console.log('Approved ids:', selectedIds);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 md:gap-8">
      <div className="container-w mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            Senior Frontend Developer
          </h1>
        </div>

        {/* Search */}
        <div className="w-full">
          <SearchBar
            placeholder="Выберите кандидатов..."
            onSearch={setQuery}
            className="!px-0 !w-full max-w-none"
          />
        </div>

        {/* Tabs row with Approve on right */}
        <div className="flex items-end justify-between mb-2 border-b border-slate-700/60">
          <nav className="flex gap-6">
            {TABS.map(tab => {
              const isActive = activeTab === tab.key;
              const count =
                tab.key === 'interview' ? countInterview : countDecision;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-3 -mb-px text-sm md:text-base font-medium transition-colors flex items-center gap-2 border-b-2
                    ${
                      isActive
                        ? 'border-indigo-500 text-white'
                        : 'border-transparent text-gray-400 hover:text-white hover:border-slate-500'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-6 h-6 px-1 rounded-full text-xs font-semibold
                      ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-700 text-gray-100'}`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
          <Button
            onClick={handleApprove}
            variant="outline"
            size="lg"
            className="cursor-pointer px-4 md:px-6 lg:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-300 dark:border-indigo-600 border-indigo-600"
          >
            Утвердить
          </Button>
        </div>

        {/* Columns header */}
        <div className="flex items-center text-gray-300 select-none mt-4">
          <button
            onClick={() => toggleSort('name')}
            className="flex-1 text-left hover:text-white"
          >
            Полное имя{' '}
            {sortKey === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => toggleSort('score')}
            className="w-28 text-right hover:text-white"
          >
            Рейтинг {sortKey === 'score' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>

        {/* List */}
        <div className="space-y-2">
          {applicants.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Нет заявок в этом разделе
            </div>
          ) : (
            applicants.map(applicant => (
              <ApplicantCard
                key={applicant.id}
                checked={selectedIds.includes(applicant.id)}
                onCheck={val => toggleSelect(applicant.id, Boolean(val))}
                fullName={applicant.fullName}
                score={`${applicant.score}%`}
                profileUrl={applicant.profileUrl}
                reportUrl={applicant.reportUrl}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Applicants;
