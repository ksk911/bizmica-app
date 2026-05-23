import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
const MetricCard = ({ category, value, subtitle }) => (
  <View style={styles.metricCard}>
    <Text style={styles.metricCategory}>{category}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricSubtitle}>{subtitle}</Text>
  </View>
);

export default function EodSummary() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  return (
    <View style={styles.container}>
      <TopNavBar />

      <View style={styles.layout}>
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={styles.headerSection}>
            <Text style={styles.pageTitle}>End-of-Day Operations Summary</Text>
            <View style={styles.subtitleRow}>
              <MaterialIcons name="check-circle" size={18} color={COLORS.secondary} />
              <Text style={styles.subtitleText}>Auto-collation of regional data for Pune-Mumbai complete</Text>
            </View>
          </View>

          {/* Metric Cards */}
          <View style={[styles.metricsRow, !isWide && styles.metricsColumn]}>
            <MetricCard category="Operations" value="14 Checklists Approved" subtitle="Across 8 major hubs in the sector" />
            <MetricCard category="Security" value="3 SOS Incidents Resolved & Logged" subtitle="Zero outstanding critical tickets" />
            <MetricCard category="Personnel" value="5 Site Reassignments Confirmed" subtitle="Shift balancing for Night Cycle complete" />
          </View>

          {/* Main Layout */}
          <View style={[styles.contentRow, !isWide && styles.contentColumn]}>
            
            {/* PDF Preview Container */}
            <View style={[styles.pdfLeftContainer, !isWide && { width: '100%' }]}>
              <View style={styles.pdfHeaderRow}>
                <Text style={styles.pdfHeaderTitle}>Document Preview (Read-Only)</Text>
                <View style={styles.pdfHeaderIcons}>
                  <MaterialIcons name="zoom-in" size={20} color={COLORS.secondary} />
                  <MaterialIcons name="print" size={20} color={COLORS.onSurfaceVariant} />
                  <MaterialIcons name="download" size={20} color={COLORS.onSurfaceVariant} />
                </View>
              </View>

              <View style={styles.pdfPaper}>
                <View style={styles.pdfTopRow}>
                  <View>
                    <Text style={styles.docTitle}>AREA MANAGER PORTAL</Text>
                    <Text style={styles.docSubtitle}>OPERATIONAL EXCELLENCE REPORT</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.docIdLabel}>Document ID</Text>
                    <Text style={styles.docIdValue}>EOD-PNQ-BOM-290524</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />

                <Text style={styles.execSummaryTitle}>Executive Summary</Text>
                <Text style={styles.execSummaryText}>
                  This report represents the collated operational status for the Pune-Mumbai corridor for the current EOD cycle. All high-priority safety checklists have been reconciled. Personnel allocation for the upcoming transition shift has been validated against regional compliance standards.
                </Text>

                <View style={[styles.complianceRow, !isWide && { flexDirection: 'column' }]}>
                  <View style={styles.complianceBox}>
                    <Text style={styles.complianceBoxLabel}>Regional Compliance</Text>
                    <View style={styles.complianceCircleBox}>
                       <View style={styles.complianceCircle}>
                         <Text style={styles.compliancePercent}>98%</Text>
                       </View>
                    </View>
                  </View>
                  <View style={styles.complianceBox}>
                    <Text style={styles.complianceBoxLabel}>Incident Trend</Text>
                    <View style={styles.trendBarsBox}>
                      <View style={[styles.trendBar, { height: 48 }]} />
                      <View style={[styles.trendBar, { height: 32 }]} />
                      <View style={[styles.trendBar, { height: 64 }]} />
                      <View style={[styles.trendBar, { height: 24 }]} />
                      <View style={[styles.trendBar, { height: 40 }]} />
                    </View>
                  </View>
                </View>

                {/* Simplified Table Array */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.th, { flex: 2 }]}>HUB LOCATION</Text>
                  <Text style={[styles.th, { flex: 1 }]}>STATUS</Text>
                  <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>METRIC</Text>
                </View>
                {[
                  { hub: 'Pune North Central', status: 'Secured', metric: '09:12 UTC' },
                  { hub: 'Mumbai South Gateway', status: 'Secured', metric: '09:45 UTC' },
                  { hub: 'Navi Mumbai Logistics', status: 'Review Pending', metric: 'N/A' },
                ].map((row, i) => (
                  <View key={i} style={styles.tr}>
                    <Text style={[styles.tdHub, { flex: 2 }]}>{row.hub}</Text>
                    <Text style={[styles.tdStatus, { flex: 1 }]}>{row.status}</Text>
                    <Text style={[styles.tdMetric, { flex: 1, textAlign: 'right' }]}>{row.metric}</Text>
                  </View>
                ))}

                <View style={styles.watermark}>
                  <MaterialIcons name="verified" size={120} color="rgba(196,198,206,0.05)" />
                </View>
              </View>
            </View>

            {/* Action Panel Right */}
            <View style={[styles.actionRightContainer, !isWide && { width: '100%' }]}>
              
              <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Final Confirmation</Text>
                <Text style={styles.actionSubtitle}>Review recipient list and document metadata before dispatch.</Text>
                
                <Text style={styles.recipientsLabel}>Recipients</Text>
                <View style={styles.recipientRow}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80' }} style={styles.recipientAvatar} />
                  <View>
                    <Text style={styles.recipientName}>Regional Director</Text>
                    <Text style={styles.recipientEmail}>rd.office@areamanager.corp</Text>
                  </View>
                </View>
                <View style={styles.recipientRow}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&q=80' }} style={styles.recipientAvatar} />
                  <View>
                    <Text style={styles.recipientName}>Operations Lead</Text>
                    <Text style={styles.recipientEmail}>ops.pune@areamanager.corp</Text>
                  </View>
                </View>

                <View style={styles.metadataRow}>
                  <Text style={styles.metaLabel}>Collation Time</Text>
                  <Text style={styles.metaValue}>Today, 18:30 IST</Text>
                </View>
                <View style={styles.metadataRow}>
                  <Text style={styles.metaLabel}>Server Timestamp</Text>
                  <Text style={[styles.metaValue, styles.metaMono]}>2024-05-29 13:00:00 UTC</Text>
                </View>

                <TouchableOpacity style={styles.primaryActionBtn}>
                  <MaterialIcons name="send" size={18} color={COLORS.onPrimary} />
                  <Text style={styles.primaryActionText}>Generate & Email EOD Report</Text>
                </TouchableOpacity>
                <Text style={styles.termsText}>By clicking above, you certify that all regional data has been verified.</Text>
              </View>

              <TouchableOpacity style={styles.secondaryActionCard}>
                <View style={styles.secondaryActionLeft}>
                  <MaterialIcons name="history-edu" size={20} color={COLORS.secondary} />
                  <Text style={styles.secondaryActionTitle}>View Archived EODs</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color={COLORS.onSurfaceVariant} />
              </TouchableOpacity>

            </View>

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
  
  headerSection: { marginBottom: 16 },
  pageTitle: { fontSize: 36, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: -1, marginBottom: 8 },
  subtitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subtitleText: { fontSize: 16, color: COLORS.secondary, fontWeight: '500' },

  metricsRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  metricsColumn: { flexDirection: 'column' },
  metricCard: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest, padding: 24, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: COLORS.secondary, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  metricCategory: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  metricValue: { fontSize: 24, fontWeight: '800', color: COLORS.primaryContainer },
  metricSubtitle: { marginTop: 12, fontSize: 10, color: COLORS.onSurfaceVariant },

  contentRow: { flexDirection: 'row', gap: 48 },
  contentColumn: { flexDirection: 'column' },
  
  pdfLeftContainer: { flex: 7 },
  pdfHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  pdfHeaderTitle: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.5 },
  pdfHeaderIcons: { flexDirection: 'row', gap: 16 },
  
  pdfPaper: { backgroundColor: '#fff', padding: 48, borderWidth: 1, borderColor: 'rgba(196,198,206,0.2)', shadowColor: '#191c1e', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.06, shadowRadius: 40, elevation: 10, position: 'relative', overflow: 'hidden' },
  pdfTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  docTitle: { fontSize: 18, fontWeight: '900', color: COLORS.primaryContainer, letterSpacing: -0.5 },
  docSubtitle: { fontSize: 10, color: COLORS.onSurfaceVariant, marginTop: 4 },
  docIdLabel: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', marginBottom: 4 },
  docIdValue: { fontSize: 12, fontWeight: '600', color: COLORS.onSurface },
  divider: { height: 1, backgroundColor: 'rgba(196, 198, 206, 0.3)', width: '100%', marginVertical: 32 },
  execSummaryTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primaryContainer, marginBottom: 12 },
  execSummaryText: { fontSize: 11, lineHeight: 18, color: COLORS.onSurfaceVariant, marginBottom: 32 },
  
  complianceRow: { flexDirection: 'row', gap: 24, marginBottom: 32 },
  complianceBox: { flex: 1, backgroundColor: COLORS.surfaceContainerLow, padding: 16, borderRadius: 8 },
  complianceBoxLabel: { fontSize: 9, fontWeight: '700', color: COLORS.secondary, textTransform: 'uppercase', marginBottom: 12 },
  complianceCircleBox: { width: '100%', height: 96, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  complianceCircle: { width: 64, height: 64, borderRadius: 32, borderWidth: 6, borderColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  compliancePercent: { fontSize: 12, fontWeight: '700' },
  trendBarsBox: { width: '100%', height: 96, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 4, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', paddingHorizontal: 16, paddingBottom: 8 },
  trendBar: { width: 8, backgroundColor: COLORS.secondary, borderTopLeftRadius: 4, borderTopRightRadius: 4 },

  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.primaryContainer, padding: 12, borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  th: { color: '#fff', fontSize: 10, fontWeight: '700' },
  tr: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.3)', padding: 12 },
  tdHub: { fontWeight: '600', fontSize: 10, color: COLORS.primaryContainer },
  tdStatus: { fontSize: 10, color: COLORS.onSurfaceVariant },
  tdMetric: { fontSize: 10, color: COLORS.onSurfaceVariant },
  
  watermark: { position: 'absolute', bottom: 40, right: 40, opacity: 1, zIndex: -1 },

  actionRightContainer: { flex: 5, gap: 24 },
  actionCard: { backgroundColor: COLORS.surfaceContainerLowest, padding: 32, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  actionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primaryContainer, marginBottom: 8 },
  actionSubtitle: { fontSize: 12, color: COLORS.onSurfaceVariant, marginBottom: 24 },
  recipientsLabel: { fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 },
  recipientRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: COLORS.surfaceContainerLow, borderRadius: 8, marginBottom: 12 },
  recipientAvatar: { width: 36, height: 36, borderRadius: 18 },
  recipientName: { fontSize: 12, fontWeight: '700', color: COLORS.primaryContainer },
  recipientEmail: { fontSize: 10, color: COLORS.onSurfaceVariant },
  
  metadataRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  metaLabel: { fontSize: 10, fontWeight: '600', color: COLORS.onSurfaceVariant },
  metaValue: { fontSize: 10, fontWeight: '600', color: COLORS.onSurfaceVariant },
  metaMono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', web: 'monospace' }), color: COLORS.primaryContainer },

  primaryActionBtn: { marginTop: 32, width: '100%', backgroundColor: COLORS.primaryContainer, paddingVertical: 16, borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },
  primaryActionText: { color: COLORS.onPrimary, fontSize: 12, fontWeight: '700' },
  termsText: { marginTop: 12, fontSize: 10, color: COLORS.onSurfaceVariant, textAlign: 'center', fontStyle: 'italic' },

  secondaryActionCard: { backgroundColor: COLORS.surfaceContainer, padding: 24, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  secondaryActionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  secondaryActionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primaryContainer },

});

