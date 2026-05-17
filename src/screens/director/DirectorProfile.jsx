import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorLayout from '../../components/director/DirectorLayout';

const { width } = Dimensions.get('window');

const userProfile = {
  name: 'Dr. Arvind Sharma',
  role: 'Director of Security Operations',
  email: 'arvind.sharma@security.com',
  phone: '+91 98765 43210',
  avatar: null,
  joinDate: 'January 2020',
  location: 'Mumbai, India',
  stats: {
    reportsReviewed: 1247,
    incidentsResolved: 892,
    activeCases: 23,
  }
};

const DirectorProfile = ({ navigation }) => {
  return (
    <DirectorLayout navigation={navigation} activeRoute="DirectorProfile">
      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headline}>Director Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.profileName}>{userProfile.name}</Text>
          <Text style={styles.profileRole}>{userProfile.role}</Text>
        </View>

        <View style={styles.profileStats}>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>{userProfile.stats.reportsReviewed}</Text>
            <Text style={styles.profileStatLabel}>Reports Reviewed</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>{userProfile.stats.incidentsResolved}</Text>
            <Text style={styles.profileStatLabel}>Incidents Resolved</Text>
          </View>
          <View style={styles.profileStatItem}>
            <Text style={styles.profileStatValue}>{userProfile.stats.activeCases}</Text>
            <Text style={styles.profileStatLabel}>Active Cases</Text>
          </View>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Email</Text>
            <Text style={styles.profileInfoValue}>{userProfile.email}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Phone</Text>
            <Text style={styles.profileInfoValue}>{userProfile.phone}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Location</Text>
            <Text style={styles.profileInfoValue}>{userProfile.location}</Text>
          </View>
          <View style={styles.profileInfoItem}>
            <Text style={styles.profileInfoLabel}>Member Since</Text>
            <Text style={styles.profileInfoValue}>{userProfile.joinDate}</Text>
          </View>
        </View>

        <View style={styles.profileActions}>
          <TouchableOpacity style={styles.profileButton} onPress={() => console.log('Edit Profile')}>
            <Text style={styles.profileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.profileButton, styles.logoutButton]} onPress={() => {
            navigation.replace('ExecutiveLogin');
          }}>
            <Text style={[styles.profileButtonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </DirectorLayout>
  );
};

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: width > 1024 ? 64 : 24, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: width > 1024 ? 48 : 32 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },

  profileContainer: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: theme.colors.primaryContainer + '10',
  },
  profileAvatar: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  profileAvatarText: { fontSize: 36, fontWeight: 'bold', color: '#FFFFFF' },
  profileName: { ...theme.typography.headline, fontSize: 24, marginBottom: 8 },
  profileRole: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant },
  
  profileStats: {
    flexDirection: 'row', padding: 24, backgroundColor: theme.colors.surfaceContainerHigh, justifyContent: 'space-around',
  },
  profileStatItem: { alignItems: 'center' },
  profileStatValue: { ...theme.typography.headline, fontSize: 24, fontWeight: 'bold', color: theme.colors.primary, marginBottom: 4 },
  profileStatLabel: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant },
  
  profileInfo: { padding: 24 },
  profileInfoItem: { marginBottom: 20 },
  profileInfoLabel: { ...theme.typography.bodySm, color: theme.colors.onSurfaceVariant, marginBottom: 4 },
  profileInfoValue: { ...theme.typography.bodyMd, fontWeight: '500' },
  
  profileActions: { flexDirection: 'row', padding: 24, gap: 12 },
  profileButton: {
    flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', backgroundColor: theme.colors.primary,
  },
  logoutButton: { backgroundColor: theme.colors.error },
  profileButtonText: { color: '#FFFFFF', fontWeight: '600' },
  logoutButtonText: { color: '#FFFFFF' },
});

export default DirectorProfile;
