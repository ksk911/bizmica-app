import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

export default function ActivePatrolMap() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission not granted');
          setLoading(false);
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getMapUrl = () => {
    if (!location) return 'https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.4,74.1,19.4&layer=mapnik';
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);
    const offset = 0.01;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - offset},${lat - offset},${lng + offset},${lat + offset}&layer=mapnik&marker=${lat},${lng}`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mapContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#002e85" />
            <Text style={styles.loadingText}>Acquiring GPS...</Text>
          </View>
        ) : (
          Platform.OS === 'web' ? (
            <iframe 
              src={getMapUrl()} 
              style={styles.mapMap}
              title="Live Patrol Map"
            />
          ) : (
            <WebView 
              source={{ uri: getMapUrl() }} 
              style={styles.mapMapNative} 
            />
          )
        )}
        
        <View style={styles.mapOverlayHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.overlayCircleBtn}>
            <MaterialIcons name="arrow-back" size={24} color="#0f1623" />
          </TouchableOpacity>
          <View style={styles.statusPill}>
            <View style={styles.dot} />
            <Text style={styles.statusText}>Live Tracking Active</Text>
          </View>
        </View>

        <View style={styles.bottomCard}>
          <View style={styles.cardHandle} />
          <Text style={styles.cardTitle}>Your Live Unit</Text>
          
          <View style={styles.personRow}>
            <View style={styles.personIcon}>
              <MaterialIcons name="my-location" size={20} color="#002e85" />
            </View>
            <View style={styles.personInfo}>
              <Text style={styles.personName}>Supervisor (You)</Text>
              <Text style={styles.personLocation}>
                {location ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}` : 'Location Unavailable'}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.sosButton}
            onPress={() => navigation.navigate('EmergencySOSActive')}
          >
            <MaterialIcons name="emergency" size={20} color="#ffffff" />
            <Text style={styles.sosText}>TRIGGER SOS ALARM</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0f1623' },
  mapContainer: { flex: 1, position: 'relative' },
  mapMap: { width: '100%', height: '100%', border: 'none' },
  mapMapNative: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f6f8' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#444652', fontWeight: '600' },
  mapOverlayHeader: {
    position: 'absolute', top: 16, left: 16, right: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  },
  overlayCircleBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#ffffff',
    alignItems: 'center', justifyContent: 'center', elevation: 4
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 12,
    borderRadius: 24, elevation: 4
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#0f1623' },
  bottomCard: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, elevation: 10
  },
  cardHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#cbd5e1', alignSelf: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623', marginBottom: 16 },
  personRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f6f8',
    padding: 12, borderRadius: 12, marginBottom: 12
  },
  personIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e7ff',
    alignItems: 'center', justifyContent: 'center', marginRight: 12
  },
  personInfo: { flex: 1 },
  personName: { fontSize: 14, fontWeight: 'bold', color: '#0f1623' },
  personLocation: { fontSize: 12, color: '#444652', marginTop: 2 },
  sosButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#ba1a1a', paddingVertical: 16, borderRadius: 12, marginTop: 8
  },
  sosText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', letterSpacing: 1 }
});
