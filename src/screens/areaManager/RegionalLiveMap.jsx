import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, useWindowDimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import TopNavBar from '../../components/TopNavBar';
import SideNavBar from '../../components/SideNavBar';

export default function RegionalLiveMap() {
  const { width } = useWindowDimensions();
  const isWide = width > 1024;

  return (
    <View style={styles.container}>
      <TopNavBar />
      <View style={styles.layout}>
        {isWide && <SideNavBar />}
        <View style={styles.mainContent}>
          {Platform.OS === 'web' ? (
            <iframe 
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.4,74.1,19.4&layer=mapnik&marker=18.5204,73.8567" 
              style={styles.mapWeb}
              title="Full Regional Live Map"
            />
          ) : (
            <WebView 
              source={{ uri: 'https://www.openstreetmap.org/export/embed.html?bbox=72.7,18.4,74.1,19.4&layer=mapnik&marker=18.5204,73.8567' }} 
              style={styles.mapNative} 
            />
          )}

          {/* Floating Action Panel */}
          <View style={[styles.floatingPanel, !isWide && styles.floatingPanelMobile]} pointerEvents="box-none">
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Live Tracking Filters</Text>
              
              <TouchableOpacity style={styles.filterOption}>
                <MaterialIcons name="person-pin" size={20} color={COLORS.primaryContainer} />
                <Text style={styles.filterText}>Supervisors (8)</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.filterOption}>
                <MaterialIcons name="security" size={20} color={COLORS.secondary} />
                <Text style={styles.filterText}>Field Officers (24)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterOption}>
                <MaterialIcons name="warning" size={20} color={COLORS.error} />
                <Text style={styles.filterText}>Active Incidents (2)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.filterOption}>
                <MaterialIcons name="ev-station" size={20} color={COLORS.primary} />
                <Text style={styles.filterText}>Charging Stations (14)</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.surface },
  layout: { flex: 1, flexDirection: 'row' },
  mainContent: { flex: 1, position: 'relative' },
  mapWeb: { width: '100%', height: '100%', border: 'none' },
  mapNative: { flex: 1 },
  floatingPanel: { position: 'absolute', top: 24, left: 24, paddingBottom: 24 },
  floatingPanelMobile: { top: 'auto', bottom: 24, left: 16, right: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 12, width: 280, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primaryContainer, marginBottom: 16 },
  filterOption: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  filterText: { fontSize: 14, fontWeight: '600', color: COLORS.onSurface }
});

