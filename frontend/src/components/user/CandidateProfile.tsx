import { User, Mail, Search, Download, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockCandidate } from '@/data/mockCandidates';
import { Button } from '../ui/button';
import { Label } from '@/components/ui/label';

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
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Полное имя
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {candidate.fullName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </Label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900 dark:text-gray-100">
                    {candidate.email}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Overview */}
        <Card className="bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              <FileText className="w-5 h-5" />
              Резюме
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Applications List */}
            <div className="space-y-4 mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Краткое содержание
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    className="cursor-pointer px-6 md:px-8 lg:px-12 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl md:rounded-2xl border-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-all duration-300 dark:border-indigo-600 border-indigo-600"
                  >
                    <Search className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Посмотреть резюме
                  </Button>

                  <Button
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 px-6 md:px-8 lg:px-12 py-3 md:py-4 text-white md:text-lg font-semibold rounded-xl md:rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Скачать полную версию
                  </Button>
                </div>
              </div>

              <Card className="w-full bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30">
                <CardContent className="pt-0">some text</CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;
