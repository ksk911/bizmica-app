import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const API_BASE = 'http://192.168.1.7:5000'; // Your PC's local network IP
const SUPERVISOR_USER_ID = 1;
const SITE_ID = 1;

// Maps catalogue IDs from DB seed
const INCIDENT_TYPES = [
  { id: 1, label: 'Unauthorized Entry' },
  { id: 2, label: 'Broken Fence' },
  { id: 3, label: 'Suspicious Vehicle' },
  { id: 4, label: 'Fire Hazard' },
  { id: 5, label: 'Theft / Pilferage' },
  { id: 6, label: 'Medical Emergency' },
  { id: 7, label: 'Vandalism' },
  { id: 8, label: 'Equipment Malfunction' },
];

export default function ReportOccurrences() {
  const navigation = useNavigation();
  const [selectedType, setSelectedType] = useState(INCIDENT_TYPES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setLocation(loc.coords);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert('Missing Info', 'Please provide a description of the incident.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reported_by: SUPERVISOR_USER_ID,
          site_id: SITE_ID,
          catalogue_id: selectedType.id,
          description: description.trim(),
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        navigation.navigate('ReportSubmissionSuccess', { incidentId: data.incident_id });
      } else {
        Alert.alert('Submission Failed', data.error || 'Please try again.');
      }
    } catch (err) {
      Alert.alert('Connection Error', 'Could not reach server. Please check your network.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="close" size={24} color="#0f1623" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Occurrence</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.typeSelector}>
          <Text style={styles.label}>Select Incident Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {INCIDENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={selectedType.id === type.id ? styles.chipActive : styles.chip}
                onPress={() => setSelectedType(type)}
              >
                <Text style={selectedType.id === type.id ? styles.chipTextActive : styles.chipText}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Provide detailed information about the event..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Live Location</Text>
          <View style={styles.locationInput}>
            <MaterialIcons
              name={location ? 'gps-fixed' : 'gps-not-fixed'}
              size={20}
              color={location ? '#002e85' : '#9ca3af'}
            />
            <Text style={[styles.locationVal, !location && { color: '#9ca3af' }]}>
              {location
                ? `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
                : 'Acquiring GPS coordinates...'}
            </Text>
          </View>
          <Text style={styles.siteLabel}>Site: North Gate HQ</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Text style={styles.submitBtnText}>Submit Report</Text>
              <MaterialIcons name="check-circle" size={20} color="#ffffff" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f6f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, height: 56, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f1623' },
  backBtn: { padding: 4 },
  container: { padding: 16 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#444652', marginBottom: 8 },
  typeSelector: { marginBottom: 24 },
  chipRow: { gap: 8, paddingRight: 16, paddingBottom: 4 },
  chipActive: { backgroundColor: '#002e85', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  chip: { backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  chipTextActive: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  chipText: { color: '#444652', fontWeight: 'bold', fontSize: 13 },
  inputGroup: { marginBottom: 24 },
  textArea: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, fontSize: 16, color: '#0f1623', minHeight: 140, borderWidth: 1, borderColor: '#e2e8f0' },
  locationInput: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#ffffff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  locationVal: { fontSize: 14, color: '#0f1623', fontWeight: '500', flex: 1 },
  siteLabel: { fontSize: 12, color: '#6b7280', marginTop: 6, marginLeft: 4 },
  footer: { padding: 16, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  submitBtn: { backgroundColor: '#002e85', borderRadius: 12, height: 56, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, elevation: 2 },
  submitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});
