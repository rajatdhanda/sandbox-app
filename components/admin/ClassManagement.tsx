import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase/clients';
import { Plus, CreditCard as Edit3, Trash2, Search, Users, Clock, X, Save, Settings } from 'lucide-react-native';

interface ClassFormData {
  name: string;
  age_group: string;
  capacity: number;
  schedule_start: string;
  schedule_end: string;
  description?: string;
  color_code: string;
}

interface Class {
  id: string;
  name: string;
  age_group: string;
  capacity: number;
  schedule_start: string;
  schedule_end: string;
  description?: string;
  color_code: string;
  is_active: boolean;
  class_assignments?: any[];
  children?: any[];
}

interface User {
  id: string;
  full_name: string;
}
export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [formData, setFormData] = useState<ClassFormData>({
    name: '',
    age_group: '',
    capacity: 20,
    schedule_start: '08:00',
    schedule_end: '15:00',
    description: '',
    color_code: '#8B5CF6'
  });

  const colorOptions = [
    '#8B5CF6', '#EC4899', '#F97316', '#10B981', 
    '#6366F1', '#EF4444', '#F59E0B', '#06B6D4'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch classes with teacher assignments
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select(`
          *,
          class_assignments(
            teacher:users(*)
          ),
          children(count)
        `)
        .eq('is_active', true)
        .order('name');

      if (classesError) throw classesError;

      // Fetch teachers
      const { data: teachersData, error: teachersError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'teacher')
        .eq('is_active', true)
        .order('full_name');

      if (teachersError) throw teachersError;

      setClasses(classesData || []);
      setTeachers(teachersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClass = async () => {
    console.log('🚀 Starting class creation...');
    console.log('📝 Form data:', formData);
    console.log('👥 Selected teachers:', selectedTeachers);
    
    if (!formData.name || !formData.age_group) {
      console.log('❌ Validation failed: missing required fields');
      Alert.alert('Error', 'Class name and age group are required');
      return;
    }

    try {
      console.log('🔄 Attempting to insert class into database...');
      
      // Create class
      const { data: classData, error: classError } = await supabase
        .from('classes')
        .insert({
          name: formData.name,
          age_group: formData.age_group,
          capacity: formData.capacity,
          schedule_start: formData.schedule_start,
          schedule_end: formData.schedule_end,
          description: formData.description || null,
          color_code: formData.color_code
        })
        .select()
        .single();

      console.log('✅ Class creation result:', { classData, classError });
      
      if (classError) throw classError;

      // Create teacher assignments
      if (selectedTeachers.length > 0) {
        console.log('🔄 Creating teacher assignments for:', selectedTeachers);
        const assignments = selectedTeachers.map((teacherId, index) => ({
          teacher_id: teacherId,
          class_id: classData.id,
          is_primary: index === 0
        }));

        console.log('📋 Assignment data:', assignments);
        
        const { error: assignmentError } = await supabase
          .from('class_assignments')
          .insert(assignments);

        console.log('✅ Assignment result:', assignmentError);
        if (assignmentError) throw assignmentError;
      }

      console.log('🎉 Class created successfully!');
      Alert.alert('Success', 'Class created successfully');
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('💥 Error creating class:', error);
      console.error('💥 Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      Alert.alert('Error', `Failed to create class: ${error.message || 'Unknown error'}`);
    }
  };

  const handleUpdateClass = async () => {
    if (!editingClass || !formData.name || !formData.age_group) {
      Alert.alert('Error', 'Class name and age group are required');
      return;
    }

    try {
      // Update class
      const { error: classError } = await supabase
        .from('classes')
        .update({
          name: formData.name,
          age_group: formData.age_group,
          capacity: formData.capacity,
          schedule_start: formData.schedule_start,
          schedule_end: formData.schedule_end,
          description: formData.description || null,
          color_code: formData.color_code,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingClass.id);

      if (classError) throw classError;

      // Update teacher assignments
      // First, delete existing assignments
      await supabase
        .from('class_assignments')
        .delete()
        .eq('class_id', editingClass.id);

      // Then create new ones
      if (selectedTeachers.length > 0) {
        const assignments = selectedTeachers.map((teacherId, index) => ({
          teacher_id: teacherId,
          class_id: editingClass.id,
          is_primary: index === 0
        }));

        const { error: assignmentError } = await supabase
          .from('class_assignments')
          .insert(assignments);

        if (assignmentError) throw assignmentError;
      }

      Alert.alert('Success', 'Class updated successfully');
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error updating class:', error);
      Alert.alert('Error', error.message || 'Failed to update class');
    }
  };

  const handleDeleteClass = async (classId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this class? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // First delete class assignments
              await supabase
                .from('class_assignments')
                .delete()
                .eq('class_id', classId);

              // Then delete the class
              const { error } = await supabase
                .from('classes')
                .delete()
                .eq('id', classId);

              if (error) throw error;

              Alert.alert('Success', 'Class deleted successfully');
              fetchData();
            } catch (error: any) {
              console.error('Error deleting class:', error);
              Alert.alert('Error', error.message || 'Failed to delete class');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age_group: '',
      capacity: 20,
      schedule_start: '08:00',
      schedule_end: '15:00',
      description: '',
      color_code: '#8B5CF6'
    });
    setSelectedTeachers([]);
    setEditingClass(null);
    setShowForm(false);
  };

  const openEditForm = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      age_group: classItem.age_group,
      capacity: classItem.capacity,
      schedule_start: classItem.schedule_start,
      schedule_end: classItem.schedule_end,
      description: classItem.description || '',
      color_code: classItem.color_code
    });
    
    // Set selected teachers
    const teacherIds = classItem.class_assignments?.map(assignment => assignment.teacher.id) || [];
    setSelectedTeachers(teacherIds);
    setShowForm(true);
  };

  const filteredClasses = classes.filter(classItem =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.age_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Class Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Class</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search classes..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Classes List */}
      <ScrollView style={styles.classesList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading classes...</Text>
        ) : (
          filteredClasses.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={[styles.colorIndicator, { backgroundColor: classItem.color_code }]} />
              
              <View style={styles.classInfo}>
                <View style={styles.classHeader}>
                  <Text style={styles.className}>{classItem.name}</Text>
                  <Text style={styles.ageGroup}>{classItem.age_group}</Text>
                </View>
                
                <View style={styles.classDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {classItem.schedule_start} - {classItem.schedule_end}
                    </Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {classItem.children?.[0]?.count || 0}/{classItem.capacity} students
                    </Text>
                  </View>
                  
                  {classItem.class_assignments && classItem.class_assignments.length > 0 && (
                    <View style={styles.detailRow}>
                      <Settings size={14} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Teachers: {classItem.class_assignments.map(assignment => assignment.teacher.full_name).join(', ')}
                      </Text>
                    </View>
                  )}
                  
                  {classItem.description && (
                    <Text style={styles.descriptionText}>{classItem.description}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.classActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditForm(classItem)}
                >
                  <Edit3 size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteClass(classItem.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Class Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Class Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Sunflower Class"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Age Group *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.age_group}
                onChangeText={(text) => setFormData({ ...formData, age_group: text })}
                placeholder="3-4 years"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Capacity</Text>
              <TextInput
                style={styles.formInput}
                value={formData.capacity.toString()}
                onChangeText={(text) => setFormData({ ...formData, capacity: parseInt(text) || 20 })}
                placeholder="20"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Start Time</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.schedule_start}
                  onChangeText={(text) => setFormData({ ...formData, schedule_start: text })}
                  placeholder="08:00"
                />
              </View>
              
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>End Time</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.schedule_end}
                  onChangeText={(text) => setFormData({ ...formData, schedule_end: text })}
                  placeholder="15:00"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Color</Text>
              <View style={styles.colorSelector}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      formData.color_code === color && styles.selectedColorOption
                    ]}
                    onPress={() => setFormData({ ...formData, color_code: color })}
                  />
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Teachers</Text>
              <View style={styles.teachersSelector}>
                {teachers.map((teacher) => (
                  <TouchableOpacity
                    key={teacher.id}
                    style={[
                      styles.teacherOption,
                      selectedTeachers.includes(teacher.id) && styles.selectedTeacherOption
                    ]}
                    onPress={() => {
                      if (selectedTeachers.includes(teacher.id)) {
                        setSelectedTeachers(selectedTeachers.filter(id => id !== teacher.id));
                      } else {
                        setSelectedTeachers([...selectedTeachers, teacher.id]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.teacherOptionText,
                      selectedTeachers.includes(teacher.id) && styles.selectedTeacherOptionText
                    ]}>
                      {teacher.full_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                style={styles.formTextArea}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Class description and activities..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={editingClass ? handleUpdateClass : handleCreateClass}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {editingClass ? 'Update' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  classesList: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  colorIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  classInfo: {
    flex: 1,
  },
  classHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  ageGroup: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  classDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    fontStyle: 'italic',
  },
  classActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
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
  formField: {
    marginBottom: 20,
  },
  formFieldHalf: {
    flex: 1,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
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
  colorSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorOption: {
    borderColor: '#1F2937',
  },
  teachersSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  teacherOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedTeacherOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  teacherOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedTeacherOptionText: {
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