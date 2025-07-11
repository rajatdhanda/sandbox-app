import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, CircleCheck as CheckCircle, Circle, CreditCard as Edit3, Camera, Save, X, Users, BookOpen, Target, Star, CircleAlert as AlertCircle } from 'lucide-react-native';

interface CurriculumItem {
  id: string;
  title: string;
  description?: string;
  activity_type: string;
  materials_needed: string[];
  learning_goals: string[];
  week_number: number;
  day_number: number;
  estimated_duration: number;
  skills_developed: string[];
  time_slot?: {
    name: string;
    start_time: string;
    end_time: string;
  };
}

interface CurriculumExecution {
  id: string;
  curriculum_item_id: string;
  execution_date: string;
  actual_start_time?: string;
  actual_end_time?: string;
  completion_status: 'planned' | 'in_progress' | 'completed' | 'skipped' | 'modified';
  modifications_made?: string;
  student_engagement: 'low' | 'medium' | 'high';
  materials_used: string[];
  challenges_faced?: string;
  notes?: string;
  photos: string[];
  next_steps?: string;
}

interface TeacherClass {
  id: string;
  name: string;
  color_code: string;
  curriculum_assignments: {
    curriculum_template: {
      id: string;
      name: string;
      curriculum_items: CurriculumItem[];
    };
  }[];
  children: {
    id: string;
    first_name: string;
    last_name: string;
  }[];
}

interface StudentParticipation {
  student_id: string;
  participation_level: 'low' | 'medium' | 'high';
  notes?: string;
}

