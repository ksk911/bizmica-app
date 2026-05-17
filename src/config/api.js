import { Platform } from 'react-native';

// For Android Emulator, use 10.0.2.2 instead of localhost
// For web, use localhost
// For physical devices, you must use your machine's local IP address (e.g., 192.168.1.5)
const LOCALHOST = '10.38.54.110'; // Using machine's local IP so physical devices on the same Wi-Fi can connect

export const API_BASE_URL = `http://${LOCALHOST}:5000/api`;

