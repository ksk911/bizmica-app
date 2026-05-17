import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Switch, Platform } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width, height } = Dimensions.get('window');

const MOCK_OFFICERS = [
  { id: '1', name: 'Rajesh Kumar', role: 'Field Officer', status: 'active', sosActive: false, site: 'New Delhi HQ', lastUpdate: '2 mins ago' },
  { id: '2', name: 'Priya Sharma', role: 'Supervisor', status: 'inactive', sosActive: false, site: 'Mumbai Sector A', lastUpdate: '1 hr ago' },
  { id: '3', name: 'Amit Patel', role: 'Field Officer', status: 'active', sosActive: true, site: 'Bangalore Campus', lastUpdate: 'Just now' },
  { id: '4', name: 'Sneha Reddy', role: 'Area Manager', status: 'active', sosActive: false, site: 'Chennai Zone', lastUpdate: '5 mins ago' },
];

const DirectorLiveMap = ({ navigation }) => {
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [showSOSOnly, setShowSOSOnly] = useState(false);

  const filteredOfficers = MOCK_OFFICERS.filter(o => {
    if (showActiveOnly && o.status !== 'active') return false;
    if (showSOSOnly && !o.sosActive) return false;
    return true;
  });

  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorLiveMap">
      <View style={styles.container}>
        <View style={styles.headerPanel}>
          <View>
            <Text style={styles.headline}>Real-Time Live Map</Text>
            <Text style={styles.subtitle}>Tracking {filteredOfficers.length} officers across all sites.</Text>
          </View>
          
          <View style={styles.controlsRow}>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>Active Only</Text>
              <Switch value={showActiveOnly} onValueChange={setShowActiveOnly} />
            </View>
            <View style={styles.controlItem}>
              <Text style={styles.controlLabel}>SOS Events</Text>
              <Switch value={showSOSOnly} onValueChange={setShowSOSOnly} trackColor={{ true: theme.colors.error }} />
            </View>
            <TouchableOpacity style={styles.zoomButton}>
              <Text style={styles.zoomButtonText}>Zoom to Fit All</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mapContainer}>
          <Text style={styles.mapPlaceholderText}>[ Interactive Map Placeholder ]</Text>
          <Text style={styles.mapSubText}>Integrate with react-native-maps or leaflet here</Text>

          {/* Mock Markers rendered randomly over the map area */}
          <View style={styles.markersContainer}>
            {filteredOfficers.map((officer, index) => (
              <View 
                key={officer.id} 
                style={[
                  styles.mockMarker, 
                  { top: 50 + (index * 80), left: 100 + (index * 120) }
                ]}
              >
                <View style={[
                  styles.markerDot, 
                  officer.sosActive ? styles.markerSOS : 
                  officer.status === 'active' ? styles.markerActive : styles.markerInactive
                ]} />
                <View style={styles.infoWindow}>
                  <Text style={styles.infoName}>{officer.name}</Text>
                  <Text style={styles.infoDetails}>{officer.site}</Text>
                  <Text style={styles.infoDetails}>Last Update: {officer.lastUpdate}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </DirectorLayout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingHorizontal: width > 1024 ? 64 : 24 },
  headerPanel: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: width > 768 ? 'center' : 'flex-start',
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    gap: 16,
  },
  headline: { ...theme.typography.title, color: theme.colors.primaryContainer, fontSize: 20, marginBottom: 4 },
  subtitle: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
  
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  controlItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlLabel: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, fontWeight: '500' },
  
  zoomButton: { backgroundColor: theme.colors.surfaceContainerHigh, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  zoomButtonText: { ...theme.typography.bodyMd, color: theme.colors.primaryContainer, fontWeight: '600' },

  mapContainer: {
    flex: 1,
    minHeight: height * 0.6,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapPlaceholderText: { ...theme.typography.title, color: theme.colors.outline, fontSize: 24, marginBottom: 8 },
  mapSubText: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant },

  markersContainer: { ...StyleSheet.absoluteFillObject },
  mockMarker: { position: 'absolute', alignItems: 'center' },
  markerDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 4 },
  markerActive: { backgroundColor: '#4CAF50' },
  markerInactive: { backgroundColor: '#F44336' },
  markerSOS: { backgroundColor: '#F44336', width: 24, height: 24, borderRadius: 12 }, // Blinking animation would go here in production
  
  infoWindow: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    padding: 12, borderRadius: 8, marginTop: 8, width: 150,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  infoName: { ...theme.typography.bodyMd, fontWeight: '700', color: theme.colors.primaryContainer, marginBottom: 4 },
  infoDetails: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant, fontSize: 11, marginBottom: 2 },
});

export default DirectorLiveMap;
