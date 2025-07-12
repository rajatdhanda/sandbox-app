import type { Users as UsersType, Notifications } from '@/lib/supabase/_generated/generated-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Bell, Shield, Database, Users, Wifi, CircleHelp as HelpCircle, ChevronRight, Mail, Phone } from 'lucide-react-native';
import { useState } from 'react';

export default function SettingsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [dataSync, setDataSync] = useState(true);

  const settingsCategories = [
    {
      title: 'General',
      icon: Settings,
      settings: [
        { id: 'school-info', title: 'School Information', subtitle: 'Update school details and contact info' },
        { id: 'academic-year', title: 'Academic Year Settings', subtitle: 'Configure terms and holidays' },
        { id: 'class-schedules', title: 'Class Schedules', subtitle: 'Manage daily schedules and timings' },
      ]
    },
    {
      title: 'Notifications',
      icon: Bell,
      settings: [
        { 
          id: 'push-notifications', 
          title: 'Push Notifications', 
          subtitle: 'Receive real-time updates',
          toggle: true,
          value: pushNotifications,
          onToggle: setPushNotifications
        },
        { 
          id: 'email-notifications', 
          title: 'Email Notifications', 
          subtitle: 'Get updates via email',
          toggle: true,
          value: emailNotifications,
          onToggle: setEmailNotifications
        },
        { id: 'notification-schedule', title: 'Notification Schedule', subtitle: 'Set quiet hours and frequency' },
      ]
    },
    {
      title: 'Security & Privacy',
      icon: Shield,
      settings: [
        { id: 'user-permissions', title: 'User Permissions', subtitle: 'Manage role-based access' },
        { id: 'data-privacy', title: 'Data Privacy', subtitle: 'Control data sharing and retention' },
        { id: 'security-logs', title: 'Security Logs', subtitle: 'View system access logs' },
        { id: 'two-factor', title: 'Two-Factor Authentication', subtitle: 'Enable 2FA for admin accounts' },
      ]
    },
    {
      title: 'Data Management',
      icon: Database,
      settings: [
        { 
          id: 'auto-backup', 
          title: 'Automatic Backup', 
          subtitle: 'Daily data backup at 3:00 AM',
          toggle: true,
          value: autoBackup,
          onToggle: setAutoBackup
        },
        { 
          id: 'data-sync', 
          title: 'Data Synchronization', 
          subtitle: 'Sync data across devices',
          toggle: true,
          value: dataSync,
          onToggle: setDataSync
        },
        { id: 'export-data', title: 'Export Data', subtitle: 'Download all school data' },
        { id: 'storage-usage', title: 'Storage Usage', subtitle: 'View storage consumption' },
      ]
    },
    {
      title: 'User Management',
      icon: Users,
      settings: [
        { id: 'parent-registration', title: 'Parent Registration', subtitle: 'Configure registration process' },
        { id: 'teacher-accounts', title: 'Teacher Accounts', subtitle: 'Manage teacher access and roles' },
        { id: 'student-profiles', title: 'Student Profiles', subtitle: 'Configure student information fields' },
      ]
    },
    {
      title: 'System',
      icon: Wifi,
      settings: [
        { id: 'system-status', title: 'System Status', subtitle: 'Check server health and uptime' },
        { id: 'api-integrations', title: 'API Integrations', subtitle: 'Manage third-party connections' },
        { id: 'system-logs', title: 'System Logs', subtitle: 'View system activity logs' },
        { id: 'maintenance', title: 'Maintenance Mode', subtitle: 'Enable maintenance mode' },
      ]
    },
  ];

  const supportOptions = [
    { id: 'help-center', title: 'Help Center', subtitle: 'Browse FAQs and guides', icon: HelpCircle },
    { id: 'contact-support', title: 'Contact Support', subtitle: 'Get help from our team', icon: Mail },
    { id: 'phone-support', title: 'Phone Support', subtitle: 'Call us at 1-800-PRESCHOOL', icon: Phone },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Configure system preferences and options</Text>
        </View>

        <View style={styles.systemInfo}>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>System Version</Text>
              <Text style={styles.infoValue}>v2.4.1</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>Jan 10, 2025</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Server Status</Text>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {settingsCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <View key={category.title} style={styles.categorySection}>
              <View style={styles.categoryHeader}>
                <IconComponent size={20} color="#8B5CF6" />
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              
              {category.settings.map((setting) => (
                <TouchableOpacity key={setting.id} style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                    <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                  </View>
                  <View style={styles.settingAction}>
                    {setting.toggle ? (
                      <Switch
                        value={setting.value}
                        onValueChange={setting.onToggle}
                        trackColor={{ false: '#E5E7EB', true: '#8B5CF6' }}
                        thumbColor={setting.value ? '#FFFFFF' : '#FFFFFF'}
                      />
                    ) : (
                      <ChevronRight size={16} color="#6B7280" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}

        <View style={styles.supportSection}>
          <Text style={styles.sectionTitle}>Support & Help</Text>
          {supportOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <TouchableOpacity key={option.id} style={styles.supportItem}>
                <View style={styles.supportIcon}>
                  <IconComponent size={20} color="#8B5CF6" />
                </View>
                <View style={styles.supportInfo}>
                  <Text style={styles.supportTitle}>{option.title}</Text>
                  <Text style={styles.supportSubtitle}>{option.subtitle}</Text>
                </View>
                <ChevronRight size={16} color="#6B7280" />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Reset All Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Factory Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  systemInfo: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  infoCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  categorySection: {
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
    paddingVertical: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  settingAction: {
    marginLeft: 16,
  },
  supportSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  supportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  supportInfo: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  supportSubtitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  dangerZone: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 16,
  },
  dangerButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  dangerButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});