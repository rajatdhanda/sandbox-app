import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Plus, CreditCard as Edit3, Trash2, Search, BookOpen, Clock, Users, X, Save } from 'lucide-react-native';

interface Curriculum {
  id: string;
  name: string;
  description?: string;
  age_group: string;
  subject_area: string;
  difficulty_level: string;
  duration_weeks: number;
  learning_objectives: string[];
  is_active: boolean;
  created_at: string;
}

interface CurriculumItem {
  id: string;
  curriculum_id: string;
  title: string;
  description?: string;
  activity_type: string;
  materials_needed: string[];
  instructions?: string;
  learning_goals: string[];
  week_number: number;
  day_number: number;
  estimated_duration: number;
}

export const CurriculumManagement: React.FC = () => {
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<Curriculum | null>(null);
  const [curriculumItems, setCurriculumItems] = useState<CurriculumItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(null);
  const [editingItem, setEditingItem] = useState<CurriculumItem | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    age_group: '',
    subject_area: '',
    difficulty_level: 'beginner',
    duration_weeks: 4,
    learning_objectives: ['']
  });

  const [itemFormData, setItemFormData] = useState({
    title: '',
    description: '',
    activity_type: '',
    materials_needed: [''],
    instructions: '',
    learning_goals: [''],
    week_number: 1,
    day_number: 1,
    estimated_duration: 30
  });

  useEffect(() => {
    fetchCurricula();
  }, []);

  useEffect(() => {
    if (selectedCurriculum) {
      fetchCurriculumItems(selectedCurriculum.id);
    }
  }, [selectedCurriculum]);

  const fetchCurricula = async () => {
    try {
      console.log('📚 Fetching curricula...');
      const { data, error } = await supabase
        .from('curriculum')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      console.log('✅ Curricula fetched:', data?.length || 0);
      setCurricula(data || []);
      if (data && data.length > 0) {
        setSelectedCurriculum(data[0]);
      }
    } catch (error) {
      console.error('💥 Error fetching curricula:', error);
      Alert.alert('Error', 'Failed to fetch curricula');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculumItems = async (curriculumId: string) => {
    try {
      console.log('📖 Fetching curriculum items for:', curriculumId);
      const { data, error } = await supabase
        .from('curriculum_items')
        .select('*')
        .eq('curriculum_id', curriculumId)
        .eq('is_active', true)
        .order('week_number', { ascending: true });

      if (error) throw error;
      console.log('✅ Curriculum items fetched:', data?.length || 0);
      setCurriculumItems(data || []);
    } catch (error) {
      console.error('💥 Error fetching curriculum items:', error);
    }
  };

  const handleCreateCurriculum = async () => {
    if (!formData.name || !formData.age_group || !formData.subject_area) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      console.log('🚀 Creating curriculum:', formData);
      const { error } = await supabase
        .from('curriculum')
        .insert({
          name: formData.name,
          description: formData.description || null,
          age_group: formData.age_group,
          subject_area: formData.subject_area,
          difficulty_level: formData.difficulty_level,
          duration_weeks: formData.duration_weeks,
          learning_objectives: formData.learning_objectives.filter(obj => obj.trim() !== '')
        });

      if (error) throw error;
      console.log('✅ Curriculum created successfully');
      Alert.alert('Success', 'Curriculum created successfully');
      resetForm();
      fetchCurricula();
    } catch (error: any) {
      console.error('💥 Error creating curriculum:', error);
      Alert.alert('Error', error.message || 'Failed to create curriculum');
    }
  };

  const handleCreateItem = async () => {
    if (!selectedCurriculum || !itemFormData.title || !itemFormData.activity_type) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      console.log('🚀 Creating curriculum item:', itemFormData);
      const { error } = await supabase
        .from('curriculum_items')
        .insert({
          curriculum_id: selectedCurriculum.id,
          title: itemFormData.title,
          description: itemFormData.description || null,
          activity_type: itemFormData.activity_type,
          materials_needed: itemFormData.materials_needed.filter(mat => mat.trim() !== ''),
          instructions: itemFormData.instructions || null,
          learning_goals: itemFormData.learning_goals.filter(goal => goal.trim() !== ''),
          week_number: itemFormData.week_number,
          day_number: itemFormData.day_number,
          estimated_duration: itemFormData.estimated_duration
        });

      if (error) throw error;
      console.log('✅ Curriculum item created successfully');
      Alert.alert('Success', 'Curriculum item created successfully');
      resetItemForm();
      fetchCurriculumItems(selectedCurriculum.id);
    } catch (error: any) {
      console.error('💥 Error creating curriculum item:', error);
      Alert.alert('Error', error.message || 'Failed to create curriculum item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      age_group: '',
      subject_area: '',
      difficulty_level: 'beginner',
      duration_weeks: 4,
      learning_objectives: ['']
    });
    setEditingCurriculum(null);
    setShowForm(false);
  };

  const resetItemForm = () => {
    setItemFormData({
      title: '',
      description: '',
      activity_type: '',
      materials_needed: [''],
      instructions: '',
      learning_goals: [''],
      week_number: 1,
      day_number: 1,
      estimated_duration: 30
    });
    setEditingItem(null);
    setShowItemForm(false);
  };

  const addObjectiveField = () => {
    setFormData({
      ...formData,
      learning_objectives: [...formData.learning_objectives, '']
    });
  };

  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...formData.learning_objectives];
    newObjectives[index] = value;
    setFormData({ ...formData, learning_objectives: newObjectives });
  };

  const addMaterialField = () => {
    setItemFormData({
      ...itemFormData,
      materials_needed: [...itemFormData.materials_needed, '']
    });
  };

  const updateMaterial = (index: number, value: string) => {
    const newMaterials = [...itemFormData.materials_needed];
    newMaterials[index] = value;
    setItemFormData({ ...itemFormData, materials_needed: newMaterials });
  };

  const filteredCurricula = curricula.filter(curriculum =>
    curriculum.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curriculum.subject_area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Curriculum Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Curriculum</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search curricula..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.leftPanel}>
          <Text style={styles.panelTitle}>Curricula</Text>
          <ScrollView style={styles.curriculaList}>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : (
              filteredCurricula.map((curriculum) => (
                <TouchableOpacity
                  key={curriculum.id}
                  style={[
                    styles.curriculumCard,
                    selectedCurriculum?.id === curriculum.id && styles.selectedCard
                  ]}
                  onPress={() => setSelectedCurriculum(curriculum)}
                >
                  <View style={styles.curriculumInfo}>
                    <Text style={styles.curriculumName}>{curriculum.name}</Text>
                    <Text style={styles.curriculumSubject}>{curriculum.subject_area}</Text>
                    <Text style={styles.curriculumAge}>{curriculum.age_group}</Text>
                  </View>
                  <View style={styles.curriculumMeta}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.curriculumDuration}>{curriculum.duration_weeks}w</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        <View style={styles.rightPanel}>
          {selectedCurriculum ? (
            <>
              <View style={styles.curriculumHeader}>
                <Text style={styles.panelTitle}>{selectedCurriculum.name}</Text>
                <TouchableOpacity
                  style={styles.addItemButton}
                  onPress={() => setShowItemForm(true)}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.addItemButtonText}>Add Item</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.itemsList}>
                {curriculumItems.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <View style={styles.itemMeta}>
                        <Text style={styles.itemWeek}>Week {item.week_number}</Text>
                        <Text style={styles.itemDay}>Day {item.day_number}</Text>
                      </View>
                    </View>
                    <Text style={styles.itemType}>{item.activity_type}</Text>
                    {item.description && (
                      <Text style={styles.itemDescription}>{item.description}</Text>
                    )}
                    <View style={styles.itemDetails}>
                      <View style={styles.itemDuration}>
                        <Clock size={12} color="#6B7280" />
                        <Text style={styles.itemDurationText}>{item.estimated_duration} min</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#6B7280" />
              <Text style={styles.emptyText}>Select a curriculum to view items</Text>
            </View>
          )}
        </View>
      </View>

      {/* Curriculum Form Modal */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Curriculum</Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Early Math Concepts"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Subject Area *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.subject_area}
                onChangeText={(text) => setFormData({ ...formData, subject_area: text })}
                placeholder="Mathematics"
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
              <Text style={styles.formLabel}>Learning Objectives</Text>
              {formData.learning_objectives.map((objective, index) => (
                <TextInput
                  key={index}
                  style={[styles.formInput, { marginBottom: 8 }]}
                  value={objective}
                  onChangeText={(text) => updateObjective(index, text)}
                  placeholder={`Objective ${index + 1}`}
                />
              ))}
              <TouchableOpacity style={styles.addFieldButton} onPress={addObjectiveField}>
                <Plus size={16} color="#8B5CF6" />
                <Text style={styles.addFieldText}>Add Objective</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateCurriculum}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Item Form Modal */}
      <Modal visible={showItemForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Curriculum Item</Text>
            <TouchableOpacity onPress={resetItemForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Title *</Text>
              <TextInput
                style={styles.formInput}
                value={itemFormData.title}
                onChangeText={(text) => setItemFormData({ ...itemFormData, title: text })}
                placeholder="Counting Bears"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Activity Type *</Text>
              <TextInput
                style={styles.formInput}
                value={itemFormData.activity_type}
                onChangeText={(text) => setItemFormData({ ...itemFormData, activity_type: text })}
                placeholder="hands-on"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Week</Text>
                <TextInput
                  style={styles.formInput}
                  value={itemFormData.week_number.toString()}
                  onChangeText={(text) => setItemFormData({ ...itemFormData, week_number: parseInt(text) || 1 })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Day</Text>
                <TextInput
                  style={styles.formInput}
                  value={itemFormData.day_number.toString()}
                  onChangeText={(text) => setItemFormData({ ...itemFormData, day_number: parseInt(text) || 1 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Materials Needed</Text>
              {itemFormData.materials_needed.map((material, index) => (
                <TextInput
                  key={index}
                  style={[styles.formInput, { marginBottom: 8 }]}
                  value={material}
                  onChangeText={(text) => updateMaterial(index, text)}
                  placeholder={`Material ${index + 1}`}
                />
              ))}
              <TouchableOpacity style={styles.addFieldButton} onPress={addMaterialField}>
                <Plus size={16} color="#8B5CF6" />
                <Text style={styles.addFieldText}>Add Material</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetItemForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateItem}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Create</Text>
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  leftPanel: {
    width: '40%',
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  curriculaList: {
    flex: 1,
  },
  curriculumCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCard: {
    backgroundColor: '#F3F4F6',
  },
  curriculumInfo: {
    flex: 1,
  },
  curriculumName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  curriculumSubject: {
    fontSize: 14,
    color: '#8B5CF6',
    marginBottom: 2,
  },
  curriculumAge: {
    fontSize: 12,
    color: '#6B7280',
  },
  curriculumMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  curriculumDuration: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  curriculumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  addItemButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addItemButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  itemsList: {
    flex: 1,
    padding: 20,
  },
  itemCard: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  itemMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  itemWeek: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  itemDay: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '500',
  },
  itemType: {
    fontSize: 14,
    color: '#F97316',
    fontWeight: '500',
    marginBottom: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDuration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDurationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
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
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
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
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  addFieldText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
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