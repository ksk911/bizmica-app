import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
const API_BASE = 'http://192.168.1.7:5000';
const AREA_MANAGER_USER_ID = 2;

export default function IncidentHubReview({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  const [activeTab, setActiveTab] = useState(route?.params?.filter || 'pending');
  const [incidents, setIncidents] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  const fetchIncidents = useCallback(async () => {
    try {
      const [incRes, sosRes] = await Promise.all([
        fetch(`${API_BASE}/api/incidents`),
        fetch(`${API_BASE}/api/sos`)
      ]);
      const incData = await incRes.json();
      const sosData = await sosRes.json();
      setIncidents(incData);
      setSosAlerts(sosData);
      
      if (!selectedIncident) {
        if (route?.params?.filter === 'sos' && sosData.length > 0) {
          setSelectedIncident(sosData[0]);
        } else if (incData.length > 0) {
          setSelectedIncident(incData[0]);
        }
      }
    } catch (err) {
      console.error('Data fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [route?.params?.filter, selectedIncident]);

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 15000);
    return () => clearInterval(interval);
  }, [fetchIncidents]);

  const handleClose = async (incidentId) => {
    try {
      const res = await fetch(`${API_BASE}/api/incidents/${incidentId}/close`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ closed_by: AREA_MANAGER_USER_ID }),
      });
      if (res.ok) {
        Alert.alert('✅ Incident Closed', 'The incident has been marked as resolved.');
        fetchIncidents();
      }
    } catch (err) {
      Alert.alert('Error', 'Could not reach server.');
    }
  };

  const handleAcknowledgeSOS = async (sosId) => {
    try {
      const res = await fetch(`${API_BASE}/api/sos/${sosId}/acknowledge`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged_by: AREA_MANAGER_USER_ID }),
      });
      if (res.ok) {
        Alert.alert('✅ Acknowledged', 'SOS alert has been acknowledged. Response team dispatched.');
        fetchIncidents();
      }
    } catch (err) {
      Alert.alert('Error', 'Could not reach server.');
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#93000a';
      case 'HIGH': return COLORS.error;
      case 'MEDIUM': return '#d97706';
      default: return COLORS.secondary;
    }
  };

  const pendingIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'UNDER_INVESTIGATION');
  const closedIncidents = incidents.filter(i => i.status === 'CLOSED');
  const displayList = activeTab === 'sos' ? sosAlerts : (activeTab === 'pending' ? pendingIncidents : closedIncidents);



  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        <View style={[styles.contentWrapper, !isWide && { flexDirection: 'column' }]}>
          {/* Middle Column: Incident Queue */}
          <ScrollView
            style={styles.middleColumn}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchIncidents(); }} />}
          >
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.pageTitle}>Incident{'\n'}Hub</Text>
              </View>
              <View style={styles.tabToggle}>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]}
                  onPress={() => { setActiveTab('pending'); setSelectedIncident(null); }}
                >
                  <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending{'\n'}({pendingIncidents.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'approved' && styles.tabBtnActive]}
                  onPress={() => { setActiveTab('approved'); setSelectedIncident(null); }}
                >
                  <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>Resolved{'\n'}({closedIncidents.length})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabBtn, activeTab === 'sos' && styles.tabBtnActive, sosAlerts.length > 0 && { backgroundColor: COLORS.errorContainer }]}
                  onPress={() => { setActiveTab('sos'); setSelectedIncident(null); }}
                >
                  <Text style={[styles.tabText, activeTab === 'sos' && styles.tabTextActive, sosAlerts.length > 0 && { color: COLORS.onErrorContainer, fontWeight: '800' }]}>🚨 SOS{'\n'}({sosAlerts.length})</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.pageSubtitle}>
              Real-time incidents reported{'\n'}by field supervisors.
            </Text>

            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primaryContainer} style={{ marginTop: 40 }} />
            ) : (
              <View style={styles.cardsList}>
                {displayList.length === 0 ? (
                  <View style={{ padding: 32, alignItems: 'center' }}>
                    <MaterialIcons name="check-circle-outline" size={48} color={COLORS.secondary} />
                    <Text style={{ color: COLORS.onSurfaceVariant, marginTop: 12, fontWeight: '600' }}>No incidents in this category</Text>
                  </View>
                ) : displayList.map((incident) => (
                  <TouchableOpacity
                    key={incident.id}
                    style={[
                      styles.queueCard,
                      activeTab === 'sos' && incident.status === 'OPEN' && { borderColor: COLORS.error, borderWidth: 2 },
                      activeTab === 'sos' && incident.status === 'ACKNOWLEDGED' && { borderColor: COLORS.secondary, borderWidth: 2 },
                      activeTab === 'sos' && incident.status === 'CLOSED' && { opacity: 0.6 },
                      selectedIncident?.id === incident.id && styles.queueCardActive
                    ]}
                    onPress={() => setSelectedIncident(incident)}
                  >
                    <View style={[styles.queueCardCol, { width: 60 }]}>
                      <Text style={styles.queueLabel}>ID</Text>
                      <Text style={styles.queueValue}>#{String(incident.id).padStart(4, '0')}</Text>
                    </View>
                    <View style={[styles.queueCardCol, { flex: 1.2 }]}>
                      <Text style={styles.queueLabel}>SITE</Text>
                      <Text style={styles.queueValue}>{incident.site_name}</Text>
                    </View>
                    <View style={[styles.queueCardCol, { flex: 1 }]}>
                      <Text style={styles.queueLabel}>SUPERVISOR</Text>
                      <View style={styles.supervisorRow}>
                        <View style={styles.supervisorAvatarDark}>
                          <Text style={styles.avatarTextLight}>
                            {(incident.reported_by_name || incident.triggered_by_name || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </Text>
                        </View>
                        <Text style={[styles.queueValue, { fontSize: 12 }]}>{(incident.reported_by_name || incident.triggered_by_name || 'Unknown').split(' ').join('\n')}</Text>
                      </View>
                    </View>
                    <View style={[styles.queueCardCol, { width: 90, alignItems: 'flex-end' }]}>
                      <Text style={styles.queueLabel}>STATUS</Text>
                      <Text style={[
                        styles.queueValue, 
                        { fontSize: 11, textAlign: 'right' },
                        incident.status === 'OPEN' && activeTab === 'sos' ? { color: COLORS.error } : null,
                        incident.status === 'ACKNOWLEDGED' ? { color: COLORS.secondary } : null,
                        incident.status === 'CLOSED' ? { color: COLORS.onSurfaceVariant } : null
                      ]}>
                        {incident.status}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Right Column: Detail Panel */}
          <ScrollView style={styles.rightColumn} showsVerticalScrollIndicator={false}>
            {selectedIncident ? (
              <>
                <View style={styles.rightColHeader}>
                  <View style={[styles.badgeDark, { backgroundColor: activeTab === 'sos' && selectedIncident.status === 'OPEN' ? COLORS.error : activeTab === 'sos' && selectedIncident.status === 'ACKNOWLEDGED' ? COLORS.secondary : getSeverityColor(selectedIncident.severity) }]}>
                    <Text style={styles.badgeDarkText}>{selectedIncident.status || 'OPEN'}</Text>
                  </View>
                  <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedIncident(null)}>
                    <MaterialIcons name="close" size={20} color={COLORS.onSurfaceVariant} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.detailTitle}>#{String(selectedIncident.id).padStart(4, '0')} Details</Text>

                <View style={styles.infoBox}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.infoBoxLabel}>REPORTED AT</Text>
                    <Text style={styles.infoBoxValue}>{formatTime(selectedIncident.opened_at || selectedIncident.triggered_at)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.infoBoxLabel, { textAlign: 'right' }]}>SITE</Text>
                    <Text style={[styles.infoBoxValue, { textAlign: 'right' }]}>{selectedIncident.site_name}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailSectionHeader}>
                    <MaterialIcons name="category" size={16} color={COLORS.primaryContainer} />
                    <Text style={styles.detailSectionTitle}>INCIDENT TYPE</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.primaryContainer }}>
                    {activeTab === 'sos' ? 'SOS EMERGENCY' : (selectedIncident.incident_type || 'Unclassified')}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <View style={styles.detailSectionHeader}>
                    <MaterialIcons name="chat-bubble" size={16} color={COLORS.primaryContainer} />
                    <Text style={styles.detailSectionTitle}>SUPERVISOR REMARKS</Text>
                  </View>
                  <View style={styles.remarksBox}>
                    <Text style={styles.remarksText}>"{selectedIncident.description || 'SOS Triggered - Emergency Assistance Requested'}"</Text>
                  </View>
                  <Text style={styles.remarksAuthor}>— {(selectedIncident.reported_by_name || selectedIncident.triggered_by_name || 'Unknown').toUpperCase()}, Site Supervisor</Text>
                </View>

                {(selectedIncident.latitude || selectedIncident.trigger_latitude) && (
                  <View style={styles.detailSection}>
                    <View style={styles.detailSectionHeader}>
                      <MaterialIcons name="location-on" size={16} color={COLORS.primaryContainer} />
                      <Text style={styles.detailSectionTitle}>GPS COORDINATES</Text>
                    </View>
                    <Text style={{ fontSize: 14, color: COLORS.onSurface, fontWeight: '600' }}>
                      {parseFloat(selectedIncident.latitude || selectedIncident.trigger_latitude).toFixed(5)}, {parseFloat(selectedIncident.longitude || selectedIncident.trigger_longitude).toFixed(5)}
                    </Text>
                  </View>
                )}

                {selectedIncident.status !== 'CLOSED' && activeTab !== 'sos' && (
                  <View style={styles.actionsFooter}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleClose(selectedIncident.id)}
                    >
                      <MaterialIcons name="check-circle" size={18} color={COLORS.onPrimary} />
                      <Text style={styles.approveBtnText}>Close Incident</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedIncident.status === 'OPEN' && activeTab === 'sos' && (
                  <View style={styles.actionsFooter}>
                    <TouchableOpacity
                      style={[styles.approveBtn, { backgroundColor: COLORS.error }]}
                      onPress={() => handleAcknowledgeSOS(selectedIncident.id)}
                    >
                      <MaterialIcons name="campaign" size={18} color={COLORS.onError} />
                      <Text style={[styles.approveBtnText, { color: COLORS.onError }]}>Acknowledge & Dispatch</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {selectedIncident.status !== 'OPEN' && activeTab === 'sos' && (
                  <View style={[styles.actionsFooter, { opacity: 0.5 }]}>
                    <View style={[styles.approveBtn, { backgroundColor: COLORS.secondary }]}>
                      <MaterialIcons name="verified" size={18} color="#fff" />
                      <Text style={styles.approveBtnText}>Acknowledged</Text>
                    </View>
                  </View>
                )}
                {selectedIncident.status === 'CLOSED' && activeTab !== 'sos' && (
                  <View style={[styles.actionsFooter, { opacity: 0.5 }]}>
                    <View style={[styles.approveBtn, { backgroundColor: COLORS.secondary }]}>
                      <MaterialIcons name="verified" size={18} color="#fff" />
                      <Text style={styles.approveBtnText}>Resolved</Text>
                    </View>
                  </View>
                )}
              </>
            ) : (
              <View style={{ padding: 32, alignItems: 'center', marginTop: 64 }}>
                <MaterialIcons name="touch-app" size={48} color={COLORS.onSurfaceVariant} />
                <Text style={{ color: COLORS.onSurfaceVariant, marginTop: 12, fontWeight: '600', textAlign: 'center' }}>
                  Select an incident from the queue to view details
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },
  contentWrapper: { flex: 1, flexDirection: 'row' },
  
  // Left/Middle Column
  middleColumn: { flex: 1.5, paddingHorizontal: 48, paddingVertical: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: -0.5, lineHeight: 36 },
  tabToggle: { flexDirection: 'row', backgroundColor: COLORS.surfaceContainerLow, borderRadius: 8, padding: 4, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)' },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  tabBtnActive: { backgroundColor: COLORS.surfaceContainerLowest, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 1 },
  tabText: { fontSize: 13, fontWeight: '700', color: COLORS.onSurfaceVariant, textAlign: 'center' },
  tabTextActive: { color: COLORS.primaryContainer },
  pageSubtitle: { fontSize: 14, color: COLORS.onSurfaceVariant, fontWeight: '500', lineHeight: 22, marginBottom: 40 },
  
  cardsList: { gap: 16, marginBottom: 48 },
  queueCard: { flexDirection: 'row', backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)' },
  queueCardActive: { borderColor: COLORS.primaryContainer, borderWidth: 3, borderLeftWidth: 6 },
  queueCardCol: { justifyContent: 'center' },
  queueLabel: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  queueValue: { fontSize: 14, fontWeight: '700', color: COLORS.primaryContainer, lineHeight: 20 },
  
  supervisorRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  supervisorAvatarDark: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  avatarTextLight: { color: '#fff', fontSize: 11, fontWeight: '700' },
  supervisorAvatarLight: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  avatarTextDark: { color: COLORS.onSurfaceVariant, fontSize: 11, fontWeight: '700' },
  
  alertLogsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  sectionTitleBlack: { fontSize: 18, fontWeight: '800', color: '#000' },
  sectionSubtitle: { fontSize: 13, color: COLORS.onSurfaceVariant, marginTop: 4 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  filterText: { color: COLORS.secondary, fontWeight: '700', fontSize: 13 },
  
  table: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(196,198,206,0.2)', paddingBottom: 16 },
  tableHead: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: COLORS.surfaceContainerLow, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  tableHeadText: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)' },
  tableCell: { fontSize: 13, color: COLORS.onSurfaceVariant },
  tableCellBold: { fontSize: 13, fontWeight: '800', color: COLORS.primaryContainer },

  // Right Column Details
  rightColumn: { flex: 1, maxWidth: 420, backgroundColor: COLORS.surfaceContainerLowest, borderLeftWidth: 1, borderLeftColor: 'rgba(196,198,206,0.3)', paddingHorizontal: 32, paddingTop: 32 },
  rightColHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  badgeDark: { backgroundColor: COLORS.primaryContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  badgeDarkText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  closeBtn: { padding: 4, backgroundColor: COLORS.surfaceContainer, borderRadius: 16 },
  
  detailTitle: { fontSize: 24, fontWeight: '800', color: COLORS.primaryContainer, marginBottom: 24 },
  infoBox: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)', borderRadius: 8, marginBottom: 32 },
  infoBoxLabel: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, letterSpacing: 0.5, marginBottom: 4 },
  infoBoxValue: { fontSize: 13, fontWeight: '800', color: COLORS.primaryContainer },

  detailSection: { marginBottom: 32 },
  detailSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  detailSectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: 1 },
  
  checklistRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, padding: 16, borderRadius: 8, marginBottom: 8 },
  checklistText: { fontSize: 13, fontWeight: '700', color: COLORS.primaryContainer },
  checklistRowUnchecked: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLowest, padding: 16, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)' },
  checklistTextUnchecked: { fontSize: 13, fontWeight: '500', color: COLORS.onSurfaceVariant },
  
  remarksBox: { backgroundColor: COLORS.surfaceContainerLow, padding: 20, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.primaryContainer, marginBottom: 12 },
  remarksText: { fontSize: 13, fontStyle: 'italic', fontWeight: '500', color: COLORS.onSurfaceVariant, lineHeight: 20 },
  remarksAuthor: { fontSize: 11, fontWeight: '700', color: COLORS.primaryContainer, textAlign: 'right' },
  
  actionsFooter: { flexDirection: 'row', gap: 16, marginTop: 16, marginBottom: 64 },
  approveBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primaryContainer, paddingVertical: 14, borderRadius: 8 },
  approveBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
  sendBackBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.surfaceContainerLowest, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#ba1a1a' },
  sendBackBtnText: { color: '#ba1a1a', fontSize: 14, fontWeight: '800' }
});

