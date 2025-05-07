import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context'; // @ts-ignore
import { Provider as PaperProvider } from 'react-native-paper';
import Navigation from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Navigation />
        <StatusBar style="auto" />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
