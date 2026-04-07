import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorDashboard = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="DirectorDashboard" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>National Oversight — India</Text>
            <Text style={styles.subtitle}>Real-time tactical reporting & security intelligence.</Text>
          </View>

          <View style={styles.grid}>
            <View style={[styles.card, styles.alertCard]}>
              <Text style={styles.cardHeaderSmall}>CRITICAL EVENT</Text>
              <Text style={styles.cardTitle}>New Delhi: Perimeter Breach</Text>
              <Text style={styles.cardBody}>Breach detected at Zone 7 Gate. Response team deployed.</Text>
              <View style={styles.statusBarError} />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderSmall}>OPERATIONS</Text>
              <Text style={styles.cardTitle}>Mumbai Sector STATUS</Text>
              <Text style={styles.cardBody}>Shift handover complete. No anomalies detected.</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeaderSmall}>WORKFORCE</Text>
              <Text style={styles.cardTitle}>Live Deployment</Text>
              <Text style={styles.cardBody}>1,420 Active Personnel across 4 regions.</Text>
            </View>
          </View>

          <View style={[styles.card, { marginTop: 32, minHeight: 300 }]}>
            <Text style={styles.cardTitle}>24h Incident Timeline</Text>
            <View style={styles.timelinePlaceholder}>
              <Text style={styles.timelineText}>Timeline visualization goes here.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  layout: { flex: 1, flexDirection: 'row' },
  layoutMobile: { flexDirection: 'column' },
  mainContent: { flex: 1, backgroundColor: theme.colors.background },
  contentContainer: { paddingTop: 64, paddingHorizontal: width > 1024 ? 64 : 24, paddingBottom: 64 },
  header: { marginBottom: 48 },
  headline: { ...theme.typography.headline, color: theme.colors.primaryContainer, marginBottom: 8 },
  subtitle: { ...theme.typography.bodyLg, color: theme.colors.onSurfaceVariant },
  grid: { flexDirection: width > 1024 ? 'row' : 'column', gap: 24 },
  card: { flex: 1, backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 32, minHeight: 180, justifyContent: 'center', shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.06, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }) },
  alertCard: { backgroundColor: '#fffcfc' },
  cardHeaderSmall: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 16 },
  cardTitle: { ...theme.typography.title, color: theme.colors.primaryContainer, marginBottom: 12 },
  cardBody: { ...theme.typography.bodyMd, color: theme.colors.onSurfaceVariant, lineHeight: 22 },
  statusBarError: { position: 'absolute', left: 0, top: 32, bottom: 32, width: 4, backgroundColor: theme.colors.error, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  timelinePlaceholder: { flex: 1, marginTop: 24, backgroundColor: theme.colors.surfaceContainerLow, borderRadius: 8, alignItems: 'center', justifyContent: 'center', minHeight: 200 },
  timelineText: { ...theme.typography.bodyMd, color: theme.colors.outlineVariant },
});

export default DirectorDashboard;
