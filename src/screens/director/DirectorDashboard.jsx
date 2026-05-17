import React from 'react';
import DirectorLayout from '../../components/director/DirectorLayout';
import DirectorOverview from './DirectorOverview';

export default function DirectorDashboard({ navigation }) {
  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorDashboard">
      <DirectorOverview navigation={navigation} />
    </DirectorLayout>
  );
}