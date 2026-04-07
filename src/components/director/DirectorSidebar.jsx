import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { theme } from '../../screens/director/ExecutiveLoginPortal';

const { width } = Dimensions.get('window');

const NAV_ITEMS = [
  { label: 'Dashboard',         route: 'DirectorDashboard' },
  { label: 'Analytics & KPIs',  route: 'DirectorKPI' },
  { label: 'Incident Logs',      route: 'AlertLogs' },
  { label: 'Site Allocation',    route: 'SiteAllocation' },
  { label: 'Benchmarking',       route: 'OfficerBenchmarking' },
  { label: 'Shift Editor',       route: 'ShiftEditor' },
  { label: 'Reporting & Export', route: 'ReportingModals' },
];

const DirectorSidebar = ({ navigation, activeRoute }) => {
  const isMobile = width <= 1024;

  return (
    <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
      <View style={styles.brandBox}>
        <Text style={styles.brandText}>Executive Portal</Text>
      </View>

      <View style={styles.navItems}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.route === activeRoute;
          return (
            <TouchableOpacity
              key={item.route}
              style={isActive ? styles.navItemActive : styles.navItem}
              onPress={() => !isActive && navigation.navigate(item.route)}
              activeOpacity={0.7}
            >
              <Text style={isActive ? styles.navTextActive : styles.navText}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.logoutSection}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('ExecutiveLogin')}
        >
          <Text style={[styles.navText, { color: theme.colors.error, fontWeight: '600' }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: theme.colors.surfaceContainerLow,
    paddingVertical: 32,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  sidebarMobile: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  brandBox: {
    marginBottom: 40,
  },
  brandText: {
    ...theme.typography.title,
    color: theme.colors.primaryContainer,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  navItems: {
    gap: 4,
    flex: 1,
  },
  navItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    ...Platform.select({ web: { cursor: 'pointer' } }),
  },
  navItemActive: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.surfaceContainerLowest,
    shadowColor: theme.colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    ...Platform.select({ web: { transition: 'all 0.2s ease' } }),
  },
  navText: {
    ...theme.typography.bodyMd,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  navTextActive: {
    ...theme.typography.bodyMd,
    color: theme.colors.primaryContainer,
    fontWeight: '700',
  },
  logoutSection: {
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
    paddingTop: 16,
  },
});

export default DirectorSidebar;
