import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConfigFields } from '@/hooks/useConfigFields';
import { supabase } from '@/lib/supabase';
import { Plus, CreditCard as Edit3, Trash2, Save, X } from 'lucide-react-native';

export default function AdminConfigScreen() {
  const [selectedCategory, setSelectedCategory] = useState('mood');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('config_fields')
        .select('*')
        .eq('category', selectedCategory)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setFields(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, [selectedCategory]);

  const categories = [
    { key: 'mood', label: 'Moods' },
    { key: 'activity_type', label: 'Activity Types' },
    { key: 'skill_tag', label: 'Skill Tags' },
    { key: 'worksheet_type', label: 'Worksheet Types' },
  ];

  const handleAddField = async () => {
    if (!newLabel || !newValue) {
      Alert.alert('Error', 'Please fill in label and value');
      return;
    }

    try {
      const { error } = await supabase
        .from('config_fields')
        .insert({
          category: selectedCategory,
          label: newLabel,
          value: newValue,
          description: newDescription || null,
          sort_order: fields.length + 1
        });

      if (error) throw error;

      setNewLabel('');
      setNewValue('');
      setNewDescription('');
      setShowAddForm(false);
      refetch();
      Alert.alert('Success', 'Field added successfully');
    } catch (error) {
      console.error('Error adding field:', error);
      Alert.alert('Error', 'Failed to add field');
    }
  };

  const handleUpdateField = async () => {
    if (!editingField || !newLabel || !newValue) {
      Alert.alert('Error', 'Please fill in label and value');
      return;
    }

    try {
      const { error } = await supabase
        .from('config_fields')
        .update({
          label: newLabel,
          value: newValue,
          description: newDescription || null
        })
        .eq('id', editingField.id);

      if (error) throw error;

      setEditingField(null);
      setNewLabel('');
      setNewValue('');
      setNewDescription('');
      refetch();
      Alert.alert('Success', 'Field updated successfully');
    } catch (error) {
      console.error('Error updating field:', error);
      Alert.alert('Error', 'Failed to update field');
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this field?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('config_fields')
                .update({ is_active: false })
                .eq('id', fieldId);

              if (error) throw error;

              refetch();
              Alert.alert('Success', 'Field deleted successfully');
            } catch (error) {
              console.error('Error deleting field:', error);
              Alert.alert('Error', 'Failed to delete field');
            }
          }
        }
      ]
    );
  };

  const startEdit = (field: any) => {
    setEditingField(field);
    setNewLabel(field.label);
    setNewValue(field.value);
    setNewDescription(field.description || '');
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingField(null);
    setNewLabel('');
    setNewValue('');
    setNewDescription('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Configuration Management</Text>
          <Text style={styles.subtitle}>Manage dropdown options for forms</Text>
        </View>

        <View style={styles.categoryTabs}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.key}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.key && styles.activeCategoryTab
                ]}
                onPress={() => setSelectedCategory(category.key)}
              >
                <Text style={[
                  styles.categoryTabText,
                  selectedCategory === category.key && styles.activeCategoryTabText
                ]}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {categories.find(c => c.key === selectedCategory)?.label} Options
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setShowAddForm(true);
                setEditingField(null);
                setNewLabel('');
                setNewValue('');
                setNewDescription('');
              }}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {(showAddForm || editingField) && (
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>
                {editingField ? 'Edit Field' : 'Add New Field'}
              </Text>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Label *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newLabel}
                  onChangeText={setNewLabel}
                  placeholder="Display name"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Value *</Text>
                <TextInput
                  style={styles.formInput}
                  value={newValue}
                  onChangeText={setNewValue}
                  placeholder="Internal value (lowercase, no spaces)"
                />
              </View>

              <View style={styles.formField}>
                <Text style={styles.formLabel}>Description</Text>
                <TextInput
                  style={styles.formInput}
                  value={newDescription}
                  onChangeText={setNewDescription}
                  placeholder="Optional description"
                />
              </View>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelEdit}
                >
                  <X size={16} color="#6B7280" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editingField ? handleUpdateField : handleAddField}
                >
                  <Save size={16} color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>
                    {editingField ? 'Update' : 'Add'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <View style={styles.fieldsList}>
              {fields.map((field) => (
                <View key={field.id} style={styles.fieldCard}>
                  <View style={styles.fieldInfo}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <Text style={styles.fieldValue}>Value: {field.value}</Text>
                    {field.description && (
                      <Text style={styles.fieldDescription}>{field.description}</Text>
                    )}
                  </View>
                  
                  <View style={styles.fieldActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => startEdit(field)}
                    >
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteField(field.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
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
  categoryTabs: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeCategoryTab: {
    backgroundColor: '#8B5CF6',
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryTabText: {
    color: '#FFFFFF',
  },
  content: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  formCard: {
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
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  fieldsList: {
    gap: 12,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  fieldInfo: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  fieldDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  fieldActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    color: '#EF4444',
    fontSize: 16,
    marginTop: 20,
  },
});