import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { theme } from './ExecutiveLoginPortal';

const { width } = Dimensions.get('window');

const KPI_DATA = {
  activeSites: 142,
  activeOfficers: 847,
  completionRate: 94.5,
  missedPatrols: 12,
  openIncidents: 23,
  closedIncidents: 18,
  topSites: [
    { id: '1', name: 'New Delhi HQ', completion: 98, incidents: 2, score: 96 },
    { id: '2', name: 'Chennai Tech Park', completion: 97, incidents: 1, score: 95 },
    { id: '3', name: 'Mumbai Financial', completion: 96, incidents: 3, score: 94 },
    { id: '4', name: 'Bangalore Campus A', completion: 95, incidents: 2, score: 92 },
    { id: '5', name: 'Pune IT Zone', completion: 94, incidents: 4, score: 90 },
  ],
  bottomSites: [
    { id: '6', name: 'Kolkata Dockyard', completion: 72, critical: 5, action: 'Review Security Roster' },
    { id: '7', name: 'Ahmedabad Mill', completion: 76, critical: 3, action: 'Equipment Audit Required' },
    { id: '8', name: 'Hyderabad Sector 4', completion: 79, critical: 2, action: 'Increase Patrol Frequency' },
    { id: '9', name: 'Noida Warehouse B', completion: 81, critical: 4, action: 'Investigate Late Shifts' },
    { id: '10', name: 'Gurgaon Tower', completion: 82, critical: 1, action: 'Checklist Compliance Warning' },
  ]
};

const DirectorOverview = ({ navigation }) => {
  const renderMetricCard = (title, value, color) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headline}>Executive Dashboard</Text>
        <Text style={styles.subtitle}>Global analytics across all sites and clients.</Text>
      </View>

      {/* Top Metrics Grid */}
      <View style={styles.metricsGrid}>
        {renderMetricCard('Active Sites', KPI_DATA.activeSites, theme.colors.primary)}
        {renderMetricCard('Active Officers', KPI_DATA.activeOfficers, theme.colors.primaryContainer)}
        {renderMetricCard('Completion Rate', `${KPI_DATA.completionRate}%`, '#4CAF50')}
        {renderMetricCard('Missed Patrols', KPI_DATA.missedPatrols, '#FF9800')}
        {renderMetricCard('Open Incidents', KPI_DATA.openIncidents, theme.colors.error)}
        {renderMetricCard('Closed Incidents', KPI_DATA.closedIncidents, '#4CAF50')}
      </View>

      <View style={styles.row}>
        {/* Top 5 Sites */}
        <View style={styles.tableCard}>
          <Text style={styles.cardTitle}>Top 5 Performing Sites</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>SITE</Text>
            <Text style={[styles.th, { flex: 1 }]}>COMPLETION</Text>
            <Text style={[styles.th, { flex: 1 }]}>INCIDENTS</Text>
            <Text style={[styles.th, { flex: 1 }]}>SCORE</Text>
          </View>
          {KPI_DATA.topSites.map(site => (
            <View key={site.id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>{site.name}</Text>
              <Text style={[styles.td, { flex: 1, color: '#4CAF50' }]}>{site.completion}%</Text>
              <Text style={[styles.td, { flex: 1 }]}>{site.incidents}</Text>
              <Text style={[styles.td, { flex: 1 }]}>{site.score}</Text>
            </View>
          ))}
        </View>

        {/* Bottom 5 Sites */}
        <View style={styles.tableCard}>
          <Text style={styles.cardTitle}>Bottom 5 Underperforming Sites</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 2 }]}>SITE</Text>
            <Text style={[styles.th, { flex: 1 }]}>COMPLETION</Text>
            <Text style={[styles.th, { flex: 1 }]}>CRITICAL</Text>
            <Text style={[styles.th, { flex: 2 }]}>RECOMMENDED ACTION</Text>
          </View>
          {KPI_DATA.bottomSites.map(site => (
            <View key={site.id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 2, fontWeight: '600' }]}>{site.name}</Text>
              <Text style={[styles.td, { flex: 1, color: theme.colors.error }]}>{site.completion}%</Text>
              <Text style={[styles.td, { flex: 1 }]}>{site.critical}</Text>
              <Text style={[styles.td, { flex: 2, color: '#FF9800', fontSize: 11 }]}>{site.action}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Placeholder Charts */}
      <View style={styles.chartSection}>
        <Text style={styles.cardTitle}>Trend Analysis</Text>
        <View style={styles.chartGrid}>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderLabel}>📊 Weekly/Monthly Completion Trend</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderLabel}>📈 Incident Trend (Open vs Closed)</Text>
          </View>
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderLabel}>🕒 Shift Adherence Rate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 32, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 32 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },
  
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  metricCard: {
    flex: 1, minWidth: width > 768 ? 150 : '45%',
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 12, padding: 20, borderLeftWidth: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  metricTitle: { ...theme.typography.bodySm, color: theme.colors.outlineVariant, marginBottom: 8 },
  metricValue: { ...theme.typography.headline, fontSize: 28, fontWeight: '800' },
  
  row: { flexDirection: width > 1024 ? 'row' : 'column', gap: 24, marginBottom: 32 },
  tableCard: {
    flex: 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  cardTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 20 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 12, marginBottom: 8 },
  th: { ...theme.typography.label, color: theme.colors.outlineVariant, fontSize: 11, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow },
  td: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },

  chartSection: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24, marginBottom: 32 },
  chartGrid: { flexDirection: width > 768 ? 'row' : 'column', gap: 16 },
  chartPlaceholder: {
    flex: 1, minHeight: 200, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  placeholderLabel: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant, textAlign: 'center' },
});

export default DirectorOverview;
