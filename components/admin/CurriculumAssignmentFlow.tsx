import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';
import { BookOpen, Calendar, Target, Users, Plus, Check, X, ArrowRight, Clock, Settings } from 'lucide-react-native';

interface CurriculumTemplate {
  id: string;
  name: string;
  description?: string;
  age_group: string;
  subject_area: string;
  total_weeks: number;
  learning_objectives: string[];
  is_active: boolean;
  curriculum_items?: CurriculumItem[];
}

interface CurriculumItem {
  id: string;
  title: string;
  description?: string;
  activity_type: string;
  week_number: number;
  day_number: number;
  estimated_duration: number;
  time_slot?: {
    name: string;
    start_time: string;
    end_time: string;
  };
}

interface Class {
  id: string;
  name: string;
  age_group: string;
  color_code: string;
  curriculum_assignments?: CurriculumAssignment[];
}

interface CurriculumAssignment {
  id: string;
  curriculum_id: string;
  class_id: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  curriculum_template?: CurriculumTemplate;
}

export const CurriculumAssignmentFlow: React.FC = () => {
  const [curriculumTemplates, setCurriculumTemplates] = useState<CurriculumTemplate[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<CurriculumAssignment[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumTemplate | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'assign' | 'schedule'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching curriculum assignment data...');
      
      // Fetch curriculum templates with items
      const { data: templatesData, error: templatesError } = await supabase
        .from('curriculum_templates')
        .select(`
          *,
          curriculum_items(
            *,
            time_slot:time_slots(*)
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (templatesError) throw templatesError;

      // Fetch classes with current assignments
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          *,
          curriculum_assignments(
            *,
            curriculum_template:curriculum_templates(*)
          )
        `)
        .eq('is_active', true)
        .order('name');

      if (classesError) throw classesError;

      // Fetch all assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('curriculum_assignments')
        .select(`
          *,
          curriculum_template:curriculum_templates(*),
          class:classes(*)
        `)
        .eq('is_active', true)
        .order('start_date', { ascending: false });

      if (assignmentsError) throw assignmentsError;

      setCurriculumTemplates(templatesData || []);
      setClasses(classesData || []);
      setAssignments(assignmentsData || []);

      console.log('✅ Curriculum assignment data fetched successfully');
    } catch (error) {
      console.error('💥 Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const openAssignmentModal = (curriculum: CurriculumTemplate) => {
    setSelectedCurriculum(curriculum);
    setSelectedClasses([]);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setShowAssignmentModal(true);
  };

  const handleAssignment = async () => {
    if (!selectedCurriculum || selectedClasses.length === 0) return;

    try {
      console.log('🔄 Creating curriculum assignments...', {
        curriculum: selectedCurriculum.id,
        classes: selectedClasses,
        startDate,
        endDate
      });

      const { data: { user } } = await supabase.auth.getUser();

      const assignments = selectedClasses.map(classId => ({
        curriculum_id: selectedCurriculum.id,
        class_id: classId,
        start_date: startDate,
        end_date: endDate || null,
        assigned_by: user?.id
      }));

      const { error } = await supabase
        .from('curriculum_assignments')
        .insert(assignments);

      if (error) throw error;

      Alert.alert('Success', 'Curriculum assigned to classes successfully');
      setShowAssignmentModal(false);
      fetchData();
    } catch (error: any) {
      console.error('💥 Error assigning curriculum:', error);
      Alert.alert('Error', error.message || 'Failed to assign curriculum');
    }
  };

  const removeAssignment = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('curriculum_assignments')
        .update({ is_active: false })
        .eq('id', assignmentId);

      if (error) throw error;

      Alert.alert('Success', 'Curriculum assignment removed');
      fetchData();
    } catch (error: any) {
      console.error('💥 Error removing assignment:', error);
      Alert.alert('Error', error.message || 'Failed to remove assignment');
    }
  };

  const toggleClassSelection = (classId: string) => {
    if (selectedClasses.includes(classId)) {
      setSelectedClasses(selectedClasses.filter(id => id !== classId));
    } else {
      setSelectedClasses([...selectedClasses, classId]);
    }
  };

  const getAssignedClasses = (curriculumId: string) => {
    return assignments.filter(a => a.curriculum_id === curriculumId);
  };

  const getUnassignedClasses = () => {
    if (!selectedCurriculum) return [];
    
    const assignedClassIds = getAssignedClasses(selectedCurriculum.id).map(a => a.class_id);
    return classes.filter(c => !assignedClassIds.includes(c.id));
  };

  const getDayName = (dayNumber: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber] || 'Unknown';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading curriculum assignments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Curriculum Assignment</Text>
        <Text style={styles.subtitle}>Assign curriculum to classes and manage schedules</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <BookOpen size={16} color={activeTab === 'overview' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Overview
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'assign' && styles.activeTab]}
          onPress={() => setActiveTab('assign')}
        >
          <Target size={16} color={activeTab === 'assign' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'assign' && styles.activeTabText]}>
            Assign
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'schedule' && styles.activeTab]}
          onPress={() => setActiveTab('schedule')}
        >
          <Calendar size={16} color={activeTab === 'schedule' ? '#FFFFFF' : '#6B7280'} />
          <Text style={[styles.tabText, activeTab === 'schedule' && styles.activeTabText]}>
            Schedule
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && (
          <>
            {/* Summary Stats */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryCard}>
                <BookOpen size={24} color="#8B5CF6" />
                <Text style={styles.summaryNumber}>{curriculumTemplates.length}</Text>
                <Text style={styles.summaryLabel}>Curriculum Templates</Text>
              </View>
              <View style={styles.summaryCard}>
                <Target size={24} color="#EC4899" />
                <Text style={styles.summaryNumber}>{assignments.length}</Text>
                <Text style={styles.summaryLabel}>Active Assignments</Text>
              </View>
              <View style={styles.summaryCard}>
                <Users size={24} color="#F97316" />
                <Text style={styles.summaryNumber}>{classes.length}</Text>
                <Text style={styles.summaryLabel}>Classes</Text>
              </View>
            </View>

            {/* Current Assignments */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Assignments</Text>
              
              {assignments.length === 0 ? (
                <Text style={styles.emptyText}>No curriculum assignments yet</Text>
              ) : (
                assignments.map((assignment) => (
                  <View key={assignment.id} style={styles.assignmentCard}>
                    <View style={styles.assignmentHeader}>
                      <View style={styles.assignmentInfo}>
                        <Text style={styles.assignmentTitle}>
                          {assignment.curriculum_template?.name}
                        </Text>
                        <Text style={styles.assignmentClass}>
                          {assignment.class?.name}
                        </Text>
                        <Text style={styles.assignmentDate}>
                          Started: {new Date(assignment.start_date).toLocaleDateString()}
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeAssignment(assignment.id)}
                      >
                        <X size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.assignmentMeta}>
                      <Text style={styles.metaItem}>
                        {assignment.curriculum_template?.subject_area} • {assignment.curriculum_template?.age_group}
                      </Text>
                      <Text style={styles.metaItem}>
                        {assignment.curriculum_template?.total_weeks} weeks
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        {activeTab === 'assign' && (
          <>
            {/* Available Curriculum */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Curriculum Templates</Text>
              
              {curriculumTemplates.map((curriculum) => {
                const assignedClasses = getAssignedClasses(curriculum.id);
                
                return (
                  <View key={curriculum.id} style={styles.curriculumCard}>
                    <View style={styles.curriculumHeader}>
                      <View style={styles.curriculumInfo}>
                        <Text style={styles.curriculumTitle}>{curriculum.name}</Text>
                        <Text style={styles.curriculumSubject}>
                          {curriculum.subject_area} • {curriculum.age_group}
                        </Text>
                        <Text style={styles.curriculumWeeks}>
                          {curriculum.total_weeks} weeks • {curriculum.curriculum_items?.length || 0} activities
                        </Text>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.assignCurriculumButton}
                        onPress={() => openAssignmentModal(curriculum)}
                      >
                        <Plus size={16} color="#FFFFFF" />
                        <Text style={styles.assignCurriculumButtonText}>Assign</Text>
                      </TouchableOpacity>
                    </View>

                    {curriculum.description && (
                      <Text style={styles.curriculumDescription}>{curriculum.description}</Text>
                    )}

                    {curriculum.learning_objectives && curriculum.learning_objectives.length > 0 && (
                      <View style={styles.objectivesContainer}>
                        <Text style={styles.objectivesTitle}>Learning Objectives:</Text>
                        {curriculum.learning_objectives.slice(0, 3).map((objective, index) => (
                          <Text key={index} style={styles.objective}>• {objective}</Text>
                        ))}
                      </View>
                    )}

                    {assignedClasses.length > 0 && (
                      <View style={styles.assignedClassesContainer}>
                        <Text style={styles.assignedClassesTitle}>Assigned to:</Text>
                        <View style={styles.assignedClassesList}>
                          {assignedClasses.map((assignment) => (
                            <View key={assignment.id} style={styles.assignedClassChip}>
                              <Text style={styles.assignedClassText}>
                                {assignment.class?.name}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {activeTab === 'schedule' && (
          <>
            {/* Weekly Schedule View */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Weekly Schedule Overview</Text>
              
              {curriculumTemplates.map((curriculum) => {
                const assignedClasses = getAssignedClasses(curriculum.id);
                if (assignedClasses.length === 0) return null;

                // Group curriculum items by week and day
                const weeklySchedule = curriculum.curriculum_items?.reduce((acc, item) => {
                  const weekKey = `Week ${item.week_number}`;
                  const dayKey = getDayName(item.day_number);
                  
                  if (!acc[weekKey]) acc[weekKey] = {};
                  if (!acc[weekKey][dayKey]) acc[weekKey][dayKey] = [];
                  
                  acc[weekKey][dayKey].push(item);
                  return acc;
                }, {} as Record<string, Record<string, CurriculumItem[]>>);

                return (
                  <View key={curriculum.id} style={styles.scheduleCard}>
                    <Text style={styles.scheduleTitle}>{curriculum.name}</Text>
                    <Text style={styles.scheduleSubtitle}>
                      Assigned to: {assignedClasses.map(a => a.class?.name).join(', ')}
                    </Text>

                    {weeklySchedule && Object.entries(weeklySchedule).map(([week, days]) => (
                      <View key={week} style={styles.weekContainer}>
                        <Text style={styles.weekTitle}>{week}</Text>
                        
                        {Object.entries(days).map(([day, items]) => (
                          <View key={day} style={styles.dayContainer}>
                            <Text style={styles.dayTitle}>{day}</Text>
                            
                            {items.map((item) => (
                              <View key={item.id} style={styles.activityItem}>
                                <View style={styles.activityTime}>
                                  <Clock size={12} color="#8B5CF6" />
                                  <Text style={styles.activityTimeText}>
                                    {item.time_slot?.start_time} - {item.time_slot?.end_time}
                                  </Text>
                                </View>
                                <Text style={styles.activityTitle}>{item.title}</Text>
                                <Text style={styles.activityType}>{item.activity_type}</Text>
                                <Text style={styles.activityDuration}>
                                  {item.estimated_duration} min
                                </Text>
                              </View>
                            ))}
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </>
        )}
      </ScrollView>

      {/* Assignment Modal */}
      <Modal visible={showAssignmentModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Assign "{selectedCurriculum?.name}" to Classes
            </Text>
            <TouchableOpacity onPress={() => setShowAssignmentModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>Select classes to assign this curriculum:</Text>

            {/* Date Selection */}
            <View style={styles.dateSection}>
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>Start Date *</Text>
                <TextInput
                  style={styles.dateInput}
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
              
              <View style={styles.dateField}>
                <Text style={styles.dateLabel}>End Date (Optional)</Text>
                <TextInput
                  style={styles.dateInput}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="YYYY-MM-DD"
                />
              </View>
            </View>

            {/* Class Selection */}
            {getUnassignedClasses().map((classItem) => (
              <TouchableOpacity
                key={classItem.id}
                style={[
                  styles.classSelectionItem,
                  selectedClasses.includes(classItem.id) && styles.selectedClassItem
                ]}
                onPress={() => toggleClassSelection(classItem.id)}
              >
                <View style={[styles.classColorIndicator, { backgroundColor: classItem.color_code }]} />
                
                <View style={styles.classSelectionInfo}>
                  <Text style={styles.classSelectionName}>{classItem.name}</Text>
                  <Text style={styles.classSelectionDetails}>{classItem.age_group}</Text>
                </View>
                
                {selectedClasses.includes(classItem.id) && (
                  <Check size={20} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}

            {getUnassignedClasses().length === 0 && (
              <Text style={styles.emptyText}>
                All classes already have this curriculum assigned
              </Text>
            )}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAssignmentModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.assignModalButton, selectedClasses.length === 0 && styles.disabledButton]}
              onPress={handleAssignment}
              disabled={selectedClasses.length === 0}
            >
              <ArrowRight size={16} color="#FFFFFF" />
              <Text style={styles.assignModalButtonText}>
                Assign to {selectedClasses.length} Class(es)
              </Text>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  summaryCard: {
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
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
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
  assignmentCard: {
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
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  assignmentClass: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  assignmentDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    fontSize: 12,
    color: '#6B7280',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
  },
  curriculumCard: {
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
  curriculumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  curriculumInfo: {
    flex: 1,
  },
  curriculumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  curriculumSubject: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  curriculumWeeks: {
    fontSize: 12,
    color: '#6B7280',
  },
  assignCurriculumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assignCurriculumButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  curriculumDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  objectivesContainer: {
    marginBottom: 12,
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  objective: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  assignedClassesContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  assignedClassesTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  assignedClassesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assignedClassChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  assignedClassText: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  scheduleCard: {
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
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  weekContainer: {
    marginBottom: 16,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dayContainer: {
    marginBottom: 12,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  activityItem: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityTimeText: {
    fontSize: 12,
    color: '#8B5CF6',
    marginLeft: 4,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  activityType: {
    fontSize: 12,
    color: '#EC4899',
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyText: {
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  dateSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#374151',
  },
  classSelectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedClassItem: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  classColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  classSelectionInfo: {
    flex: 1,
  },
  classSelectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  classSelectionDetails: {
    fontSize: 14,
    color: '#6B7280',
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
  assignModalButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
  },
  assignModalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});