import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Search, Filter, Calendar, User, Activity, CircleAlert as AlertCircle } from 'lucide-react-native';

interface LogEntry {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
  level: 'info' | 'warning' | 'error';
}

export const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // Generate sample logs for demonstration
      const sampleLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: new Date().toISOString(),
          user_id: 'admin-1',
          user_name: 'Admin User',
          action: 'User Created',
          details: 'Created new teacher account for Sarah Johnson',
          level: 'info'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          user_id: 'teacher-1',
          user_name: 'Ms. Johnson',
          action: 'Activity Logged',
          details: 'Logged art activity for Emma Wilson',
          level: 'info'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          user_id: 'system',
          user_name: 'System',
          action: 'Backup Completed',
          details: 'Daily backup completed successfully',
          level: 'info'
        },
        {
          id: '4',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          user_id: 'admin-1',
          user_name: 'Admin User',
          action: 'Config Updated',
          details: 'Added new mood option: Excited',
          level: 'info'
        },
        {
          id: '5',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          user_id: 'system',
          user_name: 'System',
          action: 'Login Failed',
          details: 'Failed login attempt for unknown@example.com',
          level: 'warning'
        }
      ];
      
      setLogs(sampleLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'info': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle size={16} color="#EF4444" />;
      case 'warning': return <AlertCircle size={16} color="#F59E0B" />;
      case 'info': return <Activity size={16} color="#10B981" />;
      default: return <Activity size={16} color="#6B7280" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>System Logs</Text>
        <Text style={styles.subtitle}>Monitor system activity and user actions</Text>
      </View>

      <View style={styles.controls}>
        <View style={styles.searchBox}>
          <Search size={16} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search logs..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        
        <View style={styles.filterContainer}>
          {['all', 'info', 'warning', 'error'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.filterButton,
                filterLevel === level && styles.activeFilterButton
              ]}
              onPress={() => setFilterLevel(level)}
            >
              <Text style={[
                styles.filterButtonText,
                filterLevel === level && styles.activeFilterButtonText
              ]}>
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.logsList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading logs...</Text>
        ) : (
          filteredLogs.map((log) => (
            <View key={log.id} style={styles.logCard}>
              <View style={styles.logHeader}>
                <View style={styles.logLevel}>
                  {getLevelIcon(log.level)}
                  <Text style={[styles.levelText, { color: getLevelColor(log.level) }]}>
                    {log.level.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {new Date(log.timestamp).toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.logContent}>
                <View style={styles.actionRow}>
                  <User size={14} color="#6B7280" />
                  <Text style={styles.userName}>{log.user_name}</Text>
                  <Text style={styles.action}>{log.action}</Text>
                </View>
                <Text style={styles.details}>{log.details}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  logsList: {
    flex: 1,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 16,
    marginTop: 20,
  },
  logCard: {
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
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  logContent: {
    gap: 8,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  action: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  details: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});