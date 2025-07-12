import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DynamicSelect } from './DynamicSelect';
import { supabase } from '@/lib/supabase/clients';
import { Save, X } from 'lucide-react-native';

interface ActivityLogFormProps {
  childId: string;
  teacherId: string;
  onSave: () => void;
  onCancel: () => void;
}

export const ActivityLogForm: React.FC<ActivityLogFormProps> = ({
  childId,
  teacherId,
  onSave,
  onCancel
}) => {
  const [activityType, setActivityType] = useState('');
  const [mood, setMood] = useState('');
  const [description, setDescription] = useState('');
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!activityType || !description) {
      Alert.alert('Error', 'Please fill in activity type and description');
      return;
    }

    try {
      setSaving(true);
      console.log('Saving activity log:', {
        child_id: childId,
        teacher_id: teacherId,
        activity_type: activityType,
        mood,
        description,
        skill_tags: skillTags,
        duration_minutes: durationMinutes
      });
      
      const { error } = await supabase
        .from('daily_logs')
        .insert({
          child_id: childId,
          teacher_id: teacherId,
          activity_type: activityType,
          mood: mood || null,
          description,
          skill_tags: skillTags.length > 0 ? skillTags : null,
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : null,
          notes: notes || null,
          log_date: new Date().toISOString().split('T')[0]
        });

      console.log('Activity log save result:', error);
      if (error) throw error;

      Alert.alert('Success', 'Activity log saved successfully');
      onSave();
    } catch (error) {
      console.error('Error saving activity log:', error);
      Alert.alert('Error', 'Failed to save activity log');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log Activity</Text>
        <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Activity Type *</Text>
          <DynamicSelect
            category="activity_type"
            value={activityType}
            onValueChange={setActivityType}
            placeholder="Select activity type"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Mood</Text>
          <DynamicSelect
            category="mood"
            value={mood}
            onValueChange={setMood}
            placeholder="Select mood"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe the activity and child's participation..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Skills Developed</Text>
          <DynamicSelect
            category="skill_tag"
            multiple
            selectedValues={skillTags}
            onMultipleChange={setSkillTags}
            placeholder="Select skills"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Duration (minutes)</Text>
          <TextInput
            style={styles.input}
            value={durationMinutes}
            onChangeText={setDurationMinutes}
            placeholder="30"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any additional observations or notes..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.disabledButton]}
            onPress={handleSave}
            disabled={saving}
          >
            <Save size={16} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Save Activity'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    minHeight: 100,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
});