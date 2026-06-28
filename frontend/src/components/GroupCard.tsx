import Link from 'next/link';
import { Users, ArrowRight, Calendar } from 'lucide-react';
import { Group } from '@/types';

interface GroupCardProps {
  group: Group;
}

export default function GroupCard({ group }: GroupCardProps) {
  const formattedDate = new Date(group.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link href={`/groups/${group._id}`}>
      <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-6 hover:border-green-300 dark:hover:border-orange-500/30 hover:shadow-md dark:hover:shadow-orange-500/5 transition-all duration-200 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-orange-400 transition-colors">
              {group.name}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-gray-400 dark:text-gray-500 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-green-50 dark:bg-orange-500/10 text-green-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 border border-green-100 dark:border-orange-500/20">
            <Users className="w-3.5 h-3.5" />
            <span>{group.members.length}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {group.members.slice(0, 4).map((member) => (
            <span
              key={member}
              className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium border border-transparent dark:border-white/5"
            >
              {member}
            </span>
          ))}
          {group.members.length > 4 && (
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-full text-xs">
              +{group.members.length - 4} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-end text-green-600 dark:text-orange-400 text-sm font-medium">
          <span>View details</span>
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
