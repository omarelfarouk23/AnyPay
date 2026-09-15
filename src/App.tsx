import React, {useState, useEffect, useRef} from 'react';
import {StatusBar, View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ThemeProvider} from './hooks/useTheme';
import {AppNavigator} from './navigation/AppNavigator';
import {pushNotificationService} from './services/notification/PushNotificationService';
import {useAuthStore} from './store/authStore';
import {colors} from './config/colors';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const {checkAuth, token} = useAuthStore();
  const mountedRef = useRef(true);

  useEffect(() => {
    async function init() {
      try {
        await checkAuth();
      } catch (e) {
        console.error('[App] Auth check failed:', e);
      }
      if (mountedRef.current) {
        setIsReady(true);
      }
    }
    init();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady || !token) return;
    let mounted = true;

    async function setupNotifications() {
      try {
        // Configure push notification service
        pushNotificationService.configure({
          onForeground: async (notification) => {
            if (!mounted) return;
            console.log('[App] Foreground notification:', notification);
            // Handle incoming message notification
            const data = notification.request.content.data as {conversationId?: string} | undefined;
            if (data?.conversationId) {
              // Will be handled by navigation
            }
          },
          onBackground: async (notification) => {
            console.log('[App] Background notification:', notification);
          },
          onTap: async (notification) => {
            if (!mounted) return;
            console.log('[App] Notification tap:', notification);
          },
        });

        const pushToken = await pushNotificationService.getDevicePushToken();
        if (pushToken && mounted) {
          console.log('[App] Push token:', pushToken);
        }
      } catch (e) {
        console.error('[App] Push error:', e);
      }
    }

    setupNotifications();

    return () => {
      mounted = false;
      pushNotificationService.removeAllListeners();
    };
  }, [isReady, token]);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <View style={styles.splash}>
            <Text style={styles.splashText}>Anypay</Text>
            <ActivityIndicator color={colors.accent} size="large" style={styles.spinner} />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
          <AppNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
  splash: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginBottom: 24,
    letterSpacing: 1,
  },
  spinner: {transform: [{scale: 1.2}]},
});
