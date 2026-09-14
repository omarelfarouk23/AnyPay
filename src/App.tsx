import React, { useEffect } from 'react';
import { StatusBar, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from './hooks/useTheme';
import { AppNavigator } from './navigation/AppNavigator';
import { pushNotificationService } from './services/notification/PushNotificationService';
import { useAuthStore } from './store/authStore';
import { colors } from './config/colors';

export default function App() {
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    let mounted = true;

    const initPushNotifications = async () => {
      if (!mounted) return;
      const token = await pushNotificationService.getDevicePushToken();
      if (token && isAuthenticated) {
        console.log('[App] Push token registered', token);
      }
    };

    initPushNotifications();

    pushNotificationService.addForegroundListener((notification) => {
      if (!mounted) return;
      console.log('[App] Notification received:', notification);
    });

    pushNotificationService.addResponseListener((response) => {
      if (!mounted) return;
      console.log('[App] Notification tapped:', response);
    });

    return () => {
      mounted = false;
      pushNotificationService.removeAllListeners();
    };
  }, [isAuthenticated]);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar barStyle="light-content" backgroundColor="#1A2E6B" />
          {isAuthenticated && user ? <AppNavigator /> : <View style={styles.splash}><Text style={styles.splashText}>Anypay</Text></View>}
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
