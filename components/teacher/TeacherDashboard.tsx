import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { supabase, Child, Class } from '@/lib/supabase';
import { CurriculumExecution } from './CurriculumExecution';
import { ActivityLogForm } from '../forms/ActivityLogForm';
import { LogOut, Users, Plus, UserCheck, Camera, FileText, Clock, Calendar, BookOpen, CheckCircle, Circle, AlertCircle } from 'lucide-react-native';

interface TeacherClass extends Class {
  children: Child[];
  curriculum_assignments: {
    curriculum_template: {
      id: string;
      name: string;
      curriculum_items: any[];
    };
  }[];
}

interface TodaysActivity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  time_slot: {
    name: string;
    start_time: string;
    end_time: string;
  };
  estimated_duration: number;
  materials_needed: string[];
  learning_goals: string[];
  skills_developed: string[];
  execution?: {
    id: string;
    completion_status: 'planned' | 'in_progress' | 'completed' | 'skipped' | 'modified';
    student_engagement: 'low' | 'medium' | 'high';
    notes?: string;
  };
}

export const TeacherDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [todaysActivities, setTodaysActivities] = useState<TodaysActivity[]>([]);
  const [weeklyActivities, setWeeklyActivities] = useState<TodaysActivity[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showCurriculumExecution, setShowCurriculumExecution] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Child | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<TodaysActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'week'>('today');

  useEffect(() => {
    if (user) {
      fetchTeacherClasses();
    }
  }, [user]);

  useEffect(() => {
    if (selectedClass) {
      fetchTodaysActivities();
      fetchWeeklyActivities();
    }
  }, [selectedClass]);

  const fetchTeacherClasses = async () => {
    try {
      console.log('👨‍🏫 Fetching teacher classes...');
      
      const { data, error } = await supabase
        .from('class_assignments')
        .select(`
          class:classes(
            *,
            children(
              *,
              parent_child_relationships(
                parent:users(full_name, email)
              )
            ),
            curriculum_assignments(
              curriculum_template:curriculum_templates(
                id,
                name,
                curriculum_items(*)
              )
            )
          )
        `)
        .eq('teacher_id', user!.id);

      if (error) throw error;

      const classesData = data?.map(assignment => assignment.class).filter(Boolean) || [];
      console.log('✅ Teacher classes fetched:', classesData.length);
      
      setClasses(classesData);
      if (classesData.length > 0) {
        setSelectedClass(classesData[0]);
      }
    } catch (error) {
      console.error('💥 Error fetching teacher classes:', error);
      Alert.alert('Error', 'Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysActivities = async () => {
    if (!selectedClass) return;

    try {
      console.log('📅 Fetching today\'s activities...');
      
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentWeek = Math.ceil(today.getDate() / 7);
      
      // Get curriculum items for today
      const { data: curriculumItems, error: curriculumError } = await supabase
        .from('curriculum_items')
        .select(`
          *,
          time_slot:time_slots(*),
          curriculum_template:curriculum_templates(*)
        `)
        .in('curriculum_id', selectedClass.curriculum_assignments?.map(ca => ca.curriculum_template.id) || [])
        .eq('day_number', dayOfWeek)
        .lte('week_number', currentWeek)
        .order('time_slot(sort_order)');

      if (curriculumError) throw curriculumError;

      // Get executions for today
      const { data: executions, error: executionsError } = await supabase
        .from('curriculum_executions')
        .select('*')
        .eq('class_id', selectedClass.id)
        .eq('execution_date', today.toISOString().split('T')[0]);

      if (executionsError) throw executionsError;

      // Combine curriculum items with executions
      const activitiesWithExecutions = curriculumItems?.map(item => ({
        ...item,
        execution: executions?.find(exec => exec.curriculum_item_id === item.id)
      })) || [];

      console.log('✅ Today\'s activities fetched:', activitiesWithExecutions.length);
      setTodaysActivities(activitiesWithExecutions);
    } catch (error) {
      console.error('💥 Error fetching today\'s activities:', error);
    }
  };

  const fetchWeeklyActivities = async () => {
    if (!selectedClass) return;

    try {
      console.log('📅 Fetching weekly activities...');
      
      const today = new Date();
      const currentWeek = Math.ceil(today.getDate() / 7);
      
      // Get all curriculum items for this week
      const { data: curriculumItems, error: curriculumError } = await supabase
        .from('curriculum_items')
        .select(`
          *,
          time_slot:time_slots(*),
          curriculum_template:curriculum_templates(*)
        `)
        .in('curriculum_id', selectedClass.curriculum_assignments?.map(ca => ca.curriculum_template.id) || [])
        .eq('week_number', currentWeek)
        .order('day_number', { ascending: true })
        .order('time_slot(sort_order)', { ascending: true });

      if (curriculumError) throw curriculumError;

      console.log('✅ Weekly activities fetched:', curriculumItems?.length || 0);
      setWeeklyActivities(curriculumItems || []);
    } catch (error) {
      console.error('💥 Error fetching weekly activities:', error);
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

  const openCurriculumExecution = () => {
    setShowCurriculumExecution(true);
  };

  const closeCurriculumExecution = () => {
    setShowCurriculumExecution(false);
  };

  const updateActivityStatus = async (activity: TodaysActivity, status: 'planned' | 'in_progress' | 'completed' | 'skipped') => {
    try {
      console.log('🔄 Updating activity status:', { activityId: activity.id, status });
      
      const today = new Date().toISOString().split('T')[0];
      const currentTime = new Date().toISOString();
      
      const executionData = {
        curriculum_item_id: activity.id,
        class_id: selectedClass!.id,
        teacher_id: user!.id,
        execution_date: today,
        completion_status: status,
        actual_start_time: status !== 'planned' ? currentTime : null,
        actual_end_time: status === 'completed' ? currentTime : null,
        student_engagement: 'medium' as const
      };

      if (activity.execution) {
        // Update existing execution
        const { error } = await supabase
          .from('curriculum_executions')
          .update(executionData)
          .eq('id', activity.execution.id);
        
        if (error) throw error;
      } else {
        // Create new execution
        const { error } = await supabase
          .from('curriculum_executions')
          .insert(executionData);
        
        if (error) throw error;
      }

      console.log('✅ Activity status updated successfully');
      fetchTodaysActivities(); // Refresh the list
    } catch (error: any) {
      console.error('💥 Error updating activity status:', error);
      Alert.alert('Error', error.message || 'Failed to update activity status');
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'skipped': return '#EF4444';
      case 'modified': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'in_progress': return <Clock size={16} color="#F59E0B" />;
      case 'skipped': return <Circle size={16} color="#EF4444" />;
      case 'modified': return <AlertCircle size={16} color="#8B5CF6" />;
      default: return <Circle size={16} color="#6B7280" />;
    }
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
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
                    {selectedClass.children?.length || 0} students • {selectedClass.age_group}
                  </Text>
                  <Text style={styles.classSchedule}>
                    {selectedClass.schedule_start} - {selectedClass.schedule_end}
                  </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <Users size={24} color="#8B5CF6" />
                    <Text style={styles.statNumber}>{selectedClass.children?.length || 0}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                  </View>
                  <View style={styles.statCard}>
                    <BookOpen size={24} color="#EC4899" />
                    <Text style={styles.statNumber}>{todaysActivities.length}</Text>
                    <Text style={styles.statLabel}>Today's Activities</Text>
                  </View>
                  <View style={styles.statCard}>
                    <CheckCircle size={24} color="#10B981" />
                    <Text style={styles.statNumber}>
                      {todaysActivities.filter(a => a.execution?.completion_status === 'completed').length}
                    </Text>
                    <Text style={styles.statLabel}>Completed</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Clock size={24} color="#F59E0B" />
                    <Text style={styles.statNumber}>
                      {todaysActivities.filter(a => a.execution?.completion_status === 'in_progress').length}
                    </Text>
                    <Text style={styles.statLabel}>In Progress</Text>
                  </View>
                </View>

                {/* Activity Tabs */}
                <View style={styles.tabContainer}>
                  <TouchableOpacity
                    style={[styles.tab, activeTab === 'today' && styles.activeTab]}
                    onPress={() => setActiveTab('today')}
                  >
                    <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>
                      Today's Activities
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.tab, activeTab === 'week' && styles.activeTab]}
                    onPress={() => setActiveTab('week')}
                  >
                    <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
                      This Week
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Activities List */}
                <View style={styles.activitiesSection}>
                  {activeTab === 'today' ? (
                    todaysActivities.length === 0 ? (
                      <Text style={styles.emptyText}>No activities planned for today</Text>
                    ) : (
                      todaysActivities.map((activity) => (
                        <View key={activity.id} style={styles.activityCard}>
                          <View style={styles.activityHeader}>
                            <View style={styles.activityInfo}>
                              <Text style={styles.activityTitle}>{activity.title}</Text>
                              <Text style={styles.activityType}>{activity.activity_type}</Text>
                              {activity.time_slot && (
                                <View style={styles.timeSlot}>
                                  <Clock size={14} color="#8B5CF6" />
                                  <Text style={styles.timeSlotText}>
                                    {activity.time_slot.start_time} - {activity.time_slot.end_time}
                                  </Text>
                                </View>
                              )}
                            </View>
                            
                            <View style={styles.activityStatus}>
                              {getStatusIcon(activity.execution?.completion_status)}
                              <Text style={[
                                styles.statusText, 
                                { color: getStatusColor(activity.execution?.completion_status) }
                              ]}>
                                {activity.execution?.completion_status || 'planned'}
                              </Text>
                            </View>
                          </View>

                          <Text style={styles.activityDescription}>{activity.description}</Text>

                          <View style={styles.activityMeta}>
                            <Text style={styles.activityDuration}>{activity.estimated_duration} min</Text>
                            {activity.skills_developed.length > 0 && (
                              <View style={styles.skillsTags}>
                                {activity.skills_developed.slice(0, 2).map((skill, index) => (
                                  <Text key={index} style={styles.skillTag}>{skill}</Text>
                                ))}
                              </View>
                            )}
                          </View>

                          {/* Quick Status Buttons */}
                          <View style={styles.statusButtons}>
                            <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: '#F59E0B' }]}
                              onPress={() => updateActivityStatus(activity, 'in_progress')}
                            >
                              <Text style={styles.statusButtonText}>Start</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: '#10B981' }]}
                              onPress={() => updateActivityStatus(activity, 'completed')}
                            >
                              <Text style={styles.statusButtonText}>Complete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[styles.statusButton, { backgroundColor: '#EF4444' }]}
                              onPress={() => updateActivityStatus(activity, 'skipped')}
                            >
                              <Text style={styles.statusButtonText}>Skip</Text>
                            </TouchableOpacity>
                          </View>

                          {activity.execution?.notes && (
                            <View style={styles.executionNotes}>
                              <Text style={styles.notesLabel}>Notes:</Text>
                              <Text style={styles.notesText}>{activity.execution.notes}</Text>
                            </View>
                          )}
                        </View>
                      ))
                    )
                  ) : (
                    // Weekly view
                    weeklyActivities.length === 0 ? (
                      <Text style={styles.emptyText}>No activities planned for this week</Text>
                    ) : (
                      weeklyActivities.reduce((acc, activity) => {
                        const dayName = getDayName(activity.day_number);
                        if (!acc[dayName]) {
                          acc[dayName] = [];
                        }
                        acc[dayName].push(activity);
                        return acc;
                      }, {} as Record<string, TodaysActivity[]>)
                    ) && Object.entries(
                      weeklyActivities.reduce((acc, activity) => {
                        const dayName = getDayName(activity.day_number);
                        if (!acc[dayName]) {
                          acc[dayName] = [];
                        }
                        acc[dayName].push(activity);
                        return acc;
                      }, {} as Record<string, TodaysActivity[]>)
                    ).map(([day, activities]) => (
                      <View key={day} style={styles.daySection}>
                        <Text style={styles.dayTitle}>{day}</Text>
                        {activities.map((activity) => (
                          <View key={activity.id} style={styles.weeklyActivityCard}>
                            <View style={styles.weeklyActivityHeader}>
                              <Text style={styles.weeklyActivityTitle}>{activity.title}</Text>
                              <Text style={styles.weeklyActivityTime}>
                                {activity.time_slot?.start_time} - {activity.time_slot?.end_time}
                              </Text>
                            </View>
                            <Text style={styles.weeklyActivityType}>{activity.activity_type}</Text>
                            <Text style={styles.weeklyActivityDuration}>{activity.estimated_duration} min</Text>
                          </View>
                        ))}
                      </View>
                    ))
                  )}
                </View>

                {/* Student Roster */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Student Roster</Text>
                  {selectedClass.children?.length === 0 ? (
                    <Text style={styles.emptyText}>No students in this class</Text>
                  ) : (
                    selectedClass.children?.map((student) => (
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
                            {student.allergies && (
                              <Text style={styles.studentAllergies}>⚠️ {student.allergies}</Text>
                            )}
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
                    <TouchableOpacity 
                      style={styles.quickActionCard}
                      onPress={openCurriculumExecution}
                    >
                      <BookOpen size={24} color="#8B5CF6" />
                      <Text style={styles.quickActionText}>Curriculum Execution</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <Camera size={24} color="#EC4899" />
                      <Text style={styles.quickActionText}>Add Photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickActionCard}>
                      <FileText size={24} color="#F97316" />
                      <Text style={styles.quickActionText}>View Reports</Text>
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

      {/* Curriculum Execution Modal */}
      <Modal
        visible={showCurriculumExecution}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CurriculumExecution />
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={closeCurriculumExecution}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  activitiesSection: {
    marginBottom: 24,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityType: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 4,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeSlotText: {
    fontSize: 12,
    color: '#8B5CF6',
    marginLeft: 4,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    fontSize: 10,
    color: '#8B5CF6',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 4,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  executionNotes: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  daySection: {
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  weeklyActivityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  weeklyActivityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  weeklyActivityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  weeklyActivityTime: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  weeklyActivityType: {
    fontSize: 12,
    color: '#EC4899',
    marginBottom: 2,
  },
  weeklyActivityDuration: {
    fontSize: 12,
    color: '#6B7280',
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
  studentAllergies: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
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
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});