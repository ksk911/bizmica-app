import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const API_BASE = 'http://192.168.1.7:5000'; // Make sure this matches your PC's IP

export default function PatrolHistory() {
  const navigation = useNavigation();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // All, Pending, Resolved

  const fetchIncidents = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents`);
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      console.error('Fetch incidents error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    // Refresh every 10 seconds to catch closures from Area Manager
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const filteredIncidents = incidents.filter(i => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return i.status !== 'CLOSED';
    if (filter === 'Resolved') return i.status === 'CLOSED';
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="#002e85" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patrol History & Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.filterSection}>
          {['All', 'Pending', 'Resolved'].map(f => (
            <TouchableOpacity 
              key={f}
              style={filter === f ? styles.filterChipActive : styles.filterChip}
              onPress={() => setFilter(f)}
            >
              <Text style={filter === f ? styles.filterTextActive : styles.filterText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#002e85" style={{ marginTop: 40 }} />
        ) : filteredIncidents.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="fact-check" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No {filter.toLowerCase()} incidents found.</Text>
          </View>
        ) : (
          filteredIncidents.map((incident) => (
            <View key={incident.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                {incident.status === 'CLOSED' ? (
                  <View style={styles.badgeSuccess}>
                    <MaterialIcons name="verified" size={14} color="#002e85" />
                    <Text style={styles.badgeSuccessText}>RESOLVED</Text>
                  </View>
                ) : (
                  <View style={styles.badgeWarning}>
                    <MaterialIcons name="warning" size={14} color="#93000a" />
                    <Text style={styles.badgeWarningText}>PENDING</Text>
                  </View>
                )}
                <Text style={styles.reportTime}>{formatTime(incident.opened_at)}</Text>
              </View>
              <Text style={styles.reportTitle}>{incident.incident_type || 'Incident Report'}</Text>
              <Text style={styles.reportDesc}>{incident.description}</Text>
              <View style={styles.reportFooter}>
                <View style={styles.officerInfo}>
                  <MaterialIcons name="person" size={16} color="#444652" />
                  <Text style={styles.officerName}>Guard: {incident.reported_by_name?.split(' ')[0]}</Text>
                </View>
                <TouchableOpacity><Text style={styles.viewLink}>ID: #{String(incident.id).padStart(4, '0')}</Text></TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 56, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002e85' },
  backBtn: { padding: 4 },
  container: { padding: 16, paddingBottom: 40 },
  filterSection: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterChipActive: { backgroundColor: '#002e85', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChip: { backgroundColor: '#e2e8f0', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterTextActive: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  filterText: { color: '#444652', fontWeight: 'bold', fontSize: 12 },
  
  reportCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 2 },
  reportHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeWarning: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ffdad6', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeWarningText: { fontSize: 10, fontWeight: 'bold', color: '#93000a' },
  badgeSuccess: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#e0e7ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeSuccessText: { fontSize: 10, fontWeight: 'bold', color: '#002e85' },
  reportTime: { fontSize: 12, color: '#444652', fontWeight: '500' },
  reportTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f1623', marginBottom: 6 },
  reportDesc: { fontSize: 14, color: '#444652', marginBottom: 16 },
  reportFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f0f8', paddingTop: 12 },
  officerInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  officerName: { fontSize: 12, color: '#444652', fontWeight: '500' },
  viewLink: { fontSize: 12, fontWeight: 'bold', color: '#002e85' },
  
  emptyState: { alignItems: 'center', marginTop: 60, opacity: 0.5 },
  emptyText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: '#444652' }
});
