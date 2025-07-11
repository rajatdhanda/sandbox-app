import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Users, Baby, Settings, Chrome as Home, Camera, MessageCircle, Calendar, ChartBar as BarChart3, UserCheck, FileText, Sliders } from 'lucide-react-native';
import { useRoleStore } from '@/stores/roleStore';

export default function TabLayout() {
  const { currentRole } = useRoleStore();

  const getTabsConfig = () => {
    switch (currentRole) {
      case 'parent':
        return [
          { name: 'index', title: 'Home', icon: Home },
          { name: 'activities', title: 'Activities', icon: Baby },
          { name: 'photos', title: 'Photos', icon: Camera },
          { name: 'messages', title: 'Messages', icon: MessageCircle },
          { name: 'schedule', title: 'Schedule', icon: Calendar },
        ];
      case 'teacher':
        return [
          { name: 'index', title: 'Dashboard', icon: Home },
          { name: 'attendance', title: 'Attendance', icon: UserCheck },
          { name: 'activities', title: 'Activities', icon: Baby },
          { name: 'photos', title: 'Photos', icon: Camera },
          { name: 'messages', title: 'Messages', icon: MessageCircle },
        ];
      case 'admin':
        return [
          { name: 'index', title: 'Dashboard', icon: BarChart3 },
          { name: 'users', title: 'Users', icon: Users },
          { name: 'classes', title: 'Classes', icon: Settings },
          { name: 'reports', title: 'Reports', icon: FileText },
          { name: 'admin-config', title: 'Config', icon: Sliders },
          { name: 'settings', title: 'Settings', icon: Settings },
        ];
      default:
        return [
          { name: 'index', title: 'Home', icon: Home },
        ];
    }
  };

  const tabsConfig = getTabsConfig();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
      }}>
      {tabsConfig.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ size, color }) => (
              <tab.icon size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 5,
    paddingTop: 5,
  },
});