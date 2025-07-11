import React from 'react';
import { View } from 'react-native';
import ReportsScreen from '../../app/(tabs)/reports';

export const ReportsModule: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <ReportsScreen />
    </View>
  );
};