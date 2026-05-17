import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';
import { API_BASE_URL } from '../../config/api';

const { width } = Dimensions.get('window');

const FILTER_TYPES = ['All', 'Missed Patrols', 'Late Shift Starts', 'Incomplete Checklists', 'GPS Tamper', 'Low Battery', 'Mock Location'];

const DirectorAlertLogs = ({ navigation }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/director/alerts/exceptions`)
      .then(res => res.json())
      .then(json => {
        setAlerts(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch alerts:', err);
        setLoading(false);
      });
  }, []);

  const renderSeverityBadge = (status) => {
    switch (status) {
      case 'critical': return <View style={[styles.badge, { backgroundColor: '#ffebe9' }]}><Text style={[styles.badgeText, { color: theme.colors.error }]}>CRITICAL</Text></View>;
      case 'warning': return <View style={[styles.badge, { backgroundColor: '#fff8c5' }]}><Text style={[styles.badgeText, { color: '#9a6700' }]}>WARNING</Text></View>;
      case 'info': return <View style={[styles.badge, { backgroundColor: '#e0eaff' }]}><Text style={[styles.badgeText, { color: '#0047ff' }]}>INFO</Text></View>;
      default: return null;
    }
  };

  return (
    <DirectorLayout navigation={navigation} activeRoute="AlertLogs">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headline}>Alert Logs & Exceptions</Text>
          <Text style={styles.subtitle}>System-generated alerts for compliance and security failures.</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Search Officer</Text>
              <TextInput style={styles.filterInput} placeholder="Name or ID" />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <TextInput style={styles.filterInput} placeholder="Last 7 Days" editable={false} />
            </View>
          </View>
          
          <Text style={styles.filterLabel}>Alert Type Filter</Text>
          <View style={styles.chipsWrapper}>
            {FILTER_TYPES.map(type => (
              <TouchableOpacity 
                key={type} 
                style={[styles.chip, activeFilter === type && styles.chipActive]}
                onPress={() => setActiveFilter(type)}
              >
                <Text style={[styles.chipText, activeFilter === type && styles.chipTextActive]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.exportButtonSecondary}><Text style={styles.exportButtonTextSecondary}>Export CSV</Text></TouchableOpacity>
            <TouchableOpacity style={styles.exportButton}><Text style={styles.exportButtonText}>Mark All as Read</Text></TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>TIME</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>ALERT TYPE</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>OFFICER</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>SITE</Text>
            <Text style={[styles.th, { flex: 2 }]}>DETAILS</Text>
            <Text style={[styles.th, { flex: 1 }]}>SEVERITY</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : (
            alerts.filter(a => activeFilter === 'All' || a.type === activeFilter || a.type.includes(activeFilter.replace(/s$/, ''))).map(alert => (
              <View key={alert.id} style={[styles.tableRow, !alert.read && styles.tableRowUnread]}>
                <Text style={[styles.td, { flex: 1 }]}>{alert.time}</Text>
                <Text style={[styles.td, { flex: 1.5, fontWeight: '600' }]}>{alert.type}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{alert.officer}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{alert.site}</Text>
                <Text style={[styles.td, { flex: 2, fontSize: 13 }]}>{alert.details}</Text>
                <View style={{ flex: 1 }}>{renderSeverityBadge(alert.status)}</View>
              </View>
            ))
          )}
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
  
  chipsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.surfaceContainerLow, borderWidth: 1, borderColor: theme.colors.outlineVariant },
  chipActive: { backgroundColor: theme.colors.primaryContainer, borderColor: theme.colors.primaryContainer },
  chipText: { fontSize: 12, fontWeight: '500', color: theme.colors.onSurfaceVariant },
  chipTextActive: { color: '#FFF' },

  filterActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 16 },
  exportButton: { backgroundColor: theme.colors.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonText: { color: '#FFF', fontWeight: '700' },
  exportButtonSecondary: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonTextSecondary: { color: theme.colors.primaryContainer, fontWeight: '700' },

  tableCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 12, marginBottom: 8 },
  th: { ...theme.typography.label, color: theme.colors.outlineVariant, fontSize: 11, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow, alignItems: 'center' },
  tableRowUnread: { backgroundColor: theme.colors.primaryContainer + '0A' },
  td: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
});

export default DirectorAlertLogs;
