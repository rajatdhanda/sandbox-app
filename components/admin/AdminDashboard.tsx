import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { LogOut, Users, Baby, Settings, BarChart3, Database, Shield, FileText } from 'lucide-react-native';

interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  totalClasses: number;
  totalTeachers: number;
  totalParents: number;
  activeUsers: number;
}

export const AdminDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalChildren: 0,
    totalClasses: 0,
    totalTeachers: 0,
    totalParents: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch user statistics
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('role, is_active');

      if (usersError) throw usersError;

      // Fetch children count
      const { count: childrenCount, error: childrenError } = await supabase
        .from('children')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (childrenError) throw childrenError;

      // Fetch classes count
      const { count: classesCount, error: classesError } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      if (classesError) throw classesError;

      // Calculate statistics
      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => u.is_active).length || 0;
      const totalTeachers = users?.filter(u => u.role === 'teacher').length || 0;
      const totalParents = users?.filter(u => u.role === 'parent').length || 0;

      setStats({
        totalUsers,
        totalChildren: childrenCount || 0,
        totalClasses: classesCount || 0,
        totalTeachers,
        totalParents,
        activeUsers,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Admin Dashboard</Text>
          <Text style={styles.roleText}>Welcome, {user?.full_name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* System Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Users size={24} color="#8B5CF6" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Baby size={24} color="#EC4899" />
              <Text style={styles.statNumber}>{stats.totalChildren}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Settings size={24} color="#F97316" />
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statLabel}>Classes</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#10B981" />
              <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
            <View style={styles.statCard}>
              <Users size={24} color="#6366F1" />
              <Text style={styles.statNumber}>{stats.totalParents}</Text>
              <Text style={styles.statLabel}>Parents</Text>
            </View>
            <View style={styles.statCard}>
              <Shield size={24} color="#059669" />
              <Text style={styles.statNumber}>{stats.activeUsers}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
          </View>
        </View>

        {/* Management Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Management Modules</Text>
          <View style={styles.moduleGrid}>
            <TouchableOpacity style={styles.moduleCard}>
              <Users size={32} color="#8B5CF6" />
              <Text style={styles.moduleTitle}>User Management</Text>
              <Text style={styles.moduleDescription}>
                Manage parents, teachers, and admin accounts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moduleCard}>
              <Baby size={32} color="#EC4899" />
              <Text style={styles.moduleTitle}>Student Management</Text>
              <Text style={styles.moduleDescription}>
                View and manage student profiles and enrollment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moduleCard}>
              <Settings size={32} color="#F97316" />
              <Text style={styles.moduleTitle}>Class Management</Text>
              <Text style={styles.moduleDescription}>
                Manage classes, schedules, and teacher assignments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moduleCard}>
              <Database size={32} color="#10B981" />
              <Text style={styles.moduleTitle}>Configuration</Text>
              <Text style={styles.moduleDescription}>
                Manage dropdown fields and system settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moduleCard}>
              <BarChart3 size={32} color="#6366F1" />
              <Text style={styles.moduleTitle}>Reports & Analytics</Text>
              <Text style={styles.moduleDescription}>
                View system reports and analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.moduleCard}>
              <FileText size={32} color="#059669" />
              <Text style={styles.moduleTitle}>System Logs</Text>
              <Text style={styles.moduleDescription}>
                Monitor system activity and audit logs
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent System Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Users size={16} color="#8B5CF6" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>New teacher account created</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Baby size={16} color="#EC4899" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Student enrolled in Rainbow Class</Text>
                <Text style={styles.activityTime}>4 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Settings size={16} color="#F97316" />
              </View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Class schedule updated</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
          </View>
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthCard}>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Database Status</Text>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.healthText}>Online</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Server Status</Text>
              <View style={styles.healthStatus}>
                <View style={[styles.healthDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.healthText}>Healthy</Text>
              </View>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Last Backup</Text>
              <Text style={styles.healthValue}>2 hours ago</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthLabel}>Storage Used</Text>
              <Text style={styles.healthValue}>2.4 GB / 10 GB</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  roleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  moduleDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  healthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  healthLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  healthStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  healthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#10B981',
  },
  healthValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
});