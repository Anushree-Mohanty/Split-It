'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { createExpense } from '@/lib/api';

interface AddExpenseModalProps {
  groupId: string;
  members: string[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({
  groupId,
  members,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(members[0] || '');
  
  // 🚀 NEW STATE: Automatically select all members by default
  const [splitBetween, setSplitBetween] = useState<string[]>(members);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Handle checking/unchecking members
  const handleCheckboxChange = (member: string) => {
    if (splitBetween.includes(member)) {
      // Prevent unchecking everyone entirely
      if (splitBetween.length === 1) return;
      setSplitBetween(splitBetween.filter((m) => m !== member));
    } else {
      setSplitBetween([...splitBetween, member]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);
    if (!description.trim()) {
      setError('Description is required');
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);
    try {
      await createExpense({
        groupId,
        description: description.trim(),
        amount: amountNum,
        paidBy,
        splitBetween, // 🚀 NEW: Send your target consumer split list to the API
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ' +
    'border bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent ' +
    'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder-gray-500 dark:focus:ring-orange-500';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <div className="relative bg-white dark:bg-gray-900/90 dark:backdrop-blur-xl rounded-2xl shadow-xl dark:shadow-black/60 w-full max-w-md p-6 z-10 border border-gray-200 dark:border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Dinner at restaurant"
                autoFocus
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Paid by
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className={inputClass}
                >
                  {members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 🚀 NEW SECTION: SPLIT BETWEEN MULTI-SELECT CHECKBOX GRID */}
            <div className="pt-2 border-t border-gray-100 dark:border-white/5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Split Between
              </label>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-3.5 space-y-3">
                {members.map((member) => {
                  const isChecked = splitBetween.includes(member);
                  return (
                    <label
                      key={member}
                      className="flex items-center justify-between cursor-pointer group text-sm select-none"
                    >
                      <span
                        className={`font-medium transition-colors ${
                          isChecked
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                      >
                        {member}
                      </span>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCheckboxChange(member)}
                        className="w-4 h-4 rounded border-gray-300 dark:border-white/20 bg-transparent text-green-600 dark:text-orange-500 focus:ring-0 cursor-pointer accent-green-600 dark:accent-orange-500"
                      />
                    </label>
                  );
                })}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 pl-1">
                The bill amount will be divided evenly among only the checked members.
              </p>
            </div>

            {error && (
              <p className="text-rose-600 dark:text-rose-400 text-sm bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 px-4 py-2.5 rounded-xl">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-white/10 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white dark:bg-gradient-to-r dark:from-orange-500 dark:to-amber-400 dark:hover:from-orange-600 dark:hover:to-amber-500 dark:text-gray-900 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {loading ? 'Adding...' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}