import { TrendingUp, TrendingDown, CheckCircle, ArrowRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';
import { Settlement } from '@/types';

interface BalanceCardProps {
  member: string;
  balance: number;
  settlements: Settlement[];
}

export default function BalanceCard({ member, balance, settlements = [] }: BalanceCardProps) {
  const isPositive = balance > 0.005;
  const isNegative = balance < -0.005;
  const isSettled = !isPositive && !isNegative;

  // Filter out the relevant settlement items for this specific person
  const whoIOwe = settlements.filter((s) => s.from === member);
  const whoPaysMe = settlements.filter((s) => s.to === member);

  return (
    <div
      className={`flex flex-col p-4 rounded-xl border transition-all ${
        isPositive
          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50'
          : isNegative
          ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/50'
          : 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/10'
      }`}
    >
      {/* TOP ROW: MAIN INFO PANEL */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
              isPositive
                ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300'
                : isNegative
                ? 'bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-300'
                : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
            }`}
          >
            {member.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white text-sm">{member}</p>
            <p
              className={`text-xs ${
                isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isNegative
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {isPositive ? 'gets back' : isNegative ? 'owes' : 'settled up'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSettled ? (
            <CheckCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : isPositive ? (
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-rose-500" />
          )}
          <span
            className={`font-bold text-base ${
              isPositive
                ? 'text-emerald-700 dark:text-emerald-400'
                : isNegative
                ? 'text-rose-700 dark:text-rose-400'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {isSettled ? '—' : formatINR(Math.abs(balance))}
          </span>
        </div>
      </div>

      {/* BOTTOM SECTION: DETAILED PAYMENT BREAKDOWNS */}
      {!isSettled && (whoIOwe.length > 0 || whoPaysMe.length > 0) && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-white/10 space-y-1.5">
          
          {/* Case A: You owe money -> Show who to send it to */}
          {isNegative &&
            whoIOwe.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400/80 font-medium">
                <ArrowRight className="w-3 h-3 opacity-60" />
                <span>Owes <span className="font-bold">{formatINR(s.amount)}</span> to {s.to}</span>
              </div>
            ))}

          {/* Case B: You are getting money back -> Show who is paying you */}
          {isPositive &&
            whoPaysMe.map((s, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400/80 font-medium">
                <ArrowRight className="w-3 h-3 opacity-60" />
                <span>Gets <span className="font-bold">{formatINR(s.amount)}</span> from {s.from}</span>
              </div>
            ))}
            
        </div>
      )}
    </div>
  );
}