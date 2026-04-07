import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorReportingModals = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState('none');

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="ReportingModals" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Reporting & Export</Text>
            <Text style={styles.subtitle}>Manage executive-level reporting schedules, white-label exports, and secure session management.</Text>
          </View>

          <View style={styles.cardRow}>
            <TouchableOpacity style={styles.actionCard} onPress={() => setModalVisible('scheduled')}>
              <Text style={styles.actionCardTitle}>Scheduled Reporting</Text>
              <Text style={styles.actionCardBody}>Configure automated delivery of KPI abstracts to executive inboxes on a weekly or monthly cycle.</Text>
              <Text style={styles.actionCardCTA}>Configure →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={() => setModalVisible('export')}>
              <Text style={styles.actionCardTitle}>Export Preview</Text>
              <Text style={styles.actionCardBody}>Generate a white-labeled executive report branded with your company identity to share with stakeholders.</Text>
              <Text style={styles.actionCardCTA}>Preview →</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionCard, { borderColor: theme.colors.error, borderWidth: 1 }]} onPress={() => setModalVisible('logout')}>
              <Text style={[styles.actionCardTitle, { color: theme.colors.error }]}>End Session</Text>
              <Text style={styles.actionCardBody}>Securely terminate the current executive session and return to the authentication portal.</Text>
              <Text style={[styles.actionCardCTA, { color: theme.colors.error }]}>Sign Out →</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Shared Modal */}
        <Modal transparent visible={modalVisible !== 'none'} animationType="fade">
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              {modalVisible === 'scheduled' && (
                <>
                  <Text style={styles.modalTitle}>Configure Scheduled Report</Text>
                  <Text style={styles.modalBody}>Set automated delivery for Executive KPI abstracts to your inbox.</Text>
                  <View style={styles.fakeInput}><Text style={styles.fakeInputText}>Frequency: Weekly (Mondays 08:00 AM IST)</Text></View>
                  <View style={styles.fakeInput}><Text style={styles.fakeInputText}>Format: PDF & Raw CSV</Text></View>
                </>
              )}
              {modalVisible === 'export' && (
                <>
                  <Text style={styles.modalTitle}>White-Label Export Preview</Text>
                  <Text style={styles.modalBody}>Generating a branded layout with your company identity applied to a standard KPI layout.</Text>
                  <View style={styles.previewBox}><Text style={styles.previewBoxText}>[Document Preview Render]</Text></View>
                </>
              )}
              {modalVisible === 'logout' && (
                <>
                  <Text style={[styles.modalTitle, { color: theme.colors.error }]}>End Secure Session?</Text>
                  <Text style={styles.modalBody}>You are about to sign out of the Executive Portal. All unsaved configuration overrides will be discarded.</Text>
                </>
              )}
              <View style={styles.modalFooter}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible('none')}>
                  <Text style={styles.cancelBtnText}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.confirmBtn, modalVisible === 'logout' && { backgroundColor: theme.colors.error }]}
                  onPress={() => { setModalVisible('none'); if (modalVisible === 'logout') navigation.navigate('ExecutiveLogin'); }}
                >
                  <Text style={styles.confirmBtnText}>{modalVisible === 'logout' ? 'Sign Out' : 'Confirm'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  layout: { flex: 1, flexDirection: 'row' },
  layoutMobile: { flexDirection: 'column' },
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 64, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 48 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },
  cardRow: { flexDirection: width > 1024 ? 'row' : 'column', gap: 24 },
  actionCard: { flex: 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 }, web: { cursor: 'pointer' } }) },
  actionCardTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 16 },
  actionCardBody: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, lineHeight: 22, marginBottom: 24 },
  actionCardCTA: { ...theme.typography.bodyMd, color: theme.colors.secondary, fontWeight: '700' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(10, 37, 64, 0.5)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalBox: { width: '100%', maxWidth: 520, backgroundColor: theme.colors.surfaceContainerLowest, padding: 40, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.12, shadowRadius: 48 },
  modalTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 12 },
  modalBody: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant, marginBottom: 32, lineHeight: 24 },
  fakeInput: { borderBottomWidth: 1, borderBottomColor: theme.colors.outlineVariant, paddingVertical: 12, marginBottom: 16 },
  fakeInputText: { ...theme.typography.bodyMd, color: theme.colors.primaryContainer },
  previewBox: { backgroundColor: theme.colors.surfaceContainerLow, height: 200, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  previewBoxText: { color: theme.colors.outlineVariant, ...theme.typography.bodyMd },
  modalFooter: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  cancelBtnText: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, fontWeight: '600' },
  confirmBtn: { backgroundColor: theme.colors.primaryContainer, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  confirmBtnText: { ...theme.typography.bodyMd, color: theme.colors.onPrimary, fontWeight: '600' },
});

export default DirectorReportingModals;
