import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User, FileText } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface ApplicantCardProps {
  checked?: boolean;
  onCheck?: (checked: boolean) => void;
  fullName: string;
  score: number | string;
  profileUrl: string;
  reportUrl?: string;
}

const ApplicantCard = ({
  checked,
  onCheck,
  fullName,
  score,
  profileUrl,
  reportUrl,
}: ApplicantCardProps) => (
  <Card className="px-4 py-3 bg-white dark:bg-slate-900/40 border border-gray-100 dark:border-slate-600/30 mb-2">
    <div className="flex items-center">
      <Checkbox checked={checked} onCheckedChange={onCheck} className="mr-3" />
      <span className="flex-1 truncate text-gray-900 dark:text-gray-100 font-medium">
        {fullName}
      </span>
      <span className="w-28 text-right text-gray-900 dark:text-gray-100 font-medium">
        {score}
      </span>
      <Link
        to={profileUrl}
        className="ml-3 text-gray-500 hover:text-indigo-600 transition-colors"
        title="Профиль"
      >
        <User className="w-5 h-5" />
      </Link>
      {reportUrl && (
        <Link
          to={reportUrl}
          className="ml-2 text-gray-500 hover:text-indigo-600 transition-colors"
          title="Отчет"
        >
          <FileText className="w-5 h-5" />
        </Link>
      )}
    </div>
  </Card>
);

export default ApplicantCard;
