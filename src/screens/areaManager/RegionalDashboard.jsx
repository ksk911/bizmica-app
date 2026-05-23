import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions, Platform, Image, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import GeofenceAlertPanel from '../../components/GeofenceAlertPanel';

const API_BASE = 'http://192.168.1.7:5000'; // Match PC IP

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
  
  const [targetLocation, setTargetLocation] = useState(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [activeSosCount, setActiveSosCount] = useState(0);

  useEffect(() => {
    const fetchLatestLocation = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/sos`);
        const data = await res.json();
        
        if (data && data.length > 0) {
          const openSosCount = data.filter(s => s.status === 'OPEN').length;
          setActiveSosCount(openSosCount);
          const latest = data[0];
          setTargetLocation({ lat: latest.trigger_latitude, lng: latest.trigger_longitude });
        } else {
          setActiveSosCount(0);
          const incidentRes = await fetch(`${API_BASE}/api/incidents`);
          const incidentData = await incidentRes.json();
          if (incidentData && incidentData.length > 0) {
            const latestInc = incidentData[0];
            setTargetLocation({ lat: latestInc.latitude, lng: latestInc.longitude });
          } else {
            setTargetLocation({ lat: 18.5204, lng: 73.8567 });
          }
        }
      } catch (err) {
        console.error("Dashboard map fetch error:", err);
        setTargetLocation({ lat: 18.5204, lng: 73.8567 });
      } finally {
        setMapLoading(false);
      }
    };

    fetchLatestLocation();
    const interval = setInterval(fetchLatestLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  const getMapUrl = () => {
    if (!targetLocation) return '';
    const lat = parseFloat(targetLocation.lat);
    const lng = parseFloat(targetLocation.lng);
    const offset = 0.01;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset},${lat - offset},${lng + offset},${lat + offset}&layer=mapnik&marker=${lat},${lng}`;
  };

  return (
    <View style={styles.container}>
      <TopNavBar />

      <View style={styles.layout}>
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
            <TouchableOpacity onPress={() => navigation.navigate('IncidentHubReview', { filter: 'sos' })} style={{ flex: 1, minWidth: 220, marginBottom: 16 }}>
              <KPICard 
                title="Active SOS" 
                value={activeSosCount.toString()} 
                detail={activeSosCount > 0 ? "Critical" : "All Clear"} 
                type={activeSosCount > 0 ? "error" : "info"} 
                color={activeSosCount > 0 ? COLORS.error : COLORS.secondary} 
              />
            </TouchableOpacity>
            <KPICard title="Regional Hotspots" value="14" detail="Active Sites" type="info" color={COLORS.primaryContainer} />
          </View>

          {/* Geofence Breach Alerts */}
          <GeofenceAlertPanel company_id={1} />

          {/* Map and Sidebar Layout */}
          <View style={[styles.middleLayout, !isWide && { flexDirection: 'column', height: 'auto' }]}>
            
            {/* Interactive Map */}
            <View style={[styles.mapContainer, !isWide && { height: 300 }]}>
              {mapLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Syncing Live Location...</Text>
                </View>
              ) : Platform.OS === 'web' ? (
                <iframe 
                  src={getMapUrl()} 
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  title="Regional Live Map"
                />
              ) : (
                <WebView 
                  source={{ uri: getMapUrl() }} 
                  style={styles.mapImage} 
                />
              )}
              <View style={styles.mapOverlayTopLeft} pointerEvents="none">
                <Text style={styles.mapOverlayTitle}>Live Personnel</Text>
                <View style={styles.mapOverlayRow}><Text style={styles.mapOverlayLabel}>Supervisors</Text><Text style={styles.mapOverlayValue}>08</Text></View>
                <View style={styles.mapOverlayRow}><Text style={styles.mapOverlayLabel}>Field Officers</Text><Text style={styles.mapOverlayValue}>24</Text></View>
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

  middleLayout: { flexDirection: 'row', gap: 32, height: 400 },
  mapContainer: { flex: 1, backgroundColor: COLORS.surfaceContainerLowest, borderRadius: 16, borderWidth: 3, borderColor: '#111827', overflow: 'hidden', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 4 },
  mapImage: { width: '100%', height: '100%', opacity: 0.8 },
  mapOverlayTopLeft: { position: 'absolute', top: 24, left: 24, backgroundColor: 'rgba(255,255,255,0.9)', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(196,198,206,0.2)', width: 220, ...Platform.select({ web: { backdropFilter: 'blur(8px)' } }) },
  mapOverlayTitle: { fontSize: 14, fontWeight: '800', color: COLORS.primaryContainer, marginBottom: 8 },
  mapOverlayRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  mapOverlayLabel: { fontSize: 12, fontWeight: '500', color: COLORS.onSurfaceVariant },
  mapOverlayValue: { fontSize: 12, fontWeight: '800', color: COLORS.primaryContainer },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '600', color: COLORS.primary },


});

