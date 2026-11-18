'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@ub/api';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const AUTHORIZED_ADMIN_EMAILS = [
  'upgraderboy@gmail.com',
  'ankit@upgraderboy.com',
];

/* ------------------------------------------------------------------ */
/*  AdminShell — Layout Wrapper for all /dashboard/* routes           */
/* ------------------------------------------------------------------ */

interface AdminShellProps {
  children: React.ReactNode;
}

export default function AdminShell({ children }: AdminShellProps) {
  const router = useRouter();

  /* Auth state */
  const [adminUser, setAdminUser] = useState<{ email?: string; username?: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  /* Sidebar state */
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  /* ---- Auth verification ---- */
  useEffect(() => {
    let isMounted = true;
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      router.replace('/login');
      return;
    }

    async function verifyUser(user: {
      id: string;
      email?: string;
      user_metadata?: Record<string, unknown>;
    } | null) {
      if (!user) {
        if (isMounted) router.replace('/login');
        return;
      }

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
        if (isMounted) router.replace('/login?error=unauthorized');
        return;
      }

      if (isMounted) {
        setAdminUser({
          email: user.email,
          username:
            (user.user_metadata?.username as string) ||
            (user.user_metadata?.full_name as string) ||
            'upgraderboy',
        });
        setIsVerifying(false);
      }
    }

    // Check existing session immediately
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        void verifyUser(session.user);
      } else {
        const fallbackTimer = setTimeout(() => {
          if (isMounted) {
            void supabase!.auth.getUser().then(({ data: { user } }) => {
              if (user) {
                void verifyUser(user);
              } else {
                router.replace('/login');
              }
            });
          }
        }, 1500);

        return () => clearTimeout(fallbackTimer);
      }
    });

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        void verifyUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) router.replace('/login');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  /* ---- Sign out handler ---- */
  const handleSignOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ub_admin_session');
    router.push('/login');
  }, [router]);


  /* ---- Loading state ---- */
  if (isVerifying) {
    return (
      <div className="min-h-dvh bg-[#070A11] flex flex-col items-center justify-center text-slate-400">
        <div className="w-8 h-8 border-2 border-[var(--accent-color)] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono">
          Verifying administrative security credentials...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#070A11] text-slate-100">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        onClose={() => setIsMobileOpen(false)}
        onToggleCollapse={() => setIsCollapsed((c) => !c)}
      />

      {/* Main content area — offset by sidebar width */}
      <div
        className={`
          flex flex-col min-h-dvh transition-[margin-left] duration-200 ease-out
          ${isCollapsed ? 'lg:ml-[60px]' : 'lg:ml-[240px]'}
        `}
      >
        {/* Top bar */}
        <TopBar
          adminEmail={adminUser?.email}
          isCollapsed={isCollapsed}
          onMenuToggle={() => setIsMobileOpen((o) => !o)}
          onCollapseToggle={() => setIsCollapsed((c) => !c)}
          onSignOut={handleSignOut}
        />

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
