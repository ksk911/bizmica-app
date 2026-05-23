import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';

export default function TopNavBar() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isWide = width > 768; // Desktop vs Mobile breakpoint

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        <Text style={styles.brandTitle}>Area Manager Portal</Text>
        {isWide && (
          <View style={styles.navLinks}>
            <TouchableOpacity style={[styles.navLink, navigation.getState()?.routes[navigation.getState().index]?.name === 'Dashboard' && styles.navLinkActive]} onPress={() => navigation.navigate('Dashboard')}><Text style={[styles.navText, navigation.getState()?.routes[navigation.getState().index]?.name === 'Dashboard' && styles.navTextActive]}>Dashboard</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.navLink, navigation.getState()?.routes[navigation.getState().index]?.name === 'RegionalLiveMap' && styles.navLinkActive]} onPress={() => navigation.navigate('RegionalLiveMap')}><Text style={[styles.navText, navigation.getState()?.routes[navigation.getState().index]?.name === 'RegionalLiveMap' && styles.navTextActive]}>Regional Map</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.navLink, navigation.getState()?.routes[navigation.getState().index]?.name === 'ShiftSiteMapping' && styles.navLinkActive]} onPress={() => navigation.navigate('ShiftSiteMapping')}><Text style={[styles.navText, navigation.getState()?.routes[navigation.getState().index]?.name === 'ShiftSiteMapping' && styles.navTextActive]}>Regional Tools</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.navLink, navigation.getState()?.routes[navigation.getState().index]?.name === 'IncidentHubReview' && styles.navLinkActive]} onPress={() => navigation.navigate('IncidentHubReview')}><Text style={[styles.navText, navigation.getState()?.routes[navigation.getState().index]?.name === 'IncidentHubReview' && styles.navTextActive]}>Incident Hub</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.navLink, navigation.getState()?.routes[navigation.getState().index]?.name === 'EodSummary' && styles.navLinkActive]} onPress={() => navigation.navigate('EodSummary')}><Text style={[styles.navText, navigation.getState()?.routes[navigation.getState().index]?.name === 'EodSummary' && styles.navTextActive]}>Analytics</Text></TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.rightSection}>
        <View style={styles.iconsRow}>
          <TouchableOpacity>
            <MaterialIcons name="settings" size={24} color={COLORS.onSurfaceVariant} style={styles.iconSpaced} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="help-outline" size={24} color={COLORS.onSurfaceVariant} style={styles.iconSpaced} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="language" size={24} color={COLORS.onSurfaceVariant} style={styles.iconSpaced} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.relativeBlock}>
            <MaterialIcons name="notifications" size={24} color={COLORS.onSurfaceVariant} style={styles.iconSpaced} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          {isWide && (
            <View style={styles.profileTextContainer}>
              <Text style={styles.profileName}>Sanjay – Area Manager</Text>
              <Text style={styles.profileRole}>PUNE-MUMBAI REGION</Text>
            </View>
          )}
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr5xWRYFh33vmK6d9fT3XJzDImk9iheoYOSK42o97jMbzB6m6zh0wVsmaNfDvbUmJgqWEgfgD05KWbBICx45ALpPXl6FXxNqrfOvTkHe0Rik2xI3jF1BxRt5L-ZnF2VxgcLyZa-jP0GX1Pq-VO-Qp76Xy1lKfKdzhqTnVb9w8Z8BfvKeaLt3THq0_HSuMN37c1GlmNEHIllvJQiacDTXBgJ8fTzWYnzhKAbIbk-3raDvRsr3V-YiHZm8thNwVH4blpoLUqZ4T3tc3k' }} 
            style={styles.avatar} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 198, 206, 0.2)'
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', gap: 32 },
  brandTitle: { fontSize: 20, fontWeight: '700', color: COLORS.primaryContainer, letterSpacing: -0.5 },
  navLinks: { flexDirection: 'row', gap: 24, marginLeft: 16 },
  navLinkActive: { borderBottomWidth: 2, borderBottomColor: COLORS.secondary, paddingBottom: 4 },
  navTextActive: { color: COLORS.primaryContainer, fontWeight: '800' },
  navLink: { paddingBottom: 4 },
  navText: { color: COLORS.onSurfaceVariant, fontWeight: '500' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  iconsRow: { flexDirection: 'row', gap: 16 },
  iconSpaced: { paddingHorizontal: 4 },
  relativeBlock: { position: 'relative' },
  badge: { position: 'absolute', top: -4, right: 0, width: 8, height: 8, backgroundColor: '#ba1a1a', borderRadius: 4 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: 'rgba(196, 198, 206, 0.3)' },
  profileTextContainer: { alignItems: 'flex-end' },
  profileName: { fontSize: 14, fontWeight: '700', color: '#000f22' },
  profileRole: { fontSize: 10, color: COLORS.onSurfaceVariant, fontWeight: '700', letterSpacing: 0.5 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(196, 198, 206, 0.2)' }
});
