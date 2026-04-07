import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';

const KPICard = ({ title, value, detail, type, icon, color }) => (
  <View style={[styles.kpiCard, { borderBottomColor: color }]}>
    <Text style={styles.kpiTitle}>{title}</Text>
    <View style={styles.kpiValueRow}>
      <Text style={[styles.kpiValue, { color: type === 'error' ? COLORS.error : COLORS.primaryContainer }]}>{value}</Text>
      <View style={styles.kpiDetailRow}>
        {icon && <MaterialIcons name={icon} size={14} color={color} />}
        <Text style={[styles.kpiDetail, { color }]}>{detail}</Text>
      </View>
    </View>
    {/* Progress Bar / Indicator */}
    {type === 'progress' && (
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: value, backgroundColor: color }]} />
      </View>
    )}
  </View>
);

export default function RegionalDashboard({ navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  return (
    <View style={styles.container}>
      <TopNavBar />

      <View style={styles.layout}>
        {isWide && <SideNavBar />}

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={[styles.headerRow, !isWide && { flexDirection: 'column', alignItems: 'flex-start', gap: 16 }]}>
            <View>
              <Text style={styles.pageTitle}>Regional Command Center</Text>
              <Text style={styles.pageSubtitle}>Monitoring Pune-Mumbai Corridor Performance</Text>
            </View>
            <View style={styles.headerButtons}>
              <TouchableOpacity style={styles.filterBtn}>
                <MaterialIcons name="filter-list" size={18} color={COLORS.primaryContainer} />
                <Text style={styles.filterBtnText}>Filters</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exportBtn}>
                <MaterialIcons name="file-download" size={18} color={COLORS.onPrimary} />
                <Text style={styles.exportBtnText}>Export PDF</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* KPI Grid */}
          <View style={[styles.kpiGrid, !isWide && styles.kpiGridMobile]}>
            <KPICard title="Punctuality" value="98.4%" detail="1.2%" type="progress" icon="arrow-upward" color={COLORS.secondary} />
            <KPICard title="Checklist Completion" value="92%" detail="0%" type="progress" icon="horizontal-rule" color={COLORS.secondaryContainer} />
            <TouchableOpacity onPress={() => navigation.navigate('RegionalSOSConsole')} style={{ flex: 1, minWidth: 220, marginBottom: 16 }}>
              <KPICard title="Active SOS" value="2" detail="Critical" type="error" color={COLORS.error} />
            </TouchableOpacity>
            <KPICard title="Regional Hotspots" value="14" detail="Active Sites" type="info" color={COLORS.primaryContainer} />
          </View>

          {/* Map and Sidebar Layout */}
          <View style={[styles.middleLayout, !isWide && { flexDirection: 'column', height: 'auto' }]}>
            
            {/* Interactive Map */}
            <View style={[styles.mapContainer, !isWide && { height: 300 }]}>
              {Platform.OS === 'web' ? (
                <iframe 
                  src="https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.4,74.1,19.4&layer=mapnik&marker=18.5204,73.8567" 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Regional Live Map"
                />
              ) : (
                <WebView 
                  source={{ uri: 'https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.4,74.1,19.4&layer=mapnik&marker=18.5204,73.8567' }} 
                  style={styles.mapImage} 
                />
              )}
              <View style={styles.mapOverlayTopLeft} pointerEvents="none">
                <Text style={styles.mapOverlayTitle}>Live Personnel</Text>
                <View style={styles.mapOverlayRow}><Text style={styles.mapOverlayLabel}>Supervisors</Text><Text style={styles.mapOverlayValue}>08</Text></View>
                <View style={styles.mapOverlayRow}><Text style={styles.mapOverlayLabel}>Field Officers</Text><Text style={styles.mapOverlayValue}>24</Text></View>
              </View>
            </View>

            {/* Heatmap & Flow Sidebar */}
            <View style={[styles.heatmapSidebar, !isWide && { width: '100%' }]}>
              <View style={styles.heatmapCard}>
                <View style={styles.heatmapCardHeader}>
                  <Text style={styles.heatmapTitle}>REGIONAL HEATMAP</Text>
                </View>
                <View style={styles.heatmapImageContainer}>
                  <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600' }} 
                    style={styles.heatmapImage} 
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.heatmapCardFooter}>
                  <Text style={styles.heatmapFooterText}>
                    High density detected in <Text style={styles.heatmapHighlight}>Navi Mumbai Industrial Zone</Text>. Deployment recommended.
                  </Text>
                </View>
              </View>
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  pageTitle: { fontSize: 28, fontWeight: '800', color: COLORS.primaryContainer, letterSpacing: -0.5 },
  pageSubtitle: { fontSize: 16, color: COLORS.onSurfaceVariant, fontWeight: '500', marginTop: 4 },
  headerButtons: { flexDirection: 'row', gap: 12 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.surfaceContainerLow, borderRadius: 6 },
  filterBtnText: { color: COLORS.primaryContainer, fontWeight: '700', fontSize: 14 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: COLORS.primaryContainer, borderRadius: 6 },
  exportBtnText: { color: COLORS.onPrimary, fontWeight: '700', fontSize: 14 },
  
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between' },
  kpiGridMobile: { flexDirection: 'column' },
  kpiCard: { flex: 1, minWidth: 220, marginBottom: 16, backgroundColor: COLORS.surfaceContainerLowest, padding: 24, borderRadius: 12, borderBottomWidth: 3, borderBottomColor: 'transparent', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  kpiTitle: { fontSize: 12, fontWeight: '700', color: COLORS.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  kpiValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  kpiValue: { fontSize: 32, fontWeight: '800' },
  kpiDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  kpiDetail: { fontSize: 12, fontWeight: '700' },
  progressBarBg: { width: '100%', height: 4, backgroundColor: COLORS.surfaceContainer, borderRadius: 2, marginTop: 16, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },

  middleLayout: { flexDirection: 'row', gap: 32, height: 500 },
  mapContainer: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  mapImage: { width: '100%', height: '100%', opacity: 0.8 },
  mapOverlayTopLeft: { position: 'absolute', top: 24, left: 24, backgroundColor: 'rgba(255,255,255,0.9)', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(196,198,206,0.2)', width: 220, ...Platform.select({ web: { backdropFilter: 'blur(8px)' } }) },
  mapOverlayTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primaryContainer, marginBottom: 8 },
  mapOverlayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  mapOverlayLabel: { fontSize: 12, fontWeight: '500', color: COLORS.onSurfaceVariant },
  mapOverlayValue: { fontSize: 12, fontWeight: '800', color: COLORS.primaryContainer },

  heatmapSidebar: { width: 320, flexDirection: 'column', gap: 24 },
  heatmapCard: { backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 20, elevation: 2 },
  heatmapCardHeader: { padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(196,198,206,0.1)' },
  heatmapTitle: { fontSize: 12, fontWeight: '700', color: COLORS.primaryContainer, letterSpacing: 1.5 },
  heatmapImageContainer: { height: 200, backgroundColor: '#e0e3e5' },
  heatmapImage: { width: '100%', height: '100%', opacity: 0.85 },
  heatmapCardFooter: { padding: 16, backgroundColor: COLORS.surfaceContainerLow },
  heatmapFooterText: { fontSize: 11, color: COLORS.onSurfaceVariant, lineHeight: 18 },
  heatmapHighlight: { color: COLORS.secondary, fontWeight: '700' }
});

