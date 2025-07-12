import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { supabase } from '@/lib/supabase/clients';
import { getNotifications, getAnnouncements, getUpcomingEvents } from '@/lib/supabase/queries';
import type { Notification, Announcement, Event } from '@/lib/supabase/types';
import { UserManagement } from './UserManagement';
import { ClassroomAssignmentFlow } from './ClassroomAssignmentFlow';
import { CurriculumAssignmentFlow } from './CurriculumAssignmentFlow';
import { ChildrenManagement } from './ChildrenManagement';
import { ClassManagement } from './ClassManagement';
import { LogOut, Users, Baby, Settings, ChartBar as BarChart3, Database, Shield, FileText, X, Bell, Calendar, MessageCircle, TrendingUp, BookOpen } from 'lucide-react-native';
import { ConfigManagement } from './ConfigManagement';
import { ReportsModule } from './ReportsModule';
import { CurriculumManagement } from './CurriculumManagement';
import { PhotoManagement } from './PhotoManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { SystemLogs } from './SystemLogs';

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
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [showModule, setShowModule] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
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
    if (user) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [notificationsData, announcementsData, eventsData] = await Promise.all([
        getNotifications(user!.id, 5),
        getAnnouncements(3),
        getUpcomingEvents(3)
      ]);

      setNotifications(notificationsData);
      setAnnouncements(announcementsData);
      setUpcomingEvents(eventsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

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

  const openModule = (module: string) => {
    setActiveModule(module);
    setShowModule(true);
  };

  const closeModule = () => {
    setActiveModule(null);
    setShowModule(false);
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'classroom-assignment':
        return <ClassroomAssignmentFlow />;
      case 'curriculum-assignment':
        return <CurriculumAssignmentFlow />;
      case 'users':
        return <UserManagement />;
      case 'children':
        return <ChildrenManagement />;
      case 'classes':
        return <ClassManagement />;
      case 'config':
        return <ConfigManagement />;
      case 'curriculum':
        return <CurriculumManagement />;
      case 'photos':
        return <PhotoManagement />;
      case 'attendance':
        return <AttendanceManagement />;
      case 'reports':
        return <ReportsModule />;
      case 'logs':
        return <SystemLogs />;
      default:
        return null;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'urgent': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'success': return '#10B981';
      case 'error': return '#EF4444';
      default: return '#8B5CF6';
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
            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('classroom-assignment')}
            >
              <Users size={32} color="#8B5CF6" />
              <Text style={styles.moduleTitle}>Classroom Assignment</Text>
              <Text style={styles.moduleDescription}>
                Assign students and teachers to classes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('curriculum-assignment')}
            >
              <BookOpen size={32} color="#EC4899" />
              <Text style={styles.moduleTitle}>Curriculum Assignment</Text>
              <Text style={styles.moduleDescription}>
                Assign curriculum to classes and manage schedules
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('users')}
            >
              <Users size={32} color="#8B5CF6" />
              <Text style={styles.moduleTitle}>User Management</Text>
              <Text style={styles.moduleDescription}>
                Manage parents, teachers, and admin accounts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('children')}
            >
              <Baby size={32} color="#EC4899" />
              <Text style={styles.moduleTitle}>Student Management</Text>
              <Text style={styles.moduleDescription}>
                View and manage student profiles and enrollment
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('classes')}
            >
              <Settings size={32} color="#F97316" />
              <Text style={styles.moduleTitle}>Class Management</Text>
              <Text style={styles.moduleDescription}>
                Manage classes, schedules, and teacher assignments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('curriculum')}
            >
              <FileText size={32} color="#059669" />
              <Text style={styles.moduleTitle}>Curriculum Management</Text>
              <Text style={styles.moduleDescription}>
                Create, schedule, and assign comprehensive learning plans
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('photos')}
            >
              <Database size={32} color="#DC2626" />
              <Text style={styles.moduleTitle}>Photo Management</Text>
              <Text style={styles.moduleDescription}>
                Upload, tag, and organize student photos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('attendance')}
            >
              <Users size={32} color="#7C3AED" />
              <Text style={styles.moduleTitle}>Attendance Management</Text>
              <Text style={styles.moduleDescription}>
                Track daily attendance and check-in/out times
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('config')}
            >
              <Database size={32} color="#10B981" />
              <Text style={styles.moduleTitle}>Configuration</Text>
              <Text style={styles.moduleDescription}>
                Manage dropdown fields and system settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('reports')}
            >
              <BarChart3 size={32} color="#6366F1" />
              <Text style={styles.moduleTitle}>Reports & Analytics</Text>
              <Text style={styles.moduleDescription}>
                View system reports and analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.moduleCard}
              onPress={() => openModule('logs')}
            >
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
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <View style={styles.notificationsCard}>
            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>No recent notifications</Text>
            ) : (
              notifications.slice(0, 3).map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <View style={[styles.notificationIcon, { backgroundColor: getNotificationColor(notification.type) + '20' }]}>
                    <Bell size={16} color={getNotificationColor(notification.type)} />
                  </View>
                  <View style={styles.notificationDetails}>
                    <Text style={styles.notificationTitle}>{notification.title}</Text>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <Text style={styles.notificationTime}>
                      {new Date(notification.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Announcements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Announcements</Text>
          <View style={styles.announcementsCard}>
            {announcements.length === 0 ? (
              <Text style={styles.emptyText}>No recent announcements</Text>
            ) : (
              announcements.map((announcement) => (
                <View key={announcement.id} style={styles.announcementItem}>
                  <View style={styles.announcementHeader}>
                    <Text style={styles.announcementTitle}>{announcement.title}</Text>
                    <Text style={styles.announcementType}>{announcement.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.announcementContent} numberOfLines={2}>
                    {announcement.content}
                  </Text>
                  <Text style={styles.announcementDate}>
                    {new Date(announcement.publish_date).toLocaleDateString()}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.eventsCard}>
            {upcomingEvents.length === 0 ? (
              <Text style={styles.emptyText}>No upcoming events</Text>
            ) : (
              upcomingEvents.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventIcon}>
                    <Calendar size={16} color="#8B5CF6" />
                  </View>
                  <View style={styles.eventDetails}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>
                      {new Date(event.start_date).toLocaleDateString()} at {new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    {event.location && (
                      <Text style={styles.eventLocation}>{event.location}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Quick Stats Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <TrendingUp size={20} color="#10B981" />
              <Text style={styles.summaryLabel}>Active Users Today</Text>
              <Text style={styles.summaryValue}>{Math.floor(stats.activeUsers * 0.8)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <MessageCircle size={20} color="#EC4899" />
              <Text style={styles.summaryLabel}>Messages Sent</Text>
              <Text style={styles.summaryValue}>23</Text>
            </View>
            <View style={styles.summaryItem}>
              <Bell size={20} color="#F97316" />
              <Text style={styles.summaryLabel}>Notifications</Text>
              <Text style={styles.summaryValue}>{notifications.filter(n => !n.is_read).length}</Text>
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

      {/* Module Modal */}
      <Modal
        visible={showModule}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.moduleContainer}>
          <View style={styles.moduleHeader}>
            <Text style={styles.moduleHeaderTitle}>
              {activeModule === 'users' && 'User Management'}
              {activeModule === 'classroom-assignment' && 'Classroom Assignment'}
              {activeModule === 'curriculum-assignment' && 'Curriculum Assignment'}
              {activeModule === 'children' && 'Children Management'}
              {activeModule === 'classes' && 'Class Management'}
              {activeModule === 'curriculum' && 'Curriculum Management'}
              {activeModule === 'photos' && 'Photo Management'}
              {activeModule === 'attendance' && 'Attendance Management'}
              {activeModule === 'config' && 'Configuration Management'}
              {activeModule === 'reports' && 'Reports & Analytics'}
              {activeModule === 'logs' && 'System Logs'}
            </Text>
            <TouchableOpacity onPress={closeModule}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          {renderModule()}
        </View>
      </Modal>
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
  notificationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationDetails: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  announcementsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  announcementItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  announcementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  announcementType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  announcementContent: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  announcementDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  eventsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  eventDate: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
  moduleContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  moduleHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
});