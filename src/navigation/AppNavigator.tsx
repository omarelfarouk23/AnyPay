import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet} from 'react-native';
import {colors} from '../config/colors';
import {useAuthStore} from '../store/authStore';
import {AuthScreen} from '../screens/auth/AuthScreen';
import {ChatListScreen} from '../screens/chat/ChatListScreen';
import {ChatScreen} from '../screens/chat/ChatScreen';
import {WalletScreen} from '../screens/wallet/WalletScreen';
import {SendMoneyScreen} from '../screens/wallet/SendMoneyScreen';
import {TransactionHistoryScreen} from '../screens/wallet/TransactionHistoryScreen';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {SettingsScreen} from '../screens/profile/SettingsScreen';
import {CustomerSupportScreen} from '../screens/customer/CustomerSupportScreen';
import {FAQScreen} from '../screens/customer/FAQScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabIcon: React.FC<{name: string; focused: boolean; color: string}> = ({name, focused, color}) => {
  const icons: Record<string, string> = {
    chat: '💬',
    wallet: '👛',
    profile: '👤',
  };
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, {color}]}>{icons[name] ?? '📱'}</Text>
    </View>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 65,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
          marginBottom: 2,
        },
      }}>
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({focused, color}) => <TabIcon name="chat" focused={focused} color={color} />,
          tabBarLabel: 'المحادثات',
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({focused, color}) => <TabIcon name="wallet" focused={focused} color={color} />,
          tabBarLabel: 'المحفظة',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color}) => <TabIcon name="profile" focused={focused} color={color} />,
          tabBarLabel: 'الملف',
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const {isAuthenticated} = useAuthStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
        }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    lineHeight: 22,
  },
});
