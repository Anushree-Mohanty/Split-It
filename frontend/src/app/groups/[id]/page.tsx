'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Receipt, Loader2, TrendingUp, AlertCircle, Users } from 'lucide-react';
import { getGroup, deleteExpense } from '@/lib/api';
import { GroupDetail, Expense } from '@/types';

import { formatINR } from '@/lib/utils';
import BalanceCard from '@/components/BalanceCard';
import ExpenseItem from '@/components/ExpenseItem';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditExpenseModal from '@/components/EditExpenseModal';
import AuthGuard from '@/components/AuthGuard';

// Define the runtime extended format to keep TypeScript happy
interface ExtendedGroupDetail extends Omit<GroupDetail, 'settlements'> {
  settlements: {
    from: string;
    to: string;
    amount: number;
  }[];
}

function GroupDetailView() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ExtendedGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadGroup = useCallback(async () => {
    try {
      const result = await getGroup(id);
      console.log('[DEBUG] group API result:', JSON.stringify(result, null, 2));
      setData(result as ExtendedGroupDetail);
      setError('');
    } catch {
      setError('Group not found or failed to load.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadGroup(); }, [loadGroup]);

  const handleExpenseAdded = async () => {
    setShowModal(false);
    setLoading(true);
    await loadGroup();
  };

  const handleExpenseUpdated = async () => {
    setEditingExpense(null);
    setLoading(true);
    await loadGroup();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteExpense(id);
      await loadGroup();
    } catch {
      alert('Failed to delete expense. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-green-600 dark:text-orange-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-5 py-3 rounded-xl mb-5">
          <AlertCircle className="w-4 h-4" />
          {error || 'Something went wrong'}
        </div>
        <Link href="/dashboard" className="text-green-600 dark:text-orange-400 hover:opacity-80 text-sm font-medium">
          ← Back to groups
        </Link>
      </div>
    );
  }

  const { group, expenses, balances } = data;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const sortedBalances = Object.entries(balances).sort((a, b) => b[1] - a[1]);
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const statCard = (label: string, value: string) => (
    <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-xl border border-gray-200 dark:border-white/10 p-4 w-full">
      <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide font-medium">{label}</p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1 break-words">{value}</p>
    </div>
  );

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All groups
      </Link>

      {/* 🚀 RESPONSIVE WRAPPER: Stacks dynamically on dynamic viewports */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-6 gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white break-words">{group.name}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            {group.members.map((member) => (
              <span
                key={member}
                className="px-3 py-1 bg-green-100 dark:bg-orange-500/10 text-green-700 dark:text-orange-400 rounded-full text-xs sm:text-sm font-medium border border-green-200 dark:border-orange-500/20"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {/* 🚀 RESPONSIVE GRID: Stacks on mobile viewports */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCard('Total Spent', formatINR(totalSpent))}
        {statCard('Expenses', expenses.length.toString())}
        {statCard('Members', group.members.length.toString())}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses Segment */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Expenses</h2>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
              {expenses.length} {expenses.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {sortedExpenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-11 h-11 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-3 border border-gray-200 dark:border-white/10">
                <Receipt className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">No expenses yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-green-600 dark:text-orange-400 hover:opacity-80 text-sm font-medium mt-1"
              >
                Add the first one →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {sortedExpenses.map((expense) => (
                <ExpenseItem
                  key={expense._id}
                  expense={expense}
                  onEdit={setEditingExpense}
                  onDelete={handleDelete}
                  deleting={deletingId === expense._id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Balances Segment */}
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 dark:border-white/5">
            <TrendingUp className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Balances</h2>
          </div>

          {expenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <div className="w-11 h-11 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center justify-center mb-3 border border-gray-200 dark:border-white/10">
                <Users className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Balances will appear once expenses are added
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {sortedBalances.map(([member, balance]) => (
                <BalanceCard key={member} member={member} balance={balance} settlements={data.settlements} />
              ))}
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                Positive = gets back · Negative = owes
              </p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <AddExpenseModal
          groupId={group.id}
          members={group.members}
          onClose={() => setShowModal(false)}
          onSuccess={handleExpenseAdded}
        />
      )}

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          members={group.members}
          onClose={() => setEditingExpense(null)}
          onSuccess={handleExpenseUpdated}
        />
      )}
    </>
  );
}

export default function GroupDetailPage() {
  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GroupDetailView />
      </div>
    </AuthGuard>
  );
}