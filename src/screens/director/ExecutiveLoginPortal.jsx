import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Platform } from 'react-native';

const { width } = Dimensions.get('window');

// Centralized Theme Tokens for Director App
export const theme = {
  colors: {
    background: '#f7f9fb',
    surfaceContainerLow: '#f2f4f6',
    surfaceContainerLowest: '#ffffff',
    primaryContainer: '#0a2540',
    onPrimary: '#ffffff',
    secondary: '#006591',
    secondaryContainer: '#00b3fe',
    onSurface: '#191c1e',
    onSurfaceVariant: '#43474d',
    outlineVariant: '#c4c6ce',
    error: '#ba1a1a',
  },
  typography: {
    headline: {
      fontFamily: Platform.OS === 'web' ? 'Manrope, sans-serif' : 'System',
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    title: {
      fontFamily: Platform.OS === 'web' ? 'Manrope, sans-serif' : 'System',
      fontSize: 22,
      fontWeight: '600',
    },
    bodyLg: {
      fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
      fontSize: 16,
      fontWeight: '400',
    },
    bodyMd: {
      fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
      fontSize: 14,
      fontWeight: '400',
    },
    label: {
      fontFamily: Platform.OS === 'web' ? 'Inter, sans-serif' : 'System',
      fontSize: 12,
      fontWeight: '500',
    }
  }
};

const ExecutiveLoginPortal = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headline}>Executive Access Portal</Text>
          <Text style={styles.subtitle}>
            Secure access point for high-level tactical reporting and infrastructure surveillance management.
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity 
            style={[styles.card, styles.primaryCard]}
            onPress={() => navigation.navigate('DirectorDashboard')} // Placeholder for full Director auth later
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Director Login</Text>
              <Text style={styles.cardDescription}>Full Oversight Access</Text>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.actionTextPrimary}>Secure Login →</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.secondaryCard]}
            onPress={() => navigation.navigate('Login')} // Matches existing AreaManagerLogin
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitleLight}>Area Admin Login</Text>
              <Text style={styles.cardDescriptionLight}>Regional Operation Access</Text>
            </View>
            <View style={styles.cardAction}>
              <Text style={styles.actionTextSecondary}>Access Portal →</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerDot}> • </Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerDot}> • </Text>
          <Text style={styles.footerLink}>Security Disclosure</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: width > 1024 ? 1024 : '90%',
    paddingVertical: 80,
    alignItems: 'center',
    maxWidth: 900,
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  headline: {
    ...theme.typography.headline,
    color: theme.colors.primaryContainer,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    ...theme.typography.bodyLg,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 600,
    lineHeight: 24,
  },
  cardsContainer: {
    flexDirection: width > 768 ? 'row' : 'column',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
    marginBottom: 80,
  },
  card: {
    flex: 1,
    minHeight: 280,
    borderRadius: 16,
    padding: 32,
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      },
      default: {
        elevation: 4,
      }
    }),
  },
  primaryCard: {
    backgroundColor: theme.colors.primaryContainer,
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  secondaryCard: {
    backgroundColor: theme.colors.surfaceContainerLowest,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.surfaceContainerLow,
  },
  cardHeader: {
    gap: 8,
  },
  cardTitle: {
    ...theme.typography.title,
    color: theme.colors.onPrimary,
  },
  cardDescription: {
    ...theme.typography.bodyMd,
    color: theme.colors.outlineVariant,
  },
  cardTitleLight: {
    ...theme.typography.title,
    color: theme.colors.primaryContainer,
  },
  cardDescriptionLight: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
  },
  cardAction: {
    marginTop: 'auto',
  },
  actionTextPrimary: {
    ...theme.typography.bodyLg,
    fontWeight: '600',
    color: theme.colors.onPrimary,
  },
  actionTextSecondary: {
    ...theme.typography.bodyLg,
    fontWeight: '600',
    color: theme.colors.secondary,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  footerLink: {
    ...theme.typography.label,
    color: theme.colors.onSurfaceVariant,
    textDecorationLine: 'underline',
    cursor: 'pointer',
  },
  footerDot: {
    color: theme.colors.outlineVariant,
  }
});

export default ExecutiveLoginPortal;
