import React from 'react';
import { useAuth } from './auth/AuthProvider';
import { LoginScreen } from './auth/LoginScreen';
import { ParentDashboard } from './parent/ParentDashboard';
import { TeacherDashboard } from './teacher/TeacherDashboard';
import { AdminDashboard } from './admin/AdminDashboard';
import { View, Text, StyleSheet } from 'react-native';
import { User } from 'lucide-react-native';

export const RoleRouter: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <User size={48} color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // Route based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid user role: {user.role}</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
  },
});