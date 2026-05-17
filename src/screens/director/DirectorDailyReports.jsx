import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';
import { API_BASE_URL } from '../../config/api';

const { width } = Dimensions.get('window');

const DirectorDailyReports = ({ navigation }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/director/reports/daily-patrol`)
      .then(res => res.json())
      .then(json => {
        setReports(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch daily reports:', err);
        setLoading(false);
      });
  }, []);

  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorDailyReports">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headline}>Daily Patrol Reports</Text>
          <Text style={styles.subtitle}>View and download complete daily patrol logs from all sites globally.</Text>
        </View>

        {/* Filters */}
        <View style={styles.filterCard}>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Date Range</Text>
              <TextInput style={styles.filterInput} placeholder="Select Date Range" editable={false} />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Company</Text>
              <TextInput style={styles.filterInput} placeholder="All Companies" editable={false} />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Site</Text>
              <TextInput style={styles.filterInput} placeholder="All Sites" editable={false} />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Officer Search</Text>
              <TextInput style={styles.filterInput} placeholder="Search by name or ID..." />
            </View>
          </View>
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportButtonText}>Bulk Export PDF</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableCard}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, { flex: 1 }]}>DATE</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>OFFICER</Text>
            <Text style={[styles.th, { flex: 1.5 }]}>SITE</Text>
            <Text style={[styles.th, { flex: 1 }]}>COMPLETION</Text>
            <Text style={[styles.th, { flex: 1 }]}>INCIDENTS</Text>
            <Text style={[styles.th, { flex: 1 }]}>OBSERVATIONS</Text>
            <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>EXPORT</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : (
            reports.map(report => (
              <View key={report.id} style={styles.tableRow}>
                <Text style={[styles.td, { flex: 1 }]}>{report.date}</Text>
                <Text style={[styles.td, { flex: 1.5, fontWeight: '600' }]}>{report.officer}</Text>
                <Text style={[styles.td, { flex: 1.5 }]}>{report.site}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.td, { color: report.completion < 90 ? theme.colors.error : '#4CAF50', fontWeight: '700' }]}>{report.completion}%</Text>
                </View>
                <Text style={[styles.td, { flex: 1, color: report.incidents > 0 ? theme.colors.error : theme.colors.onSurfaceVariant }]}>{report.incidents}</Text>
                <Text style={[styles.td, { flex: 1 }]}>{report.observations}</Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity style={styles.pdfButton}><Text style={styles.pdfButtonText}>📄 View</Text></TouchableOpacity>
                </View>
              </View>
            ))
          )}
          
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>Showing 1-4 of 1,248 reports</Text>
            <View style={styles.pageControls}>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageButtonText}>Prev</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.pageButton, styles.pageButtonActive]}><Text style={styles.pageButtonTextActive}>1</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageButtonText}>2</Text></TouchableOpacity>
              <TouchableOpacity style={styles.pageButton}><Text style={styles.pageButtonText}>Next</Text></TouchableOpacity>
            </View>
          </View>
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
  filterActions: { flexDirection: 'row', justifyContent: 'flex-end', borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 16 },
  exportButton: { backgroundColor: theme.colors.secondary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  exportButtonText: { color: '#FFF', fontWeight: '700' },

  tableCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingBottom: 12, marginBottom: 8 },
  th: { ...theme.typography.label, color: theme.colors.outlineVariant, fontSize: 11, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow, alignItems: 'center' },
  td: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  
  pdfButton: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: theme.colors.surfaceContainerHigh, borderRadius: 6 },
  pdfButtonText: { ...theme.typography.bodySm, color: theme.colors.primary, fontWeight: '700' },

  pagination: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 16 },
  paginationText: { ...theme.typography.bodySm, color: theme.colors.outlineVariant },
  pageControls: { flexDirection: 'row', gap: 8 },
  pageButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6, backgroundColor: theme.colors.surfaceContainerLow },
  pageButtonActive: { backgroundColor: theme.colors.primary },
  pageButtonText: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
  pageButtonTextActive: { ...theme.typography.bodySm, color: '#FFF', fontWeight: '700' },
});

export default DirectorDailyReports;
