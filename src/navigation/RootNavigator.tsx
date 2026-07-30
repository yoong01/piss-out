import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { AddReviewScreen } from '../screens/AddReviewScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { FindStackParamList, RootTabParamList } from './types';

const FindStack = createNativeStackNavigator<FindStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function FindStackNavigator() {
  return (
    <FindStack.Navigator screenOptions={{ headerTintColor: colors.primaryDark }}>
      <FindStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <FindStack.Screen
        name="LocationDetail"
        component={LocationDetailScreen}
        options={{ title: 'Details' }}
      />
      <FindStack.Screen
        name="AddReview"
        component={AddReviewScreen}
        options={{ title: 'File a Report', presentation: 'modal' }}
      />
    </FindStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
      }}
    >
      <Tab.Screen
        name="FindTab"
        component={FindStackNavigator}
        options={{
          title: 'Find',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🧭</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Rank',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎖️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
