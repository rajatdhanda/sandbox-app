import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoleStore } from '@/stores/roleStore';
import { Clock, MapPin, Users, Plus, CreditCard as Edit3, Camera } from 'lucide-react-native';

export default function ActivitiesScreen() {
  const { currentRole } = useRoleStore();

  const renderParentActivities = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emma's Activities</Text>
        <Text style={styles.subtitle}>Track your child's daily adventures</Text>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
          <Text style={styles.filterTextInactive}>This Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterButton, styles.filterButtonInactive]}>
          <Text style={styles.filterTextInactive}>All Time</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.activityContainer}>
        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityIcon}>
              <Camera size={20} color="#8B5CF6" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Art & Craft Time</Text>
              <View style={styles.activityMeta}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.activityTime}>10:30 AM - 11:30 AM</Text>
              </View>
            </View>
          </View>
          <Text style={styles.activityDescription}>
            Emma created a beautiful butterfly painting using watercolors. She showed great creativity and attention to detail!
          </Text>
          <View style={styles.activityPhotos}>
            <Image source={{ uri: 'https://images.pexels.com/photos/1181346/pexels-photo-1181346.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }} style={styles.activityPhoto} />
            <Image source={{ uri: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2' }} style={styles.activityPhoto} />
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityIcon}>
              <Users size={20} color="#EC4899" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Circle Time</Text>
              <View style={styles.activityMeta}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.activityTime}>9:00 AM - 9:30 AM</Text>
              </View>
            </View>
          </View>
          <Text style={styles.activityDescription}>
            Emma participated actively in our morning circle time. We sang songs about the weather and she shared her favorite color!
          </Text>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityIcon}>
              <MapPin size={20} color="#F97316" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Outdoor Play</Text>
              <View style={styles.activityMeta}>
                <Clock size={14} color="#6B7280" />
                <Text style={styles.activityTime}>2:00 PM - 3:00 PM</Text>
              </View>
            </View>
          </View>
          <Text style={styles.activityDescription}>
            Emma enjoyed playing on the swings and slides. She made new friends and practiced sharing toys with others.
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderTeacherActivities = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity Management</Text>
        <Text style={styles.subtitle}>Log and track class activities</Text>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Log New Activity</Text>
      </TouchableOpacity>

      <View style={styles.activityContainer}>
        <View style={styles.teacherActivityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Art & Craft Time</Text>
              <Text style={styles.activitySubtitle}>15 students participated</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.activityDescription}>
            Students created butterfly paintings using watercolors. Focus on creativity and fine motor skills development.
          </Text>
          <View style={styles.studentTags}>
            <Text style={styles.studentTag}>Emma</Text>
            <Text style={styles.studentTag}>Liam</Text>
            <Text style={styles.studentTag}>Sofia</Text>
            <Text style={styles.studentTag}>+12 more</Text>
          </View>
        </View>

        <View style={styles.teacherActivityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Story Time</Text>
              <Text style={styles.activitySubtitle}>18 students participated</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.activityDescription}>
            Read "The Very Hungry Caterpillar" and discussed colors, counting, and days of the week.
          </Text>
          <View style={styles.studentTags}>
            <Text style={styles.studentTag}>All Students</Text>
          </View>
        </View>

        <View style={styles.teacherActivityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Music & Movement</Text>
              <Text style={styles.activitySubtitle}>14 students participated</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <Text style={styles.activityDescription}>
            Dancing and singing to promote physical development and rhythm recognition.
          </Text>
          <View style={styles.studentTags}>
            <Text style={styles.studentTag}>Emma</Text>
            <Text style={styles.studentTag}>Oliver</Text>
            <Text style={styles.studentTag}>Maya</Text>
            <Text style={styles.studentTag}>+11 more</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentRole === 'parent' ? renderParentActivities() : renderTeacherActivities()}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  activityContainer: {
    padding: 20,
    paddingTop: 0,
  },
  activityCard: {
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
  teacherActivityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 12,
  },
  activityPhotos: {
    flexDirection: 'row',
  },
  activityPhoto: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  studentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  studentTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    color: '#374151',
    marginRight: 8,
    marginBottom: 4,
  },
});