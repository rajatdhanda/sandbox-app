import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { UserCheck, UserX, Clock, Calendar, Check, X, Users } from 'lucide-react-native';

interface AttendanceRecord {
  id: string;
  child_id: string;
  class_id: string;
  attendance_date: string;
  check_in_time?: string;
  check_out_time?: string;
  status: 'present' | 'absent' | 'late' | 'early_pickup' | 'sick';
  notes?: string;
  child?: {
    first_name: string;
    last_name: string;
  };
}

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  class_id: string;
}

export const AttendanceManagement: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchChildren();
      fetchAttendance();
    }
  }, [selectedClass, selectedDate]);

  const fetchClasses = async () => {
    try {
      console.log('🏫 Fetching classes...');
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      console.log('✅ Classes fetched:', data?.length || 0);
      setClasses(data || []);
      if (data && data.length > 0) {
        setSelectedClass(data[0].id);
      }
    } catch (error) {
      console.error('💥 Error fetching classes:', error);
      Alert.alert('Error', 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      console.log('👶 Fetching children for class:', selectedClass);
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('class_id', selectedClass)
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      console.log('✅ Children fetched:', data?.length || 0);
      setChildren(data || []);
    } catch (error) {
      console.error('💥 Error fetching children:', error);
    }
  };

  const fetchAttendance = async () => {
    try {
      console.log('📊 Fetching attendance for date:', selectedDate);
      const { data, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          child:children(first_name, last_name)
        `)
        .eq('attendance_date', selectedDate)
        .in('child_id', children.map(child => child.id));

      if (error) throw error;
      console.log('✅ Attendance records fetched:', data?.length || 0);
      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('💥 Error fetching attendance:', error);
    }
  };

  const markAttendance = async (childId: string, status: 'present' | 'absent' | 'late') => {
    try {
      console.log('✅ Marking attendance:', { childId, status, date: selectedDate });
      
      const { data: userData } = await supabase.auth.getUser();
      const currentTime = new Date().toISOString();
      
      // Check if record already exists
      const existingRecord = attendanceRecords.find(record => record.child_id === childId);
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('attendance_records')
          .update({
            status,
            check_in_time: status !== 'absent' ? currentTime : null,
            updated_at: currentTime
          })
          .eq('id', existingRecord.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('attendance_records')
          .insert({
            child_id: childId,
            class_id: selectedClass,
            attendance_date: selectedDate,
            status,
            check_in_time: status !== 'absent' ? currentTime : null,
            checked_in_by: userData.user?.id
          });

        if (error) throw error;
      }

      console.log('✅ Attendance marked successfully');
      fetchAttendance();
    } catch (error: any) {
      console.error('💥 Error marking attendance:', error);
      Alert.alert('Error', error.message || 'Failed to mark attendance');
    }
  };

  const markCheckOut = async (childId: string) => {
    try {
      console.log('🚪 Marking check-out for child:', childId);
      
      const { data: userData } = await supabase.auth.getUser();
      const currentTime = new Date().toISOString();
      
      const existingRecord = attendanceRecords.find(record => record.child_id === childId);
      
      if (existingRecord) {
        const { error } = await supabase
          .from('attendance_records')
          .update({
            check_out_time: currentTime,
            checked_out_by: userData.user?.id,
            updated_at: currentTime
          })
          .eq('id', existingRecord.id);

        if (error) throw error;
        console.log('✅ Check-out marked successfully');
        fetchAttendance();
      }
    } catch (error: any) {
      console.error('💥 Error marking check-out:', error);
      Alert.alert('Error', error.message || 'Failed to mark check-out');
    }
  };

  const getAttendanceStatus = (childId: string) => {
    const record = attendanceRecords.find(record => record.child_id === childId);
    return record?.status || 'not_marked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10B981';
      case 'late': return '#F59E0B';
      case 'absent': return '#EF4444';
      case 'sick': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getAttendanceStats = () => {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const total = children.length;
    
    return { present, late, absent, total };
  };

  const stats = getAttendanceStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Management</Text>
        <View style={styles.dateSelector}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.dateText}>{selectedDate}</Text>
        </View>
      </View>

      {/* Class Selector */}
      <View style={styles.classSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {classes.map((classItem) => (
            <TouchableOpacity
              key={classItem.id}
              style={[
                styles.classTab,
                selectedClass === classItem.id && styles.activeClassTab
              ]}
              onPress={() => setSelectedClass(classItem.id)}
            >
              <Text style={[
                styles.classTabText,
                selectedClass === classItem.id && styles.activeClassTabText
              ]}>
                {classItem.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <UserCheck size={24} color="#10B981" />
          <Text style={styles.statNumber}>{stats.present}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{stats.late}</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
        <View style={styles.statCard}>
          <UserX size={24} color="#EF4444" />
          <Text style={styles.statNumber}>{stats.absent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statCard}>
          <Users size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Student List */}
      <ScrollView style={styles.studentsList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          children.map((child) => {
            const status = getAttendanceStatus(child.id);
            const record = attendanceRecords.find(r => r.child_id === child.id);
            
            return (
              <View key={child.id} style={styles.studentCard}>
                <View style={styles.studentInfo}>
                  <View style={styles.studentAvatar}>
                    <Text style={styles.studentInitial}>
                      {child.first_name[0]}{child.last_name[0]}
                    </Text>
                  </View>
                  <View style={styles.studentDetails}>
                    <Text style={styles.studentName}>
                      {child.first_name} {child.last_name}
                    </Text>
                    {record?.check_in_time && (
                      <Text style={styles.checkInTime}>
                        Check-in: {new Date(record.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                    {record?.check_out_time && (
                      <Text style={styles.checkOutTime}>
                        Check-out: {new Date(record.check_out_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.attendanceActions}>
                  <View style={styles.statusBadge}>
                    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                      {status === 'not_marked' ? 'Not Marked' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </View>
                  
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#10B981' }]}
                      onPress={() => markAttendance(child.id, 'present')}
                    >
                      <Check size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#F59E0B' }]}
                      onPress={() => markAttendance(child.id, 'late')}
                    >
                      <Clock size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#EF4444' }]}
                      onPress={() => markAttendance(child.id, 'absent')}
                    >
                      <X size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  {record && record.status !== 'absent' && !record.check_out_time && (
                    <TouchableOpacity
                      style={styles.checkOutButton}
                      onPress={() => markCheckOut(child.id)}
                    >
                      <Text style={styles.checkOutButtonText}>Check Out</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  classSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  classTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeClassTab: {
    backgroundColor: '#8B5CF6',
  },
  classTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeClassTabText: {
    color: '#FFFFFF',
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
  studentsList: {
    flex: 1,
    padding: 20,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  checkInTime: {
    fontSize: 12,
    color: '#10B981',
  },
  checkOutTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  attendanceActions: {
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOutButton: {
    backgroundColor: '#EC4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkOutButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
});