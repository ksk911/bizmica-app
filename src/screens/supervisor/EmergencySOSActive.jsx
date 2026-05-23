import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const API_BASE = 'http://192.168.1.7:5000'; // Your PC's local network IP
const SUPERVISOR_USER_ID = 1; // Seeded demo supervisor
const SITE_ID = 1;

export default function EmergencySOSActive() {
  const navigation = useNavigation();
  const [isTriggering, setIsTriggering] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [location, setLocation] = useState(null);

  // Pulsing animation
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Request location permission and grab GPS
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc.coords);
      }
    })();

    // Start pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(pulse1, { toValue: 1.3, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse2, { toValue: 1.15, duration: 800, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(pulse1, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(pulse2, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  const triggerSOS = async () => {
    setIsTriggering(true);
    try {
      const response = await fetch(`${API_BASE}/api/sos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          triggered_by: SUPERVISOR_USER_ID,
          site_id: SITE_ID,
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSosTriggered(true);
        Alert.alert('🚨 SOS Sent!', `Emergency alert dispatched to Area Manager.\nSOS ID: #SOS-${data.sos_id}`, [{ text: 'OK' }]);
      } else {
        Alert.alert('Error', data.error || 'Failed to trigger SOS');
      }
    } catch (err) {
      Alert.alert('Connection Error', 'Could not reach server. Please check your network.');
    } finally {
      setIsTriggering(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialIcons name="close" size={28} color="#ffffff" />
          </TouchableOpacity>
          {location && (
            <View style={styles.gpsTag}>
              <MaterialIcons name="gps-fixed" size={14} color="#4ade80" />
              <Text style={styles.gpsText}>GPS Live</Text>
            </View>
          )}
        </View>

        <View style={styles.pulseContainer}>
          <Animated.View style={[styles.pulseRing1, { transform: [{ scale: pulse1 }] }]} />
          <Animated.View style={[styles.pulseRing2, { transform: [{ scale: pulse2 }] }]} />
          <View style={styles.alertIconWrapper}>
            <MaterialIcons name="emergency" size={64} color="#ba1a1a" />
          </View>
        </View>

        <Text style={styles.title}>EMERGENCY ALERT</Text>
        <Text style={styles.subtitle}>
          {sosTriggered ? 'SOS Alert Dispatched to Control Room' : 'SOS Triggered by: Ravi Sharma (SUP001)'}
        </Text>

        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <MaterialIcons name="location-on" size={24} color="#ba1a1a" />
            <Text style={styles.locationText}>North Gate HQ</Text>
          </View>
          {location ? (
            <Text style={styles.coordsText}>
              {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
            </Text>
          ) : (
            <Text style={styles.coordsText}>Acquiring GPS coordinates...</Text>
          )}
        </View>

        {!sosTriggered ? (
          <TouchableOpacity
            style={[styles.sosTriggerBtn, isTriggering && { opacity: 0.7 }]}
            onPress={triggerSOS}
            disabled={isTriggering}
          >
            {isTriggering ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <MaterialIcons name="emergency" size={24} color="#ffffff" />
                <Text style={styles.sosTriggerText}>SEND SOS ALERT NOW</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.confirmedBanner}>
            <MaterialIcons name="check-circle" size={24} color="#4ade80" />
            <Text style={styles.confirmedText}>Alert sent! Emergency services notified.</Text>
          </View>
        )}

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionBtnWhite}>
            <MaterialIcons name="call" size={24} color="#002e85" />
            <Text style={styles.actionBtnTextBlue}>Call Guard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtnWhite}>
            <MaterialIcons name="local-police" size={24} color="#002e85" />
            <Text style={styles.actionBtnTextBlue}>Dispatch Team</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resolveBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.resolveBtnText}>MARK AS RESOLVED</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#93000a' },
  container: { flex: 1, padding: 24, alignItems: 'center' },
  header: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  backBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  gpsTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  gpsText: { color: '#4ade80', fontSize: 12, fontWeight: 'bold' },
  pulseContainer: { width: 200, height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  pulseRing1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.15)' },
  pulseRing2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.3)' },
  alertIconWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 30, fontWeight: '900', color: '#ffffff', letterSpacing: 2, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#ffdad6', fontWeight: '500', marginBottom: 24, textAlign: 'center' },
  locationCard: { width: '100%', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 24, elevation: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  locationText: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  coordsText: { fontSize: 12, color: '#6b7280', marginLeft: 32 },
  sosTriggerBtn: { width: '100%', backgroundColor: '#ba1a1a', borderRadius: 12, height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 16, elevation: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  sosTriggerText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },
  confirmedBanner: { width: '100%', backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1, borderColor: '#4ade80', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  confirmedText: { color: '#4ade80', fontSize: 14, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', gap: 16, width: '100%', marginBottom: 16 },
  actionBtnWhite: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 2 },
  actionBtnTextBlue: { color: '#002e85', fontSize: 14, fontWeight: 'bold' },
  resolveBtn: { width: '100%', paddingVertical: 16, borderRadius: 12, borderWidth: 2, borderColor: '#ffdad6', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', marginBottom: 20 },
  resolveBtnText: { color: '#ffdad6', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 }
});
