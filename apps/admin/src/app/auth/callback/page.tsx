'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@ub/api';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const AUTHORIZED_ADMIN_EMAILS = [
  'upgraderboy@gmail.com',
  'ankit@upgraderboy.com',
];

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState('Verifying administrative security credentials...');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    async function handleSessionVerification(user: { id: string; email?: string } | null) {
      if (!user) {
        if (isMounted) {
          setErrorDetails('Authentication session could not be established.');
          setTimeout(() => router.replace('/login?error=auth_failed'), 1500);
        }
        return;
      }

      setStatusMessage('Validating administrator privileges...');

      const isEmailAuthorized =
        user.email &&
        AUTHORIZED_ADMIN_EMAILS.includes(user.email.toLowerCase());

      let isRoleAdmin = false;
      const { data: profile } = await supabase!
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.role === 'admin') {
        isRoleAdmin = true;
      }

      if (!isEmailAuthorized && !isRoleAdmin) {
        await supabase!.auth.signOut();
        localStorage.removeItem('ub_admin_session');
        if (isMounted) {
          router.replace('/login?error=unauthorized');
        }
        return;
      }

      // Store local session confirmation for instant client reads
      localStorage.setItem(
        'ub_admin_session',
        JSON.stringify({
          email: user.email,
          role: 'admin',
          verifiedAt: new Date().toISOString(),
        })
      );

      const nextUrl = searchParams.get('next') || '/dashboard';
      if (isMounted) {
        setStatusMessage('Authorized. Launching Mission Control...');
        router.replace(nextUrl);
      }
    }

    async function startAuthFlow() {
      if (!supabase) {
        if (isMounted) {
          setErrorDetails('Supabase authentication client is not configured.');
          setTimeout(() => router.replace('/login'), 2000);
        }
        return;
      }

      // 1. Check if session already exists or has been hydrated
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        if (isMounted) {
          setErrorDetails(error.message);
          setTimeout(() => router.replace('/login?error=auth_failed'), 2000);
        }
        return;
      }

      if (session?.user) {
        await handleSessionVerification(session.user);
      }
    }

    void startAuthFlow();

    if (!supabase) return;

    // 2. Listen to onAuthStateChange for OAuth token / code exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        void handleSessionVerification(session.user);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) router.replace('/login');
      }
    });

    // Fallback safety timeout if no session arrives within 5 seconds
    const timeout = setTimeout(() => {
      if (isMounted) {
        void supabase!.auth.getUser().then(({ data: { user } }) => {
          if (user) {
            void handleSessionVerification(user);
          } else {
            router.replace('/login');
          }
        });
      }
    }, 5000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#070A11] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-full max-w-sm p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center mb-6 text-[var(--accent-color)]">
          {errorDetails ? (
            <AlertCircle className="w-7 h-7 text-rose-400" />
          ) : (
            <ShieldCheck className="w-7 h-7" />
          )}
        </div>

        {!errorDetails ? (
          <>
            <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-base font-bold text-white mb-2">Authenticating Administrator</h2>
            <p className="text-xs font-mono text-slate-400">{statusMessage}</p>
          </>
        ) : (
          <>
            <h2 className="text-base font-bold text-rose-400 mb-2">Authentication Failed</h2>
            <p className="text-xs font-mono text-slate-400">{errorDetails}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070A11] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
