import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  TextInput, Alert, ActivityIndicator, useWindowDimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';

const API_BASE = 'http://192.168.1.7:5000';
const MANAGER_ID = 2;
const COMPANY_ID = 1;
const REGION_ID = 1;

export default function GeofenceDrawingMap({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  // Supervisor info passed via navigation params
  const supervisor = route?.params?.supervisor || { id: null, full_name: 'Unknown', employee_id: '—' };
  const existingAssignment = route?.params?.existingAssignment || null;

  const [circleLat, setCircleLat] = useState(existingAssignment?.site_lat || null);
  const [circleLng, setCircleLng] = useState(existingAssignment?.site_lng || null);
  const [radius, setRadius] = useState(existingAssignment?.geofence_radius_m || 200);
  const [siteName, setSiteName] = useState(existingAssignment?.site_name || '');
  const [saving, setSaving] = useState(false);

  // Build the Leaflet HTML with click-to-place-circle + drag support
  const getMapHtml = () => {
    const centerLat = circleLat || 18.5591;
    const centerLng = circleLng || 73.7766;
    const hasCircle = circleLat && circleLng;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; }
          #map { height: 100vh; width: 100vw; cursor: crosshair; }
          .info-bar {
            position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
            z-index: 1000; background: rgba(255,255,255,0.95); padding: 10px 20px;
            border-radius: 24px; font-size: 13px; font-weight: 600;
            box-shadow: 0 2px 12px rgba(0,0,0,0.15); color: #333;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <div class="info-bar" id="infoBar">
          ${hasCircle ? '🟢 Geofence placed — drag the marker to move it, or click elsewhere to reposition' : '📍 Click anywhere on the map to place the geofence center'}
        </div>
        <script>
          var map = L.map('map').setView([${centerLat}, ${centerLng}], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: '© OpenStreetMap'
          }).addTo(map);

          var marker = null;
          var circle = null;
          var currentRadius = ${radius};

          function placeGeofence(lat, lng) {
            if (marker) { map.removeLayer(marker); }
            if (circle) { map.removeLayer(circle); }

            marker = L.marker([lat, lng], { draggable: true }).addTo(map);
            circle = L.circle([lat, lng], {
              radius: currentRadius,
              color: '#00b3fe',
              fillColor: '#00b3fe',
              fillOpacity: 0.15,
              weight: 2
            }).addTo(map);

            marker.bindTooltip('${supervisor.full_name} — Geofence Center', {
              permanent: true, direction: 'right', offset: [12, 0]
            });

            // When marker is dragged, update circle and notify React Native
            marker.on('dragend', function(e) {
              var pos = e.target.getLatLng();
              circle.setLatLng(pos);
              notifyParent(pos.lat, pos.lng);
            });

            notifyParent(lat, lng);
            document.getElementById('infoBar').innerHTML = '🟢 Geofence placed — drag the marker to move it, or click elsewhere to reposition';
          }

          function notifyParent(lat, lng) {
            // Communicate back to React Native / iframe parent
            try {
              window.parent.postMessage(JSON.stringify({ type: 'geofence', lat: lat, lng: lng }), '*');
            } catch(e) {}
          }

          // Click to place
          map.on('click', function(e) {
            placeGeofence(e.latlng.lat, e.latlng.lng);
          });

          // Listen for radius updates from parent
          window.addEventListener('message', function(e) {
            try {
              var data = JSON.parse(e.data);
              if (data.type === 'setRadius' && circle) {
                currentRadius = data.radius;
                circle.setRadius(data.radius);
              }
            } catch(ex) {}
          });

          ${hasCircle ? `placeGeofence(${circleLat}, ${circleLng});` : ''}
        </script>
      </body>
      </html>
    `;
  };

  // Listen for postMessage from the iframe (map click coordinates)
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    const handler = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'geofence') {
          setCircleLat(data.lat);
          setCircleLng(data.lng);
        }
      } catch (e) { /* ignore non-JSON messages */ }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Send radius changes to the iframe
  const updateRadius = (newRadius) => {
    setRadius(newRadius);
    if (Platform.OS === 'web') {
      try {
        const iframe = document.querySelector('#geofence-map-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(JSON.stringify({ type: 'setRadius', radius: newRadius }), '*');
        }
      } catch (e) {}
    }
  };

  // Save the drawn geofence
  const handleSave = async () => {
    if (!circleLat || !circleLng) {
      Alert.alert('No Geofence', 'Please click on the map to place a geofence circle first.');
      return;
    }
    if (!siteName.trim()) {
      Alert.alert('Name Required', 'Please enter a name for this patrol zone.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/assignments/create-and-assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supervisor_id: supervisor.id,
          assigned_by: MANAGER_ID,
          company_id: COMPANY_ID,
          region_id: REGION_ID,
          site_name: siteName.trim(),
          latitude: circleLat,
          longitude: circleLng,
          geofence_radius_m: radius
        })
      });
      const data = await res.json();

      if (res.ok) {
        Alert.alert('✅ Saved', `${supervisor.full_name} has been assigned to "${siteName.trim()}"`, [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', data.error || 'Failed to save.');
      }
    } catch (err) {
      Alert.alert('Connection Error', 'Could not reach the server.');
      console.error('Save geofence error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        {/* Map */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              id="geofence-map-iframe"
              srcDoc={getMapHtml()}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title="Geofence Drawing Map"
            />
          ) : (
            <Text style={{ padding: 40, color: COLORS.onSurfaceVariant }}>Map drawing is only supported on web.</Text>
          )}
        </View>

        {/* Right Panel — Controls */}
        <View style={[styles.controlPanel, !isWide && styles.controlPanelMobile]}>
          {/* Supervisor Info */}
          <View style={styles.supervisorCard}>
            <View style={styles.supervisorIcon}>
              <MaterialIcons name="person" size={24} color={COLORS.secondary} />
            </View>
            <View>
              <Text style={styles.supervisorName}>{supervisor.full_name}</Text>
              <Text style={styles.supervisorId}>{supervisor.employee_id}</Text>
            </View>
          </View>

          {/* Zone Name Input */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>PATROL ZONE NAME</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. North Gate HQ, Baner Office..."
              placeholderTextColor={COLORS.onSurfaceVariant}
              value={siteName}
              onChangeText={setSiteName}
            />
          </View>

          {/* Radius Control */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>GEOFENCE RADIUS</Text>
            <View style={styles.radiusRow}>
              <TouchableOpacity
                style={styles.radiusBtn}
                onPress={() => updateRadius(Math.max(50, radius - 50))}
              >
                <MaterialIcons name="remove" size={20} color={COLORS.primaryContainer} />
              </TouchableOpacity>
              <Text style={styles.radiusValue}>{radius}m</Text>
              <TouchableOpacity
                style={styles.radiusBtn}
                onPress={() => updateRadius(Math.min(2000, radius + 50))}
              >
                <MaterialIcons name="add" size={20} color={COLORS.primaryContainer} />
              </TouchableOpacity>
            </View>
            <View style={styles.radiusPresets}>
              {[100, 200, 500, 1000].map(r => (
                <TouchableOpacity
                  key={r}
                  style={[styles.presetBtn, radius === r && styles.presetBtnActive]}
                  onPress={() => updateRadius(r)}
                >
                  <Text style={[styles.presetText, radius === r && styles.presetTextActive]}>{r}m</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Coordinates Display */}
          {circleLat && circleLng && (
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>GEOFENCE CENTER</Text>
              <Text style={styles.coordsText}>
                {parseFloat(circleLat).toFixed(6)}, {parseFloat(circleLng).toFixed(6)}
              </Text>
            </View>
          )}

          {/* Instructions */}
          <View style={styles.instructionsBox}>
            <MaterialIcons name="info-outline" size={16} color={COLORS.secondary} />
            <Text style={styles.instructionsText}>
              Click on the map to place the geofence center. Drag the marker to reposition. Adjust radius with controls above.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving
                ? <ActivityIndicator size="small" color="#fff" />
                : <MaterialIcons name="check" size={18} color="#fff" />
              }
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save & Assign'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },

  mapContainer: { flex: 1 },

  controlPanel: {
    width: 360, backgroundColor: COLORS.surfaceContainerLowest,
    borderLeftWidth: 1, borderLeftColor: 'rgba(196,198,206,0.3)',
    padding: 28, gap: 24, overflow: 'scroll'
  },
  controlPanelMobile: { width: '100%', maxHeight: 300 },

  supervisorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: 'rgba(0,179,254,0.06)', padding: 16, borderRadius: 12,
    borderWidth: 1, borderColor: 'rgba(0,179,254,0.15)'
  },
  supervisorIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(0,179,254,0.1)', alignItems: 'center', justifyContent: 'center'
  },
  supervisorName: { fontSize: 16, fontWeight: '700', color: COLORS.primaryContainer },
  supervisorId: { fontSize: 12, color: COLORS.onSurfaceVariant, marginTop: 2 },

  fieldGroup: { gap: 8 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: COLORS.onSurfaceVariant, letterSpacing: 1.5 },

  textInput: {
    backgroundColor: COLORS.surfaceContainerLow, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 14, fontWeight: '600', color: COLORS.primaryContainer,
    borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)'
  },

  radiusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  radiusBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.surfaceContainerLow,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)'
  },
  radiusValue: { fontSize: 28, fontWeight: '800', color: COLORS.primaryContainer, minWidth: 80, textAlign: 'center' },

  radiusPresets: { flexDirection: 'row', gap: 8, marginTop: 4 },
  presetBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 6,
    backgroundColor: COLORS.surfaceContainerLow, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)'
  },
  presetBtnActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  presetText: { fontSize: 12, fontWeight: '700', color: COLORS.onSurfaceVariant },
  presetTextActive: { color: '#fff' },

  coordsText: { fontSize: 13, fontWeight: '600', color: COLORS.primaryContainer, fontFamily: 'monospace' },

  instructionsBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: 'rgba(0,179,254,0.05)', padding: 12, borderRadius: 8
  },
  instructionsText: { flex: 1, fontSize: 12, color: COLORS.onSurfaceVariant, lineHeight: 18 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 8,
    backgroundColor: COLORS.surfaceContainerLow, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(196,198,206,0.3)'
  },
  cancelBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.onSurfaceVariant },
  saveBtn: {
    flex: 2, flexDirection: 'row', gap: 8,
    paddingVertical: 14, borderRadius: 8,
    backgroundColor: COLORS.primaryContainer, alignItems: 'center', justifyContent: 'center'
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
