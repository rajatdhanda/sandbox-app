import type { Users as UsersType, Reports as ReportsType, Attendance } from '@/lib/supabase/_generated/generated-types';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart3, TrendingUp, Download, Calendar, Users, Baby, Clock, FileText, ChartPie as PieChart } from 'lucide-react-native';

export default function ReportsScreen() {
  const reports = [
    {
      id: '1',
      title: 'Monthly Attendance Report',
      description: 'Detailed attendance statistics for all classes',
      date: 'January 2025',
      type: 'attendance',
      icon: Users,
      color: '#8B5CF6',
      data: '94% average attendance'
    },
    {
      id: '2',
      title: 'Student Enrollment Report',
      description: 'Current enrollment status and capacity utilization',
      date: 'January 15, 2025',
      type: 'enrollment',
      icon: Baby,
      color: '#EC4899',
      data: '127 students enrolled'
    },
    {
      id: '3',
      title: 'Teacher Performance Report',
      description: 'Teacher activity and student engagement metrics',
      date: 'December 2024',
      type: 'performance',
      icon: TrendingUp,
      color: '#F97316',
      data: '18 active teachers'
    },
    {
      id: '4',
      title: 'Financial Summary',
      description: 'Monthly revenue and expense breakdown',
      date: 'December 2024',
      type: 'financial',
      icon: BarChart3,
      color: '#10B981',
      data: '$45,230 revenue'
    },
    {
      id: '5',
      title: 'Activity Engagement Report',
      description: 'Most popular activities and participation rates',
      date: 'This Week',
      type: 'activities',
      icon: PieChart,
      color: '#6366F1',
      data: '156 activities logged'
    },
    {
      id: '6',
      title: 'Parent Communication Report',
      description: 'Message volume and response rates',
      date: 'This Month',
      type: 'communication',
      icon: FileText,
      color: '#8B5CF6',
      data: '234 messages sent'
    },
  ];

  const quickStats = [
    { label: 'Total Students', value: '127', change: '+5', trend: 'up' },
    { label: 'Active Teachers', value: '18', change: '+2', trend: 'up' },
    { label: 'Avg. Attendance', value: '94%', change: '+2%', trend: 'up' },
    { label: 'Parent Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reports & Analytics</Text>
          <Text style={styles.subtitle}>Track performance and generate insights</Text>
        </View>

        <View style={styles.quickStatsContainer}>
          <Text style={styles.sectionTitle}>Quick Statistics</Text>
          <View style={styles.statsGrid}>
            {quickStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <View style={styles.statChange}>
                  <TrendingUp size={12} color="#10B981" />
                  <Text style={styles.statChangeText}>{stat.change}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartsContainer}>
          <Text style={styles.sectionTitle}>Data Visualization</Text>
          
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Weekly Attendance Trend</Text>
              <TouchableOpacity style={styles.chartAction}>
                <Calendar size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.chartPlaceholder}>
              <BarChart3 size={40} color="#8B5CF6" />
              <Text style={styles.chartPlaceholderText}>
                Interactive chart showing attendance patterns
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>Class Enrollment Distribution</Text>
              <TouchableOpacity style={styles.chartAction}>
                <PieChart size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <View style={styles.chartPlaceholder}>
              <PieChart size={40} color="#EC4899" />
              <Text style={styles.chartPlaceholderText}>
                Pie chart showing enrollment by class
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.reportsContainer}>
          <Text style={styles.sectionTitle}>Available Reports</Text>
          
          {reports.map((report) => {
            const IconComponent = report.icon;
            return (
              <View key={report.id} style={styles.reportCard}>
                <View style={styles.reportHeader}>
                  <View style={[styles.reportIcon, { backgroundColor: report.color + '20' }]}>
                    <IconComponent size={20} color={report.color} />
                  </View>
                  <View style={styles.reportInfo}>
                    <Text style={styles.reportTitle}>{report.title}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                    <Text style={styles.reportDate}>{report.date}</Text>
                  </View>
                </View>
                
                <View style={styles.reportData}>
                  <Text style={styles.reportDataText}>{report.data}</Text>
                </View>
                
                <View style={styles.reportActions}>
                  <TouchableOpacity style={styles.reportAction}>
                    <FileText size={16} color="#6B7280" />
                    <Text style={styles.reportActionText}>View</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reportAction}>
                    <Download size={16} color="#6B7280" />
                    <Text style={styles.reportActionText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export Data</Text>
          <View style={styles.exportGrid}>
            <TouchableOpacity style={styles.exportButton}>
              <Download size={20} color="#8B5CF6" />
              <Text style={styles.exportButtonText}>Export All Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <Calendar size={20} color="#EC4899" />
              <Text style={styles.exportButtonText}>Schedule Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}>
              <FileText size={20} color="#F97316" />
              <Text style={styles.exportButtonText}>Custom Report</Text>
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
  quickStatsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    color: '#10B981',
    marginLeft: 4,
    fontWeight: '500',
  },
  chartsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  chartCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  chartAction: {
    padding: 4,
  },
  chartPlaceholder: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  chartPlaceholderText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: 20,
  },
  chartBar: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 30,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  reportsContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  reportCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  reportDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  reportData: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reportDataText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  reportAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  reportActionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  exportSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  exportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exportButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  exportButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    textAlign: 'center',
  },
});