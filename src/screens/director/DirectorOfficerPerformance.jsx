import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width } = Dimensions.get('window');

const MOCK_PERFORMANCE = [
  { id: '1', name: 'Rajesh Kumar', site: 'New Delhi HQ', punctuality: 98, completion: 96, avgTime: '2.4m', incidents: 12, observations: 45, missed: 0 },
  { id: '2', name: 'Priya Sharma', site: 'Mumbai Sector A', punctuality: 95, completion: 94, avgTime: '2.8m', incidents: 8, observations: 32, missed: 1 },
  { id: '3', name: 'Amit Patel', site: 'Bangalore Campus', punctuality: 88, completion: 91, avgTime: '3.1m', incidents: 5, observations: 21, missed: 3 },
];

const DirectorOfficerPerformance = ({ navigation }) => {
  const renderGauge = (value, color) => (
    <View style={styles.gaugeContainer}>
      <View style={styles.gaugeTrack}>
        <View style={[styles.gaugeFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.gaugeValue, { color }]}>{value}%</Text>
    </View>
  );

  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorOfficerPerformance">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headline}>Officer Performance</Text>
          <Text style={styles.subtitle}>Individual KPI tracking and analytics across all sites.</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Search</Text>
              <TextInput style={styles.filterInput} placeholder="Officer Name or ID" />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Site</Text>
              <TextInput style={styles.filterInput} placeholder="All Sites" editable={false} />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Period</Text>
              <TextInput style={styles.filterInput} placeholder="This Month" editable={false} />
            </View>
          </View>
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.exportButtonSecondary}><Text style={styles.exportButtonTextSecondary}>Export Excel</Text></TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}><Text style={styles.exportButtonText}>Generate PDF Report</Text></TouchableOpacity>
          </View>
        </View>

        {/* Officer Cards */}
        <View style={styles.cardsGrid}>
          {MOCK_PERFORMANCE.map(officer => (
            <View key={officer.id} style={styles.officerCard}>
              <View style={styles.officerHeader}>
                <View>
                  <Text style={styles.officerName}>{officer.name}</Text>
                  <Text style={styles.officerSite}>{officer.site}</Text>
                </View>
                <TouchableOpacity style={styles.detailsBtn}><Text style={styles.detailsBtnText}>Details</Text></TouchableOpacity>
              </View>

              <View style={styles.metricsRow}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Punctuality</Text>
                  {renderGauge(officer.punctuality, officer.punctuality > 90 ? '#4CAF50' : '#FF9800')}
                </View>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Completion Rate</Text>
                  {renderGauge(officer.completion, officer.completion > 95 ? '#4CAF50' : '#FF9800')}
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{officer.avgTime}</Text>
                  <Text style={styles.statLabel}>Avg Time/Checkpoint</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: theme.colors.error }]}>{officer.incidents}</Text>
                  <Text style={styles.statLabel}>Incidents Reported</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{officer.observations}</Text>
                  <Text style={styles.statLabel}>Observations</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: officer.missed > 0 ? theme.colors.error : '#4CAF50' }]}>{officer.missed}</Text>
                  <Text style={styles.statLabel}>Missed Patrols</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </DirectorLayout>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 32, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 32 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },

  filterCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  filterRow: { flexDirection: width > 768 ? 'row' : 'column', gap: 16, marginBottom: 16 },
  filterGroup: { flex: 1 },
  filterLabel: { ...theme.typography.label, color: theme.colors.outlineVariant, marginBottom: 8 },
  filterInput: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, padding: 12, ...theme.typography.bodyMd },
  filterActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 16 },
  exportButton: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonText: { color: '#FFF', fontWeight: '700' },
  exportButtonSecondary: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonTextSecondary: { color: theme.colors.primaryContainer, fontWeight: '700' },

  cardsGrid: { flexDirection: width > 1024 ? 'row' : 'column', flexWrap: 'wrap', gap: 24 },
  officerCard: {
    flex: width > 1024 ? 0.48 : 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  officerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  officerName: { ...theme.typography.title, color: theme.colors.primaryContainer, fontSize: 18, marginBottom: 4 },
  officerSite: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
  detailsBtn: { backgroundColor: theme.colors.surfaceContainerLow, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  detailsBtnText: { ...theme.typography.bodySm, color: theme.colors.primary, fontWeight: '700' },

  metricsRow: { marginBottom: 24 },
  metricCol: { marginBottom: 16 },
  metricLabel: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant, marginBottom: 8 },
  gaugeContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  gaugeTrack: { flex: 1, height: 8, backgroundColor: theme.colors.outlineVariant, borderRadius: 4, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 4 },
  gaugeValue: { ...theme.typography.bodyMd, fontWeight: '700', width: 45, textAlign: 'right' },

  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 20 },
  statBox: { flex: 1, minWidth: '40%' },
  statValue: { ...theme.typography.headline, fontSize: 24, fontWeight: '800', color: theme.colors.primaryContainer, marginBottom: 4 },
  statLabel: { ...theme.typography.bodySm, color: theme.colors.outline, fontSize: 11 },
});

export default DirectorOfficerPerformance;
