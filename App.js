import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AreaManagerLogin from './src/screens/areaManager/AreaManagerLogin';
import RegionalDashboard from './src/screens/areaManager/RegionalDashboard';
import EodSummary from './src/screens/areaManager/EodSummary';
import RegionalLiveMap from './src/screens/areaManager/RegionalLiveMap';
import RegionalSOSConsole from './src/screens/areaManager/RegionalSOSConsole';
import IncidentHubReview from './src/screens/areaManager/IncidentHubReview';
import ShiftSiteMapping from './src/screens/areaManager/ShiftSiteMapping';

// Director Screens
import ExecutiveLoginPortal from './src/screens/director/ExecutiveLoginPortal';
import DirectorDashboard from './src/screens/director/DirectorDashboard';
import DirectorKPIDashboard from './src/screens/director/DirectorKPIDashboard';
import DirectorAlertLogs from './src/screens/director/DirectorAlertLogs';
import DirectorSiteAllocation from './src/screens/director/DirectorSiteAllocation';
import DirectorOfficerBenchmarking from './src/screens/director/DirectorOfficerBenchmarking';
import DirectorShiftEditor from './src/screens/director/DirectorShiftEditor';
import DirectorReportingModals from './src/screens/director/DirectorReportingModals';
import DirectorProfile from './src/screens/director/DirectorProfile';
import DirectorLiveMap from './src/screens/director/DirectorLiveMap';
import DirectorSOSConsole from './src/screens/director/DirectorSOSConsole';
import DirectorDailyReports from './src/screens/director/DirectorDailyReports';
import DirectorOfficerPerformance from './src/screens/director/DirectorOfficerPerformance';
import DirectorHistoricalTrends from './src/screens/director/DirectorHistoricalTrends';

// Supervisor Screens (For Testing)
import SupervisorNavigator from './src/screens/supervisor/SupervisorNavigator';

const Stack = createNativeStackNavigator();

console.log('App.js is evaluating...');

export default function App() {
  console.log('App component is rendering...');
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ExecutiveLogin" screenOptions={{ headerShown: false }}>
        {/* Supervisor Suite Entry for Testing */}
        <Stack.Screen name="SupervisorSuite" component={SupervisorNavigator} />
        
        {/* Entry Portal */}
        <Stack.Screen name="ExecutiveLogin" component={ExecutiveLoginPortal} />
        
        {/* Director App Routes */}
        <Stack.Screen name="DirectorDashboard" component={DirectorDashboard} />
        <Stack.Screen name="DirectorKPI" component={DirectorKPIDashboard} />
        <Stack.Screen name="AlertLogs" component={DirectorAlertLogs} />
        <Stack.Screen name="SiteAllocation" component={DirectorSiteAllocation} />
        <Stack.Screen name="OfficerBenchmarking" component={DirectorOfficerBenchmarking} />
        <Stack.Screen name="ShiftEditor" component={DirectorShiftEditor} />
        <Stack.Screen name="ReportingModals" component={DirectorReportingModals} />
        <Stack.Screen name="DirectorProfile" component={DirectorProfile} />
        <Stack.Screen name="DirectorLiveMap" component={DirectorLiveMap} />
        <Stack.Screen name="DirectorSOSConsole" component={DirectorSOSConsole} />
        <Stack.Screen name="DirectorDailyReports" component={DirectorDailyReports} />
        <Stack.Screen name="DirectorOfficerPerformance" component={DirectorOfficerPerformance} />
        <Stack.Screen name="DirectorHistoricalTrends" component={DirectorHistoricalTrends} />

        {/* Area Manager App Routes */}
        <Stack.Screen name="Login" component={AreaManagerLogin} />
        <Stack.Screen name="Dashboard" component={RegionalDashboard} />
        <Stack.Screen name="EodSummary" component={EodSummary} />
        <Stack.Screen name="RegionalLiveMap" component={RegionalLiveMap} />
        <Stack.Screen name="RegionalSOSConsole" component={RegionalSOSConsole} />
        <Stack.Screen name="IncidentHubReview" component={IncidentHubReview} />
        <Stack.Screen name="ShiftSiteMapping" component={ShiftSiteMapping} />

        {/* Director App Routes (Placeholders to be built) */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}