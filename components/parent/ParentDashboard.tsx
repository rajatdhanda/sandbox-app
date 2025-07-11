import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../auth/AuthProvider';
import { supabase, Child, DailyLog, Photo } from '@/lib/supabase';
import { LogOut, Baby, Camera, FileText, MessageCircle, Calendar, Clock } from 'lucide-react-native';

export const ParentDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChild) {
      fetchChildData(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('parent_child_relationships')
        .select(`
          child:children(
            *,
            class:classes(*)
          )
        `)
        .eq('parent_id', user!.id);

      if (error) throw error;

      const childrenData = data?.map(rel => rel.child).filter(Boolean) || [];
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0]);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChildData = async (childId: string) => {
    try {
      // Fetch daily logs
      const { data: logsData, error: logsError } = await supabase
        .from('daily_logs')
        .select(`
          *,
          teacher:users(full_name)
        `)
        .eq('child_id', childId)
        .order('log_date', { ascending: false })
        .limit(10);

      if (logsError) throw logsError;
      setDailyLogs(logsData || []);

      // Fetch photos
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('child_id', childId)
        .eq('is_shared_with_parents', true)
        .order('photo_date', { ascending: false })
        .limit(20);

      if (photosError) throw photosError;
      setPhotos(photosData || []);
    } catch (error) {
      console.error('Error fetching child data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back, {user?.full_name}!</Text>
          <Text style={styles.roleText}>Parent Dashboard</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LogOut size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {children.length === 0 ? (
        <View style={styles.emptyState}>
          <Baby size={48} color="#6B7280" />
          <Text style={styles.emptyText}>No children found</Text>
        </View>
      ) : (
        <>
          {/* Child Selector */}
          {children.length > 1 && (
            <View style={styles.childSelector}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {children.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={[
                      styles.childTab,
                      selectedChild?.id === child.id && styles.activeChildTab
                    ]}
                    onPress={() => setSelectedChild(child)}
                  >
                    <Text style={[
                      styles.childTabText,
                      selectedChild?.id === child.id && styles.activeChildTabText
                    ]}>
                      {child.first_name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <ScrollView style={styles.content}>
            {selectedChild && (
              <>
                {/* Child Info */}
                <View style={styles.childInfo}>
                  <Text style={styles.childName}>
                    {selectedChild.first_name} {selectedChild.last_name}
                  </Text>
                  <Text style={styles.childClass}>
                    {selectedChild.class?.name || 'No class assigned'}
                  </Text>
                </View>

                {/* Quick Stats */}
                <View style={styles.statsContainer}>
                  <View style={styles.statCard}>
                    <FileText size={24} color="#8B5CF6" />
                    <Text style={styles.statNumber}>{dailyLogs.length}</Text>
                    <Text style={styles.statLabel}>Activities</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Camera size={24} color="#EC4899" />
                    <Text style={styles.statNumber}>{photos.length}</Text>
                    <Text style={styles.statLabel}>Photos</Text>
                  </View>
                  <View style={styles.statCard}>
                    <Calendar size={24} color="#F97316" />
                    <Text style={styles.statNumber}>5</Text>
                    <Text style={styles.statLabel}>Days/Week</Text>
                  </View>
                </View>

                {/* Recent Activities */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recent Activities</Text>
                  {dailyLogs.length === 0 ? (
                    <Text style={styles.emptyText}>No activities logged yet</Text>
                  ) : (
                    dailyLogs.slice(0, 5).map((log) => (
                      <View key={log.id} style={styles.activityCard}>
                        <View style={styles.activityHeader}>
                          <Text style={styles.activityTitle}>{log.activity_type}</Text>
                          <View style={styles.activityMeta}>
                            <Clock size={14} color="#6B7280" />
                            <Text style={styles.activityDate}>
                              {new Date(log.log_date).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        <Text style={styles.activityDescription}>{log.description}</Text>
                        {log.mood && (
                          <View style={styles.moodBadge}>
                            <Text style={styles.moodText}>Mood: {log.mood}</Text>
                          </View>
                        )}
                        {log.skill_tags && log.skill_tags.length > 0 && (
                          <View style={styles.skillTags}>
                            {log.skill_tags.map((skill, index) => (
                              <Text key={index} style={styles.skillTag}>{skill}</Text>
                            ))}
                          </View>
                        )}
                      </View>
                    ))
                  )}
                </View>

                {/* Recent Photos */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Recent Photos</Text>
                  {photos.length === 0 ? (
                    <Text style={styles.emptyText}>No photos shared yet</Text>
                  ) : (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      <View style={styles.photosContainer}>
                        {photos.slice(0, 10).map((photo) => (
                          <View key={photo.id} style={styles.photoCard}>
                            <Image source={{ uri: photo.image_url }} style={styles.photo} />
                            {photo.caption && (
                              <Text style={styles.photoCaption}>{photo.caption}</Text>
                            )}
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  )}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Quick Actions</Text>
                  <View style={styles.actionGrid}>
                    <TouchableOpacity style={styles.actionCard}>
                      <MessageCircle size={24} color="#8B5CF6" />
                      <Text style={styles.actionText}>Message Teacher</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                      <Calendar size={24} color="#EC4899" />
                      <Text style={styles.actionText}>View Schedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                      <Camera size={24} color="#F97316" />
                      <Text style={styles.actionText}>Photo Gallery</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                      <FileText size={24} color="#10B981" />
                      <Text style={styles.actionText}>Progress Report</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
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
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  roleText: {
    fontSize: 14,
    color: '#6B7280',
  },
  logoutButton: {
    padding: 8,
  },
  childSelector: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  childTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  activeChildTab: {
    backgroundColor: '#8B5CF6',
  },
  childTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeChildTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  childInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  childName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  childClass: {
    fontSize: 16,
    color: '#6B7280',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  activityCard: {
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
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityDate: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 8,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  moodText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  skillTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillTag: {
    backgroundColor: '#EEF2FF',
    color: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 4,
  },
  photosContainer: {
    flexDirection: 'row',
  },
  photoCard: {
    marginRight: 12,
    width: 120,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  photoCaption: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
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
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 50,
  },
});