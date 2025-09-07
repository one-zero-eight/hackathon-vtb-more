import { User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCandidate } from '@/data/mockCandidates';

const CandidateProfile = () => {
  const candidate = mockCandidate;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="container-w mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Профиль кандидата
          </h1>
        </div>

        {/* Profile Information */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30 w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <User className="w-5 h-5" />
              Личная информация
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Две колонки: ФИО и Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Полное имя
                </span>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {candidate.fullName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </span>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {candidate.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Остальные поля */}
            <div className="space-y-4 pt-4">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  ID вакансии:
                </span>
                <span className="ml-2">{candidate.vacancyId}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Резюме (файл):
                </span>
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 md:mb-4">
                  Краткое описание:
                </h2>
                <p className="mt-1 text-gray-800 dark:text-gray-100">
                  {candidate.summary}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;
