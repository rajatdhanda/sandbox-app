import React, { useState, useEffect } from 'react';
import type { Users as UsersType, NotificationsWithRelations } from '@/lib/supabase/_generated/generated-types';
import { classAssignmentsClient, curriculumExecutionsClient } from '@/lib/supabase/compatibility';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';

import { Calendar, Clock, CircleCheck as CheckCircle, Circle as XCircle, CreditCard as Edit3, Camera, Save, X, Users, BookOpen } from 'lucide-react-native';

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
  curriculum_assignments: {
    curriculum_template: {
      id: string;
      name: string;
      curriculum_items: CurriculumItem[];
    };
  }[];
}

export const CurriculumExecution: React.FC = () => {
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [todaysItems, setTodaysItems] = useState<CurriculumItem[]>([]);
  const [executions, setExecutions] = useState<CurriculumExecution[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      
      const { data, error } = await classAssignmentsClient()
        .select(`
          class:classes(
            id,
            name,
            curriculum_assignments(
              curriculum_template:curriculum_templates(
                id,
                name,
                curriculum_items(*)
              )
            )
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
      
      // Get current week and day
      const today = new Date(selectedDate);
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const currentWeek = Math.ceil(today.getDate() / 7); // Simple week calculation
      
      // Get all curriculum items for this class
      const allItems: CurriculumItem[] = [];
      selectedClass.curriculum_assignments?.forEach(assignment => {
        if (assignment.curriculum_template?.curriculum_items) {
          allItems.push(...assignment.curriculum_template.curriculum_items);
        }
      });

      // Filter items for today (you might want to implement more sophisticated date logic)
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
      const { data, error } = await curriculumExecutionsClient()
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
    
    // Check if there's an existing execution
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

      // Check if execution already exists
      const existingExecution = executions.find(exec => exec.curriculum_item_id === selectedItem.id);
      
      if (existingExecution) {
        const { error } = await curriculumExecutionsClient()
          .update(executionData)
          .eq('id', existingExecution.id);
        
        if (error) throw error;
      } else {
        const { error } = await curriculumExecutionsClient()
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
      case 'skipped': return <XCircle size={16} color="#EF4444" />;
      case 'modified': return <Edit3 size={16} color="#8B5CF6" />;
      default: return <Calendar size={16} color="#6B7280" />;
    }
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
        <Text style={styles.title}>Today's Curriculum</Text>
        <Text style={styles.subtitle}>Track and update activity execution</Text>
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

      {/* Today's Activities */}
      <ScrollView style={styles.activitiesList}>
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
              <TouchableOpacity
                key={item.id}
                style={styles.activityCard}
                onPress={() => openExecutionModal(item)}
              >
                <View style={styles.activityHeader}>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{item.title}</Text>
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

                <Text style={styles.activityType}>{item.activity_type}</Text>
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

                {execution && execution.notes && (
                  <View style={styles.executionNotes}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{execution.notes}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Execution Modal */}
      <Modal visible={showExecutionModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Activity Execution</Text>
            <TouchableOpacity onPress={() => setShowExecutionModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {selectedItem && (
              <>
                <View style={styles.activitySummary}>
                  <Text style={styles.summaryTitle}>{selectedItem.title}</Text>
                  <Text style={styles.summaryType}>{selectedItem.activity_type}</Text>
                  <Text style={styles.summaryDuration}>{selectedItem.estimated_duration} minutes</Text>
                </View>

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
                  <Text style={styles.formLabel}>Student Engagement</Text>
                  <View style={styles.engagementSelector}>
                    {['low', 'medium', 'high'].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.engagementOption,
                          executionForm.student_engagement === level && styles.selectedEngagementOption
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
                  <Text style={styles.formLabel}>Notes</Text>
                  <TextInput
                    style={styles.formTextArea}
                    value={executionForm.notes}
                    onChangeText={(text) => setExecutionForm({ ...executionForm, notes: text })}
                    placeholder="Additional observations and notes..."
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
                    placeholder="Follow-up activities or recommendations..."
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.formActions}>
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
              </>
            )}
          </ScrollView>
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
  activitiesList: {
    flex: 1,
    padding: 20,
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
  activityType: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 8,
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
  formContainer: {
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
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formTextArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
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
    backgroundColor: '#FFFFFF',
  },
  selectedStatusOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  statusOptionText: {
    fontSize: 14,
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
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  selectedEngagementOption: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  engagementOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedEngagementOptionText: {
    color: '#FFFFFF',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
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
    flex: 1,
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