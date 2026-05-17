import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width } = Dimensions.get('window');

const DirectorHistoricalTrends = ({ navigation }) => {
  const [chartType, setChartType] = useState('line');

  const renderChartCard = (title, color, icon) => (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{icon} {title}</Text>
        <TouchableOpacity style={styles.moreBtn}><Text style={styles.moreBtnText}>Details</Text></TouchableOpacity>
      </View>
      <View style={styles.chartPlaceholder}>
        <View style={styles.yAxis}>
          <Text style={styles.axisText}>100</Text>
          <Text style={styles.axisText}>50</Text>
          <Text style={styles.axisText}>0</Text>
        </View>
        <View style={styles.chartArea}>
          <Text style={[styles.placeholderText, { color }]}>[ {chartType.toUpperCase()} CHART ]</Text>
          <View style={styles.xAxis}>
            <Text style={styles.axisText}>Jan</Text>
            <Text style={styles.axisText}>Feb</Text>
            <Text style={styles.axisText}>Mar</Text>
            <Text style={styles.axisText}>Apr</Text>
            <Text style={styles.axisText}>May</Text>
            <Text style={styles.axisText}>Jun</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorHistoricalTrends">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headline}>Historical Trend Analysis</Text>
          <Text style={styles.subtitle}>Month-over-month analytics to identify systemic risks and patterns.</Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsCard}>
          <View style={styles.filtersWrapper}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Time Horizon</Text>
              <TextInput style={styles.filterInput} placeholder="Last 12 Months" editable={false} />
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Site Filter</Text>
              <TextInput style={styles.filterInput} placeholder="All Sites Globally" editable={false} />
            </View>
          </View>
          <View style={styles.toggleWrapper}>
            <TouchableOpacity 
              style={[styles.toggleBtn, chartType === 'line' && styles.toggleBtnActive]}
              onPress={() => setChartType('line')}
            >
              <Text style={[styles.toggleBtnText, chartType === 'line' && styles.toggleBtnTextActive]}>Line Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, chartType === 'bar' && styles.toggleBtnActive]}
              onPress={() => setChartType('bar')}
            >
              <Text style={[styles.toggleBtnText, chartType === 'bar' && styles.toggleBtnTextActive]}>Bar Chart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Charts Grid */}
        <View style={styles.chartsGrid}>
          {renderChartCard('Security Breach Trend', '#F44336', '🚨')}
          {renderChartCard('Maintenance Issue Trend', '#FF9800', '🔧')}
          {renderChartCard('Safety Violation Trend', '#FFC107', '⚠️')}
        </View>

        {/* Heatmap */}
        <View style={styles.heatmapCard}>
          <Text style={styles.chartTitle}>🗺️ Incident Heatmap (Last 12 Months)</Text>
          <Text style={styles.chartSub}>Clustered markers showing incident density across the country.</Text>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>[ Map Heatmap Render ]</Text>
            <View style={styles.legend}>
              <Text style={styles.legendText}>Density: </Text>
              <View style={[styles.legendBox, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Low</Text>
              <View style={[styles.legendBox, { backgroundColor: '#FFC107' }]} />
              <Text style={styles.legendText}>Med</Text>
              <View style={[styles.legendBox, { backgroundColor: '#F44336' }]} />
              <Text style={styles.legendText}>High</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </DirectorLayout>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 32, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 32 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },

  controlsCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    marginBottom: 24, flexDirection: width > 768 ? 'row' : 'column', justifyContent: 'space-between', alignItems: width > 768 ? 'center' : 'stretch', gap: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  filtersWrapper: { flexDirection: 'row', gap: 16, flex: 1 },
  filterGroup: { flex: 1 },
  filterLabel: { ...theme.typography.label, color: theme.colors.outlineVariant, marginBottom: 8 },
  filterInput: { backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, padding: 12, ...theme.typography.bodyMd },
  
  toggleWrapper: { flexDirection: 'row', backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, padding: 4 },
  toggleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  toggleBtnActive: { backgroundColor: theme.colors.surfaceContainerLowest, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  toggleBtnText: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, fontWeight: '600' },
  toggleBtnTextActive: { color: theme.colors.primary },

  chartsGrid: { gap: 24, marginBottom: 24 },
  chartCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  chartTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, fontSize: 18 },
  moreBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 6 },
  moreBtnText: { ...theme.typography.bodySm, color: theme.colors.primary, fontWeight: '600' },

  chartPlaceholder: { flexDirection: 'row', height: 250 },
  yAxis: { justifyContent: 'space-between', paddingRight: 12, paddingBottom: 24, borderRightWidth: 1, borderRightColor: theme.colors.outlineVariant },
  axisText: { ...theme.typography.bodySm, color: theme.colors.outline, fontSize: 11 },
  chartArea: { flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  placeholderText: { ...theme.typography.headline, fontWeight: '800', opacity: 0.5 },
  xAxis: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: theme.colors.outlineVariant, paddingTop: 8 },

  heatmapCard: {
    backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
  },
  chartSub: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, marginBottom: 16 },
  mapPlaceholder: {
    height: 300, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', position: 'relative',
    borderWidth: 1, borderColor: theme.colors.outlineVariant,
  },
  mapText: { ...theme.typography.title, color: theme.colors.outline },
  legend: { position: 'absolute', bottom: 16, right: 16, backgroundColor: '#FFF', padding: 8, borderRadius: 6, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  legendText: { fontSize: 11, color: theme.colors.onSurfaceVariant, marginHorizontal: 4 },
  legendBox: { width: 12, height: 12, borderRadius: 2 },
});

export default DirectorHistoricalTrends;
