import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Platform, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import { theme } from './ExecutiveLoginPortal';
import DirectorSidebar from '../../components/director/DirectorSidebar';

const { width } = Dimensions.get('window');

const DirectorShiftEditor = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.layout, width <= 1024 && styles.layoutMobile]}>
        <DirectorSidebar navigation={navigation} activeRoute="ShiftEditor" />

        <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headline}>Shift-Site Mapping & Holiday Editor</Text>
            <Text style={styles.subtitle}>Define workforce schedules, holiday multipliers, and global shift templates.</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.cardHeaderSmall}>GLOBAL TEMPLATE OVERRIDE</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SELECT REGIONAL CLUSTER</Text>
              <TextInput style={styles.input} placeholder="e.g. Maharashtra Northern Block" placeholderTextColor={theme.colors.outlineVariant} />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>HOLIDAY CALENDAR ID</Text>
                <TextInput style={styles.input} placeholder="IND-NAT-2024" placeholderTextColor={theme.colors.outlineVariant} />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>SHIFT DURATION OVERRIDE</Text>
                <TextInput style={styles.input} placeholder="12 Hours" placeholderTextColor={theme.colors.outlineVariant} />
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Commit Changes to Cluster</Text>
            </TouchableOpacity>
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
  formCard: { backgroundColor: theme.colors.surfaceContainerLowest, borderRadius: 16, padding: 40, shadowColor: theme.colors.onSurface, shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.05, shadowRadius: 40, ...Platform.select({ default: { elevation: 2 } }), maxWidth: 800 },
  cardHeaderSmall: { ...theme.typography.label, color: theme.colors.outlineVariant, letterSpacing: 1, marginBottom: 32 },
  inputGroup: { marginBottom: 32 },
  inputRow: { flexDirection: width > 768 ? 'row' : 'column', gap: 24 },
  label: { ...theme.typography.label, color: theme.colors.primaryContainer, marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: theme.colors.surfaceContainerLow, paddingVertical: 12, fontSize: 16, color: theme.colors.primaryContainer, ...Platform.select({ web: { outlineStyle: 'none' } }) },
  primaryButton: { backgroundColor: theme.colors.primaryContainer, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  primaryButtonText: { ...theme.typography.bodyMd, color: theme.colors.onPrimary, fontWeight: '600' },
});

export default DirectorShiftEditor;
