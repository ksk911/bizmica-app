import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorOfficerBenchmarking = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="OfficerBenchmarking" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Officer Performance Benchmarking</Text>
            <Text style={styles.subtitle}>Multi-axis ranking and comparative analytics for national workforce tiers.</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tier 1 Officers</Text>
              <Text style={styles.statValue}>847</Text>
              <Text style={styles.statSub}>95%+ Punctuality</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Tier 2 Officers</Text>
              <Text style={[styles.statValue, { color: '#9a6700' }]}>421</Text>
              <Text style={styles.statSub}>85–94% Punctuality</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Below Standard</Text>
              <Text style={[styles.statValue, { color: theme.colors.error }]}>152</Text>
              <Text style={styles.statSub}>Under 85%</Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 24 }]}>
            <Text style={styles.cardHeaderSmall}>TIER DISTRIBUTION</Text>
            <View style={styles.chartPlaceholder}>
              <Text style={styles.placeholderLabel}>[Scatter Plot / Bell Curve Visualization]</Text>
            </View>
            <View style={styles.legendGroup}>
              <Text style={styles.legendTextTier1}>● Tier 1 (95%+)</Text>
              <Text style={styles.legendTextTier2}>● Tier 2 (85–94%)</Text>
              <Text style={styles.legendTextRed}>● Below Standard</Text>
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
  statsRow: { flexDirection: width > 768 ? 'row' : 'column', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 28, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.04, shadowRadius: 24, ...Platform.select({ default: { elevation: 2 } }) },
  statLabel: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, marginBottom: 8 },
  statValue: { fontSize: 40, fontWeight: '700', color: theme.colors.secondary, fontFamily: Platform.OS === 'web' ? 'Manrope, sans-serif' : 'System' },
  statSub: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, marginTop: 4 },
  card: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }) },
  cardHeaderSmall: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, marginBottom: 16 },
  chartPlaceholder: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, minHeight: 320, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  placeholderLabel: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant },
  legendGroup: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  legendTextTier1: { ...theme.typography.bodyMd, color: theme.colors.secondary, fontWeight: '600' },
  legendTextTier2: { ...theme.typography.bodyMd, color: '#9a6700', fontWeight: '600' },
  legendTextRed: { ...theme.typography.bodyMd, color: theme.colors.error, fontWeight: '600' },
});

export default DirectorOfficerBenchmarking;
