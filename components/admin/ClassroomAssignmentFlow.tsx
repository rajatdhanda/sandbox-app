import React, { useState, useEffect } from 'react';
import type { Classes, ChildrenWithRelations } from '@/lib/supabase/_generated/generated-types';
import { classesClient, childrenClient, usersClient, classAssignmentsClient } from '@/lib/supabase/compatibility';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';

import { Users, Baby, BookOpen, Calendar, Plus, Check, X, ArrowRight, Settings, Target, Clock } from 'lucide-react-native';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  class_id?: string;
  class?: {
    name: string;
    color_code: string;
  };
}

interface Teacher {
  id: string;
  full_name: string;
  email: string;
  class_assignments?: {
    class: {
      id: string;
      name: string;
    };
    is_primary: boolean;
  }[];
}

interface Class {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  color_code: string;
  schedule_start: string;
  schedule_end: string;
  _count?: {
    students: number;
    teachers: number;
  };
}

export const ClassroomAssignmentFlow: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<(Classes & { _count?: { students: number; teachers: number } })[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<Student[]>([]);
  const [unassignedTeachers, setUnassignedTeachers] = useState<Teacher[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [assignmentType, setAssignmentType] = useState<'student' | 'teacher'>('student');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching classroom assignment data...');
      
      // Fetch students with class info
      const { data: studentsData, error: studentsError } = await childrenClient()
        .select(`
          *,
          class:classes(name, color_code)
        `)
        .eq('is_active', true)
        .order('first_name');

      if (studentsError) throw studentsError;

      // Fetch teachers with class assignments
      const { data: teachersData, error: teachersError } = await usersClient()
        .select(`
          *,
          class_assignments(
            is_primary,
            class:classes(id, name)
          )
        `)
        .eq('role', 'teacher')
        .eq('is_active', true)
        .order('full_name');

      if (teachersError) throw teachersError;

      // Fetch classes with counts
      const { data: classesData, error: classesError } = await classesClient()
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (classesError) throw classesError;

      // Calculate counts for each class
      const classesWithCounts = await Promise.all(
        (classesData || []).map(async (classItem) => {
          const { count: studentCount } = await childrenClient()
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classItem.id)
            .eq('is_active', true);

          const { count: teacherCount } = await classAssignmentsClient()
            .select('*', { count: 'exact', head: true })
            .eq('class_id', classItem.id);

          return {
            ...classItem,
            _count: {
              students: studentCount || 0,
              teachers: teacherCount || 0
            }
          };
        })
      );

      setStudents(studentsData || []);
      setTeachers(teachersData || []);
      setClasses(classesWithCounts);
      
      // Filter unassigned
      setUnassignedStudents((studentsData || []).filter(s => !s.class_id));
      setUnassignedTeachers((teachersData || []).filter(t => !t.class_assignments?.length));

      console.log('✅ Data fetched successfully');
    } catch (error) {
      console.error('💥 Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const openAssignmentModal = (classItem: Class, type: 'student' | 'teacher') => {
    setSelectedClass(classItem);
    setAssignmentType(type);
    setSelectedItems([]);
    setShowAssignmentModal(true);
  };

  const handleAssignment = async () => {
    if (!selectedClass || selectedItems.length === 0) return;

    try {
      console.log('🔄 Processing assignments...', { type: assignmentType, items: selectedItems });

      if (assignmentType === 'student') {
        // Assign students to class
        const { error } = await childrenClient()
          .update({ class_id: selectedClass.id })
          .in('id', selectedItems);

        if (error) throw error;
      } else {
        // Assign teachers to class
        const assignments = selectedItems.map((teacherId, index) => ({
          teacher_id: teacherId,
          class_id: selectedClass.id,
          is_primary: index === 0 // First teacher is primary
        }));

        const { error } = await classAssignmentsClient()
          .insert(assignments);

        if (error) throw error;
      }

      Alert.alert('Success', `${assignmentType === 'student' ? 'Students' : 'Teachers'} assigned successfully`);
      setShowAssignmentModal(false);
      fetchData();
    } catch (error: any) {
      console.error('💥 Error assigning:', error);
      Alert.alert('Error', error.message || 'Failed to assign');
    }
  };

  const removeAssignment = async (itemId: string, type: 'student' | 'teacher') => {
    try {
      if (type === 'student') {
        const { error } = await childrenClient()
          .update({ class_id: null })
          .eq('id', itemId);

        if (error) throw error;
      } else {
        const { error } = await classAssignmentsClient()
          .delete()
          .eq('teacher_id', itemId);

        if (error) throw error;
      }

      Alert.alert('Success', 'Assignment removed successfully');
      fetchData();
    } catch (error: any) {
      console.error('💥 Error removing assignment:', error);
      Alert.alert('Error', error.message || 'Failed to remove assignment');
    }
  };

  const getAvailableItems = () => {
    if (assignmentType === 'student') {
      return unassignedStudents;
    } else {
      return unassignedTeachers;
    }
  };

  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading assignments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Classroom Assignments</Text>
        <Text style={styles.subtitle}>Manage student and teacher assignments</Text>
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Baby size={24} color="#8B5CF6" />
          <Text style={styles.summaryNumber}>{unassignedStudents.length}</Text>
          <Text style={styles.summaryLabel}>Unassigned Students</Text>
        </View>
        <View style={styles.summaryCard}>
          <Users size={24} color="#EC4899" />
          <Text style={styles.summaryNumber}>{unassignedTeachers.length}</Text>
          <Text style={styles.summaryLabel}>Unassigned Teachers</Text>
        </View>
        <View style={styles.summaryCard}>
          <Settings size={24} color="#F97316" />
          <Text style={styles.summaryNumber}>{classes.length}</Text>
          <Text style={styles.summaryLabel}>Active Classes</Text>
        </View>
      </View>

      {/* Classes Grid */}
      <ScrollView style={styles.classesContainer}>
        <Text style={styles.sectionTitle}>Classes Overview</Text>
        
        {classes.map((classItem) => (
          <View key={classItem.id} style={styles.classCard}>
            <View style={[styles.classColorBar, { backgroundColor: classItem.color_code }]} />
            
            <View style={styles.classHeader}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>{classItem.name}</Text>
                <Text style={styles.classDetails}>
                  {classItem.age_group} • {classItem.schedule_start} - {classItem.schedule_end}
                </Text>
              </View>
              
              <View style={styles.classStats}>
                <View style={styles.statItem}>
                  <Baby size={16} color="#8B5CF6" />
                  <Text style={styles.statText}>
                    {classItem._count?.students || 0}/{classItem.capacity}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Users size={16} color="#EC4899" />
                  <Text style={styles.statText}>{classItem._count?.teachers || 0}</Text>
                </View>
              </View>
            </View>

            {/* Assignment Actions */}
            <View style={styles.assignmentActions}>
              <TouchableOpacity
                style={[styles.assignButton, { backgroundColor: '#8B5CF6' }]}
                onPress={() => openAssignmentModal(classItem, 'student')}
              >
                <Baby size={16} color="#FFFFFF" />
                <Text style={styles.assignButtonText}>Assign Students</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.assignButton, { backgroundColor: '#EC4899' }]}
                onPress={() => openAssignmentModal(classItem, 'teacher')}
              >
                <Users size={16} color="#FFFFFF" />
                <Text style={styles.assignButtonText}>Assign Teachers</Text>
              </TouchableOpacity>
            </View>

            {/* Current Assignments Preview */}
            <View style={styles.assignmentsPreview}>
              <Text style={styles.previewTitle}>Current Assignments:</Text>
              
              {/* Students Preview */}
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Students:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {students
                    .filter(s => s.class_id === classItem.id)
                    .slice(0, 5)
                    .map((student) => (
                      <View key={student.id} style={styles.previewItem}>
                        <Text style={styles.previewItemText}>
                          {student.first_name} {student.last_name[0]}.
                        </Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeAssignment(student.id, 'student')}
                        >
                          <X size={12} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                </ScrollView>
              </View>

              {/* Teachers Preview */}
              <View style={styles.previewSection}>
                <Text style={styles.previewLabel}>Teachers:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {teachers
                    .filter(t => t.class_assignments?.some(ca => ca.class?.id === classItem.id))
                    .map((teacher) => (
                      <View key={teacher.id} style={styles.previewItem}>
                        <Text style={styles.previewItemText}>{teacher.full_name}</Text>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => removeAssignment(teacher.id, 'teacher')}
                        >
                          <X size={12} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    ))}
                </ScrollView>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Assignment Modal */}
      <Modal visible={showAssignmentModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Assign {assignmentType === 'student' ? 'Students' : 'Teachers'} to {selectedClass?.name}
            </Text>
            <TouchableOpacity onPress={() => setShowAssignmentModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalSubtitle}>
              Select {assignmentType === 'student' ? 'students' : 'teachers'} to assign:
            </Text>

            {getAvailableItems().map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.selectionItem,
                  selectedItems.includes(item.id) && styles.selectedItem
                ]}
                onPress={() => toggleItemSelection(item.id)}
              >
                <View style={styles.selectionInfo}>
                  <Text style={styles.selectionName}>
                    {assignmentType === 'student' 
                      ? `${(item as Student).first_name} ${(item as Student).last_name}`
                      : (item as Teacher).full_name
                    }
                  </Text>
                  {assignmentType === 'student' && (
                    <Text style={styles.selectionDetails}>
                      Age: {new Date().getFullYear() - new Date((item as Student).date_of_birth).getFullYear()}
                    </Text>
                  )}
                  {assignmentType === 'teacher' && (
                    <Text style={styles.selectionDetails}>{(item as Teacher).email}</Text>
                  )}
                </View>
                
                {selectedItems.includes(item.id) && (
                  <Check size={20} color="#10B981" />
                )}
              </TouchableOpacity>
            ))}

            {getAvailableItems().length === 0 && (
              <Text style={styles.emptyText}>
                No unassigned {assignmentType === 'student' ? 'students' : 'teachers'} available
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
              style={[styles.assignModalButton, selectedItems.length === 0 && styles.disabledButton]}
              onPress={handleAssignment}
              disabled={selectedItems.length === 0}
            >
              <ArrowRight size={16} color="#FFFFFF" />
              <Text style={styles.assignModalButtonText}>
                Assign {selectedItems.length} {assignmentType === 'student' ? 'Student(s)' : 'Teacher(s)'}
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
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryCard: {
    alignItems: 'center',
    flex: 1,
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
  classesContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  classColorBar: {
    height: 4,
    width: '100%',
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  classDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  classStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 4,
    fontWeight: '500',
  },
  assignmentActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  assignButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  assignmentsPreview: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  previewSection: {
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 6,
  },
  previewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  previewItemText: {
    fontSize: 12,
    color: '#374151',
    marginRight: 4,
  },
  removeButton: {
    padding: 2,
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
  selectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  selectionInfo: {
    flex: 1,
  },
  selectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 2,
  },
  selectionDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
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