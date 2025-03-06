import { Metadata } from 'next';
import DashboardLayout from '@/components/DashboardLayout';
import styles from './dashboard.module.css';

export const metadata: Metadata = {
  title: 'Dashboard | APUDSI CMS',
  description: 'APUDSI CMS Dashboard',
};

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className={styles.dashboardContainer}>
        <h1 className={styles.welcomeText}>Welcome to APUDSI CMS</h1>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Users</h3>
            <p className={styles.statValue}>254</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Content</h3>
            <p className={styles.statValue}>124</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Pages</h3>
            <p className={styles.statValue}>36</p>
          </div>
          
          <div className={styles.statCard}>
            <h3>Media</h3>
            <p className={styles.statValue}>89</p>
          </div>
        </div>
        
        <div className={styles.recentActivity}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <div className={styles.activityTime}>10:45 AM</div>
              <div className={styles.activityContent}>
                <p><strong>John Doe</strong> created a new page: <span>About Us</span></p>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityTime}>Yesterday</div>
              <div className={styles.activityContent}>
                <p><strong>Jane Smith</strong> updated the homepage content</p>
              </div>
            </div>
            
            <div className={styles.activityItem}>
              <div className={styles.activityTime}>2 days ago</div>
              <div className={styles.activityContent}>
                <p><strong>Admin</strong> added 3 new users</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
