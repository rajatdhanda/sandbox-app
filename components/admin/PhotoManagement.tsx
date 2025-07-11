import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image, Modal } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Camera, Plus, Tag, Search, Filter, X, Save, Upload } from 'lucide-react-native';

interface Photo {
  id: string;
  child_id: string;
  teacher_id: string;
  image_url: string;
  caption?: string;
  activity_type?: string;
  photo_date: string;
  is_shared_with_parents: boolean;
  album_name?: string;
  created_at: string;
  child?: {
    first_name: string;
    last_name: string;
  };
  teacher?: {
    full_name: string;
  };
  photo_tags?: {
    tag_name: string;
    tag_type: string;
  }[];
}

interface PhotoTag {
  id: string;
  photo_id: string;
  tag_name: string;
  tag_type: string;
}

export const PhotoManagement: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showTagModal, setShowTagModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTags, setNewTags] = useState<string[]>(['']);
  const [uploadData, setUploadData] = useState({
    child_id: '',
    caption: '',
    activity_type: '',
    album_name: '',
    is_shared_with_parents: true
  });

  useEffect(() => {
    fetchPhotos();
    fetchChildren();
  }, []);

  const fetchPhotos = async () => {
    try {
      console.log('📸 Fetching photos...');
      const { data, error } = await supabase
        .from('photos')
        .select(`
          *,
          child:children(first_name, last_name),
          teacher:users(full_name),
          photo_tags(tag_name, tag_type)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      console.log('✅ Photos fetched:', data?.length || 0);
      setPhotos(data || []);
    } catch (error) {
      console.error('💥 Error fetching photos:', error);
      Alert.alert('Error', 'Failed to fetch photos');
    } finally {
      setLoading(false);
    }
  };

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, first_name, last_name')
        .eq('is_active', true)
        .order('first_name');

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const handleAddTags = async () => {
    if (!selectedPhoto) return;

    try {
      console.log('🏷️ Adding tags to photo:', selectedPhoto.id);
      const validTags = newTags.filter(tag => tag.trim() !== '');
      
      const tagsToInsert = validTags.map(tag => ({
        photo_id: selectedPhoto.id,
        tag_name: tag.trim(),
        tag_type: 'custom'
      }));

      const { error } = await supabase
        .from('photo_tags')
        .insert(tagsToInsert);

      if (error) throw error;
      console.log('✅ Tags added successfully');
      Alert.alert('Success', 'Tags added successfully');
      setShowTagModal(false);
      setNewTags(['']);
      fetchPhotos();
    } catch (error: any) {
      console.error('💥 Error adding tags:', error);
      Alert.alert('Error', error.message || 'Failed to add tags');
    }
  };

  const handleUploadPhoto = async () => {
    if (!uploadData.child_id) {
      Alert.alert('Error', 'Please select a child');
      return;
    }

    try {
      console.log('📤 Uploading photo...');
      // In a real app, you would handle file upload here
      // For demo purposes, we'll use a placeholder image
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('photos')
        .insert({
          child_id: uploadData.child_id,
          teacher_id: userData.user?.id,
          image_url: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2',
          caption: uploadData.caption || null,
          activity_type: uploadData.activity_type || null,
          album_name: uploadData.album_name || null,
          is_shared_with_parents: uploadData.is_shared_with_parents,
          photo_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;
      console.log('✅ Photo uploaded successfully');
      Alert.alert('Success', 'Photo uploaded successfully');
      setShowUploadModal(false);
      setUploadData({
        child_id: '',
        caption: '',
        activity_type: '',
        album_name: '',
        is_shared_with_parents: true
      });
      fetchPhotos();
    } catch (error: any) {
      console.error('💥 Error uploading photo:', error);
      Alert.alert('Error', error.message || 'Failed to upload photo');
    }
  };

  const openTagModal = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShowTagModal(true);
  };

  const addTagField = () => {
    setNewTags([...newTags, '']);
  };

  const updateTag = (index: number, value: string) => {
    const updatedTags = [...newTags];
    updatedTags[index] = value;
    setNewTags(updatedTags);
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.child?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.child?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.activity_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'shared' && photo.is_shared_with_parents) ||
                         (filterType === 'private' && !photo.is_shared_with_parents);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Photo Management</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => setShowUploadModal(true)}
        >
          <Upload size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search photos..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'shared', 'private'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                filterType === filter && styles.activeFilterButton
              ]}
              onPress={() => setFilterType(filter)}
            >
              <Text style={[
                styles.filterButtonText,
                filterType === filter && styles.activeFilterButtonText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.photosList}>
        <View style={styles.photosGrid}>
          {loading ? (
            <Text style={styles.loadingText}>Loading photos...</Text>
          ) : (
            filteredPhotos.map((photo) => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.image_url }} style={styles.photoImage} />
                <View style={styles.photoOverlay}>
                  <View style={styles.photoInfo}>
                    <Text style={styles.photoChild}>
                      {photo.child?.first_name} {photo.child?.last_name}
                    </Text>
                    <Text style={styles.photoDate}>
                      {new Date(photo.photo_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.tagButton}
                    onPress={() => openTagModal(photo)}
                  >
                    <Tag size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                {photo.caption && (
                  <Text style={styles.photoCaption}>{photo.caption}</Text>
                )}
                {photo.activity_type && (
                  <View style={styles.activityBadge}>
                    <Text style={styles.activityText}>{photo.activity_type}</Text>
                  </View>
                )}
                {photo.photo_tags && photo.photo_tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {photo.photo_tags.slice(0, 3).map((tag, index) => (
                      <Text key={index} style={styles.tag}>#{tag.tag_name}</Text>
                    ))}
                  </View>
                )}
                <View style={styles.shareStatus}>
                  <Text style={[
                    styles.shareText,
                    { color: photo.is_shared_with_parents ? '#10B981' : '#EF4444' }
                  ]}>
                    {photo.is_shared_with_parents ? 'Shared' : 'Private'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Tag Modal */}
      <Modal visible={showTagModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Tags</Text>
            <TouchableOpacity onPress={() => setShowTagModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            {selectedPhoto && (
              <View style={styles.selectedPhotoContainer}>
                <Image source={{ uri: selectedPhoto.image_url }} style={styles.selectedPhotoImage} />
                <Text style={styles.selectedPhotoText}>
                  {selectedPhoto.child?.first_name} {selectedPhoto.child?.last_name}
                </Text>
              </View>
            )}

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Tags</Text>
              {newTags.map((tag, index) => (
                <TextInput
                  key={index}
                  style={[styles.formInput, { marginBottom: 8 }]}
                  value={tag}
                  onChangeText={(text) => updateTag(index, text)}
                  placeholder={`Tag ${index + 1}`}
                />
              ))}
              <TouchableOpacity style={styles.addFieldButton} onPress={addTagField}>
                <Plus size={16} color="#8B5CF6" />
                <Text style={styles.addFieldText}>Add Tag</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowTagModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddTags}>
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Add Tags</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Upload Modal */}
      <Modal visible={showUploadModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Upload Photo</Text>
            <TouchableOpacity onPress={() => setShowUploadModal(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Child *</Text>
              <View style={styles.childSelector}>
                {children.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childOption,
                      uploadData.child_id === child.id && styles.selectedChildOption
                    ]}
                    onPress={() => setUploadData({ ...uploadData, child_id: child.id })}
                  >
                    <Text style={[
                      styles.childOptionText,
                      uploadData.child_id === child.id && styles.selectedChildOptionText
                    ]}>
                      {child.first_name} {child.last_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Caption</Text>
              <TextInput
                style={styles.formInput}
                value={uploadData.caption}
                onChangeText={(text) => setUploadData({ ...uploadData, caption: text })}
                placeholder="Photo caption..."
                multiline
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Activity Type</Text>
              <TextInput
                style={styles.formInput}
                value={uploadData.activity_type}
                onChangeText={(text) => setUploadData({ ...uploadData, activity_type: text })}
                placeholder="Art Time, Outdoor Play, etc."
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Album Name</Text>
              <TextInput
                style={styles.formInput}
                value={uploadData.album_name}
                onChangeText={(text) => setUploadData({ ...uploadData, album_name: text })}
                placeholder="Optional album name"
              />
            </View>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => setUploadData({ 
                  ...uploadData, 
                  is_shared_with_parents: !uploadData.is_shared_with_parents 
                })}
              >
                <Text style={styles.checkboxText}>
                  {uploadData.is_shared_with_parents ? '☑️' : '☐'} Share with parents
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowUploadModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUploadPhoto}>
                <Upload size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Upload</Text>
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
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  controls: {
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#374151',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#8B5CF6',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  photosList: {
    flex: 1,
    padding: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  photoImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  photoInfo: {
    flex: 1,
  },
  photoChild: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  photoDate: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  tagButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
    padding: 8,
    borderRadius: 20,
  },
  photoCaption: {
    padding: 12,
    fontSize: 14,
    color: '#374151',
  },
  activityBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EC4899',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  tag: {
    fontSize: 10,
    color: '#8B5CF6',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  shareStatus: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  shareText: {
    fontSize: 12,
    fontWeight: '600',
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
  selectedPhotoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedPhotoImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPhotoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
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
  childSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  childOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  selectedChildOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  childOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedChildOptionText: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    marginBottom: 20,
  },
  checkbox: {
    paddingVertical: 8,
  },
  checkboxText: {
    fontSize: 16,
    color: '#374151',
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