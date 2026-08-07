import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import OrdersScreen from '../screens/OrdersScreen';
import RiderFeedScreen from '../screens/RiderFeedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConfirmRunScreen from '../screens/ConfirmRunScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Icon({ symbol, color }) {
  return <Text style={{ fontSize: 20, color }}>{symbol}</Text>;
}

function MainTabs() {
  const { mode } = useApp();
  const middleLabel = mode === 'sender' ? 'Orders' : 'Feed';
  const middleScreen = mode === 'sender' ? OrdersScreen : RiderFeedScreen;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brandGreenDeep,
        tabBarInactiveTintColor: colors.inkMuted,
        tabBarStyle: { borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Icon symbol="🏠" color={color} /> }}
      />
      <Tab.Screen
        name={middleLabel}
        component={middleScreen}
        options={{ tabBarIcon: ({ color }) => <Icon symbol={mode === 'sender' ? '🧾' : '🚴'} color={color} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ color }) => <Icon symbol="⚙️" color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { authed } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!authed ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="ConfirmRun"
              component={ConfirmRunScreen}
              options={{ headerShown: true, title: 'Confirm run', headerTintColor: colors.brandGreenDeep }}
            />
            <Stack.Screen
              name="OrderTracking"
              component={OrderTrackingScreen}
              options={{ headerShown: true, title: 'Order status', headerTintColor: colors.brandGreenDeep }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
