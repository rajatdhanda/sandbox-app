import type { Events } from '@/lib/supabase/_generated/generated-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, User, Bell, Calendar, ChevronRight } from 'lucide-react-native';

export default function ScheduleScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Emma's Schedule</Text>
          <Text style={styles.subtitle}>Daily routines and special events</Text>
        </View>

        <View style={styles.todayContainer}>
          <Text style={styles.todayTitle}>Today - January 15, 2025</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Currently in Art Time</Text>
          </View>
        </View>

        <View style={styles.scheduleContainer}>
          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>8:00 AM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Drop-off</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.completedDot} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Main Entrance</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>9:00 AM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Circle Time</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.completedDot} />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Ms. Johnson</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>10:30 AM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={[styles.eventCard, styles.currentEvent]}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Art & Craft Time</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeText}>In Progress</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Ms. Davis</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>12:00 PM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Lunch Time</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.upcomingDot} />
                    <Text style={styles.upcomingText}>Upcoming</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Cafeteria</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>1:00 PM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Quiet Time</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.upcomingDot} />
                    <Text style={styles.upcomingText}>Upcoming</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Rest Area</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>2:00 PM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Outdoor Play</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.upcomingDot} />
                    <Text style={styles.upcomingText}>Upcoming</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <MapPin size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Playground</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.scheduleItem}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>3:30 PM</Text>
              <View style={styles.timeLine} />
            </View>
            <View style={styles.eventContainer}>
              <View style={styles.eventCard}>
                <View style={styles.eventHeader}>
                  <Text style={styles.eventTitle}>Pick-up</Text>
                  <View style={styles.eventStatus}>
                    <View style={styles.upcomingDot} />
                    <Text style={styles.upcomingText}>Scheduled</Text>
                  </View>
                </View>
                <View style={styles.eventDetails}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.eventLocation}>Mom - Sarah</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          
          <TouchableOpacity style={styles.upcomingEvent}>
            <View style={styles.eventIcon}>
              <Calendar size={20} color="#8B5CF6" />
            </View>
            <View style={styles.upcomingEventDetails}>
              <Text style={styles.upcomingEventTitle}>Field Trip - Zoo Visit</Text>
              <Text style={styles.upcomingEventDate}>Tomorrow, January 16</Text>
              <Text style={styles.upcomingEventTime}>9:00 AM - 2:00 PM</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.upcomingEvent}>
            <View style={styles.eventIcon}>
              <Bell size={20} color="#EC4899" />
            </View>
            <View style={styles.upcomingEventDetails}>
              <Text style={styles.upcomingEventTitle}>Parent-Teacher Conference</Text>
              <Text style={styles.upcomingEventDate}>Friday, January 19</Text>
              <Text style={styles.upcomingEventTime}>3:00 PM - 3:30 PM</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.upcomingEvent}>
            <View style={styles.eventIcon}>
              <User size={20} color="#F97316" />
            </View>
            <View style={styles.upcomingEventDetails}>
              <Text style={styles.upcomingEventTitle}>Show & Tell</Text>
              <Text style={styles.upcomingEventDate}>Monday, January 22</Text>
              <Text style={styles.upcomingEventTime}>10:00 AM - 11:00 AM</Text>
            </View>
            <ChevronRight size={20} color="#6B7280" />
          </TouchableOpacity>
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
  todayContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
  scheduleContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeContainer: {
    width: 80,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeLine: {
    width: 2,
    height: 60,
    backgroundColor: '#E5E7EB',
    marginTop: 8,
  },
  eventContainer: {
    flex: 1,
    marginLeft: 16,
  },
  eventCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentEvent: {
    backgroundColor: '#F0F9FF',
    borderColor: '#8B5CF6',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  eventStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 4,
  },
  completedText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '500',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginRight: 4,
  },
  activeText: {
    fontSize: 10,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  upcomingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B7280',
    marginRight: 4,
  },
  upcomingText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  eventDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  upcomingSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  upcomingEvent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  eventIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  upcomingEventDetails: {
    flex: 1,
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  upcomingEventDate: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
    marginBottom: 2,
  },
  upcomingEventTime: {
    fontSize: 12,
    color: '#6B7280',
  },
});