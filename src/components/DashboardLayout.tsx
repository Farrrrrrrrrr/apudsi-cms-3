'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect dashboard routes
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>APUDSI CMS</div>
        <nav className={styles.nav}>
          <a href="/dashboard" className={styles.navLink}>Dashboard</a>
          <a href="/dashboard/profile" className={styles.navLink}>Profile</a>
          {/* Add more navigation items as needed */}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </aside>
      
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>Dashboard</div>
          <div className={styles.userInfo}>
            <span>Welcome, {session.user.name}</span>
          </div>
        </header>
        
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
