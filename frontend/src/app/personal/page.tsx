'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  Filter,
  Trash2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PersonalExpense } from '@/types';
import { formatINR, PERSONAL_CATEGORIES } from '@/lib/utils';
import AddPersonalExpenseModal from '@/components/AddPersonalExpenseModal';
import AuthGuard from '@/components/AuthGuard';

const STORAGE_KEY = (uid: string) => `splitit_personal_${uid}`;

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400',
  Transport: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',
  Shopping: 'bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400',
  Entertainment: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400',
  'Bills & Utilities': 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  Healthcare: 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400',
  Education: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
  Salary: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  Other: 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300',
};

type FilterType = 'all' | 'income' | 'expense';

function PersonalTracker() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    if (!user) return;
    const stored = localStorage.getItem(STORAGE_KEY(user.id));
    if (stored) setExpenses(JSON.parse(stored));
  }, [user]);

  const handleExpenseAdded = (expense: PersonalExpense) => {
    setExpenses((prev) => [expense, ...prev]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const updated = expenses.filter((e) => e.id !== id);
    setExpenses(updated);
    if (user) localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(updated));
  };

  const totalIncome = expenses.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  const filtered = expenses.filter((e) => {
    if (filterType !== 'all' && e.type !== filterType) return false;
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    return true;
  });

  const usedCategories = [...new Set(expenses.map((e) => e.category))];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Expenses</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Track your personal income and spending
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div
          className={`rounded-2xl p-5 border ${
            netBalance >= 0
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500'
              : 'bg-gradient-to-br from-rose-500 to-rose-600 border-rose-500'
          }`}
        >
          <p className="text-sm font-medium text-white/80">Net Balance</p>
          <p className="text-3xl font-bold text-white mt-1">{formatINR(Math.abs(netBalance))}</p>
          <p className="text-xs text-white/70 mt-1">
            {netBalance >= 0 ? 'You are in profit' : 'You are in deficit'}
          </p>
        </div>

        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Total Income</p>
            <div className="w-7 h-7 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-200 dark:border-emerald-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatINR(totalIncome)}</p>
        </div>

        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 p-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">Total Spent</p>
            <div className="w-7 h-7 bg-rose-100 dark:bg-rose-500/10 rounded-lg flex items-center justify-center border border-rose-200 dark:border-rose-500/20">
              <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{formatINR(totalExpenses)}</p>
        </div>
      </div>

      {/* Filters */}
      {expenses.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Filter:</span>
          </div>
          <div className="flex rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
            {(['all', 'income', 'expense'] as FilterType[]).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                  filterType === t
                    ? 'bg-green-600 dark:bg-orange-500 text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          {usedCategories.length > 1 && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-orange-500"
            >
              <option value="all">All categories</option>
              {usedCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>
      )}

      {/* Transaction list */}
      {expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-green-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-200 dark:border-orange-500/20">
            <Wallet className="w-7 h-7 text-green-700 dark:text-orange-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No transactions yet</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs mb-5">
            Start tracking your income and expenses
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            <Plus className="w-4 h-4" />
            Add First Transaction
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 text-sm">
          No transactions match the current filter.
        </div>
      ) : (
        <div className="bg-white dark:bg-white/5 dark:backdrop-blur-md rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Transactions</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {filtered.length} {filtered.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-white/5">
            {filtered.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    entry.type === 'income'
                      ? 'bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20'
                      : 'bg-rose-100 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20'
                  }`}
                >
                  {entry.type === 'income' ? (
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{entry.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[entry.category] || CATEGORY_COLORS['Other']}`}>
                      {entry.category}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`font-bold text-sm ${entry.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {entry.type === 'income' ? '+' : '-'}{formatINR(entry.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && user && (
        <AddPersonalExpenseModal
          userId={user.id}
          onClose={() => setShowModal(false)}
          onSuccess={handleExpenseAdded}
        />
      )}
    </div>
  );
}

export default function PersonalPage() {
  return (
    <AuthGuard>
      <PersonalTracker />
    </AuthGuard>
  );
}
