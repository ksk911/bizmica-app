import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

const LOCATION_TASK_NAME = 'background-location-task';
const API_BASE = 'http://192.168.1.7:5000'; // Match PC IP

// We need a way to pass user details to the background task if it wakes up the app.
// For MVP, we can rely on AsyncStorage or pass it when starting.
// But TaskManager tasks must be defined in global scope.
let currentUserId = null;
let currentCompanyId = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
    if (error) {
        console.error("Background Location Error:", error);
        return;
    }
    if (data) {
        const { locations } = data;
        const loc = locations[0];
        
        if (loc && currentUserId && currentCompanyId) {
            try {
                // For MVP, we fire the POST request here.
                await fetch(`${API_BASE}/api/location/ping`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: currentUserId,
                        company_id: currentCompanyId,
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude
                    })
                });
                console.log('Background ping sent:', loc.coords);
            } catch (err) {
                console.error("Failed to send background ping", err);
            }
        }
    }
});

export const startLocationTracking = async (userId, companyId) => {
    currentUserId = userId;
    currentCompanyId = companyId;

    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus !== 'granted') {
        console.warn('Foreground location permission denied');
        return;
    }

    if (Platform.OS !== 'web') {
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
            console.warn('Background location permission denied');
            // Can still try foreground tracking
        }

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 120000, // 2 minutes
            distanceInterval: 20, // 20 meters
            showsBackgroundLocationIndicator: true,
            foregroundService: {
                notificationTitle: "Bizmica PAIRS",
                notificationBody: "Live patrol tracking is active.",
                notificationColor: "#1A2B3C",
            }
        });
        console.log("Background location tracking started.");
    } else {
        // Fallback for Web (setInterval since Web doesn't support TaskManager background location)
        const sendPing = async () => {
            try {
                const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
                await fetch(`${API_BASE}/api/location/ping`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: currentUserId,
                        company_id: currentCompanyId,
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude
                    })
                });
                console.log('Web ping sent:', loc.coords);
            } catch (err) {
                console.error("Failed to send web ping", err);
            }
        };

        sendPing(); // 🔥 Fire immediately on login — don't wait 2 minutes
        setInterval(sendPing, 120000); // Then keep pinging every 2 minutes
        console.log("Web location tracking started.");
    }
};

export const stopLocationTracking = async () => {
    if (Platform.OS !== 'web') {
        const hasTask = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        if (hasTask) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log("Background location tracking stopped.");
        }
    }
};
