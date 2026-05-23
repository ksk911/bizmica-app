import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Demo Launcher
import DemoLauncher from './src/screens/DemoLauncher';

// Area Manager Screens
import AreaManagerLogin from './src/screens/areaManager/AreaManagerLogin';
import RegionalDashboard from './src/screens/areaManager/RegionalDashboard';
import EodSummary from './src/screens/areaManager/EodSummary';
import RegionalLiveMap from './src/screens/areaManager/RegionalLiveMap';
import RegionalSOSConsole from './src/screens/areaManager/RegionalSOSConsole';
import IncidentHubReview from './src/screens/areaManager/IncidentHubReview';
import ShiftSiteMapping from './src/screens/areaManager/ShiftSiteMapping';
import GeofenceDrawingMap from './src/screens/areaManager/GeofenceDrawingMap';

// Director Screens
import ExecutiveLoginPortal from './src/screens/director/ExecutiveLoginPortal';
import DirectorDashboard from './src/screens/director/DirectorDashboard';
import DirectorKPIDashboard from './src/screens/director/DirectorKPIDashboard';
import DirectorAlertLogs from './src/screens/director/DirectorAlertLogs';
import DirectorSiteAllocation from './src/screens/director/DirectorSiteAllocation';
import DirectorOfficerBenchmarking from './src/screens/director/DirectorOfficerBenchmarking';
import DirectorShiftEditor from './src/screens/director/DirectorShiftEditor';
import DirectorReportingModals from './src/screens/director/DirectorReportingModals';

// Supervisor Suite
import SupervisorNavigator from './src/screens/supervisor/SupervisorNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DemoLauncher" screenOptions={{ headerShown: false }}>

        {/* ---- DEMO ENTRY POINT ---- */}
        <Stack.Screen name="DemoLauncher" component={DemoLauncher} />

        {/* ---- SUPERVISOR FLOW ---- */}
        <Stack.Screen name="SupervisorSuite" component={SupervisorNavigator} />

        {/* ---- AREA MANAGER FLOW ---- */}
        <Stack.Screen name="Login" component={AreaManagerLogin} />
        <Stack.Screen name="Dashboard" component={RegionalDashboard} />
        <Stack.Screen name="EodSummary" component={EodSummary} />
        <Stack.Screen name="RegionalLiveMap" component={RegionalLiveMap} />
        <Stack.Screen name="RegionalSOSConsole" component={RegionalSOSConsole} />
        <Stack.Screen name="IncidentHubReview" component={IncidentHubReview} />
        <Stack.Screen name="ShiftSiteMapping" component={ShiftSiteMapping} />
        <Stack.Screen name="GeofenceDrawingMap" component={GeofenceDrawingMap} />

        {/* ---- DIRECTOR FLOW ---- */}
        <Stack.Screen name="ExecutiveLogin" component={ExecutiveLoginPortal} />
        <Stack.Screen name="DirectorDashboard" component={DirectorDashboard} />
        <Stack.Screen name="DirectorKPI" component={DirectorKPIDashboard} />
        <Stack.Screen name="AlertLogs" component={DirectorAlertLogs} />
        <Stack.Screen name="SiteAllocation" component={DirectorSiteAllocation} />
        <Stack.Screen name="OfficerBenchmarking" component={DirectorOfficerBenchmarking} />
        <Stack.Screen name="ShiftEditor" component={DirectorShiftEditor} />
        <Stack.Screen name="ReportingModals" component={DirectorReportingModals} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}