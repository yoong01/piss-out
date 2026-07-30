import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { AddReviewScreen } from '../screens/AddReviewScreen';
import { FeedScreen } from '../screens/FeedScreen';
import { LocationDetailScreen } from '../screens/LocationDetailScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';
import { RootTabParamList, SharedStackParamList } from './types';

const MapStack = createNativeStackNavigator<SharedStackParamList>();
const FeedStack = createNativeStackNavigator<SharedStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

const detailScreenOptions = {
  title: 'Details',
  headerTintColor: colors.black,
  headerTitleStyle: { fontFamily: fonts.bodyBold },
};

const addReviewScreenOptions = {
  title: 'File a Report',
  presentation: 'modal' as const,
  headerTintColor: colors.black,
  headerTitleStyle: { fontFamily: fonts.bodyBold },
};

function MapStackNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerTintColor: colors.black }}>
      <MapStack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <MapStack.Screen name="LocationDetail" component={LocationDetailScreen} options={detailScreenOptions} />
      <MapStack.Screen name="AddReview" component={AddReviewScreen} options={addReviewScreenOptions} />
    </MapStack.Navigator>
  );
}

function FeedStackNavigator() {
  return (
    <FeedStack.Navigator screenOptions={{ headerTintColor: colors.black }}>
      <FeedStack.Screen name="Feed" component={FeedScreen} options={{ headerShown: false }} />
      <FeedStack.Screen name="LocationDetail" component={LocationDetailScreen} options={detailScreenOptions} />
      <FeedStack.Screen name="AddReview" component={AddReviewScreen} options={addReviewScreenOptions} />
    </FeedStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="MapTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarLabelStyle: { fontFamily: fonts.bodyBold, fontSize: 11 },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapStackNavigator}
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="FeedTab"
        component={FeedStackNavigator}
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📰</Text>,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎖️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
