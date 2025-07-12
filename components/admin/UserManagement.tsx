import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { supabase } from '@/lib/supabase/clients';
import { User } from '@/lib/supabase/types';
import { Plus, CreditCard as Edit3, Trash2, Search, Filter, Mail, Phone, X, Save } from 'lucide-react-native';

interface UserFormData {
  email: string;
  full_name: string;
  role: 'parent' | 'teacher' | 'admin';
  phone?: string;
  address?: string;
  emergency_contact?: string;
  emergency_phone?: string;
}

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    full_name: '',
    role: 'parent',
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    console.log('▶️ handleCreateUser called');
    if (!formData.email || !formData.full_name) {
      console.warn('⚠️ Missing required fields:', formData);
      Alert.alert('Error', 'Email and full name are required');
      return;
    }

    try {
      console.log('🌐 Sending request to /api/createUser');
      const response = await fetch('/api/createUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      console.log('✅ API response:', result);
      Alert.alert('Success', 'User created successfully.');
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('🚨 Error calling API:', error);
      Alert.alert('Error', error.message || 'Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser || !formData.email || !formData.full_name) {
      Alert.alert('Error', 'Email and full name are required');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({
          email: formData.email,
          full_name: formData.full_name,
          role: formData.role,
          phone: formData.phone || null,
          address: formData.address || null,
          emergency_contact: formData.emergency_contact || null,
          emergency_phone: formData.emergency_phone || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      Alert.alert('Success', 'User updated successfully');
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error('Error updating user:', error);
      Alert.alert('Error', error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // First delete related records
              await supabase
                .from('parent_child_relationships')
                .delete()
                .eq('parent_id', userId);

              await supabase
                .from('class_assignments')
                .delete()
                .eq('teacher_id', userId);

              // Then delete the user
              const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

              if (error) throw error;

              Alert.alert('Success', 'User deleted successfully');
              fetchUsers();
            } catch (error: any) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', error.message || 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      email: '',
      full_name: '',
      role: 'parent',
      phone: '',
      address: '',
      emergency_contact: '',
      emergency_phone: ''
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      emergency_contact: user.emergency_contact || '',
      emergency_phone: user.emergency_phone || ''
    });
    setShowForm(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole && user.is_active;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#EF4444';
      case 'teacher': return '#8B5CF6';
      case 'parent': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <View style={styles.filterContainer}>
          {['all', 'parent', 'teacher', 'admin'].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterButton,
                filterRole === role && styles.activeFilterButton
              ]}
              onPress={() => setFilterRole(role)}
            >
              <Text style={[
                styles.filterButtonText,
                filterRole === role && styles.activeFilterButtonText
              ]}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Users List */}
      <ScrollView style={styles.usersList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading users...</Text>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userInfo}>
                <View style={styles.userHeader}>
                  <Text style={styles.userName}>{user.full_name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                    <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <Text style={styles.userEmail}>{user.email}</Text>
                {user.phone && (
                  <View style={styles.contactInfo}>
                    <Phone size={14} color="#6B7280" />
                    <Text style={styles.contactText}>{user.phone}</Text>
                  </View>
                )}
                {user.address && (
                  <Text style={styles.addressText}>{user.address}</Text>
                )}
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openEditForm(user)}
                >
                  <Edit3 size={16} color="#8B5CF6" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteUser(user.id)}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* User Form Modal */}
      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Edit User' : 'Add New User'}
            </Text>
            <TouchableOpacity onPress={resetForm}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.formField}>
              <Text style={styles.formLabel}>Email *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="user@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Full Name *</Text>
              <TextInput
                style={styles.formInput}
                value={formData.full_name}
                onChangeText={(text) => setFormData({ ...formData, full_name: text })}
                placeholder="John Doe"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Role *</Text>
              <View style={styles.roleSelector}>
                {['parent', 'teacher', 'admin'].map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      formData.role === role && styles.selectedRoleOption
                    ]}
                    onPress={() => setFormData({ ...formData, role: role as any })}
                  >
                    <Text style={[
                      styles.roleOptionText,
                      formData.role === role && styles.selectedRoleOptionText
                    ]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Phone</Text>
              <TextInput
                style={styles.formInput}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="+1 (555) 123-4567"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Address</Text>
              <TextInput
                style={styles.formTextArea}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="123 Main St, City, State 12345"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Emergency Contact</Text>
              <TextInput
                style={styles.formInput}
                value={formData.emergency_contact}
                onChangeText={(text) => setFormData({ ...formData, emergency_contact: text })}
                placeholder="Emergency contact name"
              />
            </View>

            <View style={styles.formField}>
              <Text style={styles.formLabel}>Emergency Phone</Text>
              <TextInput
                style={styles.formInput}
                value={formData.emergency_phone}
                onChangeText={(text) => setFormData({ ...formData, emergency_phone: text })}
                placeholder="+1 (555) 987-6543"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={resetForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  console.log('🟣 Create button pressed');
                  editingUser ? handleUpdateUser() : handleCreateUser();
                }}
              >
                <Save size={16} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {editingUser ? 'Update' : 'Create'}
                </Text>
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  searchContainer: {
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
  usersList: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  addressText: {
    fontSize: 12,
    color: '#6B7280',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
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
  formTextArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  selectedRoleOption: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedRoleOptionText: {
    color: '#FFFFFF',
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