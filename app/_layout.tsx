import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { RoleRouter } from '@/components/RoleRouter';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <RoleRouter />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
