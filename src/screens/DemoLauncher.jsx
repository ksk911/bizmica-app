import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DemoLauncher() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.logo}>BIZMICA</Text>
          <Text style={styles.tagline}>Patrol & Incident Reporting System</Text>
          <View style={styles.divider} />
          <Text style={styles.demoLabel}>DEMO DAY — ROLE SELECTOR</Text>
        </View>

        <View style={styles.cardsRow}>

          {/* Supervisor Card */}
          <TouchableOpacity
            style={[styles.card, styles.supervisorCard]}
            onPress={() => navigation.navigate('SupervisorSuite')}
          >
            <View style={styles.cardIconWrap}>
              <MaterialIcons name="security" size={48} color="#ffffff" />
            </View>
            <Text style={styles.cardRole}>SUPERVISOR</Text>
            <Text style={styles.cardName}>Ravi Sharma</Text>
            <Text style={styles.cardId}>ID: SUP001</Text>
            <Text style={styles.cardDesc}>Field officer view. Trigger SOS and report incidents with live GPS.</Text>
            <View style={styles.cardBtn}>
              <Text style={styles.cardBtnText}>Enter as Supervisor →</Text>
            </View>
          </TouchableOpacity>

          {/* Area Manager Card */}
          <TouchableOpacity
            style={[styles.card, styles.areaCard]}
            onPress={() => navigation.navigate('Login')}
          >
            <View style={[styles.cardIconWrap, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <MaterialIcons name="dashboard" size={48} color="#ffffff" />
            </View>
            <Text style={styles.cardRole}>AREA MANAGER</Text>
            <Text style={styles.cardName}>Priya Patel</Text>
            <Text style={styles.cardId}>ID: AM001</Text>
            <Text style={styles.cardDesc}>Command view. Monitor live incidents & SOS alerts from the field.</Text>
            <View style={[styles.cardBtn, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Text style={styles.cardBtnText}>Enter as Area Manager →</Text>
            </View>
          </TouchableOpacity>

        </View>

        <Text style={styles.hint}>
          💡 Open this in two browser windows — one per role — to simulate the live end-to-end flow.
        </Text>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0f1e' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 40 },

  header: { alignItems: 'center', gap: 8 },
  logo: { fontSize: 42, fontWeight: '900', color: '#ffffff', letterSpacing: 6 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.5)', fontWeight: '500', letterSpacing: 1 },
  divider: { width: 48, height: 2, backgroundColor: '#002e85', marginVertical: 8, borderRadius: 2 },
  demoLabel: { fontSize: 11, fontWeight: '800', color: '#4a9eff', letterSpacing: 2, textTransform: 'uppercase' },

  cardsRow: { flexDirection: 'row', gap: 24, flexWrap: 'wrap', justifyContent: 'center' },

  card: {
    width: 280, borderRadius: 20, padding: 28, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4, shadowRadius: 40, elevation: 12,
  },
  supervisorCard: { backgroundColor: '#002e85' },
  areaCard: { backgroundColor: '#1a0a30' },

  cardIconWrap: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  cardRole: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  cardName: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
  cardId: { fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
  cardDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 20, marginTop: 4 },
  cardBtn: {
    marginTop: 8, backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardBtnText: { color: '#ffffff', fontWeight: '700', fontSize: 13 },

  hint: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textAlign: 'center', maxWidth: 500, lineHeight: 20 },
});
