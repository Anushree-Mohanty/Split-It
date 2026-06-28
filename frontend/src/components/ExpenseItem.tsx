import { Pencil, Trash2, Receipt, Loader2 } from 'lucide-react';
import { Expense } from '@/types';
import { formatINR } from '@/lib/utils';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

export default function ExpenseItem({ expense, onEdit, onDelete, deleting }: ExpenseItemProps) {
  const formattedDate = new Date(expense.createdAt).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-colors group">
      <div className="w-9 h-9 bg-green-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-green-200 dark:border-orange-500/20">
        <Receipt className="w-4 h-4 text-green-700 dark:text-orange-400" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
          {expense.description}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">
          Paid by{' '}
          <span className="font-medium text-gray-600 dark:text-gray-300">{expense.paidBy}</span>{' '}
          · {formattedDate}
        </p>
      </div>

      {/* Amount + action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
          {formatINR(expense.amount)}
        </p>

        {/* Edit */}
        <button
          onClick={() => onEdit(expense)}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-600 dark:hover:text-orange-400 hover:bg-green-50 dark:hover:bg-orange-500/10 transition-all"
          aria-label="Edit expense"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(expense._id)}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all disabled:opacity-50"
          aria-label="Delete expense"
        >
          {deleting
            ? <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-500" />
            : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
