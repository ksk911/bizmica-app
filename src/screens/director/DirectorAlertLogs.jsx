import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorAlertLogs = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="AlertLogs" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Alert Logs & Escalations</Text>
            <Text style={styles.subtitle}>Unified console for reviewing and escalating critical regional incidents.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>TIME</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>INCIDENT</Text>
              <Text style={[styles.tableHeaderCell, { flex: 2 }]}>LOCATION</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>SEVERITY</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>STATUS</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>ACTION</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>10:42 AM</Text>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>#INC-9942</Text>
                <Text style={styles.tableCellSub}>Perimeter Breach</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>Mumbai Sector Alpha</Text>
                <Text style={styles.tableCellSub}>Zone 7 Gate</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <View style={styles.badgeCritical}><Text style={styles.badgeTextCritical}>CRITICAL</Text></View>
              </View>
              <Text style={[styles.tableCellStatus, { flex: 1, color: theme.colors.error }]}>Active</Text>
              <TouchableOpacity style={[styles.actionBtn, { flex: 1 }]}><Text style={styles.actionBtnText}>Escalate</Text></TouchableOpacity>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>09:15 AM</Text>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>#INC-9941</Text>
                <Text style={styles.tableCellSub}>Shift Missed</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>Delhi NCR Hub</Text>
                <Text style={styles.tableCellSub}>Loading Dock B</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <View style={styles.badgeWarning}><Text style={styles.badgeTextWarning}>HIGH</Text></View>
              </View>
              <Text style={[styles.tableCellStatus, { flex: 1 }]}>Resolved</Text>
              <TouchableOpacity style={[styles.actionBtnSecondary, { flex: 1 }]}><Text style={styles.actionBtnTextSecondary}>View</Text></TouchableOpacity>
            </View>

            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1 }]}>07:02 AM</Text>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>#INC-9938</Text>
                <Text style={styles.tableCellSub}>Equipment Failure</Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.tableCellData}>Bangalore South</Text>
                <Text style={styles.tableCellSub}>CCTV Node 3</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start' }}>
                <View style={styles.badgeLow}><Text style={styles.badgeTextLow}>LOW</Text></View>
              </View>
              <Text style={[styles.tableCellStatus, { flex: 1, color: '#34a853' }]}>Closed</Text>
              <TouchableOpacity style={[styles.actionBtnSecondary, { flex: 1 }]}><Text style={styles.actionBtnTextSecondary}>View</Text></TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  layout: { flex: 1, flexDirection: 'row' },
  layoutMobile: { flexDirection: 'column' },
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 64, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 48 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },
  card: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }) },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 16, marginBottom: 8 },
  tableHeaderCell: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow, paddingVertical: 18 },
  tableCell: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  tableCellData: { ...theme.typography.bodyMd, color: theme.colors.primaryContainer, fontWeight: '600' },
  tableCellSub: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant, fontSize: 12, marginTop: 4 },
  tableCellStatus: { ...theme.typography.bodyMd, color: theme.colors.secondary, fontWeight: '600' },
  badgeCritical: { backgroundColor: '#ffebe9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTextCritical: { color: theme.colors.error, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  badgeWarning: { backgroundColor: '#fff8c5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTextWarning: { color: '#9a6700', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  badgeLow: { backgroundColor: '#e6f4ea', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeTextLow: { color: '#137333', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  actionBtn: { backgroundColor: theme.colors.error, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  actionBtnText: { color: theme.colors.onPrimary, fontSize: 12, fontWeight: '600' },
  actionBtnSecondary: { backgroundColor: theme.colors.surfaceContainerLow, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6, alignItems: 'center' },
  actionBtnTextSecondary: { color: theme.colors.primaryContainer, fontSize: 12, fontWeight: '600' },
});

export default DirectorAlertLogs;
