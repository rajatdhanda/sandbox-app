import type { Messages as MessagesType } from '@/lib/supabase/_generated/generated-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoleStore } from '@/stores/roleStore';
import { Send, Search, Bell, MessageCircle, Clock, User } from 'lucide-react-native';

export default function MessagesScreen() {
  const { currentRole } = useRoleStore();

  const renderParentMessages = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Stay connected with Emma's teachers</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={16} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.messagesContainer}>
        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#8B5CF6" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Ms. Johnson</Text>
              <Text style={styles.messagePreview}>Emma had a wonderful day in art class today! She created...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>2:30 PM</Text>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>1</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#EC4899" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Ms. Davis</Text>
              <Text style={styles.messagePreview}>Quick reminder about tomorrow's field trip. Please...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>11:45 AM</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <Bell size={20} color="#F97316" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>School Announcement</Text>
              <Text style={styles.messagePreview}>Parent-teacher conferences are scheduled for next week...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>Yesterday</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#10B981" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Ms. Wilson</Text>
              <Text style={styles.messagePreview}>Emma's reading progress has been excellent this week!</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>Monday</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.composeButton}>
        <MessageCircle size={20} color="#FFFFFF" />
        <Text style={styles.composeButtonText}>New Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTeacherMessages = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.subtitle}>Communicate with parents and staff</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickAction}>
          <MessageCircle size={16} color="#8B5CF6" />
          <Text style={styles.quickActionText}>All Parents</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Bell size={16} color="#EC4899" />
          <Text style={styles.quickActionText}>Announcement</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAction}>
          <Clock size={16} color="#F97316" />
          <Text style={styles.quickActionText}>Urgent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={16} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#6B7280"
        />
      </View>

      <View style={styles.messagesContainer}>
        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#8B5CF6" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Sarah Johnson (Emma's Mom)</Text>
              <Text style={styles.messagePreview}>Thank you for the update about Emma's art project! Can we...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>3:15 PM</Text>
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>2</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#EC4899" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Mike Davis (Liam's Dad)</Text>
              <Text style={styles.messagePreview}>Hi Ms. Johnson, I wanted to ask about Liam's behavior...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>1:20 PM</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#F97316" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Principal Anderson</Text>
              <Text style={styles.messagePreview}>Staff meeting scheduled for tomorrow at 4:00 PM...</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>11:30 AM</Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <View style={styles.avatarContainer}>
              <User size={20} color="#10B981" />
            </View>
            <View style={styles.messageInfo}>
              <Text style={styles.senderName}>Lisa Wilson (Sofia's Mom)</Text>
              <Text style={styles.messagePreview}>Sofia mentioned she really enjoyed story time today!</Text>
            </View>
            <View style={styles.messageTime}>
              <Text style={styles.timeText}>Yesterday</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.composeButton}>
        <Send size={20} color="#FFFFFF" />
        <Text style={styles.composeButtonText}>New Message</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {currentRole === 'parent' ? renderParentMessages() : renderTeacherMessages()}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#374151',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 12,
  },
  quickActionText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  messagesContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  messageCard: {
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
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageInfo: {
    flex: 1,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  messagePreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  messageTime: {
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  composeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});