'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

// Standalone /login redirects to the landing page which now hosts the auth forms
export default function LoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(user ? '/dashboard' : '/');
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 text-green-600 dark:text-orange-400 animate-spin" />
    </div>
  );
}
