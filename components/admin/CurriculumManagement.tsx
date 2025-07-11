import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Plus, Upload, Download, Calendar, Clock, Users, BookOpen, X, Save, FileText, Link, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';

interface CurriculumTemplate {
  id: string;
  name: string;
  description?: string;
  age_group: string;
  subject_area: string;
  total_weeks: number;
  learning_objectives: string[];
  materials_list: string[];
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
  learning_goals: string[];
  week_number: number;
  day_number: number;
  time_slot_id?: string;
  estimated_duration: number;
  skills_developed: string[];
  time_slot?: {
    name: string;
    start_time: string;
    end_time: string;
  };
}

interface TimeSlot {
  id: string;
  name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
}

interface Class {
  id: string;
  name: string;
  age_group: string;
}

interface CurriculumAssignment {
  id: string;
  curriculum_id: string;
  class_id: string;
  start_date: string;
  is_active: boolean;
  class?: Class;
}

export const CurriculumManagement: React.FC = () => {
  const [curricula, setCurricula] = useState<CurriculumTemplate[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumTemplate | null>(null);
  const [curriculumItems, setCurriculumItems] = useState<CurriculumItem[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<CurriculumAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'templates' | 'schedule' | 'assignments' | 'import'>('templates');
  
  // Modals
  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Form data
  const [templateForm, setTemplateForm] = useState({
    name: '',
    description: '',
    age_group: '',
    subject_area: '',
    total_weeks: 4,
    learning_objectives: [''],
    materials_list: ['']
  });

  const [itemForm, setItemForm] = useState({
    title: '',
    description: '',
    activity_type: '',
    materials_needed: [''],
    learning_goals: [''],
    week_number: 1,
    day_number: 1,
    time_slot_id: '',
    estimated_duration: 45,
    skills_developed: ['']
  });

  const [importForm, setImportForm] = useState({
    import_type: 'google_sheets',
    source_url: '',
    source_name: ''
  });

  const [assignForm, setAssignForm] = useState({
    class_ids: [] as string[],
    start_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCurriculum) {
      fetchCurriculumItems(selectedCurriculum.id);
      fetchAssignments(selectedCurriculum.id);
    }
  }, [selectedCurriculum]);

  const fetchData = async () => {
    try {
      console.log('📚 Fetching curriculum data...');
      
      // Fetch curricula
      const { data: curriculaData, error: curriculaError } = await supabase
        .from('curriculum_templates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (curriculaError) throw curriculaError;

      // Fetch time slots
      const { data: timeSlotsData, error: timeSlotsError } = await supabase
        .from('time_slots')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (timeSlotsError) throw timeSlotsError;

      // Fetch classes
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (classesError) throw classesError;

      console.log('✅ Data fetched:', {
        curricula: curriculaData?.length || 0,
        timeSlots: timeSlotsData?.length || 0,
        classes: classesData?.length || 0
      });

      setCurricula(curriculaData || []);
      setTimeSlots(timeSlotsData || []);
      setClasses(classesData || []);
      
      if (curriculaData && curriculaData.length > 0) {
        setSelectedCurriculum(curriculaData[0]);
      }
    } catch (error) {
      console.error('💥 Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch curriculum data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurriculumItems = async (curriculumId: string) => {
    try {
      console.log('📖 Fetching curriculum items for:', curriculumId);
      const { data, error } = await supabase
        .from('curriculum_items')
        .select(`
          *,
          time_slot:time_slots(name, start_time, end_time)
        `)
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

  const fetchAssignments = async (curriculumId: string) => {
    try {
      const { data, error } = await supabase
        .from('curriculum_assignments')
        .select(`
          *,
          class:classes(*)
        `)
        .eq('curriculum_id', curriculumId)
        .eq('is_active', true);

      if (error) throw error;
      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handleCreateTemplate = async () => {
    if (!templateForm.name || !templateForm.age_group || !templateForm.subject_area) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      console.log('🚀 Creating curriculum template:', templateForm);
      
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('curriculum_templates')
        .insert({
          name: templateForm.name,
          description: templateForm.description || null,
          age_group: templateForm.age_group,
          subject_area: templateForm.subject_area,
          total_weeks: templateForm.total_weeks,
          learning_objectives: templateForm.learning_objectives.filter(obj => obj.trim() !== ''),
          materials_list: templateForm.materials_list.filter(mat => mat.trim() !== ''),
          created_by: userData.user?.id
        });

      if (error) throw error;
      
      console.log('✅ Template created successfully');
      Alert.alert('Success', 'Curriculum template created successfully');
      resetTemplateForm();
      fetchData();
    } catch (error: any) {
      console.error('💥 Error creating template:', error);
      Alert.alert('Error', error.message || 'Failed to create template');
    }
  };

  const handleCreateItem = async () => {
    if (!selectedCurriculum || !itemForm.title || !itemForm.activity_type) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    try {
      console.log('🚀 Creating curriculum item:', itemForm);
      
      const { error } = await supabase
        .from('curriculum_items')
        .insert({
          curriculum_id: selectedCurriculum.id,
          title: itemForm.title,
          description: itemForm.description || null,
          activity_type: itemForm.activity_type,
          materials_needed: itemForm.materials_needed.filter(mat => mat.trim() !== ''),
          learning_goals: itemForm.learning_goals.filter(goal => goal.trim() !== ''),
          week_number: itemForm.week_number,
          day_number: itemForm.day_number,
          time_slot_id: itemForm.time_slot_id || null,
          estimated_duration: itemForm.estimated_duration,
          skills_developed: itemForm.skills_developed.filter(skill => skill.trim() !== '')
        });

      if (error) throw error;
      
      console.log('✅ Item created successfully');
      Alert.alert('Success', 'Curriculum item created successfully');
      resetItemForm();
      fetchCurriculumItems(selectedCurriculum.id);
    } catch (error: any) {
      console.error('💥 Error creating item:', error);
      Alert.alert('Error', error.message || 'Failed to create item');
    }
  };

  const handleImportFromGoogleSheets = async () => {
    if (!importForm.source_url || !importForm.source_name) {
      Alert.alert('Error', 'Please provide Google Sheets URL and name');
      return;
    }

    try {
      console.log('📥 Starting Google Sheets import:', importForm);
      
      const { data: userData } = await supabase.auth.getUser();
      
      // Create import record
      const { data: importRecord, error: importError } = await supabase
        .from('curriculum_imports')
        .insert({
          import_type: importForm.import_type,
          source_url: importForm.source_url,
          source_name: importForm.source_name,
          imported_by: userData.user?.id,
          import_status: 'processing'
        })
        .select()
        .single();

      if (importError) throw importError;

      // Simulate processing (in real app, this would be a background job)
      Alert.alert(
        'Import Started', 
        'Google Sheets import has been queued. You will be notified when it completes.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowImportModal(false);
              setImportForm({ import_type: 'google_sheets', source_url: '', source_name: '' });
            }
          }
        ]
      );

      // In a real implementation, you would:
      // 1. Parse the Google Sheets data
      // 2. Validate the format
      // 3. Create curriculum template and items
      // 4. Update import status

    } catch (error: any) {
      console.error('💥 Error importing:', error);
      Alert.alert('Error', error.message || 'Failed to start import');
    }
  };

  const handleAssignToClasses = async () => {
    if (!selectedCurriculum || assignForm.class_ids.length === 0) {
      Alert.alert('Error', 'Please select at least one class');
      return;
    }

    try {
      console.log('🎯 Assigning curriculum to classes:', assignForm);
      
      const { data: userData } = await supabase.auth.getUser();
      
      const assignments = assignForm.class_ids.map(classId => ({
        curriculum_id: selectedCurriculum.id,
        class_id: classId,
        start_date: assignForm.start_date,
        assigned_by: userData.user?.id
      }));

      const { error } = await supabase
        .from('curriculum_assignments')
        .insert(assignments);

      if (error) throw error;
      
      console.log('✅ Assignments created successfully');
      Alert.alert('Success', 'Curriculum assigned to classes successfully');
      setShowAssignModal(false);
      setAssignForm({ class_ids: [], start_date: new Date().toISOString().split('T')[0] });
      fetchAssignments(selectedCurriculum.id);
    } catch (error: any) {
      console.error('💥 Error assigning curriculum:', error);
      Alert.alert('Error', error.message || 'Failed to assign curriculum');
    }
  };

  const resetTemplateForm = () => {
    setTemplateForm({
      name: '',
      description: '',
      age_group: '',
      subject_area: '',
      total_weeks: 4,
      learning_objectives: [''],
      materials_list: ['']
    });
    setShowTemplateForm(false);
  };

  const resetItemForm = () => {
    setItemForm({
      title: '',
      description: '',
      activity_type: '',
      materials_needed: [''],
      learning_goals: [''],
      week_number: 1,
      day_number: 1,
      time_slot_id: '',
      estimated_duration: 45,
      skills_developed: ['']
    });
    setShowItemForm(false);
  };

  const addArrayField = (field: string, setter: Function, current: any) => {
    setter({ ...current, [field]: [...current[field], ''] });
  };

  const updateArrayField = (field: string, index: number, value: string, setter: Function, current: any) => {
    const newArray = [...current[field]];
    newArray[index] = value;
    setter({ ...current, [field]: newArray });
  };

  const renderTemplatesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.tabHeader}>
        <Text style={styles.tabTitle}>Curriculum Templates</Text>
        <View style={styles.tabActions}>
          <TouchableOpacity style={styles.importButton} onPress={() => setShowImportModal(true)}>
            <Upload size={16} color="#FFFFFF" />
            <Text style={styles.importButtonText}>Import</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowTemplateForm(true)}>
            <Plus size={16} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Template</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.templatesList}>
        {curricula.map((curriculum) => (
          <TouchableOpacity
            key={curriculum.id}
            style={[
              styles.templateCard,
              selectedCurriculum?.id === curriculum.id && styles.selectedTemplate
            ]}
            onPress={() => setSelectedCurriculum(curriculum)}
          >
            <View style={styles.templateHeader}>
              <Text style={styles.templateName}>{curriculum.name}</Text>
              <Text style={styles.templateAge}>{curriculum.age_group}</Text>
            </View>
            <Text style={styles.templateSubject}>{curriculum.subject_area}</Text>
            <Text style={styles.templateWeeks}>{curriculum.total_weeks} weeks</Text>
            {curriculum.description && (
              <Text style={styles.templateDescription}>{curriculum.description}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderScheduleTab = () => (
    <View style={styles.tabContent}>
      {selectedCurriculum ? (
        <>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>{selectedCurriculum.name} - Schedule</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowItemForm(true)}>
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Activity</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scheduleContainer}>
            {Array.from({ length: selectedCurriculum.total_weeks }, (_, weekIndex) => (
              <View key={weekIndex} style={styles.weekContainer}>
                <Text style={styles.weekTitle}>Week {weekIndex + 1}</Text>
                
                {Array.from({ length: 5 }, (_, dayIndex) => {
                  const dayItems = curriculumItems.filter(
                    item => item.week_number === weekIndex + 1 && item.day_number === dayIndex + 1
                  );
                  
                  return (
                    <View key={dayIndex} style={styles.dayContainer}>
                      <Text style={styles.dayTitle}>Day {dayIndex + 1}</Text>
                      
                      {dayItems.length === 0 ? (
                        <Text style={styles.emptyDay}>No activities planned</Text>
                      ) : (
                        dayItems.map((item) => (
                          <View key={item.id} style={styles.activityCard}>
                            <View style={styles.activityHeader}>
                              <Text style={styles.activityTitle}>{item.title}</Text>
                              {item.time_slot && (
                                <View style={styles.timeSlot}>
                                  <Clock size={12} color="#8B5CF6" />
                                  <Text style={styles.timeSlotText}>
                                    {item.time_slot.start_time} - {item.time_slot.end_time}
                                  </Text>
                                </View>
                              )}
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
                          </View>
                        ))
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <BookOpen size={48} color="#6B7280" />
          <Text style={styles.emptyText}>Select a curriculum template to view schedule</Text>
        </View>
      )}
    </View>
  );

  const renderAssignmentsTab = () => (
    <View style={styles.tabContent}>
      {selectedCurriculum ? (
        <>
          <View style={styles.tabHeader}>
            <Text style={styles.tabTitle}>Class Assignments</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAssignModal(true)}>
              <Users size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Assign to Classes</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.assignmentsList}>
            {assignments.length === 0 ? (
              <Text style={styles.emptyText}>No class assignments yet</Text>
            ) : (
              assignments.map((assignment) => (
                <View key={assignment.id} style={styles.assignmentCard}>
                  <View style={styles.assignmentHeader}>
                    <Text style={styles.assignmentClass}>{assignment.class?.name}</Text>
                    <View style={styles.assignmentStatus}>
                      <CheckCircle size={16} color="#10B981" />
                      <Text style={styles.assignmentStatusText}>Active</Text>
                    </View>
                  </View>
                  <Text style={styles.assignmentDate}>
                    Started: {new Date(assignment.start_date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.assignmentAge}>{assignment.class?.age_group}</Text>
                </View>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Users size={48} color="#6B7280" />
          <Text style={styles.emptyText}>Select a curriculum template to view assignments</Text>
        </View>
      )}
    </View>
  );

  const renderImportTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.importGuide}>
        <Text style={styles.importTitle}>Import Curriculum</Text>
        <Text style={styles.importDescription}>
          Import curriculum from Google Sheets, CSV, or Excel files. 
          Your file should include columns for: Week, Day, Activity Title, Description, Materials, Learning Goals, Time Slot.
        </Text>
        
        <View style={styles.importOptions}>
          <TouchableOpacity style={styles.importOption} onPress={() => setShowImportModal(true)}>
            <FileText size={24} color="#8B5CF6" />
            <Text style={styles.importOptionTitle}>Google Sheets</Text>
            <Text style={styles.importOptionDesc}>Import from Google Sheets URL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.importOption}>
            <Upload size={24} color="#EC4899" />
            <Text style={styles.importOptionTitle}>CSV Upload</Text>
            <Text style={styles.importOptionDesc}>Upload CSV file</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.importOption}>
            <Download size={24} color="#F97316" />
            <Text style={styles.importOptionTitle}>Template</Text>
            <Text style={styles.importOptionDesc}>Download template file</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
        <Text style={styles.title}>Curriculum Management</Text>
        <Text style={styles.subtitle}>Create, schedule, and assign comprehensive learning plans</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {[
          { key: 'templates', label: 'Templates', icon: BookOpen },
          { key: 'schedule', label: 'Schedule', icon: Calendar },
          { key: 'assignments', label: 'Assignments', icon: Users },
          { key: 'import', label: 'Import', icon: Upload }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <IconComponent size={16} color={activeTab === tab.key ? '#8B5CF6' : '#6B7280'} />
              <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Content */}
      {activeTab === 'templates' && renderTemplatesTab()}
      {activeTab === 'schedule' && renderScheduleTab()}
      {activeTab === 'assignments' && renderAssignmentsTab()}
      {activeTab === 'import' && renderImportTab()}

      {/* Template Form Modal */}
      <Modal visible={showTemplateForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Curriculum Template</Text>
            <TouchableOpacity onPress={resetTemplateForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Template Name *</Text>
              <TextInput
                style={styles.formInput}
                value={templateForm.name}
                onChangeText={(text) => setTemplateForm({ ...templateForm, name: text })}
                placeholder="Early Math Concepts"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Subject Area *</Text>
              <TextInput
                style={styles.formInput}
                value={templateForm.subject_area}
                onChangeText={(text) => setTemplateForm({ ...templateForm, subject_area: text })}
                placeholder="Mathematics, Science, Language Arts..."
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Age Group *</Text>
              <TextInput
                style={styles.formInput}
                value={templateForm.age_group}
                onChangeText={(text) => setTemplateForm({ ...templateForm, age_group: text })}
                placeholder="3-4 years"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Total Weeks</Text>
              <TextInput
                style={styles.formInput}
                value={templateForm.total_weeks.toString()}
                onChangeText={(text) => setTemplateForm({ ...templateForm, total_weeks: parseInt(text) || 4 })}
                keyboardType="numeric"
                placeholder="4"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Learning Objectives</Text>
              {templateForm.learning_objectives.map((objective, index) => (
                <TextInput
                  key={index}
                  style={[styles.formInput, { marginBottom: 8 }]}
                  value={objective}
                  onChangeText={(text) => updateArrayField('learning_objectives', index, text, setTemplateForm, templateForm)}
                  placeholder={`Objective ${index + 1}`}
                />
              ))}
              <TouchableOpacity 
                style={styles.addFieldButton} 
                onPress={() => addArrayField('learning_objectives', setTemplateForm, templateForm)}
              >
                <Plus size={16} color="#8B5CF6" />
                <Text style={styles.addFieldText}>Add Objective</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetTemplateForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateTemplate}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Create Template</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Item Form Modal */}
      <Modal visible={showItemForm} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Curriculum Activity</Text>
            <TouchableOpacity onPress={resetItemForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Activity Title *</Text>
              <TextInput
                style={styles.formInput}
                value={itemForm.title}
                onChangeText={(text) => setItemForm({ ...itemForm, title: text })}
                placeholder="Counting Bears Fun"
              />
            </View>

            <View style={styles.formRow}>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Week *</Text>
                <TextInput
                  style={styles.formInput}
                  value={itemForm.week_number.toString()}
                  onChangeText={(text) => setItemForm({ ...itemForm, week_number: parseInt(text) || 1 })}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.formFieldHalf}>
                <Text style={styles.formLabel}>Day *</Text>
                <TextInput
                  style={styles.formInput}
                  value={itemForm.day_number.toString()}
                  onChangeText={(text) => setItemForm({ ...itemForm, day_number: parseInt(text) || 1 })}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Time Slot</Text>
              <View style={styles.timeSlotSelector}>
                <TouchableOpacity
                  style={[styles.timeSlotOption, !itemForm.time_slot_id && styles.selectedTimeSlot]}
                  onPress={() => setItemForm({ ...itemForm, time_slot_id: '' })}
                >
                  <Text style={styles.timeSlotText}>No specific time</Text>
                </TouchableOpacity>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot.id}
                    style={[styles.timeSlotOption, itemForm.time_slot_id === slot.id && styles.selectedTimeSlot]}
                    onPress={() => setItemForm({ ...itemForm, time_slot_id: slot.id })}
                  >
                    <Text style={styles.timeSlotText}>{slot.name}</Text>
                    <Text style={styles.timeSlotTime}>{slot.start_time} - {slot.end_time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={resetItemForm}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleCreateItem}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Add Activity</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Import Modal */}
      <Modal visible={showImportModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Import from Google Sheets</Text>
            <TouchableOpacity onPress={() => setShowImportModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Google Sheets URL *</Text>
              <TextInput
                style={styles.formInput}
                value={importForm.source_url}
                onChangeText={(text) => setImportForm({ ...importForm, source_url: text })}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Curriculum Name *</Text>
              <TextInput
                style={styles.formInput}
                value={importForm.source_name}
                onChangeText={(text) => setImportForm({ ...importForm, source_name: text })}
                placeholder="Imported Curriculum Name"
              />
            </View>

            <View style={styles.importInstructions}>
              <Text style={styles.instructionsTitle}>Required Columns:</Text>
              <Text style={styles.instructionsText}>• Week (number)</Text>
              <Text style={styles.instructionsText}>• Day (number)</Text>
              <Text style={styles.instructionsText}>• Title (text)</Text>
              <Text style={styles.instructionsText}>• Description (text)</Text>
              <Text style={styles.instructionsText}>• Activity Type (text)</Text>
              <Text style={styles.instructionsText}>• Materials (comma-separated)</Text>
              <Text style={styles.instructionsText}>• Learning Goals (comma-separated)</Text>
              <Text style={styles.instructionsText}>• Duration (minutes)</Text>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowImportModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleImportFromGoogleSheets}>
                <Upload size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Import</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Assignment Modal */}
      <Modal visible={showAssignModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Assign to Classes</Text>
            <TouchableOpacity onPress={() => setShowAssignModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Select Classes</Text>
              <View style={styles.classSelector}>
                {classes.map((classItem) => (
                  <TouchableOpacity
                    key={classItem.id}
                    style={[
                      styles.classOption,
                      assignForm.class_ids.includes(classItem.id) && styles.selectedClassOption
                    ]}
                    onPress={() => {
                      const newClassIds = assignForm.class_ids.includes(classItem.id)
                        ? assignForm.class_ids.filter(id => id !== classItem.id)
                        : [...assignForm.class_ids, classItem.id];
                      setAssignForm({ ...assignForm, class_ids: newClassIds });
                    }}
                  >
                    <Text style={[
                      styles.classOptionText,
                      assignForm.class_ids.includes(classItem.id) && styles.selectedClassOptionText
                    ]}>
                      {classItem.name}
                    </Text>
                    <Text style={styles.classAgeGroup}>{classItem.age_group}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Start Date</Text>
              <TextInput
                style={styles.formInput}
                value={assignForm.start_date}
                onChangeText={(text) => setAssignForm({ ...assignForm, start_date: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAssignModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAssignToClasses}>
                <Users size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Assign</Text>
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
  tabNavigation: {
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
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#8B5CF6',
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabLabel: {
    color: '#8B5CF6',
  },
  tabContent: {
    flex: 1,
  },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  tabActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  importButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EC4899',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  templatesList: {
    flex: 1,
    padding: 20,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedTemplate: {
    borderColor: '#8B5CF6',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  templateName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  templateAge: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  templateSubject: {
    fontSize: 14,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 4,
  },
  templateWeeks: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  templateDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  scheduleContainer: {
    flex: 1,
    padding: 20,
  },
  weekContainer: {
    marginBottom: 24,
  },
  weekTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF6',
  },
  dayContainer: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  emptyDay: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  activityCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
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
  activityType: {
    fontSize: 12,
    color: '#EC4899',
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
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
  assignmentsList: {
    flex: 1,
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentClass: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  assignmentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentStatusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginLeft: 4,
  },
  assignmentDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  assignmentAge: {
    fontSize: 12,
    color: '#8B5CF6',
  },
  importGuide: {
    padding: 20,
  },
  importTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  importDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  importOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  importOption: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  importOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  importOptionDesc: {
    fontSize: 12,
    color: '#6B7280',
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
  timeSlotSelector: {
    gap: 8,
  },
  timeSlotOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  selectedTimeSlot: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F4F6',
  },
  timeSlotTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  classSelector: {
    gap: 8,
  },
  classOption: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  selectedClassOption: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3F4F6',
  },
  classOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  selectedClassOptionText: {
    color: '#8B5CF6',
  },
  classAgeGroup: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  importInstructions: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
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