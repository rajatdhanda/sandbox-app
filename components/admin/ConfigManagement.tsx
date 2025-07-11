import React from 'react';
import { View } from 'react-native';
import AdminConfigScreen from '../../app/(tabs)/admin-config';

export const ConfigManagement: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <AdminConfigScreen />
    </View>
  );
};