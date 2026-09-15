// src/navigation/AppNavigator.tsx
// Navigation for Anypay app.
// AUTH: Auth state from Zustand controls the auth/main navigation fork.
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, View, StyleSheet, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../config/colors';
import {useAuthStore} from '../store/authStore';
import {AuthScreen} from '../screens/auth/AuthScreen';
import {ChatListScreen} from '../screens/chat/ChatListScreen';
import {ChatScreen} from '../screens/chat/ChatScreen';
import {NewChatScreen} from '../screens/chat/NewChatScreen';
import {WalletScreen} from '../screens/wallet/WalletScreen';
import {SendMoneyScreen} from '../screens/wallet/SendMoneyScreen';
import {TransactionHistoryScreen} from '../screens/wallet/TransactionHistoryScreen';
import {ProfileScreen} from '../screens/profile/ProfileScreen';
import {SettingsScreen} from '../screens/profile/SettingsScreen';
import {CustomerSupportScreen} from '../screens/customer/CustomerSupportScreen';
import {FAQScreen} from '../screens/customer/FAQScreen';
import {ScannerScreen} from '../screens/pay/ScannerScreen';
import {ReceiveQRScreen} from '../screens/pay/ReceiveQRScreen';
import {PaymentConfirmScreen} from '../screens/pay/PaymentConfirmScreen';
import {PaymentSuccessScreen} from '../screens/pay/PaymentSuccessScreen';
import {ChatInfoScreen} from '../screens/chat/ChatInfoScreen';
import {NearbyServicesScreen} from '../screens/location/NearbyServicesScreen';
import {BiometricSettingsScreen} from '../screens/settings/BiometricSettingsScreen';
import {Icon} from '../components/ui/Icon';

// ── Param lists ──────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Chat: {conversationId: string; conversationTitle: string};
  NewChat: {contactId?: string} | undefined;
  Settings: undefined;
  Profile: undefined;
  CustomerSupport: undefined;
  FAQ: undefined;
  PayTabs: undefined;
  Scanner: undefined;
  ReceiveQR: {presetAmount?: number};
  PaymentConfirm: {merchantId: string; merchantName: string; amount: number; ccpId?: string; note?: string};
  PaymentSuccess: {reference: string; amount: number; merchantName: string; balanceAfter: number; rewardPoints?: number};
  SendMoney: undefined;
  TransactionHistory: undefined;
  Wallet: undefined;
  ChatInfo: undefined;
  NearbyServices: undefined;
  BiometricSettings: undefined;
};

export type PaymentStackParamList = {
  Scanner: undefined;
  ReceiveQR: {presetAmount?: number};
  SendMoney: undefined;
  TransactionHistory: undefined;
  PaymentConfirm: {
    merchantId: string;
    merchantName: string;
    amount: number;
    ccpId?: string;
    note?: string;
  };
  PaymentSuccess: {
    reference: string;
    amount: number;
    merchantName: string;
    balanceAfter: number;
    rewardPoints?: number;
  };
};

export type TabParamList = {
  ChatList: undefined;
  Wallet: undefined;
  PayTabs: undefined;
  Discover: undefined;
  Me: undefined;
};

// ── Navigator instances ──────────────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();
const TabNav = createBottomTabNavigator<TabParamList>();
const PaymentStack = createNativeStackNavigator<PaymentStackParamList>();

// ── Tab icon helper ──────────────────────────────────────────────────────────

const TabIcon: React.FC<{name: keyof TabParamList; focused: boolean; color: string}> = (
  {name, focused, color},
) => {
  const icons: Record<string, string> = {
    ChatList: '💬',
    Wallet: '👛',
    PayTabs: '💰',
    Discover: '🔍',
    Me: '🧑',
  };
  return (
    <View style={styles.tabIconContainer}>
      <Text style={[styles.tabIcon, {color}]}>{icons[name] ?? '📱'}</Text>
    </View>
  );
};

// ── Tab Navigator ────────────────────────────────────────────────────────────

const TabNavigator = () => {
  return (
    <TabNav.Navigator
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
      <TabNav.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon name="ChatList" focused={focused} color={color} />
          ),
          tabBarLabel: 'المحادثات',
        }}
      />
      <TabNav.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon name="Wallet" focused={focused} color={color} />
          ),
          tabBarLabel: 'المحفظة',
        }}
      />
      <TabNav.Screen
        name="PayTabs"
        component={PayTabsStack}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon name="PayTabs" focused={focused} color={color} />
          ),
          tabBarLabel: 'الدفع',
        }}
      />
      <TabNav.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon name="Discover" focused={focused} color={color} />
          ),
          tabBarLabel: 'اكتشاف',
        }}
      />
      <TabNav.Screen
        name="Me"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused, color}) => (
            <TabIcon name="Me" focused={focused} color={color} />
          ),
          tabBarLabel: 'الملف',
        }}
      />
    </TabNav.Navigator>
  );
};

// ── Pay Tabs Stack (Scanner + ReceiveQR + Payment flow) ─────────────────────

const PayTabsStack: React.FC = () => {
  return (
    <PaymentStack.Navigator
      screenOptions={{headerShown: false}}>
      <PaymentStack.Screen
        name="Scanner"
        component={ScannerScreen}
      />
      <PaymentStack.Screen
        name="ReceiveQR"
        component={ReceiveQRScreen}
        initialParams={{presetAmount: undefined}}
      />
      <PaymentStack.Screen
        name="SendMoney"
        component={SendMoneyScreen}
      />
      <PaymentStack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
      />
      <PaymentStack.Screen
        name="PaymentConfirm"
        component={PaymentConfirmScreen}
      />
      <PaymentStack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
      />
    </PaymentStack.Navigator>
  );
};

// ── Placeholder screens ───────────────────────────────────────────────────────

const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>اكتشاف</Text>
      <Text style={styles.sub}>استكشف الخدمات القريبة</Text>
      <Button title="الخدمات القريبة" onPress={() => (navigation as any).navigate('NearbyServices')} />
    </View>
  );
};

// ── Settings Sub-Placeholders ────────────────────────────────────────

const SettingsWrapper: React.FC = () => {
  return <SettingsScreen />;
};

// ── Root AppNavigator ────────────────────────────────────────────────────────

export const AppNavigator: React.FC = () => {
  const {isAuthenticated} = useAuthStore();

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {backgroundColor: colors.background},
        }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <RootStack.Screen name="Main" component={TabNavigator} />
            <RootStack.Screen name="Chat" component={ChatScreen as any} />
            <RootStack.Screen name="NewChat" component={NewChatScreen} />
            <RootStack.Screen name="Settings" component={SettingsWrapper} />
            <RootStack.Screen name="Profile" component={ProfileScreen} />
            <RootStack.Screen name="CustomerSupport" component={CustomerSupportScreen} />
            <RootStack.Screen name="FAQ" component={FAQScreen} />
            <RootStack.Screen name="PaymentConfirm" component={PaymentConfirmScreen} />
            <RootStack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <RootStack.Screen name="ChatInfo" component={ChatInfoScreen} />
            <RootStack.Screen name="NearbyServices" component={NearbyServicesScreen} />
            <RootStack.Screen name="BiometricSettings" component={BiometricSettingsScreen} />
            {/* Screens inside PayTabs handled by PaymentStack */}
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 22,
    lineHeight: 22,
  },
  container: {flex: 1, backgroundColor: colors.background},
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginTop: 50,
  },
  sub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
