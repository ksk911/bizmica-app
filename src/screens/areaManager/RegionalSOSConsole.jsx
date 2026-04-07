import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';

export default function RegionalSOSConsole() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;
  
  // Sample Active Emergency Data
  const [activeAlerts, setActiveAlerts] = useState([
    { id: 'SOS-092', location: 'Navi Mumbai Hub', officer: 'Rahul M.', time: '2 mins ago', type: 'Medical Emergency', status: 'Requires Dispatch' },
    { id: 'SOS-091', location: 'Pune Corridor Sector 4', officer: 'Priya K.', time: '14 mins ago', type: 'Security Breach', status: 'En Route' }
  ]);

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        {isWide && <SideNavBar />}

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
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

          {/* Active Alerts List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CRITICAL ESCALATIONS</Text>
            
            {activeAlerts.map((alert) => (
              <View key={alert.id} style={styles.alertCard}>
                <View style={styles.alertHeader}>
                  <View style={styles.alertBadge}>
                    <MaterialIcons name="warning" size={16} color={COLORS.onError} />
                    <Text style={styles.alertBadgeText}>{alert.type}</Text>
                  </View>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
                
                <View style={styles.alertDetailsRow}>
                  <View style={styles.alertInfoBlock}>
                    <Text style={styles.infoLabel}>INCIDENT ID</Text>
                    <Text style={styles.infoValue}>{alert.id}</Text>
                  </View>
                  <View style={styles.alertInfoBlock}>
                    <Text style={styles.infoLabel}>LOCATION</Text>
                    <Text style={styles.infoValue}>{alert.location}</Text>
                  </View>
                  <View style={styles.alertInfoBlock}>
                    <Text style={styles.infoLabel}>REPORTING OFFICER</Text>
                    <Text style={styles.infoValue}>{alert.officer}</Text>
                  </View>
                  <View style={styles.alertInfoBlock}>
                    <Text style={styles.infoLabel}>DISPATCH STATUS</Text>
                    <Text style={[styles.infoValue, { color: alert.status === 'Requires Dispatch' ? COLORS.error : COLORS.secondary }]}>
                      {alert.status}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.resolveBtn}>
                    <Text style={styles.resolveBtnText}>Acknowledge & Dispatch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.ghostBtn}>
                    <Text style={styles.ghostBtnText}>View Full Context</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {activeAlerts.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons name="check-circle-outline" size={48} color={COLORS.secondary} />
                <Text style={styles.emptyStateTitle}>All Clear</Text>
                <Text style={styles.emptyStateSub}>No active SOS escalations in the regional network.</Text>
              </View>
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

