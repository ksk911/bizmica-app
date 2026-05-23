import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
const API_BASE = 'http://192.168.1.7:5000';
const AREA_MANAGER_USER_ID = 2;

export default function RegionalSOSConsole() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSOS = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/sos`);
      const data = await res.json();
      setActiveAlerts(data);
    } catch (err) {
      console.error('SOS fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSOS();
    // Auto-refresh every 15 seconds to catch new SOS events
    const interval = setInterval(fetchSOS, 15000);
    return () => clearInterval(interval);
  }, [fetchSOS]);

  const handleAcknowledge = async (sosId) => {
    try {
      const res = await fetch(`${API_BASE}/api/sos/${sosId}/acknowledge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: AREA_MANAGER_USER_ID }),
      });
      if (res.ok) {
        Alert.alert('✅ Acknowledged', 'SOS alert has been acknowledged. Response team dispatched.');
        fetchSOS(); // Refresh the list
      }
    } catch (err) {
      Alert.alert('Error', 'Could not reach server.');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} min${diff > 1 ? 's' : ''} ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };



  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchSOS(); }} />}
        >
          <View style={[styles.headerRow, !isWide && { flexDirection: 'column', alignItems: 'flex-start', gap: 16 }]}>
            <View>
              <Text style={styles.pageTitle}>Interactive Regional SOS Console</Text>
              <Text style={styles.pageSubtitle}>Active Field Emergencies & Coordination</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.error }]}>
                <MaterialIcons name="campaign" size={18} color={COLORS.onError} />
                <Text style={[styles.actionBtnText, { color: COLORS.onError }]}>Broadcast Alert</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CRITICAL ESCALATIONS ({activeAlerts.length})</Text>

            {loading ? (
              <ActivityIndicator size="large" color={COLORS.error} style={{ marginTop: 40 }} />
            ) : activeAlerts.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="check-circle-outline" size={48} color={COLORS.secondary} />
                <Text style={styles.emptyStateTitle}>All Clear</Text>
                <Text style={styles.emptyStateSub}>No active SOS escalations in the regional network.</Text>
              </View>
            ) : (
              activeAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertBadge}>
                      <MaterialIcons name="warning" size={16} color={COLORS.onError} />
                      <Text style={styles.alertBadgeText}>{alert.status}</Text>
                    </View>
                    <Text style={styles.alertTime}>{formatTime(alert.triggered_at)}</Text>
                  </View>

                  <View style={styles.alertDetailsRow}>
                    <View style={styles.alertInfoBlock}>
                      <Text style={styles.infoLabel}>INCIDENT ID</Text>
                      <Text style={styles.infoValue}>SOS-{String(alert.id).padStart(3, '0')}</Text>
                    </View>
                    <View style={styles.alertInfoBlock}>
                      <Text style={styles.infoLabel}>LOCATION</Text>
                      <Text style={styles.infoValue}>{alert.site_name}</Text>
                    </View>
                    <View style={styles.alertInfoBlock}>
                      <Text style={styles.infoLabel}>REPORTING OFFICER</Text>
                      <Text style={styles.infoValue}>{alert.triggered_by_name}</Text>
                    </View>
                    {alert.trigger_latitude && (
                      <View style={styles.alertInfoBlock}>
                        <Text style={styles.infoLabel}>GPS COORDS</Text>
                        <Text style={styles.infoValue}>
                          {parseFloat(alert.trigger_latitude).toFixed(4)}, {parseFloat(alert.trigger_longitude).toFixed(4)}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.resolveBtn, alert.status !== 'OPEN' && { opacity: 0.5 }]}
                      onPress={() => alert.status === 'OPEN' && handleAcknowledge(alert.id)}
                      disabled={alert.status !== 'OPEN'}
                    >
                      <Text style={styles.resolveBtnText}>
                        {alert.status === 'OPEN' ? 'Acknowledge & Dispatch' : `Already ${alert.status}`}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1 },
  scrollContent: { padding: 32, paddingBottom: 64, gap: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 16, color: COLORS.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  actionBtnText: { fontWeight: '700', fontSize: 14 },
  
  section: { gap: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  
  alertCard: { backgroundColor: COLORS.surfaceContainerLowest, padding: 24, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(186,26,26,0.2)', shadowColor: COLORS.error, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 24, elevation: 4 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  alertBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  alertBadgeText: { color: COLORS.onError, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  alertTime: { color: COLORS.error, fontWeight: '700', fontSize: 14 },
  
  alertDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 32, marginBottom: 24 },
  alertInfoBlock: { minWidth: 120 },
  infoLabel: { fontSize: 11, color: COLORS.onSurfaceVariant, fontWeight: '600', marginBottom: 4, letterSpacing: 0.5 },
  infoValue: { fontSize: 15, color: COLORS.onSurface, fontWeight: '700' },
  
  cardActions: { flexDirection: 'row', gap: 16, borderTopWidth: 1, borderTopColor: COLORS.surfaceContainer, paddingTop: 16 },
  resolveBtn: { backgroundColor: COLORS.primaryContainer, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  resolveBtnText: { color: COLORS.onPrimary, fontWeight: '700', fontSize: 14 },
  ghostBtn: { paddingHorizontal: 20, paddingVertical: 10 },
  ghostBtnText: { color: COLORS.secondary, fontWeight: '700', fontSize: 14 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 64, backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12 },
  emptyStateTitle: { fontSize: 20, fontWeight: '800', color: COLORS.primaryContainer, marginTop: 16, marginBottom: 8 },
  emptyStateSub: { fontSize: 14, color: COLORS.onSurfaceVariant, textAlign: 'center' }
});

