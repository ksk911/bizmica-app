import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  useWindowDimensions, ActivityIndicator, Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';

const API_BASE = 'http://192.168.1.7:5000';
const MANAGER_ID = 2;   // Priya Patel (AM001) — hardcoded for demo
const COMPANY_ID = 1;

export default function ShiftSiteMapping() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('mapping');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data from API
  const [supervisors, setSupervisors] = useState([]);   // all supervisors under this manager
  const [sites, setSites] = useState([]);               // all sites for the company
  const [assignments, setAssignments] = useState([]);   // current active assignments

  // Pending changes: { supervisorId_siteId: 'assign' | 'unassign' }
  const [pendingChanges, setPendingChanges] = useState({});

  // ── Fetch all data on mount ──────────────────────────────────────────────
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [supRes, siteRes, assignRes] = await Promise.all([
        fetch(`${API_BASE}/api/assignments/supervisors?manager_id=${MANAGER_ID}`),
        fetch(`${API_BASE}/api/assignments/sites?company_id=${COMPANY_ID}`),
        fetch(`${API_BASE}/api/assignments/list?company_id=${COMPANY_ID}`)
      ]);
      const [supData, siteData, assignData] = await Promise.all([
        supRes.json(), siteRes.json(), assignRes.json()
      ]);
      setSupervisors(Array.isArray(supData) ? supData : []);
      setSites(Array.isArray(siteData) ? siteData : []);
      setAssignments(Array.isArray(assignData) ? assignData : []);
    } catch (err) {
      console.error('ShiftSiteMapping fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Build a lookup: which site(s) is each supervisor assigned to? ─────────
  const getAssignedSitesForSupervisor = (supervisorId) => {
    return assignments.filter(a => a.supervisor_id === supervisorId);
  };

  // ── Optimistic toggle: queue assign or unassign ───────────────────────────
  const toggleAssignment = (supervisorId, siteId) => {
    const key = `${supervisorId}_${siteId}`;
    const alreadyAssigned = assignments.some(
      a => a.supervisor_id === supervisorId && a.site_id === siteId
    );
    const pending = pendingChanges[key];

    setPendingChanges(prev => {
      const updated = { ...prev };
      if (pending === 'assign') {
        delete updated[key]; // undo pending assign
      } else if (pending === 'unassign') {
        delete updated[key]; // undo pending unassign
      } else if (alreadyAssigned) {
        updated[key] = 'unassign';
      } else {
        updated[key] = 'assign';
      }
      return updated;
    });
  };

  // ── Check effective state of a supervisor-site pair ───────────────────────
  const getEffectiveState = (supervisorId, siteId) => {
    const key = `${supervisorId}_${siteId}`;
    const alreadyAssigned = assignments.some(
      a => a.supervisor_id === supervisorId && a.site_id === siteId
    );
    if (pendingChanges[key] === 'assign') return 'pending-assign';
    if (pendingChanges[key] === 'unassign') return 'pending-unassign';
    if (alreadyAssigned) return 'assigned';
    return 'unassigned';
  };

  // ── Save all pending changes ───────────────────────────────────────────────
  const saveConfiguration = async () => {
    const changes = Object.entries(pendingChanges);
    if (changes.length === 0) {
      Alert.alert('No Changes', 'Nothing to save.');
      return;
    }
    setSaving(true);
    try {
      await Promise.all(
        changes.map(([key, action]) => {
          const [supervisor_id, site_id] = key.split('_').map(Number);
          if (action === 'assign') {
            return fetch(`${API_BASE}/api/assignments/assign`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ supervisor_id, site_id, assigned_by: MANAGER_ID })
            });
          } else {
            return fetch(`${API_BASE}/api/assignments/unassign`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ supervisor_id, site_id })
            });
          }
        })
      );
      setPendingChanges({});
      await fetchAll(); // Refresh data from server
      Alert.alert('Saved', 'All assignments have been updated successfully.');
    } catch (err) {
      console.error('Save error:', err);
      Alert.alert('Error', 'Failed to save some changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Render the assignment matrix ───────────────────────────────────────────
  const renderMappingTab = () => {
    if (loading) {
      return (
        <View style={styles.centeredLoading}>
          <ActivityIndicator size="large" color={COLORS.secondary} />
          <Text style={styles.loadingText}>Loading assignments...</Text>
        </View>
      );
    }

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE DEPLOYMENT MAP</Text>
          <Text style={styles.sectionSubtitle}>
            Tap a cell to assign or unassign a supervisor to a site. Press Save to apply.
          </Text>
        </View>

        {/* Matrix: Rows = Supervisors, Columns = Sites */}
        <View style={styles.card}>

          {/* Header Row */}
          <View style={styles.matrixHeaderRow}>
            <View style={[styles.matrixCell, styles.matrixLabelCell]}>
              <Text style={styles.colHeader}>SUPERVISOR</Text>
            </View>
            {sites.map(site => (
              <View key={site.id} style={[styles.matrixCell, styles.matrixSiteCell]}>
                <Text style={styles.colHeader} numberOfLines={2}>{site.name}</Text>
                <Text style={styles.siteSubtext}>{site.geofence_radius_m}m radius</Text>
              </View>
            ))}
            <View style={[styles.matrixCell, styles.matrixSiteCell]}>
              <Text style={styles.colHeader}>MAP ASSIGN</Text>
            </View>
          </View>

          {/* Supervisor Rows */}
          {supervisors.map((sup, idx) => (
            <View
              key={sup.id}
              style={[styles.matrixRow, idx === supervisors.length - 1 && { borderBottomWidth: 0 }]}
            >
              {/* Supervisor name */}
              <View style={[styles.matrixCell, styles.matrixLabelCell]}>
                <Text style={styles.cellTextBold}>{sup.full_name}</Text>
                <Text style={styles.cellSubtext}>{sup.employee_id}</Text>
              </View>

              {/* Assignment toggle per site */}
              {sites.map(site => {
                const state = getEffectiveState(sup.id, site.id);
                return (
                  <TouchableOpacity
                    key={site.id}
                    style={[styles.matrixCell, styles.matrixToggleCell]}
                    onPress={() => toggleAssignment(sup.id, site.id)}
                  >
                    {state === 'assigned' && (
                      <View style={styles.badgeAssigned}>
                        <MaterialIcons name="check-circle" size={16} color={COLORS.secondary} />
                        <Text style={styles.badgeTextAssigned}>Assigned</Text>
                      </View>
                    )}
                    {state === 'pending-assign' && (
                      <View style={styles.badgePendingAssign}>
                        <MaterialIcons name="add-circle-outline" size={16} color="#f59e0b" />
                        <Text style={styles.badgeTextPending}>Pending +</Text>
                      </View>
                    )}
                    {state === 'pending-unassign' && (
                      <View style={styles.badgePendingUnassign}>
                        <MaterialIcons name="remove-circle-outline" size={16} color={COLORS.error} />
                        <Text style={styles.badgeTextPendingRemove}>Pending −</Text>
                      </View>
                    )}
                    {state === 'unassigned' && (
                      <View style={styles.badgeUnassigned}>
                        <MaterialIcons name="add" size={14} color={COLORS.onSurfaceVariant} />
                        <Text style={styles.badgeTextUnassigned}>Assign</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              {/* Navigate to drawing map for this supervisor */}
              <TouchableOpacity
                style={[styles.matrixCell, styles.matrixToggleCell]}
                onPress={() => {
                  // Find any existing assignment for this supervisor to pre-populate
                  const existing = assignments.find(a => a.supervisor_id === sup.id);
                  navigation.navigate('GeofenceDrawingMap', {
                    supervisor: sup,
                    existingAssignment: existing ? {
                      site_name: existing.site_name,
                      site_lat: existing.site_lat,
                      site_lng: existing.site_lng,
                      geofence_radius_m: existing.geofence_radius_m
                    } : null
                  });
                }}
              >
                <View style={styles.badgeMapAssign}>
                  <MaterialIcons name="edit-location-alt" size={16} color="#7c3aed" />
                  <Text style={styles.badgeTextMapAssign}>
                    {getAssignedSitesForSupervisor(sup.id).length > 0 ? 'Reassign' : 'Draw Zone'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}

          {supervisors.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No supervisors found under your account.</Text>
            </View>
          )}
        </View>

        {/* Pending changes count */}
        {Object.keys(pendingChanges).length > 0 && (
          <View style={styles.pendingBanner}>
            <MaterialIcons name="pending-actions" size={16} color="#f59e0b" />
            <Text style={styles.pendingBannerText}>
              {Object.keys(pendingChanges).length} unsaved change(s) — press Save to apply
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          <View style={[styles.headerRow, !isWide && { flexDirection: 'column', alignItems: 'flex-start', gap: 16 }]}>
            <View>
              <Text style={styles.pageTitle}>Shift-Site Mapping</Text>
              <Text style={styles.pageSubtitle}>Assign and manage supervisor site deployments</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={[styles.primaryBtn, saving && styles.primaryBtnDisabled]}
                onPress={saveConfiguration}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator size="small" color={COLORS.onPrimary} />
                  : <MaterialIcons name="save" size={18} color={COLORS.onPrimary} />
                }
                <Text style={styles.primaryBtnText}>{saving ? 'Saving...' : 'Save Configuration'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'mapping' && styles.tabBtnActive]} onPress={() => setActiveTab('mapping')}>
              <Text style={[styles.tabText, activeTab === 'mapping' && styles.tabTextActive]}>Site Assignment Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'overview' && styles.tabBtnActive]} onPress={() => setActiveTab('overview')}>
              <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Assignment Overview</Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'mapping' ? renderMappingTab() : (
            /* Overview: flat list of all current assignments */
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>CURRENT ASSIGNMENTS</Text>
              </View>
              <View style={styles.card}>
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.colHeader, { flex: 2 }]}>SUPERVISOR</Text>
                  <Text style={[styles.colHeader, { flex: 2 }]}>ASSIGNED SITE</Text>
                  <Text style={[styles.colHeader, { flex: 1 }]}>GEOFENCE</Text>
                  <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>STATUS</Text>
                </View>
                {assignments.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>No assignments yet. Use the Site Assignment Map tab.</Text>
                  </View>
                ) : assignments.map((a, idx) => (
                  <View key={a.assignment_id} style={[styles.tableRow, idx === assignments.length - 1 && { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.cellTextBold}>{a.supervisor_name}</Text>
                      <Text style={styles.cellSubtext}>{a.employee_id}</Text>
                    </View>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.cellTextBold}>{a.site_name}</Text>
                      <Text style={styles.cellSubtext}>{a.site_address}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cellText}>{a.geofence_radius_m}m</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                      <View style={styles.statusBadgeActive}>
                        <Text style={styles.statusBadgeTextActive}>Mapped</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1 },
  scrollContent: { padding: 40, paddingBottom: 80 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 15, color: COLORS.onSurfaceVariant, marginTop: 6 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: COLORS.primaryContainer, borderRadius: 6 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: COLORS.onPrimary, fontWeight: '700', fontSize: 14 },

  tabsContainer: { flexDirection: 'row', gap: 32, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.2)', marginBottom: 32 },
  tabBtn: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: COLORS.secondary },
  tabText: { fontSize: 15, fontWeight: '600', color: COLORS.onSurfaceVariant },
  tabTextActive: { color: COLORS.primaryContainer, fontWeight: '800' },

  section: { gap: 16 },
  sectionHeader: { gap: 4 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1.5 },
  sectionSubtitle: { fontSize: 12, color: COLORS.onSurfaceVariant },

  card: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)', overflow: 'hidden' },

  // Matrix layout
  matrixHeaderRow: { flexDirection: 'row', backgroundColor: COLORS.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.3)' },
  matrixRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)' },
  matrixCell: { padding: 16, justifyContent: 'center' },
  matrixLabelCell: { flex: 2, borderRightWidth: 1, borderRightColor: 'rgba(196,198,206,0.2)' },
  matrixSiteCell: { flex: 1.5, alignItems: 'center' },
  matrixToggleCell: { flex: 1.5, alignItems: 'center' },

  siteSubtext: { fontSize: 10, color: COLORS.onSurfaceVariant, marginTop: 2 },

  // Assignment badges
  badgeAssigned: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,179,254,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextAssigned: { fontSize: 11, fontWeight: '700', color: COLORS.secondary },

  badgePendingAssign: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextPending: { fontSize: 11, fontWeight: '700', color: '#f59e0b' },

  badgePendingUnassign: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextPendingRemove: { fontSize: 11, fontWeight: '700', color: COLORS.error },

  badgeUnassigned: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: 'rgba(196,198,206,0.4)', borderStyle: 'dashed', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextUnassigned: { fontSize: 11, fontWeight: '500', color: COLORS.onSurfaceVariant },

  badgeMapAssign: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(124,58,237,0.1)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  badgeTextMapAssign: { fontSize: 11, fontWeight: '700', color: '#7c3aed' },

  pendingBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(245,158,11,0.08)', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  pendingBannerText: { fontSize: 13, fontWeight: '600', color: '#f59e0b' },

  // Table layout (overview tab)
  tableRowHeader: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: COLORS.surfaceContainerLow, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.3)' },
  colHeader: { fontSize: 10, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1 },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)' },
  cellTextBold: { fontSize: 14, fontWeight: '700', color: COLORS.primaryContainer },
  cellSubtext: { fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 4 },
  cellText: { fontSize: 14, color: COLORS.onSurfaceVariant },

  statusBadgeActive: { backgroundColor: 'rgba(0,179,254,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBadgeTextActive: { color: COLORS.secondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  centeredLoading: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  loadingText: { color: COLORS.onSurfaceVariant, fontSize: 14 },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { color: COLORS.onSurfaceVariant, fontSize: 14 },
});
