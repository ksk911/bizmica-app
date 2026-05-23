import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const API_BASE = 'http://192.168.1.7:5000';
const MANAGER_USER_ID = 2; // Priya Patel — Area Manager

/**
 * GeofenceAlertPanel
 * Displays unacknowledged out-of-area breach alerts for the Area Manager.
 * Props:
 *   company_id (number) — filter alerts by company
 *   compact (bool)      — if true, renders a small summary badge only
 */
export default function GeofenceAlertPanel({ company_id = 1, compact = false }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [acknowledging, setAcknowledging] = useState(null);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, [company_id]);

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/alerts/breaches?company_id=${company_id}`);
      const data = await res.json();
      setAlerts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('GeofenceAlertPanel fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId) => {
    setAcknowledging(alertId);
    try {
      await fetch(`${API_BASE}/api/alerts/acknowledge/${alertId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: MANAGER_USER_ID })
      });
      // Remove from local state immediately (optimistic)
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (err) {
      console.error('Acknowledge error:', err);
    } finally {
      setAcknowledging(null);
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // ── Compact badge mode (for use in headers/dashboards) ─────────────────────
  if (compact) {
    if (loading || alerts.length === 0) return null;
    return (
      <TouchableOpacity style={styles.compactBadge} onPress={() => setExpanded(e => !e)}>
        <MaterialIcons name="warning" size={14} color="#fff" />
        <Text style={styles.compactBadgeText}>{alerts.length} Breach Alert{alerts.length > 1 ? 's' : ''}</Text>
      </TouchableOpacity>
    );
  }

  // ── Full panel mode ────────────────────────────────────────────────────────
  return (
    <View style={styles.panel}>
      {/* Panel Header */}
      <TouchableOpacity style={styles.panelHeader} onPress={() => setExpanded(e => !e)}>
        <View style={styles.panelHeaderLeft}>
          <MaterialIcons name="gps-off" size={18} color={alerts.length > 0 ? COLORS.error : COLORS.onSurfaceVariant} />
          <Text style={styles.panelTitle}>Out-of-Area Alerts</Text>
          {alerts.length > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{alerts.length}</Text>
            </View>
          )}
        </View>
        <MaterialIcons
          name={expanded ? 'expand-less' : 'expand-more'}
          size={22}
          color={COLORS.onSurfaceVariant}
        />
      </TouchableOpacity>

      {/* Panel Content */}
      {expanded && (
        <View style={styles.panelBody}>
          {loading ? (
            <View style={styles.centeredRow}>
              <ActivityIndicator size="small" color={COLORS.secondary} />
              <Text style={styles.mutedText}>Loading alerts...</Text>
            </View>
          ) : alerts.length === 0 ? (
            <View style={styles.centeredRow}>
              <MaterialIcons name="check-circle" size={18} color="green" />
              <Text style={styles.mutedText}>All supervisors are within their assigned zones.</Text>
            </View>
          ) : (
            <ScrollView style={styles.alertList} nestedScrollEnabled>
              {alerts.map(alert => (
                <View key={alert.id} style={styles.alertRow}>
                  <View style={styles.alertIcon}>
                    <MaterialIcons name="location-off" size={20} color={COLORS.error} />
                  </View>
                  <View style={styles.alertInfo}>
                    <Text style={styles.alertName}>{alert.supervisor_name}</Text>
                    <Text style={styles.alertDetail}>
                      Should be at: <Text style={styles.alertDetailBold}>{alert.site_name}</Text>
                    </Text>
                    <Text style={styles.alertDetail}>
                      Distance outside: <Text style={styles.alertDetailBold}>{alert.distance_m}m</Text>
                    </Text>
                    <Text style={styles.alertTime}>⏱ {formatTime(alert.triggered_at)}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.ackBtn, acknowledging === alert.id && styles.ackBtnDisabled]}
                    onPress={() => acknowledgeAlert(alert.id)}
                    disabled={acknowledging === alert.id}
                  >
                    {acknowledging === alert.id
                      ? <ActivityIndicator size="small" color="#fff" />
                      : <Text style={styles.ackBtnText}>Dismiss</Text>
                    }
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Compact badge (for headers)
  compactBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.error, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20
  },
  compactBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Full panel
  panel: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196,198,206,0.3)',
    overflow: 'hidden',
    marginBottom: 16
  },
  panelHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: COLORS.surfaceContainerLow
  },
  panelHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  panelTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primaryContainer },
  countBadge: {
    backgroundColor: COLORS.error, width: 20, height: 20,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center'
  },
  countBadgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  panelBody: { maxHeight: 320 },
  alertList: { flex: 1 },
  alertRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)', gap: 12
  },
  alertIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(239,68,68,0.1)', alignItems: 'center', justifyContent: 'center'
  },
  alertInfo: { flex: 1 },
  alertName: { fontSize: 14, fontWeight: '700', color: COLORS.primaryContainer },
  alertDetail: { fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 2 },
  alertDetailBold: { fontWeight: '700', color: COLORS.onSurface },
  alertTime: { fontSize: 11, color: COLORS.onSurfaceVariant, marginTop: 4 },

  ackBtn: {
    backgroundColor: COLORS.error, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 6, minWidth: 70, alignItems: 'center'
  },
  ackBtnDisabled: { opacity: 0.6 },
  ackBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  centeredRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 20 },
  mutedText: { fontSize: 13, color: COLORS.onSurfaceVariant },
});
