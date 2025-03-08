'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import styles from './DashboardLayout.module.css';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

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

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  return (
    <div className={styles.dashboardContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>APUDSI CMS</div>
        <nav className={styles.nav}>
          <Link href="/dashboard" className={`${styles.navLink} ${isActive('/dashboard') && pathname === '/dashboard' ? styles.active : ''}`}>Dashboard</Link>
          
          {/* New Article Editor Menu Item */}
          <Link href="/dashboard/article-editor" className={`${styles.navLink} ${isActive('/dashboard/article-editor') ? styles.active : ''}`}>Article Editor</Link>
          
          <Link href="/dashboard/profile" className={`${styles.navLink} ${isActive('/dashboard/profile') ? styles.active : ''}`}>Profile</Link>
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
          <div className={styles.headerTitle}>
            {pathname === '/dashboard' && 'Dashboard'}
            {pathname === '/dashboard/article-editor' && 'Article Editor'}
            {pathname === '/dashboard/profile' && 'Profile'}
          </div>
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
