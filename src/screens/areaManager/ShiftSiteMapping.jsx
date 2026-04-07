import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';

export default function ShiftSiteMapping() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;
  
  const [activeTab, setActiveTab] = useState('mapping'); // 'mapping' or 'holidays'

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        {isWide && <SideNavBar />}

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={[styles.headerRow, !isWide && { flexDirection: 'column', alignItems: 'flex-start', gap: 16 }]}>
            <View>
              <Text style={styles.pageTitle}>Shift-Site Mapping & Holidays</Text>
              <Text style={styles.pageSubtitle}>Manage regional deployment schedules and exceptions</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.primaryBtn}>
                <MaterialIcons name="save" size={18} color={COLORS.onPrimary} />
                <Text style={styles.primaryBtnText}>Save Configuration</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Configuration Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'mapping' && styles.tabBtnActive]} onPress={() => setActiveTab('mapping')}>
              <Text style={[styles.tabText, activeTab === 'mapping' && styles.tabTextActive]}>Site Assignment Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, activeTab === 'holidays' && styles.tabBtnActive]} onPress={() => setActiveTab('holidays')}>
              <Text style={[styles.tabText, activeTab === 'holidays' && styles.tabTextActive]}>Holiday Exceptions</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Content based on Tab */}
          {activeTab === 'mapping' ? (
            <View style={styles.section}>
              
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>ACTIVE DEPLOYMENT MAP</Text>
                <TouchableOpacity style={styles.ghostBtn}>
                  <MaterialIcons name="add" size={16} color={COLORS.secondary} />
                  <Text style={styles.ghostBtnText}>Add Shift</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.colHeader, { flex: 2 }]}>SITE</Text>
                  <Text style={[styles.colHeader, { flex: 1.5 }]}>SHIFT TIMING</Text>
                  <Text style={[styles.colHeader, { flex: 2 }]}>ASSIGNED SUPERVISOR</Text>
                  <Text style={[styles.colHeader, { flex: 1, textAlign: 'center' }]}>STATUS</Text>
                  <Text style={[styles.colHeader, { width: 60, textAlign: 'center' }]}>ACTION</Text>
                </View>

                {/* Row 1 */}
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.cellTextBold}>Northwest Distribution Center</Text>
                    <Text style={styles.cellSubtext}>Zone A-12</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <View style={styles.inputBox}>
                      <Text style={styles.inputText}>08:00 AM - 04:00 PM</Text>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={styles.dropdownBox}>
                      <Text style={styles.inputText}>Ravi Agarwal</Text>
                      <MaterialIcons name="expand-more" size={20} color={COLORS.onSurfaceVariant} />
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={styles.statusBadgeActive}><Text style={styles.statusBadgeTextActive}>Mapped</Text></View>
                  </View>
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <TouchableOpacity><MaterialIcons name="more-vert" size={20} color={COLORS.onSurfaceVariant} /></TouchableOpacity>
                  </View>
                </View>

                {/* Row 2 */}
                <View style={styles.tableRow}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.cellTextBold}>East Bay Logistics Hub</Text>
                    <Text style={styles.cellSubtext}>Zone C-04</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <View style={styles.inputBox}>
                      <Text style={styles.inputText}>10:00 PM - 06:00 AM</Text>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={styles.dropdownBox}>
                      <Text style={styles.inputText}>Priya Sharma</Text>
                      <MaterialIcons name="expand-more" size={20} color={COLORS.onSurfaceVariant} />
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={styles.statusBadgeActive}><Text style={styles.statusBadgeTextActive}>Mapped</Text></View>
                  </View>
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <TouchableOpacity><MaterialIcons name="more-vert" size={20} color={COLORS.onSurfaceVariant} /></TouchableOpacity>
                  </View>
                </View>

                {/* Row 3 - Unmapped */}
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.cellTextBold}>TechPark Alpha</Text>
                    <Text style={styles.cellSubtext}>Main Gate & Lobby</Text>
                  </View>
                  <View style={{ flex: 1.5 }}>
                    <View style={[styles.inputBox, styles.inputBoxEmpty]}>
                      <Text style={styles.inputTextEmpty}>Select Shift</Text>
                    </View>
                  </View>
                  <View style={{ flex: 2 }}>
                    <View style={[styles.dropdownBox, styles.inputBoxEmpty]}>
                      <Text style={styles.inputTextEmpty}>Unassigned</Text>
                      <MaterialIcons name="expand-more" size={20} color={COLORS.outlineVariant} />
                    </View>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <View style={styles.statusBadgeAlert}><Text style={styles.statusBadgeTextAlert}>Action Req</Text></View>
                  </View>
                  <View style={{ width: 60, alignItems: 'center' }}>
                    <TouchableOpacity><MaterialIcons name="more-vert" size={20} color={COLORS.onSurfaceVariant} /></TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>REGIONAL HOLIDAY OVERRIDES</Text>
                <TouchableOpacity style={styles.ghostBtn}>
                  <MaterialIcons name="add" size={16} color={COLORS.secondary} />
                  <Text style={styles.ghostBtnText}>Add Holiday</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <View style={styles.tableRowHeader}>
                  <Text style={[styles.colHeader, { flex: 1 }]}>DATE</Text>
                  <Text style={[styles.colHeader, { flex: 2 }]}>HOLIDAY NAME</Text>
                  <Text style={[styles.colHeader, { flex: 2 }]}>IMPACTED SITES</Text>
                  <Text style={[styles.colHeader, { width: 100, textAlign: 'center' }]}>PATROL RULE</Text>
                </View>

                {/* Holiday Row 1 */}
                <View style={styles.tableRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cellTextBold}>Nov 01, 2024</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <TextInput style={styles.textInput} defaultValue="Diwali (Regional)" />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.cellText}>All Manufacturing Units</Text>
                  </View>
                  <View style={{ width: 100, alignItems: 'center' }}>
                    <Text style={styles.ruleText}>Suspended</Text>
                  </View>
                </View>
                
                {/* Holiday Row 2 */}
                <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cellTextBold}>Dec 25, 2024</Text>
                  </View>
                  <View style={{ flex: 2 }}>
                    <TextInput style={styles.textInput} defaultValue="Christmas Day" />
                  </View>
                  <View style={{ flex: 2 }}>
                    <Text style={styles.cellText}>TechPark Alpha Only</Text>
                  </View>
                  <View style={{ width: 100, alignItems: 'center' }}>
                    <Text style={[styles.ruleText, { color: COLORS.secondary }]}>Skeletal</Text>
                  </View>
                </View>
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
  primaryBtnText: { color: COLORS.onPrimary, fontWeight: '700', fontSize: 14 },
  
  tabsContainer: { flexDirection: 'row', gap: 32, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.2)', marginBottom: 32 },
  tabBtn: { paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: COLORS.secondary },
  tabText: { fontSize: 15, fontWeight: '600', color: COLORS.onSurfaceVariant },
  tabTextActive: { color: COLORS.primaryContainer, fontWeight: '800' },
  
  section: { gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8 },
  sectionTitle: { fontSize: 11, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1.5 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ghostBtnText: { color: COLORS.secondary, fontWeight: '700', fontSize: 13 },
  
  card: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 16, elevation: 1 },
  tableRowHeader: { flexDirection: 'row', paddingHorizontal: 24, paddingVertical: 16, backgroundColor: COLORS.surfaceContainerLow, borderTopLeftRadius: 12, borderTopRightRadius: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.3)' },
  colHeader: { fontSize: 10, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1 },
  
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)' },
  cellTextBold: { fontSize: 14, fontWeight: '700', color: COLORS.primaryContainer },
  cellSubtext: { fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 4 },
  cellText: { fontSize: 14, color: COLORS.onSurfaceVariant },
  
  inputBox: { backgroundColor: COLORS.surfaceContainerLow, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  inputBoxEmpty: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.outlineVariant, borderStyle: 'dashed' },
  inputText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryContainer },
  inputTextEmpty: { fontSize: 13, fontWeight: '500', color: COLORS.onSurfaceVariant },
  
  dropdownBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surfaceContainerLow, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 6 },
  
  textInput: { fontSize: 14, fontWeight: '600', color: COLORS.primaryContainer, padding: 0 },
  
  statusBadgeActive: { backgroundColor: 'rgba(0,179,254,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBadgeTextActive: { color: COLORS.secondary, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },
  
  statusBadgeAlert: { backgroundColor: COLORS.errorContainer, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statusBadgeTextAlert: { color: COLORS.onErrorContainer, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' },

  ruleText: { fontSize: 13, fontWeight: '700', color: COLORS.error }
});

