import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, User, Users, Baby, Filter, CreditCard as Edit3, Trash2, Mail } from 'lucide-react-native';

export default function UsersScreen() {
  const users = [
    { id: '1', name: 'Sarah Johnson', role: 'Parent', email: 'sarah@example.com', children: ['Emma Johnson'], status: 'active' },
    { id: '2', name: 'Mike Davis', role: 'Parent', email: 'mike@example.com', children: ['Liam Davis'], status: 'active' },
    { id: '3', name: 'Lisa Wilson', role: 'Teacher', email: 'lisa@example.com', class: 'Sunflower Class', status: 'active' },
    { id: '4', name: 'Jennifer Martinez', role: 'Parent', email: 'jennifer@example.com', children: ['Oliver Martinez'], status: 'inactive' },
    { id: '5', name: 'David Chen', role: 'Parent', email: 'david@example.com', children: ['Maya Chen'], status: 'active' },
    { id: '6', name: 'Amanda Thompson', role: 'Teacher', email: 'amanda@example.com', class: 'Rainbow Class', status: 'active' },
    { id: '7', name: 'Robert Rodriguez', role: 'Parent', email: 'robert@example.com', children: ['Ava Rodriguez'], status: 'active' },
    { id: '8', name: 'Michelle Brown', role: 'Teacher', email: 'michelle@example.com', class: 'Butterfly Class', status: 'active' },
  ];

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Parent':
        return <User size={16} color="#8B5CF6" />;
      case 'Teacher':
        return <Users size={16} color="#EC4899" />;
      case 'Admin':
        return <Baby size={16} color="#F97316" />;
      default:
        return <User size={16} color="#6B7280" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Parent':
        return '#8B5CF6';
      case 'Teacher':
        return '#EC4899';
      case 'Admin':
        return '#F97316';
      default:
        return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? '#10B981' : '#EF4444';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>User Management</Text>
          <Text style={styles.subtitle}>Manage parents, teachers, and students</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <User size={24} color="#8B5CF6" />
            <Text style={styles.statNumber}>89</Text>
            <Text style={styles.statLabel}>Parents</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={24} color="#EC4899" />
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Teachers</Text>
          </View>
          <View style={styles.statCard}>
            <Baby size={24} color="#F97316" />
            <Text style={styles.statNumber}>127</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#6B7280"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add New User</Text>
        </TouchableOpacity>

        <View style={styles.usersList}>
          <Text style={styles.sectionTitle}>All Users</Text>
          
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userInitial}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {user.children && (
                    <Text style={styles.userChildren}>Children: {user.children.join(', ')}</Text>
                  )}
                  {user.class && (
                    <Text style={styles.userClass}>Class: {user.class}</Text>
                  )}
                </View>
              </View>
              
              <View style={styles.userMeta}>
                <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                  {getRoleIcon(user.role)}
                  <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                    {user.role}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.userActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Mail size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Edit3 size={16} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bulkActions}>
          <Text style={styles.sectionTitle}>Bulk Actions</Text>
          <View style={styles.bulkButtonContainer}>
            <TouchableOpacity style={styles.bulkButton}>
              <Mail size={16} color="#8B5CF6" />
              <Text style={styles.bulkButtonText}>Send Newsletter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bulkButton}>
              <Users size={16} color="#EC4899" />
              <Text style={styles.bulkButtonText}>Export Users</Text>
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
  filterButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  usersList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  userCard: {
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  userChildren: {
    fontSize: 12,
    color: '#8B5CF6',
  },
  userClass: {
    fontSize: 12,
    color: '#EC4899',
  },
  userMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  bulkActions: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
  },
  bulkButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bulkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  bulkButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
});