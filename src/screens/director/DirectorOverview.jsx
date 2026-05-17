import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from './ExecutiveLoginPortal';

const { width } = Dimensions.get('window');

// Mock data moved from DirectorDashboard
export const MOCK_DATA = {
  livePersonnel: [
    { id: '1', name: 'Rajesh Kumar', role: 'Field Officer', site: 'New Delhi HQ', status: 'active', lat: 28.6139, lng: 77.2090, lastUpdate: '2 mins ago' },
    { id: '2', name: 'Priya Sharma', role: 'Supervisor', site: 'Mumbai Sector', status: 'active', lat: 19.0760, lng: 72.8777, lastUpdate: '5 mins ago' },
  ],
  criticalEvents: [
    { id: '1', title: 'Perimeter Breach', location: 'New Delhi Zone 7', severity: 'critical', time: '10:32 AM', status: 'open' },
    { id: '2', title: 'Unauthorized Access', location: 'Mumbai Sector A', severity: 'high', time: '09:15 AM', status: 'investigating' },
    { id: '3', title: 'Equipment Malfunction', location: 'Bangalore Campus', severity: 'medium', time: '08:45 AM', status: 'resolved' },
  ],
  performanceMetrics: {
    totalPersonnel: 1420,
    activePatrols: 847,
    completionRate: 94.5,
    avgResponseTime: 3.2,
    incidentsToday: 23,
    resolvedIncidents: 18,
    escalationAlerts: 4,
    sosActive: 1,
  },
  escalationMatrix: [
    { id: '1', incident: 'Perimeter Breach - New Delhi', level: 'Level 1', assignedTo: 'Area Manager', timeElapsed: '2.5 hrs', sla: '4 hrs', status: 'pending' },
    { id: '2', incident: 'Security Camera Failure', level: 'Level 2', assignedTo: 'Director', timeElapsed: '6 hrs', sla: '4 hrs', status: 'escalated' },
  ],
  notifications: [
    { id: '1', title: 'New incident reported', message: 'Perimeter breach in New Delhi Zone', time: '5 mins ago', read: false },
    { id: '2', title: 'SOS Alert', message: 'Officer Rajesh Kumar sent SOS', time: '15 mins ago', read: false },
  ]
};

const DirectorOverview = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderMetricCard = (title, value, subtitle, color) => (
    <View style={[styles.metricCard, { borderTopColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderCriticalEvent = ({ item }) => (
    <View style={[styles.eventItem, item.severity === 'critical' && styles.criticalEvent]}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={[styles.eventStatus, 
          item.status === 'open' && styles.statusOpen,
          item.status === 'investigating' && styles.statusInvestigating,
          item.status === 'resolved' && styles.statusResolved
        ]}>
          <Text style={styles.eventStatusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.eventLocation}>{item.location}</Text>
      <Text style={styles.eventTime}>{item.time}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headline}>National Strategic Oversight — India</Text>
        <Text style={styles.subtitle}>
          Real-time intelligence • All clients • All sites • High-level analytics
        </Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {renderMetricCard('Active Personnel', MOCK_DATA.performanceMetrics.activePatrols, 'out of 1,420 total', theme.colors.primary)}
        {renderMetricCard('Completion Rate', `${MOCK_DATA.performanceMetrics.completionRate}%`, 'last 24 hours', '#4CAF50')}
        {renderMetricCard('Avg Response', `${MOCK_DATA.performanceMetrics.avgResponseTime} min`, 'to incidents', '#FF9800')}
        {renderMetricCard('Active SOS', MOCK_DATA.performanceMetrics.sosActive, 'emergency alerts', theme.colors.error)}
      </View>

      {/* Critical Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Critical Events & Alerts</Text>
        <FlatList
          data={MOCK_DATA.criticalEvents}
          renderItem={renderCriticalEvent}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* Escalation Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Escalation Alerts</Text>
        {MOCK_DATA.escalationMatrix.map(item => (
          <View key={item.id} style={styles.escalationCard}>
            <View style={styles.escalationHeader}>
              <Text style={styles.escalationTitle}>{item.incident}</Text>
              <View style={[styles.escalationBadge, 
                item.status === 'escalated' && styles.escalatedBadge]}>
                <Text style={styles.escalationBadgeText}>{item.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.escalationDetails}>
              Level: {item.level} | Assigned: {item.assignedTo} | Time: {item.timeElapsed} / {item.sla}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: width > 1024 ? 64 : 24, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: width > 1024 ? 48 : 32 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },
  
  tabBar: { flexDirection: 'row', marginBottom: 32, gap: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant },
  tab: { paddingVertical: 12, paddingHorizontal: 20 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: theme.colors.primary },
  tabText: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  activeTabText: { color: theme.colors.primary, fontWeight: '700' },
  
  metricsGrid: { flexDirection: width > 1024 ? 'row' : 'column', gap: 20, marginBottom: 32 },
  metricCard: {
    flex: 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    borderTopWidth: 4, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 2,
  },
  metricTitle: { ...theme.typography.label, color: theme.colors.outlineVariant, marginBottom: 12 },
  metricValue: { ...theme.typography.headline, fontSize: 32, fontWeight: '800', marginBottom: 8 },
  metricSubtitle: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
  
  section: { marginBottom: 40 },
  sectionTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 20 },
  
  eventItem: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: theme.colors.outlineVariant,
  },
  criticalEvent: { backgroundColor: '#FFF5F5', borderColor: theme.colors.error },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventTitle: { ...theme.typography.bodyMd, fontWeight: '700', color: theme.colors.onSurface, flex: 1 },
  eventStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusOpen: { backgroundColor: theme.colors.error + '20' },
  statusInvestigating: { backgroundColor: '#FF9800' + '20' },
  statusResolved: { backgroundColor: '#4CAF50' + '20' },
  eventStatusText: { fontSize: 11, fontWeight: '700' },
  eventLocation: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant, marginBottom: 4 },
  eventTime: { ...theme.typography.bodySm, color: theme.colors.outline, fontSize: 12 },
  
  escalationCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 12, padding: 16,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#FF9800',
  },
  escalationHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  escalationTitle: { ...theme.typography.bodyMd, fontWeight: '600' },
  escalationBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: '#FF9800' + '20' },
  escalatedBadge: { backgroundColor: theme.colors.error + '20' },
  escalationBadgeText: { fontSize: 11, fontWeight: '700', color: theme.colors.error },
  escalationDetails: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
});

export default DirectorOverview;
