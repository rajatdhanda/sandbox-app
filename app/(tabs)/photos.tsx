import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoleStore } from '@/stores/roleStore';
import { Camera, Download, Share, Plus, Calendar, Users } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const photoSize = (width - 60) / 3;

export default function PhotosScreen() {
  const { currentRole } = useRoleStore();

  const photos = [
    { id: '1', uri: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Art Time', date: '2025-01-15' },
    { id: '2', uri: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Outdoor Play', date: '2025-01-15' },
    { id: '3', uri: 'https://images.pexels.com/photos/1181343/pexels-photo-1181343.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Story Time', date: '2025-01-15' },
    { id: '4', uri: 'https://images.pexels.com/photos/1181344/pexels-photo-1181344.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Music Time', date: '2025-01-14' },
    { id: '5', uri: 'https://images.pexels.com/photos/1181342/pexels-photo-1181342.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Snack Time', date: '2025-01-14' },
    { id: '6', uri: 'https://images.pexels.com/photos/1181341/pexels-photo-1181341.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Circle Time', date: '2025-01-14' },
    { id: '7', uri: 'https://images.pexels.com/photos/1181340/pexels-photo-1181340.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Crafts', date: '2025-01-13' },
    { id: '8', uri: 'https://images.pexels.com/photos/1181339/pexels-photo-1181339.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Garden Time', date: '2025-01-13' },
    { id: '9', uri: 'https://images.pexels.com/photos/1181338/pexels-photo-1181338.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&dpr=2', activity: 'Reading', date: '2025-01-13' },
  ];

  const renderParentPhotos = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emma's Photos</Text>
        <Text style={styles.subtitle}>Precious moments from preschool</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>23</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1,247</Text>
          <Text style={styles.statLabel}>All Time</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Recent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
          <Text style={styles.filterTextInactive}>Activities</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
          <Text style={styles.filterTextInactive}>Favorites</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.photosGrid}>
        {photos.map((photo) => (
          <TouchableOpacity key={photo.id} style={styles.photoItem}>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <View style={styles.photoOverlay}>
              <Text style={styles.photoActivity}>{photo.activity}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Download size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Download All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Share Album</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderTeacherPhotos = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Class Photos</Text>
        <Text style={styles.subtitle}>Capture and share special moments</Text>
      </View>

      <TouchableOpacity style={styles.captureButton}>
        <Camera size={20} color="#FFFFFF" />
        <Text style={styles.captureButtonText}>Take Photo</Text>
      </TouchableOpacity>

      <View style={styles.recentPhotos}>
        <Text style={styles.sectionTitle}>Recent Photos</Text>
        <View style={styles.photosGrid}>
          {photos.map((photo) => (
            <TouchableOpacity key={photo.id} style={styles.teacherPhotoItem}>
              <Image source={{ uri: photo.uri }} style={styles.photo} />
              <View style={styles.photoActions}>
                <TouchableOpacity style={styles.photoAction}>
                  <Share size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.photoAction}>
                  <Users size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>
              <Text style={styles.photoDate}>{photo.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.albumSection}>
        <Text style={styles.sectionTitle}>Albums</Text>
        <View style={styles.albumGrid}>
          <TouchableOpacity style={styles.albumItem}>
            <View style={styles.albumCover}>
              <Image source={{ uri: photos[0].uri }} style={styles.albumImage} />
            </View>
            <Text style={styles.albumTitle}>Art & Crafts</Text>
            <Text style={styles.albumCount}>12 photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.albumItem}>
            <View style={styles.albumCover}>
              <Image source={{ uri: photos[1].uri }} style={styles.albumImage} />
            </View>
            <Text style={styles.albumTitle}>Outdoor Play</Text>
            <Text style={styles.albumCount}>18 photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.albumItem}>
            <View style={styles.albumCover}>
              <Plus size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.albumTitle}>New Album</Text>
            <Text style={styles.albumCount}>Create</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentRole === 'parent' ? renderParentPhotos() : renderTeacherPhotos()}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterButtonInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextInactive: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  captureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  recentPhotos: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoItem: {
    width: photoSize,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  teacherPhotoItem: {
    width: photoSize,
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: photoSize,
    borderRadius: 8,
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
  },
  photoActivity: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  photoAction: {
    padding: 4,
  },
  photoDate: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  albumSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  albumGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  albumItem: {
    width: '30%',
    alignItems: 'center',
  },
  albumCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  albumImage: {
    width: '100%',
    height: '100%',
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  albumCount: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 2,
  },
});