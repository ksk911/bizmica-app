import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorSiteAllocation = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="SiteAllocation" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Site Allocation Console</Text>
            <Text style={styles.subtitle}>Manage regional site parameters, guard density, and high-risk deployments.</Text>
          </View>

          <View style={styles.splitLayout}>
            <View style={[styles.card, { flex: 2 }]}>
              <Text style={styles.cardTitle}>Territory Map</Text>
              <View style={styles.mapPlaceholder}>
                <Text style={styles.placeholderLabel}>[Interactive Map UI]</Text>
              </View>
            </View>

            <View style={[styles.card, { flex: 1 }]}>
              <Text style={styles.cardHeaderSmall}>ACTIONS</Text>
              <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>+ Add New Site</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryButton, { marginTop: 12 }]}><Text style={styles.secondaryButtonText}>Re-allocate Assets</Text></TouchableOpacity>
              <View style={styles.statsDivider} />
              <Text style={styles.cardHeaderSmall}>REGIONAL STATS</Text>
              <Text style={styles.statLabel}>Active Sites</Text>
              <Text style={styles.statValue}>142</Text>
              <Text style={[styles.statLabel, { marginTop: 16 }]}>At-Risk Deployments</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>4</Text>
            </View>
          </View>
        </ScrollView>
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
  splitLayout: { flexDirection: width > 1024 ? 'row' : 'column', gap: 24 },
  card: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }) },
  cardTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 24 },
  cardHeaderSmall: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, marginBottom: 16 },
  mapPlaceholder: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, minHeight: 400, alignItems: 'center', justifyContent: 'center' },
  placeholderLabel: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant },
  primaryButton: { backgroundColor: theme.colors.primaryContainer, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { ...theme.typography.bodyMd, color: theme.colors.onPrimary, fontWeight: '600' },
  secondaryButton: { backgroundColor: theme.colors.surfaceContainerLow, paddingVertical: 14, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.outlineVariant },
  secondaryButtonText: { ...theme.typography.bodyMd, color: theme.colors.primaryContainer, fontWeight: '600' },
  statsDivider: { height: 1, backgroundColor: theme.colors.outlineVariant, marginVertical: 28, opacity: 0.3 },
  statLabel: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  statValue: { fontSize: 36, fontWeight: '700', color: theme.colors.secondary, fontFamily: Platform.OS === 'web' ? 'Manrope, sans-serif' : 'System' },
});

export default DirectorSiteAllocation;
