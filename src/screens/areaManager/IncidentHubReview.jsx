import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';

export default function IncidentHubReview() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;
  
  const [activeTab, setActiveTab] = useState('pending');

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        {isWide && <SideNavBar />}

        {/* Content Layout: 2 Columns */}
        <View style={[styles.contentWrapper, !isWide && { flexDirection: 'column' }]}>
          
          {/* Middle Column: Review Queue & Logs */}
          <ScrollView style={styles.middleColumn} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.pageTitle}>Review{'\n'}Queue</Text>
              </View>
              <View style={styles.tabToggle}>
                <TouchableOpacity 
                  style={[styles.tabBtn, activeTab === 'pending' && styles.tabBtnActive]} 
                  onPress={() => setActiveTab('pending')}
                >
                  <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending{'\n'}Review</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.tabBtn, activeTab === 'approved' && styles.tabBtnActive]} 
                  onPress={() => setActiveTab('approved')}
                >
                  <Text style={[styles.tabText, activeTab === 'approved' && styles.tabTextActive]}>Approved</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.pageSubtitle}>
              Auto-routed checklists pending{'\n'}regional validation for site{'\n'}compliance and safety protocols.
            </Text>

            <View style={styles.cardsList}>
              {/* Active Card */}
              <View style={[styles.queueCard, styles.queueCardActive]}>
                <View style={styles.queueCardCol}>
                  <Text style={styles.queueLabel}>ID</Text>
                  <Text style={styles.queueValue}>#INC-4821</Text>
                </View>
                <View style={[styles.queueCardCol, { flex: 1.5 }]}>
                  <Text style={styles.queueLabel}>SITE LOCATION</Text>
                  <Text style={styles.queueValue}>Northwest Distribution Center</Text>
                </View>
                <View style={[styles.queueCardCol, { flex: 1 }]}>
                  <Text style={styles.queueLabel}>SUPERVISOR</Text>
                  <View style={styles.supervisorRow}>
                    <View style={styles.supervisorAvatarDark}><Text style={styles.avatarTextLight}>RA</Text></View>
                    <Text style={styles.queueValue}>Ravi{'\n'}Agarwal</Text>
                  </View>
                </View>
              </View>

              {/* Inactive Card */}
              <View style={styles.queueCard}>
                <View style={styles.queueCardCol}>
                  <Text style={styles.queueLabel}>ID</Text>
                  <Text style={styles.queueValue}>#INC-4822</Text>
                </View>
                <View style={[styles.queueCardCol, { flex: 1.5 }]}>
                  <Text style={styles.queueLabel}>SITE LOCATION</Text>
                  <Text style={styles.queueValue}>East Bay Logistics Hub</Text>
                </View>
                <View style={[styles.queueCardCol, { flex: 1 }]}>
                  <Text style={styles.queueLabel}>SUPERVISOR</Text>
                  <View style={styles.supervisorRow}>
                    <View style={styles.supervisorAvatarLight}><Text style={styles.avatarTextDark}>PS</Text></View>
                    <Text style={[styles.queueValue, { color: COLORS.onSurfaceVariant }]}>Priya{'\n'}Sharma</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.alertLogsHeader}>
              <View>
                <Text style={styles.sectionTitleBlack}>Alert Logs</Text>
                <Text style={styles.sectionSubtitle}>Exceptions and system-generated conflict alerts</Text>
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <MaterialIcons name="filter-list" size={16} color={COLORS.secondary} />
                <Text style={styles.filterText}>Filter Logs</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.table}>
              <View style={styles.tableHead}>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>TICKET ID</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5 }]}>SITE</Text>
                <Text style={[styles.tableHeadText, { flex: 1.5 }]}>OFFICER</Text>
                <Text style={[styles.tableHeadText, { flex: 1 }]}>TIMESTAMP</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellBold, { flex: 1 }]}>#INC-8821</Text>
                <Text style={[styles.tableCellBold, { flex: 1.5, color: COLORS.onSurfaceVariant }]}>TechPark Alpha</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Vikram Singh</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Oct 24, 09:12 AM</Text>
              </View>
              
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellBold, { flex: 1 }]}>#INC-8819</Text>
                <Text style={[styles.tableCellBold, { flex: 1.5, color: COLORS.onSurfaceVariant }]}>Residential Hub 4</Text>
                <Text style={[styles.tableCell, { flex: 1.5 }]}>Anita Rao</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Oct 24, 08:45 AM</Text>
              </View>
            </View>

          </ScrollView>

          {/* Right Column: Detail Sidebar */}
          <ScrollView style={styles.rightColumn} showsVerticalScrollIndicator={false}>
            <View style={styles.rightColHeader}>
              <View style={styles.badgeDark}>
                <Text style={styles.badgeDarkText}>HIGH PRIORITY INCIDENT</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn}>
                <MaterialIcons name="close" size={20} color={COLORS.onSurfaceVariant} />
              </TouchableOpacity>
            </View>

            <Text style={styles.detailTitle}>#INC-4821 Details</Text>

            <View style={styles.infoBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoBoxLabel}>OCCURRENCE TIME</Text>
                <Text style={styles.infoBoxValue}>Oct 24, 2024 • 08:42:15 AM</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoBoxLabel, { textAlign: 'right' }]}>LOCATION</Text>
                <Text style={[styles.infoBoxValue, { textAlign: 'right' }]}>Loading Dock A-12</Text>
              </View>
            </View>

            <View style={styles.detailSection}>
              <View style={styles.detailSectionHeader}>
                <MaterialIcons name="fact-check" size={16} color={COLORS.primaryContainer} />
                <Text style={styles.detailSectionTitle}>CHECKLIST COMPLIANCE</Text>
              </View>
              
              <View style={styles.checklistRow}>
                <Text style={styles.checklistText}>PPE protocols strictly followed?</Text>
                <MaterialIcons name="check-circle" size={20} color={COLORS.secondary} />
              </View>
              <View style={styles.checklistRow}>
                <Text style={styles.checklistText}>Emergency shutdown engaged?</Text>
                <MaterialIcons name="check-circle" size={20} color={COLORS.secondary} />
              </View>
              <View style={styles.checklistRowUnchecked}>
                <Text style={styles.checklistTextUnchecked}>First aid administered on-site?</Text>
                <MaterialIcons name="radio-button-unchecked" size={20} color={COLORS.outlineVariant} />
              </View>
            </View>

            <View style={styles.detailSection}>
              <View style={styles.detailSectionHeader}>
                <MaterialIcons name="chat-bubble" size={16} color={COLORS.primaryContainer} />
                <Text style={styles.detailSectionTitle}>SUPERVISOR REMARKS</Text>
              </View>
              
              <View style={styles.remarksBox}>
                <Text style={styles.remarksText}>
                  "Minor hydraulic fluid leak detected during routine inspection of forklift #092. Area secured immediately. No injuries reported. Maintenance crew dispatched for repair. Requesting full approval for log closure."
                </Text>
              </View>
              <Text style={styles.remarksAuthor}>— RAVI AGARWAL, Site Supervisor</Text>
            </View>

            <View style={styles.actionsFooter}>
              <TouchableOpacity style={styles.approveBtn}>
                <MaterialIcons name="check-circle" size={18} color={COLORS.onPrimary} />
                <Text style={styles.approveBtnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sendBackBtn}>
                <MaterialIcons name="keyboard-return" size={18} color="#ba1a1a" />
                <Text style={styles.sendBackBtnText}>Send Back</Text>
              </TouchableOpacity>
            </View>
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

