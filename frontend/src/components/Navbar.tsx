'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DollarSign, Sun, Moon, LayoutDashboard, Wallet, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggle } = useTheme();
  const { user, logout, loading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!loading && !user && pathname === '/') return null;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/');
  };

  const navLink = (href: string, label: string, Icon: React.ElementType) => {
    const active = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-green-50 dark:bg-orange-500/10 text-green-700 dark:text-orange-400'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
        }`}
      >
        <Icon className="w-4 h-4" />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white dark:bg-black/40 dark:backdrop-blur-xl border-b border-gray-200 dark:border-white/5 sticky top-0 z-40 shadow-sm dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 bg-green-600 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-400 rounded-lg flex items-center justify-center group-hover:opacity-90 transition-opacity dark:shadow-orange-500/20 dark:shadow-lg">
                <DollarSign className="w-5 h-5 text-white dark:text-gray-900" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Split<span className="text-green-600 dark:text-orange-400">It</span>
              </span>
            </Link>

            {user && (
              <div className="hidden sm:flex items-center gap-1">
                {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
                {navLink('/personal', 'Personal', Wallet)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-7 h-7 bg-green-600 dark:bg-gradient-to-br dark:from-orange-500 dark:to-amber-400 rounded-full flex items-center justify-center text-white dark:text-gray-900 text-xs font-bold flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white hidden sm:block max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-52 bg-white dark:bg-gray-900/90 dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-black/40 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="flex sm:hidden items-center gap-1 pb-3">
            {navLink('/dashboard', 'Dashboard', LayoutDashboard)}
            {navLink('/personal', 'Personal', Wallet)}
          </div>
        )}
      </div>
    </nav>
  );
}
