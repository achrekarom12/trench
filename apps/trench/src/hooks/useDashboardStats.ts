import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAuth } from './useAuth';

interface DashboardStats {
  facultyCount: number;
  studentCount: number;
  adminCount: number;
  collegeCount: number;
  departmentCount: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      // Only fetch if user is authenticated and is an admin
      if (!isAuthenticated || !user || user.role !== 'admin') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await apiClient.getDashboardStats() as any;
        
        if (response.success) {
          setStats(response.stats);
        } else {
          setError('Failed to fetch dashboard statistics');
        }
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message || 'Failed to fetch dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

  return { stats, loading, error };
}
