import type { Classes  } from '@/lib/supabase/_generated/generated-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, User, Plus, CreditCard as Edit3, Settings, Calendar, Baby, Clock } from 'lucide-react-native';

export default function ClassesScreen() {
  const classes = [
    {
      id: '1',
      name: 'Sunflower Class',
      teacher: 'Ms. Johnson',
      students: 18,
      capacity: 20,
      ageGroup: '3-4 years',
      schedule: '8:00 AM - 3:00 PM',
      color: '#F59E0B',
      status: 'active'
    },
    {
      id: '2',
      name: 'Rainbow Class',
      teacher: 'Ms. Davis',
      students: 16,
      capacity: 20,
      ageGroup: '2-3 years',
      schedule: '8:30 AM - 3:30 PM',
      color: '#8B5CF6',
      status: 'active'
    },
    {
      id: '3',
      name: 'Butterfly Class',
      teacher: 'Ms. Wilson',
      students: 20,
      capacity: 20,
      ageGroup: '4-5 years',
      schedule: '7:30 AM - 2:30 PM',
      color: '#EC4899',
      status: 'active'
    },
    {
      id: '4',
      name: 'Ocean Class',
      teacher: 'Ms. Martinez',
      students: 15,
      capacity: 18,
      ageGroup: '3-4 years',
      schedule: '9:00 AM - 4:00 PM',
      color: '#10B981',
      status: 'active'
    },
    {
      id: '5',
      name: 'Star Class',
      teacher: 'Ms. Anderson',
      students: 12,
      capacity: 16,
      ageGroup: '2-3 years',
      schedule: '8:00 AM - 3:00 PM',
      color: '#F97316',
      status: 'active'
    },
  ];

  const getCapacityColor = (students: number, capacity: number) => {
    const ratio = students / capacity;
    if (ratio >= 0.9) return '#EF4444';
    if (ratio >= 0.7) return '#F59E0B';
    return '#10B981';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Class Management</Text>
          <Text style={styles.subtitle}>Manage classes, teachers, and students</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Active Classes</Text>
          </View>
          <View style={styles.statCard}>
            <User size={24} color="#EC4899" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
          <View style={styles.statCard}>
            <Baby size={24} color="#F97316" />
            <Text style={styles.statNumber}>81</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={24} color="#10B981" />
            <Text style={styles.statNumber}>94%</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Create New Class</Text>
        </TouchableOpacity>

        <View style={styles.classesList}>
          <Text style={styles.sectionTitle}>All Classes</Text>
          
          {classes.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classHeader}>
                <View style={[styles.classColorIndicator, { backgroundColor: classItem.color }]} />
                <View style={styles.classInfo}>
                  <Text style={styles.className}>{classItem.name}</Text>
                  <Text style={styles.classTeacher}>Teacher: {classItem.teacher}</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <View style={styles.classDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Baby size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{classItem.ageGroup}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{classItem.schedule}</Text>
                  </View>
                </View>
                
                <View style={styles.capacityContainer}>
                  <View style={styles.capacityInfo}>
                    <Users size={16} color="#6B7280" />
                    <Text style={styles.capacityText}>
                      {classItem.students}/{classItem.capacity} students
                    </Text>
                  </View>
                  <View style={styles.capacityBar}>
                    <View 
                      style={[
                        styles.capacityFill,
                        { 
                          width: `${(classItem.students / classItem.capacity) * 100}%`,
                          backgroundColor: getCapacityColor(classItem.students, classItem.capacity)
                        }
                      ]} 
                    />
                  </View>
                </View>
              </View>

              <View style={styles.classActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Users size={16} color="#8B5CF6" />
                  <Text style={styles.actionButtonText}>View Students</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Calendar size={16} color="#EC4899" />
                  <Text style={styles.actionButtonText}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Settings size={16} color="#F97316" />
                  <Text style={styles.actionButtonText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionGrid}>
            <TouchableOpacity style={styles.quickActionCard}>
              <Calendar size={24} color="#8B5CF6" />
              <Text style={styles.quickActionText}>View All Schedules</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Users size={24} color="#EC4899" />
              <Text style={styles.quickActionText}>Assign Teachers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Baby size={24} color="#F97316" />
              <Text style={styles.quickActionText}>Enrollment Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionCard}>
              <Settings size={24} color="#10B981" />
              <Text style={styles.quickActionText}>Bulk Settings</Text>
            </TouchableOpacity>
          </View>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  classesList: {
    paddingHorizontal: 20,
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
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  classColorIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
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
  classTeacher: {
    fontSize: 14,
    color: '#6B7280',
  },
  editButton: {
    padding: 8,
  },
  classDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  capacityContainer: {
    marginTop: 8,
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  capacityText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
  },
  capacityBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  classActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 2,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  quickActions: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
});