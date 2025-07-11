import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserCheck, UserX, Clock, Users, Check, X, Calendar } from 'lucide-react-native';

export default function AttendanceScreen() {
  const students = [
    { id: '1', name: 'Emma Johnson', status: 'present', time: '8:15 AM' },
    { id: '2', name: 'Liam Davis', status: 'present', time: '8:30 AM' },
    { id: '3', name: 'Sofia Wilson', status: 'present', time: '8:45 AM' },
    { id: '4', name: 'Oliver Martinez', status: 'absent', time: null },
    { id: '5', name: 'Maya Chen', status: 'present', time: '9:00 AM' },
    { id: '6', name: 'Noah Thompson', status: 'present', time: '8:20 AM' },
    { id: '7', name: 'Ava Rodriguez', status: 'late', time: '9:30 AM' },
    { id: '8', name: 'Ethan Brown', status: 'present', time: '8:10 AM' },
    { id: '9', name: 'Isabella Garcia', status: 'present', time: '8:25 AM' },
    { id: '10', name: 'Mason Anderson', status: 'present', time: '8:40 AM' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#10B981';
      case 'absent':
        return '#EF4444';
      case 'late':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <Check size={16} color="#10B981" />;
      case 'absent':
        return <X size={16} color="#EF4444" />;
      case 'late':
        return <Clock size={16} color="#F59E0B" />;
      default:
        return <Clock size={16} color="#6B7280" />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Attendance</Text>
          <Text style={styles.subtitle}>Sunflower Class - January 15, 2025</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <UserCheck size={24} color="#10B981" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statCard}>
            <UserX size={24} color="#EF4444" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#F59E0B" />
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>10</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Check size={16} color="#10B981" />
            <Text style={styles.actionText}>Mark All Present</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={16} color="#8B5CF6" />
            <Text style={styles.actionText}>View History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.attendanceList}>
          <Text style={styles.sectionTitle}>Student Attendance</Text>
          
          {students.map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.studentAvatar}>
                  <Text style={styles.studentInitial}>
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  {student.time && (
                    <Text style={styles.arrivalTime}>Arrived at {student.time}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.attendanceActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(student.status) + '20' }]}>
                  {getStatusIcon(student.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(student.status) }]}>
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.todaysSummary}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Attendance Rate</Text>
              <Text style={styles.summaryValue}>90%</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>First Arrival</Text>
              <Text style={styles.summaryValue}>8:10 AM</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Latest Arrival</Text>
              <Text style={styles.summaryValue}>9:30 AM</Text>
            </View>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  attendanceList: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  studentInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  arrivalTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  attendanceActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  todaysSummary: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
});