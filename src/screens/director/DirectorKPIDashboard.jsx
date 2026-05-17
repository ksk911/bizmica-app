import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width } = Dimensions.get('window');

const DirectorKPIDashboard = ({ navigation }) => {
  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorKPI">
        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Executive Overview</Text>
            <Text style={styles.subtitle}>Real-time performance metrics and strategic operational insights across all national assets.</Text>
          </View>

          <View style={styles.kpiGrid}>
            <View style={styles.row}>
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.cardHeaderSmall}>METRICS</Text>
                <Text style={styles.cardTitle}>Punctuality Score</Text>
                <Text style={styles.scoreText}>98.4%</Text>
                <Text style={styles.scoreSubText}>+1.2% this month</Text>
              </View>
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.cardHeaderSmall}>METRICS</Text>
                <Text style={styles.cardTitle}>Completion Radar</Text>
                <View style={styles.radarPlaceholder}>
                  <Text style={styles.placeholderLabel}>[Radar Chart]</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.card, { flex: 2 }]}>
                <Text style={styles.cardHeaderSmall}>GEOSPATIAL</Text>
                <Text style={styles.cardTitle}>National Heatmap</Text>
                <View style={styles.mapPlaceholder}>
                  <Text style={styles.placeholderLabel}>[Map Visualization]</Text>
                  <Text style={styles.cardBody}>Incident Frequency: High in Northern Corridor</Text>
                </View>
              </View>
              <View style={[styles.card, { flex: 1 }]}>
                <Text style={styles.cardHeaderSmall}>TRENDS</Text>
                <Text style={styles.cardTitle}>Trend (MoM)</Text>
                <View style={styles.trendPlaceholder}>
                  <Text style={styles.placeholderLabel}>[Line Chart]</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.card, { flex: 2 }]}>
                <Text style={styles.cardHeaderSmall}>HR METRICS</Text>
                <Text style={styles.cardTitle}>Officer Metrics Table</Text>
                <View style={styles.tablePlaceholder}>
                  <Text style={styles.placeholderLabel}>[Data Table]</Text>
                </View>
              </View>
              <View style={[styles.card, styles.exportCard, { flex: 1 }]}>
                <Text style={styles.cardHeaderSmall}>BRANDING</Text>
                <Text style={styles.cardTitleLight}>White-Label Export</Text>
                <Text style={styles.cardBodyLight}>Generate executive reports with your company branding.</Text>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Export Report</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
    </DirectorLayout>
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
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant, maxWidth: 800 },
  kpiGrid: { gap: 24 },
  row: { flexDirection: width > 768 ? 'row' : 'column', gap: 24 },
  card: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, minHeight: 200, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }) },
  exportCard: { backgroundColor: theme.colors.primaryContainer },
  cardHeaderSmall: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
  cardTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 12 },
  cardTitleLight: { ...theme.typography.title, color: theme.colors.onPrimary, marginBottom: 12 },
  cardBody: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, lineHeight: 22 },
  cardBodyLight: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant, lineHeight: 22, marginBottom: 24 },
  scoreText: { fontSize: 48, fontWeight: '700', color: theme.colors.secondary, fontFamily: Platform.OS === 'web' ? 'Manrope, sans-serif' : 'System' },
  scoreSubText: { ...theme.typography.bodyMd, color: '#34a853', fontWeight: '600', marginTop: 8 },
  radarPlaceholder: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 120 },
  mapPlaceholder: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 200, marginBottom: 16 },
  trendPlaceholder: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 180 },
  tablePlaceholder: { flex: 1, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  placeholderLabel: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant },
  primaryButton: { backgroundColor: theme.colors.secondary, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, alignItems: 'center', marginTop: 'auto' },
  primaryButtonText: { ...theme.typography.bodyMd, color: theme.colors.onPrimary, fontWeight: '600' },
});

export default DirectorKPIDashboard;
