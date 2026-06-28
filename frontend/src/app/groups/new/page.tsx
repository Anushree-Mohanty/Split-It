'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Users, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { createGroup } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

function NewGroupForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    if (members.map((m) => m.toLowerCase()).includes(name.toLowerCase())) {
      setError(`"${name}" is already in the group`);
      return;
    }
    setMembers([...members, name]);
    setMemberInput('');
    setError('');
  };

  const removeMember = (name: string) => {
    setMembers(members.filter((m) => m !== name));
  };

  const handleMemberKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addMember();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!groupName.trim()) { setError('Group name is required'); return; }
    if (members.length < 2) { setError('Add at least 2 members to split expenses'); return; }
    setLoading(true);
    try {
      const group = await createGroup({ name: groupName.trim(), members, userId: user!.id });
      router.push(`/groups/${group._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create group');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ' +
    'border bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent ' +
    'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-orange-500';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-lg mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to groups
        </Link>

        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 p-8 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-green-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center border border-green-200 dark:border-orange-500/20">
              <Users className="w-5 h-5 text-green-700 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create Group</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add members to split expenses with</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Trip to Goa, Roommates, Weekend camp..."
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Members
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  onKeyDown={handleMemberKeyDown}
                  placeholder="Enter a name and press Enter"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addMember}
                  className="px-4 py-2.5 bg-green-600 hover:bg-green-700 dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 text-white dark:text-gray-900 rounded-xl text-sm font-semibold transition-all flex items-center gap-1 flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {members.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-3">
                  {members.map((member) => (
                    <span
                      key={member}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-orange-500/10 text-green-700 dark:text-orange-400 rounded-full text-sm font-medium border border-green-200 dark:border-orange-500/20"
                    >
                      {member}
                      <button
                        type="button"
                        onClick={() => removeMember(member)}
                        className="hover:bg-green-200 dark:hover:bg-orange-500/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Add at least 2 members</p>
              )}
            </div>

            {error && (
              <p className="text-rose-600 dark:text-rose-400 text-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Group'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function NewGroupPage() {
  return (
    <AuthGuard>
      <NewGroupForm />
    </AuthGuard>
  );
}
