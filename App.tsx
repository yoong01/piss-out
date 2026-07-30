import 'leaflet/dist/leaflet.css';
import './src/theme/leafletOverrides.css';

import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppStore } from './src/data/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { fontAssets } from './src/theme/typography';

export default function App() {
  const hasHydrated = useAppStore((s) => s.hasHydrated);
  const [fontsLoaded] = useFonts(fontAssets);

  if (!hasHydrated || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.black} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
