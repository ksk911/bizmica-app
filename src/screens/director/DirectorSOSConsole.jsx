import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width } = Dimensions.get('window');

const MOCK_SOS = [
  { id: 'SOS-8891', officer: 'Rajesh Kumar', site: 'New Delhi Zone 7', time: '10:32 AM', status: 'open', location: 'Gate 4', timeSince: '2 hours ago' },
  { id: 'SOS-8890', officer: 'Priya Sharma', site: 'Mumbai Sector A', time: '09:15 AM', status: 'acknowledged', location: 'Basement Parking', timeSince: '3 hours ago', responseTime: '4 mins' },
  { id: 'SOS-8885', officer: 'Amit Patel', site: 'Bangalore Campus', time: 'Yesterday', status: 'investigating', location: 'Server Room', timeSince: '1 day ago', responseTime: '2 mins' },
  { id: 'SOS-8872', officer: 'Sneha Reddy', site: 'Chennai Zone', time: '05 May 2026', status: 'resolved', location: 'Perimeter Wall', timeSince: '12 days ago', responseTime: '7 mins' },
];

const DirectorSOSConsole = ({ navigation }) => {
  const [filterStatus, setFilterStatus] = useState('all');

  const renderBadge = (status) => {
    switch (status) {
      case 'open': return <View style={[styles.badge, styles.badgeOpen]}><Text style={styles.badgeTextOpen}>OPEN</Text></View>;
      case 'acknowledged': return <View style={[styles.badge, styles.badgeAck]}><Text style={styles.badgeTextAck}>ACKNOWLEDGED</Text></View>;
      case 'investigating': return <View style={[styles.badge, styles.badgeInv]}><Text style={styles.badgeTextInv}>INVESTIGATING</Text></View>;
      case 'resolved': return <View style={[styles.badge, styles.badgeResolved]}><Text style={styles.badgeTextResolved}>RESOLVED</Text></View>;
      default: return null;
    }
  };

  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorSOSConsole">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headline}>SOS Monitoring Console</Text>
          <Text style={styles.subtitle}>Centralized read-only view of all emergency SOS events globally.</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Date Range</Text>
            <TextInput style={styles.filterInput} placeholder="Last 7 Days" editable={false} />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Site</Text>
            <TextInput style={styles.filterInput} placeholder="All Sites" editable={false} />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status Filter</Text>
            <View style={styles.statusFiltersRow}>
              {['all', 'open', 'acknowledged', 'resolved'].map(s => (
                <TouchableOpacity 
                  key={s} 
                  style={[styles.statusChip, filterStatus === s && styles.statusChipActive]}
                  onPress={() => setFilterStatus(s)}
                >
                  <Text style={[styles.statusChipText, filterStatus === s && styles.statusChipTextActive]}>
                    {s.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>TICKET ID</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>OFFICER</Text>
            <Text style={[styles.th, { flex: 2 }]}>SITE & LOCATION</Text>
            <Text style={[styles.th, { flex: 1 }]}>TRIGGERED</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>STATUS</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>ACTIONS</Text>
          </View>

          {MOCK_SOS.filter(s => filterStatus === 'all' || s.status === filterStatus).map(ticket => (
            <View key={ticket.id} style={styles.tableRow}>
              <Text style={[styles.td, { flex: 1, fontWeight: '700', color: theme.colors.primary }]}>{ticket.id}</Text>
              <Text style={[styles.td, { flex: 1.5 }]}>{ticket.officer}</Text>
              <View style={{ flex: 2 }}>
                <Text style={styles.tdData}>{ticket.site}</Text>
                <Text style={styles.tdSub}>{ticket.location}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.tdData}>{ticket.time}</Text>
                <Text style={styles.tdSub}>{ticket.timeSince}</Text>
              </View>
              <View style={{ flex: 1.5, alignItems: 'flex-start' }}>
                {renderBadge(ticket.status)}
                {ticket.responseTime && <Text style={styles.tdSub}>Response: {ticket.responseTime}</Text>}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                <TouchableOpacity style={styles.actionBtnSecondary}><Text style={styles.actionBtnTextSecondary}>View</Text></TouchableOpacity>
                <TouchableOpacity style={styles.actionBtnSecondary}><Text style={styles.actionBtnTextSecondary}>PDF</Text></TouchableOpacity>
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
    marginBottom: 24, flexDirection: width > 768 ? 'row' : 'column', gap: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  filterGroup: { flex: 1 },
  filterLabel: { ...theme.typography.label, color: theme.colors.outlineVariant, marginBottom: 8 },
  filterInput: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, padding: 12, ...theme.typography.bodyMd },
  statusFiltersRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusChip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: theme.colors.surfaceContainerLow },
  statusChipActive: { backgroundColor: theme.colors.primary },
  statusChipText: { fontSize: 11, fontWeight: '600', color: theme.colors.onSurfaceVariant },
  statusChipTextActive: { color: '#FFF' },

  tableCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 12, marginBottom: 8 },
  th: { ...theme.typography.label, color: theme.colors.outlineVariant, fontSize: 11, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow, alignItems: 'center' },
  td: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  tdData: { ...theme.typography.bodyMd, color: theme.colors.primaryContainer, fontWeight: '600' },
  tdSub: { ...theme.typography.bodySm, color: theme.colors.outline, fontSize: 11, marginTop: 4 },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, alignSelf: 'flex-start' },
  badgeOpen: { backgroundColor: '#ffebe9' }, badgeTextOpen: { color: theme.colors.error, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  badgeAck: { backgroundColor: '#fff8c5' }, badgeTextAck: { color: '#9a6700', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  badgeInv: { backgroundColor: '#e0eaff' }, badgeTextInv: { color: '#0047ff', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  badgeResolved: { backgroundColor: '#e6f4ea' }, badgeTextResolved: { color: '#137333', fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  actionBtnSecondary: { backgroundColor: theme.colors.surfaceContainerLow, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, alignItems: 'center' },
  actionBtnTextSecondary: { color: theme.colors.primaryContainer, fontSize: 12, fontWeight: '600' },
});

export default DirectorSOSConsole;
