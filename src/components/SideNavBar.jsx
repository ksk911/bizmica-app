import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

export default function SideNavBar() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  if (width <= 1024) return null; // Hide on tablet and mobile 

  return (
    <View style={styles.sidebar}>
      <View style={{ marginBottom: 32, paddingHorizontal: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#000f22' }}>North Region</Text>
        <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.onSurfaceVariant, letterSpacing: 1, marginTop: 4 }}>COMMAND CENTER</Text>
      </View>

      <View style={styles.topLinks}>
        <TouchableOpacity style={[styles.link, navigation.getState()?.routes[navigation.getState().index]?.name === 'Dashboard' && styles.activeLink]} onPress={() => navigation.navigate('Dashboard')}>
          <MaterialIcons name="dashboard" size={24} color={navigation.getState()?.routes[navigation.getState().index]?.name === 'Dashboard' ? COLORS.primaryContainer : COLORS.onSurfaceVariant} />
          <Text style={[styles.text, navigation.getState()?.routes[navigation.getState().index]?.name === 'Dashboard' && styles.activeText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link, navigation.getState()?.routes[navigation.getState().index]?.name === 'ShiftSiteMapping' && styles.activeLink]} onPress={() => navigation.navigate('ShiftSiteMapping')}>
          <MaterialIcons name="map" size={24} color={navigation.getState()?.routes[navigation.getState().index]?.name === 'ShiftSiteMapping' ? COLORS.primaryContainer : COLORS.onSurfaceVariant} />
          <Text style={[styles.text, navigation.getState()?.routes[navigation.getState().index]?.name === 'ShiftSiteMapping' && styles.activeText]}>Regional Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link, navigation.getState()?.routes[navigation.getState().index]?.name === 'IncidentHubReview' && styles.activeLink]} onPress={() => navigation.navigate('IncidentHubReview')}>
          <MaterialIcons name="visibility" size={24} color={navigation.getState()?.routes[navigation.getState().index]?.name === 'IncidentHubReview' ? COLORS.primaryContainer : COLORS.onSurfaceVariant} />
          <Text style={[styles.text, navigation.getState()?.routes[navigation.getState().index]?.name === 'IncidentHubReview' && styles.activeText]}>Incident Stream</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.link, navigation.getState()?.routes[navigation.getState().index]?.name === 'EodSummary' && styles.activeLink]} onPress={() => navigation.navigate('EodSummary')}>
          <MaterialIcons name="assessment" size={24} color={navigation.getState()?.routes[navigation.getState().index]?.name === 'EodSummary' ? COLORS.primaryContainer : COLORS.onSurfaceVariant} />
          <Text style={[styles.text, navigation.getState()?.routes[navigation.getState().index]?.name === 'EodSummary' && styles.activeText]}>Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomLinks}>
        <TouchableOpacity style={styles.link}>
          <MaterialIcons name="settings" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={styles.text}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link}>
          <MaterialIcons name="help-outline" size={24} color={COLORS.onSurfaceVariant} />
          <Text style={styles.text}>Support</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 256,
    height: '100%',
    backgroundColor: COLORS.surfaceContainerLow,
    paddingVertical: 24,
    paddingRight: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    zIndex: 40,
    borderRightWidth: 1,
    borderRightColor: 'rgba(196, 198, 206, 0.2)'
  },
  topLinks: { gap: 4 },
  activeLink: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    paddingHorizontal: 24, 
    paddingVertical: 12, 
    backgroundColor: COLORS.surfaceContainerLowest, 
    borderTopRightRadius: 8, 
    borderBottomRightRadius: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
      android: { elevation: 2 },
      web: { boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }
    })
  },
  activeText: { color: COLORS.primaryContainer, fontWeight: '700', fontSize: 14 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingVertical: 12 },
  text: { color: COLORS.onSurfaceVariant, fontWeight: '500', fontSize: 14 },
  bottomLinks: { borderTopWidth: 1, borderTopColor: 'rgba(196, 198, 206, 0.2)', paddingTop: 16, gap: 4 }
});
