import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';

import { theme } from '../../screens/director/ExecutiveLoginPortal';
import DirectorSidebar from './DirectorSidebar';

const { width } = Dimensions.get('window');

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New incident reported',
    message: 'Perimeter breach in New Delhi Zone',
    time: '5 mins ago',
    read: false,
  },
  {
    id: '2',
    title: 'SOS Alert',
    message: 'Officer Rajesh Kumar sent SOS',
    time: '15 mins ago',
    read: false,
  },
  {
    id: '3',
    title: 'Report Generated',
    message: 'Daily patrol report ready',
    time: '1 hour ago',
    read: true,
  },
];

export default function DirectorLayout({
  children,
  navigation,
  activeRoute,
}) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    n => !n.read,
  ).length;

  const renderTopBar = () => (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        {width <= 1024 && (
          <TouchableOpacity
            style={styles.hamburgerButton}
            onPress={() => setSidebarVisible(true)}
          >
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
        )}

        <Text style={styles.topBarTitle}>
          Director Portal
        </Text>
      </View>

      <View style={styles.topBarRight}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            setShowNotifications(!showNotifications)
          }
        >
          <Text style={styles.iconButtonText}>🔔</Text>

          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderBottomNav = () => (
    <View style={styles.bottomNav}>
      {/* Dashboard */}
      <TouchableOpacity
        style={[
          styles.navItem,
          activeRoute === 'DirectorDashboard' &&
            styles.activeNavItem,
        ]}
        onPress={() =>
          navigation.navigate('DirectorDashboard')
        }
      >
        <Text
          style={[
            styles.navIcon,
            activeRoute === 'DirectorDashboard' &&
              styles.activeNavIcon,
          ]}
        >
          📊
        </Text>

        <Text
          style={[
            styles.navLabel,
            activeRoute === 'DirectorDashboard' &&
              styles.activeNavLabel,
          ]}
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      {/* Analytics */}
      <TouchableOpacity
        style={[
          styles.navItem,
          activeRoute === 'DirectorKPI' &&
            styles.activeNavItem,
        ]}
        onPress={() =>
          navigation.navigate('DirectorKPI')
        }
      >
        <Text
          style={[
            styles.navIcon,
            activeRoute === 'DirectorKPI' &&
              styles.activeNavIcon,
          ]}
        >
          📈
        </Text>

        <Text
          style={[
            styles.navLabel,
            activeRoute === 'DirectorKPI' &&
              styles.activeNavLabel,
          ]}
        >
          Analytics
        </Text>
      </TouchableOpacity>

      {/* Alerts */}
      <TouchableOpacity
        style={[
          styles.navItem,
          activeRoute === 'AlertLogs' &&
            styles.activeNavItem,
        ]}
        onPress={() =>
          navigation.navigate('AlertLogs')
        }
      >
        <Text
          style={[
            styles.navIcon,
            activeRoute === 'AlertLogs' &&
              styles.activeNavIcon,
          ]}
        >
          ⚠️
        </Text>

        <Text
          style={[
            styles.navLabel,
            activeRoute === 'AlertLogs' &&
              styles.activeNavLabel,
          ]}
        >
          Alerts
        </Text>

        {unreadCount > 0 && (
          <View style={styles.navBadge}>
            <Text style={styles.navBadgeText}>
              {unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity
        style={[
          styles.navItem,
          activeRoute === 'DirectorProfile' &&
            styles.activeNavItem,
        ]}
        onPress={() =>
          navigation.navigate('DirectorProfile')
        }
      >
        <Text
          style={[
            styles.navIcon,
            activeRoute === 'DirectorProfile' &&
              styles.activeNavIcon,
          ]}
        >
          👤
        </Text>

        <Text
          style={[
            styles.navLabel,
            activeRoute === 'DirectorProfile' &&
              styles.activeNavLabel,
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.layout,
          width <= 1024 && styles.layoutMobile,
        ]}
      >
        {width > 1024 && (
          <DirectorSidebar
            navigation={navigation}
            activeRoute={activeRoute}
          />
        )}

        <View style={styles.mainArea}>
          {renderTopBar()}

          <View style={styles.contentContainer}>
            {children}
          </View>

          {renderBottomNav()}
        </View>
      </View>

      {/* Sidebar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() =>
          setSidebarVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setSidebarVisible(false)
              }
            >
              <Text style={styles.closeButtonText}>
                ✕
              </Text>
            </TouchableOpacity>

            <DirectorSidebar
              navigation={navigation}
              activeRoute={activeRoute}
              onItemClick={() =>
                setSidebarVisible(false)
              }
            />
          </View>

          <Pressable
            style={styles.modalBackdrop}
            onPress={() =>
              setSidebarVisible(false)
            }
          />
        </View>
      </Modal>

      {/* Notifications */}
      {showNotifications && (
        <>
          <Pressable
            style={styles.notificationBackdrop}
            onPress={() =>
              setShowNotifications(false)
            }
          />

          <View style={styles.notificationsDropdown}>
            <Text style={styles.notificationsTitle}>
              Notifications
            </Text>

            <FlatList
              data={MOCK_NOTIFICATIONS}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.dropdownNotification,
                    !item.read &&
                      styles.unreadNotification,
                  ]}
                >
                  <Text
                    style={
                      styles.dropdownNotificationTitle
                    }
                  >
                    {item.title}
                  </Text>

                  <Text
                    style={
                      styles.dropdownNotificationMessage
                    }
                  >
                    {item.message}
                  </Text>

                  <Text
                    style={
                      styles.dropdownNotificationTime
                    }
                  >
                    {item.time}
                  </Text>
                </View>
              )}
              style={styles.notificationsList}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  layout: {
    flex: 1,
    flexDirection: 'row',
  },

  layoutMobile: {
    flexDirection: 'column',
  },

  mainArea: {
    flex: 1,
  },

  contentContainer: {
    flex: 1,
  },

  /* ---------------- TOP BAR ---------------- */

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingVertical: 10,

    backgroundColor:
      theme.colors.surfaceContainerLowest,

    borderBottomWidth: 1,
    borderBottomColor:
      theme.colors.outlineVariant,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },

      android: {
        elevation: 3,
      },
    }),
  },

  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  topBarTitle: {
    ...theme.typography.title,
    color: theme.colors.primaryContainer,
    fontSize: 17,
    fontWeight: '700',
  },

  topBarRight: {
    flexDirection: 'row',
    gap: 10,
  },

  iconButton: {
    width: 36,
    height: 36,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 18,

    backgroundColor:
      theme.colors.surfaceContainerHigh,

    position: 'relative',
  },

  iconButtonText: {
    fontSize: 18,
  },

  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,

    backgroundColor: theme.colors.error,

    borderRadius: 10,
    minWidth: 18,
    height: 18,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 4,
  },

  notificationBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  /* ---------------- HAMBURGER ---------------- */

  hamburgerButton: {
    width: 40,
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,

    backgroundColor:
      theme.colors.surfaceContainerHigh,

    marginRight: 14,
  },

  hamburgerLine: {
    width: 18,
    height: 2,

    backgroundColor:
      theme.colors.primaryContainer,

    marginVertical: 2.2,

    borderRadius: 2,
  },

  /* ---------------- BOTTOM NAV ---------------- */

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor:
      theme.colors.surfaceContainerLowest,

    borderTopWidth: 1,
    borderTopColor:
      theme.colors.outlineVariant,

    paddingTop: 6,
    paddingBottom:
      Platform.OS === 'ios' ? 14 : 6,

    height:
      Platform.OS === 'ios' ? 72 : 62,

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },

      android: {
        elevation: 8,
      },
    }),
  },

  navItem: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',

    paddingVertical: 4,

    marginHorizontal: 4,

    position: 'relative',

    borderRadius: 10,
  },

  activeNavItem: {
    backgroundColor:
      theme.colors.primaryContainer + '15',
  },

  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },

  activeNavIcon: {
    color: theme.colors.primary,
  },

  navLabel: {
    fontSize: 11,
    color: theme.colors.onSurfaceVariant,
    fontWeight: '500',
  },

  activeNavLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
  },

  navBadge: {
    position: 'absolute',

    top: 2,
    right: '24%',

    backgroundColor: theme.colors.error,

    borderRadius: 8,

    minWidth: 16,
    height: 16,

    justifyContent: 'center',
    alignItems: 'center',

    paddingHorizontal: 3,
  },

  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  /* ---------------- MODAL ---------------- */

  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  modalContent: {
    width: width * 0.8,

    backgroundColor:
      theme.colors.surfaceContainerLowest,

    height: '100%',

    position: 'relative',
  },

  closeButton: {
    position: 'absolute',

    top: Platform.OS === 'ios' ? 54 : 44,
    right: 16,

    zIndex: 1,

    width: 32,
    height: 32,

    borderRadius: 16,

    backgroundColor:
      theme.colors.surfaceContainerHigh,

    justifyContent: 'center',
    alignItems: 'center',
  },

  closeButtonText: {
    fontSize: 18,
    color: theme.colors.onSurface,
    fontWeight: '600',
  },

  /* ---------------- NOTIFICATIONS ---------------- */

  notificationBackdrop: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    backgroundColor: 'rgba(0,0,0,0.3)',

    zIndex: 5,
  },

  notificationsDropdown: {
    position: 'absolute',

    top: 60,
    right: 20,

    width: 300,

    backgroundColor:
      theme.colors.surfaceContainerLowest,

    borderRadius: 12,

    padding: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 5,

    zIndex: 6,
  },

  notificationsTitle: {
    ...theme.typography.title,
    fontSize: 16,
    marginBottom: 12,
  },

  notificationsList: {
    maxHeight: 400,
  },

  dropdownNotification: {
    paddingVertical: 12,

    borderBottomWidth: 1,

    borderBottomColor:
      theme.colors.outlineVariant,
  },

  unreadNotification: {
    backgroundColor:
      theme.colors.primaryContainer + '08',

    borderRadius: 8,

    paddingHorizontal: 8,
  },

  dropdownNotificationTitle: {
    ...theme.typography.bodyMd,
    fontWeight: '600',
  },

  dropdownNotificationMessage: {
    ...theme.typography.bodySm,

    color: theme.colors.onSurfaceVariant,

    marginTop: 4,
  },

  dropdownNotificationTime: {
    ...theme.typography.bodySm,

    fontSize: 11,

    color: theme.colors.outline,

    marginTop: 4,
  },
});