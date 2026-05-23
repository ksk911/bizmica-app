import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';

const API_BASE = 'http://192.168.1.7:5000';
const COMPANY_ID = 1;

// Haversine — client-side distance check to colour pins correctly
const haversineMetres = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const toRad = d => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Returns true if the supervisor's live location is inside ANY of their assigned sites
const isInsideAnysite = (sup) => {
  if (!sup.assigned_sites || sup.assigned_sites.length === 0) return null; // unknown — no sites assigned
  for (const site of sup.assigned_sites) {
    const dist = haversineMetres(
      parseFloat(sup.latitude), parseFloat(sup.longitude),
      parseFloat(site.site_lat), parseFloat(site.site_lng)
    );
    if (dist <= site.geofence_radius_m) return true;
  }
  return false;
};

export default function RegionalLiveMap() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [breachCount, setBreachCount] = useState(0);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/location/supervisors-live?company_id=${COMPANY_ID}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setSupervisors(data);
          // Count how many are currently in breach
          const breaches = data.filter(s => isInsideAnysite(s) === false).length;
          setBreachCount(breaches);
        }
      } catch (err) {
        console.error('Live map fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
    const interval = setInterval(fetchSupervisors, 10000);
    return () => clearInterval(interval);
  }, []);

  const getMapHtml = (sups) => {
    const centerLat = sups.length > 0 ? sups[0].latitude : 18.5204;
    const centerLng = sups.length > 0 ? sups[0].longitude : 73.8567;

    let markersJs = '';

    // Track which sites have already had their geofence circle drawn
    const drawnSites = new Set();

    sups.forEach(s => {
      const inside = isInsideAnysite(s);
      const markerColor = inside === null ? 'gray' : inside ? 'green' : 'red';
      const statusLabel = inside === null ? 'Unassigned' : inside ? '✅ In Zone' : '🚨 Out of Zone';

      // Draw the supervisor's live position marker
      markersJs += `
        var icon_${s.user_id} = L.divIcon({
          html: '<div style="background:${markerColor};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.4)"></div>',
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        L.marker([${s.latitude}, ${s.longitude}], { icon: icon_${s.user_id} })
          .addTo(map)
          .bindTooltip('<b>${s.full_name}</b><br>${statusLabel}', { permanent: true, direction: 'right', offset: [10, 0] })
          .bindPopup('<b>${s.full_name}</b> (${s.employee_id})<br>Status: ${statusLabel}<br>Live: ${parseFloat(s.latitude).toFixed(5)}, ${parseFloat(s.longitude).toFixed(5)}');
      `;

      // Draw geofence circles for each assigned site (deduplicated)
      if (s.assigned_sites && s.assigned_sites.length > 0) {
        s.assigned_sites.forEach(site => {
          if (!drawnSites.has(site.site_id)) {
            drawnSites.add(site.site_id);
            markersJs += `
              L.circle([${site.site_lat}, ${site.site_lng}], {
                color: '#00b3fe',
                fillColor: '#00b3fe',
                fillOpacity: 0.08,
                radius: ${site.geofence_radius_m},
                weight: 2,
                dashArray: '6, 4'
              }).addTo(map).bindPopup('<b>${site.site_name}</b><br>Geofence radius: ${site.geofence_radius_m}m');
              L.marker([${site.site_lat}, ${site.site_lng}], {
                icon: L.divIcon({
                  html: '<div style="background:#00b3fe22;border:2px solid #00b3fe;padding:4px 8px;border-radius:4px;font-size:11px;font-weight:700;color:#00b3fe;white-space:nowrap">${site.site_name}</div>',
                  className: '',
                  iconAnchor: [0, 0]
                })
              }).addTo(map);
            `;
          }
        });
      }
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style> body { padding: 0; margin: 0; } #map { height: 100vh; width: 100vw; } </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
          }).addTo(map);
          ${markersJs}
        </script>
      </body>
      </html>
    `;
  };

  const inZone = supervisors.filter(s => isInsideAnysite(s) === true).length;
  const outZone = supervisors.filter(s => isInsideAnysite(s) === false).length;
  const unassigned = supervisors.filter(s => isInsideAnysite(s) === null).length;

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        <View style={styles.mainContent}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
              <Text style={styles.loadingText}>Syncing Live Field Coordinates...</Text>
            </View>
          ) : Platform.OS === 'web' ? (
            <iframe
              srcDoc={getMapHtml(supervisors)}
              style={styles.mapWeb}
              title="Full Regional Live Map"
            />
          ) : (
            <WebView
              source={{ html: getMapHtml(supervisors) }}
              style={styles.mapNative}
            />
          )}

          {/* Floating Status Panel */}
          <View style={[styles.floatingPanel, !isWide && styles.floatingPanelMobile]} pointerEvents="box-none">
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Supervisor Status</Text>

              <View style={styles.filterOption}>
                <View style={[styles.dot, { backgroundColor: 'green' }]} />
                <Text style={styles.filterText}>In Zone ({inZone})</Text>
              </View>

              <View style={styles.filterOption}>
                <View style={[styles.dot, { backgroundColor: 'red' }]} />
                <Text style={styles.filterText}>Out of Zone ({outZone})</Text>
              </View>

              <View style={styles.filterOption}>
                <View style={[styles.dot, { backgroundColor: 'gray' }]} />
                <Text style={styles.filterText}>Unassigned ({unassigned})</Text>
              </View>

              <View style={[styles.filterOption, { borderBottomWidth: 0, marginTop: 8 }]}>
                <MaterialIcons name="radio-button-on" size={14} color={COLORS.secondary} />
                <Text style={[styles.filterText, { fontSize: 11, color: COLORS.onSurfaceVariant }]}>
                  Blue circle = assigned site boundary
                </Text>
              </View>

              {breachCount > 0 && (
                <View style={styles.alertBanner}>
                  <MaterialIcons name="warning" size={14} color={COLORS.error} />
                  <Text style={styles.alertBannerText}>{breachCount} supervisor(s) out of zone!</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: COLORS.secondary, fontWeight: '600' },
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, position: 'relative' },
  mapWeb: { width: '100%', height: '100%', border: 'none' },
  mapNative: { flex: 1 },
  floatingPanel: { position: 'absolute', top: 24, left: 24, paddingBottom: 24 },
  floatingPanelMobile: { top: 'auto', bottom: 24, left: 16, right: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.96)', padding: 20, borderRadius: 12, width: 280, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryContainer, marginBottom: 16 },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  filterText: { fontSize: 14, fontWeight: '600', color: COLORS.onSurface },
  dot: { width: 10, height: 10, borderRadius: 5 },
  alertBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: 'rgba(239,68,68,0.08)', padding: 10, borderRadius: 8 },
  alertBannerText: { fontSize: 12, fontWeight: '700', color: COLORS.error },
});