export const TeacherCurriculumExecution: React.FC = () => {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todaysItems, setTodaysItems] = useState<CurriculumItem[]>([]);
  const [executions, setExecutions] = useState<CurriculumExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'today' | 'week' | 'progress'>('today');
  
  // Modal states
  const [showExecutionModal, setShowExecutionModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CurriculumItem | null>(null);
  const [executionForm, setExecutionForm] = useState({
    completion_status: 'planned' as const,
    student_engagement: 'medium' as const,
    modifications_made: '',
    materials_used: [] as string[],
    challenges_faced: '',
    notes: '',
    next_steps: ''
  });
  const [studentParticipation, setStudentParticipation] = useState<StudentParticipation[]>([]);

  useEffect(() => {
    fetchTeacherClasses();
  }, []);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      fetchTodaysCurriculum();
      fetchExecutions();
    }
  }, [selectedClass, selectedDate]);

  const fetchTeacherClasses = async () => {
    try {
      console.log('👨‍🏫 Fetching teacher classes...');
      
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('class_assignments')
        .select(`
          class:classes(
            id,
            name,
            color_code,
            curriculum_assignments(
              curriculum_template:curriculum_templates(
                id,
                name,
                curriculum_items(*)
              )
            ),
            children(id, first_name, last_name)
          )
        `)
        .eq('teacher_id', userData.user?.id);

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

  const fetchTodaysCurriculum = async () => {
    if (!selectedClass) return;

    try {
      console.log('📅 Fetching today\'s curriculum...');
      
      const today = new Date(selectedDate);
      const dayOfWeek = today.getDay();
      const currentWeek = Math.ceil(today.getDate() / 7);
      
      const allItems: CurriculumItem[] = [];
      selectedClass.curriculum_assignments?.forEach(assignment => {
        if (assignment.curriculum_template?.curriculum_items) {
          allItems.push(...assignment.curriculum_template.curriculum_items);
        }
      });

      const todaysItems = allItems.filter(item => 
        item.day_number === dayOfWeek && item.week_number <= currentWeek
      );

      console.log('✅ Today\'s curriculum items:', todaysItems.length);
      setTodaysItems(todaysItems);
    } catch (error) {
      console.error('💥 Error fetching today\'s curriculum:', error);
    }
  };

  const fetchExecutions = async () => {
    if (!selectedClass) return;

    try {
      const { data, error } = await supabase
        .from('curriculum_executions')
        .select('*')
        .eq('class_id', selectedClass.id)
        .eq('execution_date', selectedDate);

      if (error) throw error;
      setExecutions(data || []);
    } catch (error) {
      console.error('Error fetching executions:', error);
    }
  };

  const openExecutionModal = (item: CurriculumItem) => {
    setSelectedItem(item);
    
    const existingExecution = executions.find(exec => exec.curriculum_item_id === item.id);
    if (existingExecution) {
      setExecutionForm({
        completion_status: existingExecution.completion_status,
        student_engagement: existingExecution.student_engagement,
        modifications_made: existingExecution.modifications_made || '',
        materials_used: existingExecution.materials_used || [],
        challenges_faced: existingExecution.challenges_faced || '',
        notes: existingExecution.notes || '',
        next_steps: existingExecution.next_steps || ''
      });
    } else {
      setExecutionForm({
        completion_status: 'planned',
        student_engagement: 'medium',
        modifications_made: '',
        materials_used: item.materials_needed || [],
        challenges_faced: '',
        notes: '',
        next_steps: ''
      });
    }

    // Initialize student participation
    const participation = selectedClass?.children.map(child => ({
      student_id: child.id,
      participation_level: 'medium' as const,
      notes: ''
    })) || [];
    setStudentParticipation(participation);
    
    setShowExecutionModal(true);
  };

  const handleSaveExecution = async () => {
    if (!selectedItem || !selectedClass) return;

    try {
      console.log('💾 Saving curriculum execution...');
      
      const { data: userData } = await supabase.auth.getUser();
      const currentTime = new Date().toISOString();
      
      const executionData = {
        curriculum_item_id: selectedItem.id,
        class_id: selectedClass.id,
        teacher_id: userData.user?.id,
        execution_date: selectedDate,
        actual_start_time: executionForm.completion_status !== 'planned' ? currentTime : null,
        actual_end_time: executionForm.completion_status === 'completed' ? currentTime : null,
        completion_status: executionForm.completion_status,
        modifications_made: executionForm.modifications_made || null,
        student_engagement: executionForm.student_engagement,
        materials_used: executionForm.materials_used,
        challenges_faced: executionForm.challenges_faced || null,
        notes: executionForm.notes || null,
        next_steps: executionForm.next_steps || null
      };

      const existingExecution = executions.find(exec => exec.curriculum_item_id === selectedItem.id);
      
      if (existingExecution) {
        const { error } = await supabase
          .from('curriculum_executions')
          .update(executionData)
          .eq('id', existingExecution.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('curriculum_executions')
          .insert(executionData);
        
        if (error) throw error;
      }

      console.log('✅ Execution saved successfully');
      Alert.alert('Success', 'Activity execution updated successfully');
      setShowExecutionModal(false);
      fetchExecutions();
    } catch (error: any) {
      console.error('💥 Error saving execution:', error);
      Alert.alert('Error', error.message || 'Failed to save execution');
    }
  };

  const quickUpdateStatus = async (item: CurriculumItem, status: 'in_progress' | 'completed' | 'skipped') => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const currentTime = new Date().toISOString();
      
      const executionData = {
        curriculum_item_id: item.id,
        class_id: selectedClass!.id,
        teacher_id: userData.user?.id,
        execution_date: selectedDate,
        completion_status: status,
        student_engagement: 'medium' as const,
        actual_start_time: status !== 'planned' ? currentTime : null,
        actual_end_time: status === 'completed' ? currentTime : null
      };

      const existingExecution = executions.find(exec => exec.curriculum_item_id === item.id);
      
      if (existingExecution) {
        const { error } = await supabase
          .from('curriculum_executions')
          .update(executionData)
          .eq('id', existingExecution.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('curriculum_executions')
          .insert(executionData);
        
        if (error) throw error;
      }

      fetchExecutions();
    } catch (error: any) {
      console.error('Error updating status:', error);
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const getExecutionStatus = (itemId: string) => {
    const execution = executions.find(exec => exec.curriculum_item_id === itemId);
    return execution?.completion_status || 'planned';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in_progress': return '#F59E0B';
      case 'skipped': return '#EF4444';
      case 'modified': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle size={16} color="#10B981" />;
      case 'in_progress': return <Clock size={16} color="#F59E0B" />;
      case 'skipped': return <Circle size={16} color="#EF4444" />;
      case 'modified': return <Edit3 size={16} color="#8B5CF6" />;
      default: return <Calendar size={16} color="#6B7280" />;
    }
  };

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'high': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const updateStudentParticipation = (studentId: string, level: 'low' | 'medium' | 'high') => {
    setStudentParticipation(prev => 
      prev.map(p => p.student_id === studentId ? { ...p, participation_level: level } : p)
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading curriculum...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Curriculum Execution</Text>
        <Text style={styles.subtitle}>Track and update daily activities</Text>
      </View>

      {/* Class and Date Selector */}
      <View style={styles.selectors}>
        <View style={styles.classSelector}>
          <Text style={styles.selectorLabel}>Class:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {classes.map((classItem) => (
              <TouchableOpacity
                key={classItem.id}
                style={[
                  styles.classTab,
                  selectedClass?.id === classItem.id && styles.activeClassTab,
                  { borderColor: classItem.color_code }
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

        <View style={styles.dateSelector}>
          <Text style={styles.selectorLabel}>Date:</Text>
          <TextInput
            style={styles.dateInput}
            value={selectedDate}
            onChangeText={setSelectedDate}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.viewButton, activeView === 'today' && styles.activeViewButton]}
          onPress={() => setActiveView('today')}
        >
          <Calendar size={16} color={activeView === 'today' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.viewButtonText, activeView === 'today' && styles.activeViewButtonText]}>
            Today
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.viewButton, activeView === 'week' && styles.activeViewButton]}
          onPress={() => setActiveView('week')}
        >
          <BookOpen size={16} color={activeView === 'week' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.viewButtonText, activeView === 'week' && styles.activeViewButtonText]}>
            Week
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.viewButton, activeView === 'progress' && styles.activeViewButton]}
          onPress={() => setActiveView('progress')}
        >
          <Target size={16} color={activeView === 'progress' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.viewButtonText, activeView === 'progress' && styles.activeViewButtonText]}>
            Progress
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        {activeView === 'today' && (
          <>
            {/* Today's Progress Summary */}
            <View style={styles.progressSummary}>
              <View style={styles.progressCard}>
                <CheckCircle size={20} color="#10B981" />
                <Text style={styles.progressNumber}>
                  {todaysItems.filter(item => getExecutionStatus(item.id) === 'completed').length}
                </Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
              
              <View style={styles.progressCard}>
                <Clock size={20} color="#F59E0B" />
                <Text style={styles.progressNumber}>
                  {todaysItems.filter(item => getExecutionStatus(item.id) === 'in_progress').length}
                </Text>
                <Text style={styles.progressLabel}>In Progress</Text>
              </View>
              
              <View style={styles.progressCard}>
                <Circle size={20} color="#6B7280" />
                <Text style={styles.progressNumber}>
                  {todaysItems.filter(item => getExecutionStatus(item.id) === 'planned').length}
                </Text>
                <Text style={styles.progressLabel}>Planned</Text>
              </View>
            </View>

            {/* Today's Activities */}
            {todaysItems.length === 0 ? (
              <View style={styles.emptyState}>
                <BookOpen size={48} color="#6B7280" />
                <Text style={styles.emptyText}>No activities planned for today</Text>
              </View>
            ) : (
              todaysItems.map((item) => {
                const status = getExecutionStatus(item.id);
                const execution = executions.find(exec => exec.curriculum_item_id === item.id);
                
                return (
                  <View key={item.id} style={styles.activityCard}>
                    <View style={styles.activityHeader}>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={styles.activityType}>{item.activity_type}</Text>
                        {item.time_slot && (
                          <View style={styles.timeSlot}>
                            <Clock size={14} color="#8B5CF6" />
                            <Text style={styles.timeSlotText}>
                              {item.time_slot.start_time} - {item.time_slot.end_time}
                            </Text>
                          </View>
                        )}
                      </View>
                      
                      <View style={styles.activityStatus}>
                        {getStatusIcon(status)}
                        <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </View>
                    </View>

                    {item.description && (
                      <Text style={styles.activityDescription}>{item.description}</Text>
                    )}

                    <View style={styles.activityMeta}>
                      <Text style={styles.activityDuration}>{item.estimated_duration} min</Text>
                      {item.skills_developed.length > 0 && (
                        <View style={styles.skillsTags}>
                          {item.skills_developed.slice(0, 3).map((skill, index) => (
                            <Text key={index} style={styles.skillTag}>{skill}</Text>
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Quick Action Buttons */}
                    <View style={styles.quickActions}>
                      <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#F59E0B' }]}
                        onPress={() => quickUpdateStatus(item, 'in_progress')}
                      >
                        <Text style={styles.quickActionText}>Start</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#10B981' }]}
                        onPress={() => quickUpdateStatus(item, 'completed')}
                      >
                        <Text style={styles.quickActionText}>Complete</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#EF4444' }]}
                        onPress={() => quickUpdateStatus(item, 'skipped')}
                      >
                        <Text style={styles.quickActionText}>Skip</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={[styles.quickActionButton, { backgroundColor: '#8B5CF6' }]}
                        onPress={() => openExecutionModal(item)}
                      >
                        <Edit3 size={14} color="#FFFFFF" />
                        <Text style={styles.quickActionText}>Details</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Execution Details */}
                    {execution && (
                      <View style={styles.executionDetails}>
                        <View style={styles.engagementIndicator}>
                          <Star size={14} color={getEngagementColor(execution.student_engagement)} />
                          <Text style={[styles.engagementText, { color: getEngagementColor(execution.student_engagement) }]}>
                            {execution.student_engagement.charAt(0).toUpperCase() + execution.student_engagement.slice(1)} Engagement
                          </Text>
                        </View>
                        
                        {execution.notes && (
                          <Text style={styles.executionNotes}>{execution.notes}</Text>
                        )}
                        
                        {execution.challenges_faced && (
                          <View style={styles.challengesContainer}>
                            <AlertCircle size={14} color="#F59E0B" />
                            <Text style={styles.challengesText}>{execution.challenges_faced}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </>
        )}

        {activeView === 'week' && (
          <View style={styles.weekView}>
            <Text style={styles.sectionTitle}>This Week's Curriculum</Text>
            {/* Week view implementation */}
            <Text style={styles.comingSoonText}>Weekly view coming soon...</Text>
          </View>
        )}

        {activeView === 'progress' && (
          <View style={styles.progressView}>
            <Text style={styles.sectionTitle}>Progress Analytics</Text>
            {/* Progress view implementation */}
            <Text style={styles.comingSoonText}>Progress analytics coming soon...</Text>
          </View>
        )}
      </ScrollView>

      {/* Detailed Execution Modal */}
      <Modal visible={showExecutionModal} animationType="slide" presentationStyle="fullScreen">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Activity Execution Details</Text>
            <TouchableOpacity onPress={() => setShowExecutionModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedItem && (
              <>
                {/* Activity Summary */}
                <View style={styles.activitySummary}>
                  <Text style={styles.summaryTitle}>{selectedItem.title}</Text>
                  <Text style={styles.summaryType}>{selectedItem.activity_type}</Text>
                  <Text style={styles.summaryDuration}>{selectedItem.estimated_duration} minutes</Text>
                  
                  {selectedItem.learning_goals && selectedItem.learning_goals.length > 0 && (
                    <View style={styles.goalsContainer}>
                      <Text style={styles.goalsTitle}>Learning Goals:</Text>
                      {selectedItem.learning_goals.map((goal, index) => (
                        <Text key={index} style={styles.goalItem}>• {goal}</Text>
                      ))}
                    </View>
                  )}
                </View>

                {/* Execution Form */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Execution Details</Text>
                  
                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Completion Status</Text>
                    <View style={styles.statusSelector}>
                      {['planned', 'in_progress', 'completed', 'skipped', 'modified'].map((status) => (
                        <TouchableOpacity
                          key={status}
                          style={[
                            styles.statusOption,
                            executionForm.completion_status === status && styles.selectedStatusOption
                          ]}
                          onPress={() => setExecutionForm({ ...executionForm, completion_status: status as any })}
                        >
                          <Text style={[
                            styles.statusOptionText,
                            executionForm.completion_status === status && styles.selectedStatusOptionText
                          ]}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Overall Student Engagement</Text>
                    <View style={styles.engagementSelector}>
                      {['low', 'medium', 'high'].map((level) => (
                        <TouchableOpacity
                          key={level}
                          style={[
                            styles.engagementOption,
                            executionForm.student_engagement === level && styles.selectedEngagementOption,
                            { backgroundColor: executionForm.student_engagement === level ? getEngagementColor(level) : '#F3F4F6' }
                          ]}
                          onPress={() => setExecutionForm({ ...executionForm, student_engagement: level as any })}
                        >
                          <Text style={[
                            styles.engagementOptionText,
                            executionForm.student_engagement === level && styles.selectedEngagementOptionText
                          ]}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Modifications Made</Text>
                    <TextInput
                      style={styles.formTextArea}
                      value={executionForm.modifications_made}
                      onChangeText={(text) => setExecutionForm({ ...executionForm, modifications_made: text })}
                      placeholder="Describe any changes made to the planned activity..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Challenges Faced</Text>
                    <TextInput
                      style={styles.formTextArea}
                      value={executionForm.challenges_faced}
                      onChangeText={(text) => setExecutionForm({ ...executionForm, challenges_faced: text })}
                      placeholder="Any difficulties or obstacles encountered..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Execution Notes</Text>
                    <TextInput
                      style={styles.formTextArea}
                      value={executionForm.notes}
                      onChangeText={(text) => setExecutionForm({ ...executionForm, notes: text })}
                      placeholder="Detailed observations, student responses, key moments..."
                      multiline
                      numberOfLines={4}
                    />
                  </View>

                  <View style={styles.formField}>
                    <Text style={styles.formLabel}>Next Steps</Text>
                    <TextInput
                      style={styles.formTextArea}
                      value={executionForm.next_steps}
                      onChangeText={(text) => setExecutionForm({ ...executionForm, next_steps: text })}
                      placeholder="Follow-up activities, areas to reinforce, recommendations..."
                      multiline
                      numberOfLines={3}
                    />
                  </View>
                </View>

                {/* Individual Student Participation */}
                <View style={styles.formSection}>
                  <Text style={styles.formSectionTitle}>Individual Student Participation</Text>
                  
                  {selectedClass?.children.map((student) => {
                    const participation = studentParticipation.find(p => p.student_id === student.id);
                    
                    return (
                      <View key={student.id} style={styles.studentParticipationCard}>
                        <Text style={styles.studentName}>
                          {student.first_name} {student.last_name}
                        </Text>
                        
                        <View style={styles.participationSelector}>
                          {['low', 'medium', 'high'].map((level) => (
                            <TouchableOpacity
                              key={level}
                              style={[
                                styles.participationOption,
                                participation?.participation_level === level && styles.selectedParticipationOption,
                                { backgroundColor: participation?.participation_level === level ? getEngagementColor(level) : '#F3F4F6' }
                              ]}
                              onPress={() => updateStudentParticipation(student.id, level as any)}
                            >
                              <Text style={[
                                styles.participationOptionText,
                                participation?.participation_level === level && styles.selectedParticipationOptionText
                              ]}>
                                {level.charAt(0).toUpperCase()}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowExecutionModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveExecution}>
              <Save size={16} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save Execution</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
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
  selectors: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  classSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  classTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeClassTab: {
    backgroundColor: '#FFFFFF',
  },
  classTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeClassTabText: {
    color: '#1F2937',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  activeViewButton: {
    backgroundColor: '#8B5CF6',
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeViewButtonText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  progressSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  progressCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  quickActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  executionDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  engagementIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  engagementText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  executionNotes: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 8,
  },
  challengesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  challengesText: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 4,
    flex: 1,
  },
  weekView: {
    flex: 1,
  },
  progressView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  activitySummary: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  summaryType: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 4,
  },
  summaryDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 12,
  },
  goalsContainer: {
    marginTop: 8,
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  goalItem: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formTextArea: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedStatusOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  selectedStatusOptionText: {
    color: '#FFFFFF',
  },
  engagementSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  engagementOption: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedEngagementOption: {
    borderColor: 'transparent',
  },
  engagementOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedEngagementOptionText: {
    color: '#FFFFFF',
  },
  studentParticipationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  studentName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  participationSelector: {
    flexDirection: 'row',
    gap: 4,
  },
  participationOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedParticipationOption: {
    borderColor: 'transparent',
  },
  participationOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  selectedParticipationOptionText: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});