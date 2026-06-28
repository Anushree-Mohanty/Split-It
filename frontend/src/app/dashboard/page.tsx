'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Group } from '@/types';
import { getGroups } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import GroupCard from '@/components/GroupCard';
import AuthGuard from '@/components/AuthGuard';

function Dashboard() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    async function loadGroups() {
      try {
        const data = await getGroups(user!.id);
        setGroups(data);
      } catch {
        setError('Failed to load groups. Make sure the backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    }
    loadGroups();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-green-600 dark:text-orange-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Groups</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage shared expenses with friends and family
          </p>
        </div>
        <Link
          href="/groups/new"
          className="hidden sm:flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Link>
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 mb-6 text-rose-700 dark:text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!error && groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-200 dark:border-orange-500/20">
            <Users className="w-8 h-8 text-green-700 dark:text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No groups yet
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-6">
            Create your first group to start splitting expenses with friends
          </p>
          <Link
            href="/groups/new"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Create First Group
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/groups/new"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-600 hover:bg-green-700 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-400 text-white dark:text-gray-900 rounded-full shadow-lg dark:shadow-orange-500/30 flex items-center justify-center transition-all"
        aria-label="Create group"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}
