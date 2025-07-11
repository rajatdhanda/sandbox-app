import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { supabase, Child, Class } from '@/lib/supabase';
import { ActivityLogForm } from '../forms/ActivityLogForm';
import { LogOut, Users, Plus, UserCheck, Camera, FileText, Clock } from 'lucide-react-native';

export const TeacherDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [students, setStudents] = useState<Child[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTeacherClasses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      fetchClassStudents(selectedClass.id);
    }
  }, [selectedClass]);

  const fetchTeacherClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('class_assignments')
        .select(`
          class:classes(*)
        `)
        .eq('teacher_id', user!.id);

      if (error) throw error;

      const classesData = data?.map(assignment => assignment.class).filter(Boolean) || [];
      setClasses(classesData);
      if (classesData.length > 0) {
        setSelectedClass(classesData[0]);
      }
    } catch (error) {
      console.error('Error fetching teacher classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClassStudents = async (classId: string) => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('class_id', classId)
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching class students:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const openActivityForm = (student: Child) => {
    setSelectedStudent(student);
    setShowActivityForm(true);
  };

  const closeActivityForm = () => {
    setShowActivityForm(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome, {user?.full_name}!</Text>
          <Text style={styles.roleText}>Teacher Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {classes.length === 0 ? (
        <View style={styles.emptyState}>
          <Users size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No classes assigned</Text>
        </View>
      ) : (
        <>
          {/* Class Selector */}
          {classes.length > 1 && (
            <View style={styles.classSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {classes.map((classItem) => (
                  <TouchableOpacity
                    key={classItem.id}
                    style={[
                      styles.classTab,
                      selectedClass?.id === classItem.id && styles.activeClassTab
                    ]}
                    onPress={() => setSelectedClass(classItem)}
                  >
                    <Text style={[
                      styles.classTabText,
                      selectedClass?.id === classItem.id && styles.activeClassTabText
                    ]}>
                      {classItem.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <ScrollView style={styles.content}>
            {selectedClass && (
              <>
                {/* Class Info */}
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{selectedClass.name}</Text>
                  <Text style={styles.classDetails}>
                    {students.length} students • {selectedClass.age_group}
                  </Text>
                  <Text style={styles.classSchedule}>
                    {selectedClass.schedule_start} - {selectedClass.schedule_end}
                  </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Users size={24} color="#8B5CF6" />
                    <Text style={styles.statNumber}>{students.length}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                  </View>
                  <View style={styles.statCard}>
                    <UserCheck size={24} color="#10B981" />
                    <Text style={styles.statNumber}>{Math.floor(students.length * 0.9)}</Text>
                    <Text style={styles.statLabel}>Present</Text>
                  </View>
                  <View style={styles.statCard}>
                    <FileText size={24} color="#EC4899" />
                    <Text style={styles.statNumber}>12</Text>
                    <Text style={styles.statLabel}>Activities</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Camera size={24} color="#F97316" />
                    <Text style={styles.statNumber}>23</Text>
                    <Text style={styles.statLabel}>Photos</Text>
                  </View>
                </View>

                {/* Today's Schedule */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Today's Schedule</Text>
                  <View style={styles.scheduleCard}>
                    <View style={styles.scheduleItem}>
                      <Clock size={16} color="#8B5CF6" />
                      <Text style={styles.scheduleTime}>9:00 AM</Text>
                      <Text style={styles.scheduleActivity}>Circle Time</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                      <Clock size={16} color="#EC4899" />
                      <Text style={styles.scheduleTime}>10:30 AM</Text>
                      <Text style={styles.scheduleActivity}>Art & Craft</Text>
                    </View>
                    <View style={styles.scheduleItem}>
                      <Clock size={16} color="#F97316" />
                      <Text style={styles.scheduleTime}>2:00 PM</Text>
                      <Text style={styles.scheduleActivity}>Outdoor Play</Text>
                    </View>
                  </View>
                </View>

                {/* Student Roster */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Student Roster</Text>
                  {students.length === 0 ? (
                    <Text style={styles.emptyText}>No students in this class</Text>
                  ) : (
                    students.map((student) => (
                      <View key={student.id} style={styles.studentCard}>
                        <View style={styles.studentInfo}>
                          <View style={styles.studentAvatar}>
                            <Text style={styles.studentInitial}>
                              {student.first_name[0]}{student.last_name[0]}
                            </Text>
                          </View>
                          <View style={styles.studentDetails}>
                            <Text style={styles.studentName}>
                              {student.first_name} {student.last_name}
                            </Text>
                            <Text style={styles.studentAge}>
                              Age: {new Date().getFullYear() - new Date(student.date_of_birth).getFullYear()}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.studentActions}>
                          <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => openActivityForm(student)}
                          >
                            <Plus size={16} color="#8B5CF6" />
                            <Text style={styles.actionButtonText}>Log Activity</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                  <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <UserCheck size={24} color="#10B981" />
                      <Text style={styles.quickActionText}>Take Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <Camera size={24} color="#EC4899" />
                      <Text style={styles.quickActionText}>Add Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <FileText size={24} color="#F97316" />
                      <Text style={styles.quickActionText}>View Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <Users size={24} color="#8B5CF6" />
                      <Text style={styles.quickActionText}>Message Parents</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}

      {/* Activity Log Form Modal */}
      <Modal
        visible={showActivityForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedStudent && (
          <ActivityLogForm
            childId={selectedStudent.id}
            teacherId={user!.id}
            onSave={closeActivityForm}
            onCancel={closeActivityForm}
          />
        )}
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
  content: {
    flex: 1,
    padding: 20,
  },
  classInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  className: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
  },
  classSchedule: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
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
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
    width: 80,
  },
  scheduleActivity: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  studentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  studentAge: {
    fontSize: 12,
    color: '#6B7280',
  },
  studentActions: {
    marginLeft: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
});