import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoleStore } from '@/stores/roleStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Baby, Settings, Bell, TrendingUp, Calendar, Camera, MessageCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { currentRole, setRole } = useRoleStore();

  const handleRoleChange = () => {
    Alert.alert(
      'Switch Role',
      'Select your role in the system:',
      [
        { text: 'Parent', onPress: () => setRole('parent') },
        { text: 'Teacher', onPress: () => setRole('teacher') },
        { text: 'Admin', onPress: () => setRole('admin') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderParentDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Emma's Day at Little Stars Preschool</Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Bell size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>New Updates</Text>
        </View>
        <View style={styles.statCard}>
          <Camera size={24} color="#EC4899" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>New Photos</Text>
        </View>
        <View style={styles.statCard}>
          <MessageCircle size={24} color="#F97316" />
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Activities</Text>
        <View style={styles.activityCard}>
          <View style={styles.activityTime}>
            <Text style={styles.timeText}>10:30 AM</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={styles.activityTitle}>Art & Craft Time</Text>
            <Text style={styles.activityDescription}>Emma created a beautiful painting with watercolors</Text>
          </View>
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityTime}>
            <Text style={styles.timeText}>2:15 PM</Text>
          </View>
          <View style={styles.activityDetails}>
            <Text style={styles.activityTitle}>Outdoor Play</Text>
            <Text style={styles.activityDescription}>Playing with friends in the garden</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <Calendar size={20} color="#8B5CF6" />
            <Text style={styles.actionText}>Schedule Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <MessageCircle size={20} color="#EC4899" />
            <Text style={styles.actionText}>Message Teacher</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTeacherDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Teacher Dashboard</Text>
        <Text style={styles.subtitle}>Sunflower Class - 18 Students</Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Users size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Present Today</Text>
        </View>
        <View style={styles.statCard}>
          <Baby size={24} color="#EC4899" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Activities Logged</Text>
        </View>
        <View style={styles.statCard}>
          <Camera size={24} color="#F97316" />
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>Photos Taken</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTime}>9:00 AM - 10:00 AM</Text>
          <Text style={styles.scheduleActivity}>Circle Time & Story Reading</Text>
        </View>
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTime}>10:30 AM - 11:30 AM</Text>
          <Text style={styles.scheduleActivity}>Art & Craft Activities</Text>
        </View>
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTime}>2:00 PM - 3:00 PM</Text>
          <Text style={styles.scheduleActivity}>Outdoor Play Time</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        <View style={styles.updateCard}>
          <Text style={styles.updateTitle}>Emma completed her art project</Text>
          <Text style={styles.updateTime}>2 hours ago</Text>
        </View>
        <View style={styles.updateCard}>
          <Text style={styles.updateTitle}>Liam needs pickup at 3:30 PM</Text>
          <Text style={styles.updateTime}>1 hour ago</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderAdminDashboard = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>
        <Text style={styles.subtitle}>Little Stars Preschool Management</Text>
      </View>

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Users size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>127</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Users size={24} color="#EC4899" />
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Teachers</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={24} color="#F97316" />
          <Text style={styles.statNumber}>94%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Active Classes</Text>
            <Text style={styles.overviewValue}>8</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Parent Accounts</Text>
            <Text style={styles.overviewValue}>89</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Messages Today</Text>
            <Text style={styles.overviewValue}>34</Text>
          </View>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Photos Shared</Text>
            <Text style={styles.overviewValue}>156</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activities</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>New student enrollment</Text>
          <Text style={styles.activityDescription}>Oliver Johnson joined Rainbow class</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>System backup completed</Text>
          <Text style={styles.activityDescription}>Daily backup successful at 3:00 AM</Text>
        </View>
      </View>
    </ScrollView>
  );

  const getCurrentDashboard = () => {
    switch (currentRole) {
      case 'parent':
        return renderParentDashboard();
      case 'teacher':
        return renderTeacherDashboard();
      case 'admin':
        return renderAdminDashboard();
      default:
        return renderParentDashboard();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <Text style={styles.roleText}>Current Role: {currentRole}</Text>
        <TouchableOpacity style={styles.switchButton} onPress={handleRoleChange}>
          <Text style={styles.switchButtonText}>Switch Role</Text>
        </TouchableOpacity>
      </View>
      {getCurrentDashboard()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  switchButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
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
  section: {
    backgroundColor: '#FFFFFF',
    margin: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityTime: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  activityDetails: {
    flex: 1,
    marginLeft: 16,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  scheduleTime: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 4,
  },
  scheduleActivity: {
    fontSize: 16,
    color: '#1F2937',
  },
  updateCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  updateTitle: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  overviewCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  overviewItem: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
});