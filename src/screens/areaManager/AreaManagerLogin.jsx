import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export default function AreaManagerLogin({ navigation }) {
  const { width } = useWindowDimensions();
  const [employeeId, setEmployeeId] = useState('');
  const [otp, setOtp] = useState('');

  // Dynamic breakpoint: If the screen is wider than 1024px, we switch to Desktop layout
  const isWide = width > 1024;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header Navigation */}
        <View style={styles.header}>
          <View style={styles.headerInner}>
            <Text style={styles.headerTitle}>EXECUTIVE ACCESS</Text>
            {/* Hide language toggle on very small screens to prevent overflow */}
            {width > 400 && (
              <View style={styles.langContainer}>
                <View style={styles.langToggle}>
                  <TouchableOpacity style={styles.langBtnActive}>
                    <Text style={styles.langBtnTextActive}>English</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.langBtn}>
                    <Text style={styles.langBtnText}>Hindi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.langBtn}>
                    <Text style={styles.langBtnText}>Marathi</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.globeIcon}>
                  <MaterialIcons name="language" size={24} color={COLORS.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Main Content */}
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Dynamically switch from stacked (column) to side-by-side (row) on wide screens */}
          <View style={[styles.mainWrapper, isWide && styles.mainWrapperWide]}>
            
            {/* Editorial Content */}
            <View style={[styles.editorialContent, isWide && styles.editorialContentWide]}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SECURE AUTHENTICATION</Text>
              </View>
              <Text style={[styles.heroText, isWide && styles.heroTextWide]}>
                Precision Control for{' '}
                <Text style={styles.heroTextHighlight}>Area Administrators.</Text>
              </Text>
              <Text style={[styles.subText, isWide && styles.subTextWide]}>
                Access high-level operations, resource allocation, and real-time oversight across
                your designated territory.
              </Text>
            </View>

            {/* Login Form Center/Right */}
            <View style={styles.formContainer}>
              <View style={styles.formHeader}>
                <Text style={styles.formTitle}>AREA ADMIN LOGIN</Text>
                <View style={styles.titleDivider} />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMPLOYEE ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="EA-XXXXXX"
                  placeholderTextColor="rgba(196, 198, 206, 0.6)"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>SMS OTP</Text>
                <View style={styles.relativeBlock}>
                  <TextInput
                    style={[styles.input, { paddingRight: 60 }]}
                    placeholder="6-digit code"
                    placeholderTextColor="rgba(196, 198, 206, 0.6)"
                    value={otp}
                    onChangeText={setOtp}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.resendBtn}>
                    <Text style={styles.resendText}>RESEND</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.biometricContainer}>
                <TouchableOpacity style={styles.biometricBtn}>
                  <MaterialIcons name="face" size={20} color={COLORS.secondary} />
                  <Text style={styles.biometricText}>VERIFY WITH LIVE PHOTO</Text>
                </TouchableOpacity>
                <Text style={styles.biometricSub}>Mandatory biometric sequence required</Text>
              </View>

              <View style={styles.submitContainer}>
                <TouchableOpacity 
                  style={styles.submitBtn}
                  onPress={() => navigation.navigate('Dashboard')}
                >
                  <Text style={styles.submitText}>LOGIN TO DASHBOARD</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.forgotContainer}>
                <TouchableOpacity>
                  <Text style={styles.forgotText}>Forgot Employee Credentials?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerInner}>
            <Text style={styles.footerText}>© 2024 Executive Access Portal.</Text>
            {width > 600 && (
              <View style={styles.footerLinks}>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Terms of Service</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.footerLink}>Support</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
    ...Platform.select({
      web: { height: '100vh' }
    })
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 32,
    paddingVertical: 24,
    zIndex: 10,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceContainerLow,
    padding: 4,
    borderRadius: 8,
    gap: 4,
  },
  langBtnActive: {
    backgroundColor: COLORS.surfaceContainerLowest,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
      android: { elevation: 2 },
      web: { boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }
    })
  },
  langBtnTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a2540',
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  globeIcon: {
    padding: 8,
    borderRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mainWrapper: {
    width: '100%',
    maxWidth: 1200,
    alignItems: 'center',
    // Mobile layout: Stack items vertically
    flexDirection: 'column', 
    gap: 48,
    paddingVertical: 48,
  },
  mainWrapperWide: {
    // Desktop layout: Place items side-by-side
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 64,
  },
  editorialContent: {
    alignItems: 'center',
    maxWidth: 576,
    gap: 16,
  },
  editorialContentWide: {
    // Left-align text on desktop
    alignItems: 'flex-start',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(10, 37, 64, 0.05)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(10, 37, 64, 0.1)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: 2,
  },
  heroText: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primaryContainer,
    textAlign: 'center',
    lineHeight: 48,
  },
  heroTextWide: {
    fontSize: 56,
    textAlign: 'left',
    lineHeight: 64,
  },
  heroTextHighlight: {
    color: COLORS.secondary,
  },
  subText: {
    fontSize: 16,
    color: COLORS.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
  subTextWide: {
    textAlign: 'left',
    fontSize: 18,
    maxWidth: '90%',
  },
  formContainer: {
    width: '100%',
    maxWidth: 448,
    backgroundColor: COLORS.surfaceContainerLowest,
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(196, 198, 206, 0.1)',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }
    })
  },
  formHeader: {
    marginBottom: 40,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  titleDivider: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
  },
  inputGroup: {
    marginBottom: 32,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.onSurfaceVariant,
    letterSpacing: 2,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(196, 198, 206, 0.3)',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.primaryContainer,
    ...Platform.select({
      web: { outlineStyle: 'none' }
    })
  },
  relativeBlock: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center'
  },
  resendBtn: {
    position: 'absolute',
    right: 0,
    bottom: 15,
  },
  resendText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: -0.5,
  },
  biometricContainer: {
    paddingTop: 16,
  },
  biometricBtn: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    backgroundColor: COLORS.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196, 198, 206, 0.2)',
  },
  biometricText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryContainer,
    letterSpacing: 2,
  },
  biometricSub: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 10,
    color: 'rgba(67, 71, 77, 0.7)',
    fontWeight: '500',
    letterSpacing: -0.5,
  },
  submitContainer: {
    paddingTop: 24,
  },
  submitBtn: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: COLORS.primaryContainer,
    borderRadius: 6,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: COLORS.primaryContainer, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
      android: { elevation: 4 },
      web: { boxShadow: `0 4px 8px rgba(10,37,64,0.1)` }
    })
  },
  submitText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.onPrimary,
    letterSpacing: 2,
  },
  forgotContainer: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196, 198, 206, 0.1)',
    alignItems: 'center',
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.onSurfaceVariant,
  },
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 32,
    borderTopWidth: 1,
    borderTopColor: 'rgba(196, 198, 206, 0.2)',
    backgroundColor: COLORS.surface,
    zIndex: 10,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 1440,
    alignSelf: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  footerLinks: {
    flexDirection: 'row',
    gap: 32,
  },
  footerLink: {
    fontSize: 12,
    color: COLORS.onSurfaceVariant,
    letterSpacing: 0.5,
  },
});

