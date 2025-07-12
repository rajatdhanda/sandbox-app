import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase/clients';
import { Child, Class, User } from '@/lib/supabase/types';
import { Plus, CreditCard as Edit3, Trash2, Search, Baby, Calendar, X, Save, Users } from 'lucide-react-native';

interface ChildFormData {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  class_id?: string;
  medical_notes?: string;
  allergies?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  pickup_authorized_users?: string[];
}

export const ChildrenManagement: React.FC = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [parents, setParents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [selectedParents, setSelectedParents] = useState<string[]>([]);
  const [formData, setFormData] = useState<ChildFormData>({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    class_id: '',
    medical_notes: '',
    allergies: '',
    emergency_contact: '',
    emergency_phone: '',
    pickup_authorized_users: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch children with class and parent relationships
      const { data: childrenData, error: childrenError } = await supabase
        .from('children')
        .select(`
          *,
          class:classes(*),
          parent_child_relationships(
            parent:users(*)
          )
        `)
        .eq('is_active', true)
        .order('first_name');

      if (childrenError) throw childrenError;

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (classesError) throw classesError;

      // Fetch parents
      const { data: parentsData, error: parentsError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'parent')
        .eq('is_active', true)
        .order('full_name');

      if (parentsError) throw parentsError;

      setChildren(childrenData || []);
      setClasses(classesData || []);
      setParents(parentsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChild = async () => {
    if (!formData.first_name || !formData.last_name || !formData.date_of_birth) {
      Alert.alert('Error', 'First name, last name, and date of birth are required');
      return;
    }

    try {
      console.log('Creating child with data:', formData);
      
      // Create child
      const { data: childData, error: childError } = await supabase
        .from('children')
        .insert({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          class_id: formData.class_id || null,
          medical_notes: formData.medical_notes || null,
          allergies: formData.allergies || null,
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          pickup_authorized_users: formData.pickup_authorized_users || null
        })
        .select()
        .single();

      console.log('Child creation result:', { childData, childError });
      if (childError) throw childError;

      // Create parent-child relationships
      if (selectedParents.length > 0) {
        console.log('Creating parent relationships for:', selectedParents);
        const relationships = selectedParents.map((parentId, index) => ({
          parent_id: parentId,
          child_id: childData.id,
          is_primary: index === 0
        }));

        const { error: relationshipError } = await supabase
          .from('parent_child_relationships')
          .insert(relationships);

        console.log('Relationship result:', relationshipError);
        if (relationshipError) throw relationshipError;
      }

      Alert.alert('Success', 'Child created successfully');
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error creating child:', error);
      Alert.alert('Error', error.message || 'Failed to create child');
    }
  };

  const handleUpdateChild = async () => {
    if (!editingChild || !formData.first_name || !formData.last_name || !formData.date_of_birth) {
      Alert.alert('Error', 'First name, last name, and date of birth are required');
      return;
    }

    try {
      // Update child
      const { error: childError } = await supabase
        .from('children')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          class_id: formData.class_id || null,
          medical_notes: formData.medical_notes || null,
          allergies: formData.allergies || null,
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          pickup_authorized_users: formData.pickup_authorized_users || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingChild.id);

      if (childError) throw childError;

      // Update parent-child relationships
      // First, delete existing relationships
      await supabase
        .from('parent_child_relationships')
        .delete()
        .eq('child_id', editingChild.id);

      // Then create new ones
      if (selectedParents.length > 0) {
        const relationships = selectedParents.map((parentId, index) => ({
          parent_id: parentId,
          child_id: editingChild.id,
          is_primary: index === 0
        }));

        const { error: relationshipError } = await supabase
          .from('parent_child_relationships')
          .insert(relationships);

        if (relationshipError) throw relationshipError;
      }

      Alert.alert('Success', 'Child updated successfully');
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error updating child:', error);
      Alert.alert('Error', error.message || 'Failed to update child');
    }
  };

  const handleDeleteChild = async (childId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this child? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // First delete parent-child relationships
              await supabase
                .from('parent_child_relationships')
                .delete()
                .eq('child_id', childId);

              // Then delete the child
              const { error } = await supabase
                .from('children')
                .delete()
                .eq('id', childId);

              if (error) throw error;

              Alert.alert('Success', 'Child deleted successfully');
              fetchData();
            } catch (error: any) {
              console.error('Error deleting child:', error);
              Alert.alert('Error', error.message || 'Failed to delete child');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: '',
      class_id: '',
      medical_notes: '',
      allergies: '',
      emergency_contact: '',
      emergency_phone: '',
      pickup_authorized_users: []
    });
    setSelectedParents([]);
    setEditingChild(null);
    setShowForm(false);
  };

  const openEditForm = (child: Child) => {
    setEditingChild(child);
    setFormData({
      first_name: child.first_name,
      last_name: child.last_name,
      date_of_birth: child.date_of_birth,
      class_id: child.class_id || '',
      medical_notes: child.medical_notes || '',
      allergies: child.allergies || '',
      emergency_contact: child.emergency_contact || '',
      emergency_phone: child.emergency_phone || '',
      pickup_authorized_users: child.pickup_authorized_users || []
    });
    
    // Set selected parents
    const parentIds = child.parent_child_relationships?.map(rel => rel.parent.id) || [];
    setSelectedParents(parentIds);
    setShowForm(true);
  };

  const filteredChildren = children.filter(child =>
    child.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Children Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Child</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search children..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {/* Children List */}
      <ScrollView style={styles.childrenList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading children...</Text>
        ) : (
          filteredChildren.map((child) => (
            <View key={child.id} style={styles.childCard}>
              <View style={styles.childInfo}>
                <View style={styles.childHeader}>
                  <Text style={styles.childName}>
                    {child.first_name} {child.last_name}
                  </Text>
                  <Text style={styles.childAge}>
                    Age: {calculateAge(child.date_of_birth)}
                  </Text>
                </View>
                
                <View style={styles.childDetails}>
                  <View style={styles.detailRow}>
                    <Calendar size={14} color="#6B7280" />
                    <Text style={styles.detailText}>
                      Born: {new Date(child.date_of_birth).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  {child.class && (
                    <View style={styles.detailRow}>
                      <Baby size={14} color="#6B7280" />
                      <Text style={styles.detailText}>Class: {child.class.name}</Text>
                    </View>
                  )}
                  
                  {child.parent_child_relationships && child.parent_child_relationships.length > 0 && (
                    <View style={styles.detailRow}>
                      <Users size={14} color="#6B7280" />
                      <Text style={styles.detailText}>
                        Parents: {child.parent_child_relationships.map(rel => rel.parent.full_name).join(', ')}
                      </Text>
                    </View>
                  )}
                  
                  {child.allergies && (
                    <Text style={styles.allergiesText}>⚠️ Allergies: {child.allergies}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.childActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditForm(child)}
                >
                  <Edit3 size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteChild(child.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Child Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingChild ? 'Edit Child' : 'Add New Child'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>First Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.first_name}
                onChangeText={(text) => setFormData({ ...formData, first_name: text })}
                placeholder="Emma"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Last Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.last_name}
                onChangeText={(text) => setFormData({ ...formData, last_name: text })}
                placeholder="Johnson"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Date of Birth *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.date_of_birth}
                onChangeText={(text) => setFormData({ ...formData, date_of_birth: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Class</Text>
              <View style={styles.classSelector}>
                <TouchableOpacity
                  style={[
                    styles.classOption,
                    !formData.class_id && styles.selectedClassOption
                  ]}
                  onPress={() => setFormData({ ...formData, class_id: '' })}
                >
                  <Text style={[
                    styles.classOptionText,
                    !formData.class_id && styles.selectedClassOptionText
                  ]}>
                    No Class
                  </Text>
                </TouchableOpacity>
                {classes.map((classItem) => (
                  <TouchableOpacity
                    key={classItem.id}
                    style={[
                      styles.classOption,
                      formData.class_id === classItem.id && styles.selectedClassOption
                    ]}
                    onPress={() => setFormData({ ...formData, class_id: classItem.id })}
                  >
                    <Text style={[
                      styles.classOptionText,
                      formData.class_id === classItem.id && styles.selectedClassOptionText
                    ]}>
                      {classItem.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Parents</Text>
              <View style={styles.parentsSelector}>
                {parents.map((parent) => (
                  <TouchableOpacity
                    key={parent.id}
                    style={[
                      styles.parentOption,
                      selectedParents.includes(parent.id) && styles.selectedParentOption
                    ]}
                    onPress={() => {
                      if (selectedParents.includes(parent.id)) {
                        setSelectedParents(selectedParents.filter(id => id !== parent.id));
                      } else {
                        setSelectedParents([...selectedParents, parent.id]);
                      }
                    }}
                  >
                    <Text style={[
                      styles.parentOptionText,
                      selectedParents.includes(parent.id) && styles.selectedParentOptionText
                    ]}>
                      {parent.full_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Medical Notes</Text>
              <TextInput
                style={styles.formTextArea}
                value={formData.medical_notes}
                onChangeText={(text) => setFormData({ ...formData, medical_notes: text })}
                placeholder="Any medical conditions or notes..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Allergies</Text>
              <TextInput
                style={styles.formInput}
                value={formData.allergies}
                onChangeText={(text) => setFormData({ ...formData, allergies: text })}
                placeholder="Food allergies, environmental allergies..."
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.formInput}
                value={formData.emergency_contact}
                onChangeText={(text) => setFormData({ ...formData, emergency_contact: text })}
                placeholder="Emergency contact name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Emergency Phone</Text>
              <TextInput
                style={styles.formInput}
                value={formData.emergency_phone}
                onChangeText={(text) => setFormData({ ...formData, emergency_phone: text })}
                placeholder="+1 (555) 987-6543"
                keyboardType="phone-pad"
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
                onPress={editingChild ? handleUpdateChild : handleCreateChild}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {editingChild ? 'Update' : 'Create'}
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
  childrenList: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  childCard: {
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
  childInfo: {
    flex: 1,
  },
  childHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  childAge: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  childDetails: {
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
  allergiesText: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 4,
  },
  childActions: {
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
  classSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  classOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedClassOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  classOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedClassOptionText: {
    color: '#FFFFFF',
  },
  parentsSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  parentOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedParentOption: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  parentOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedParentOptionText: {
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