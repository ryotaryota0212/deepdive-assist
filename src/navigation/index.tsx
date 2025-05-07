import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import CaptureScreen from '../screens/Capture/CaptureScreen';
import NotesScreen from '../screens/Notes/NotesScreen';
import DeepDiveScreen from '../screens/DeepDive/DeepDiveScreen';
import MediaDetailScreen from '../screens/MediaDetailScreen';

import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6200ee',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: '深掘りアシスト' }} 
        />
        <Stack.Screen 
          name="Capture" 
          component={CaptureScreen} 
          options={{ title: 'キャプチャ' }} 
        />
        <Stack.Screen 
          name="Notes" 
          component={NotesScreen} 
          options={{ title: 'メモ & 感情ログ' }} 
        />
        <Stack.Screen 
          name="DeepDive" 
          component={DeepDiveScreen} 
          options={{ title: '深掘りセッション' }} 
        />
        <Stack.Screen 
          name="MediaDetail" 
          component={MediaDetailScreen} 
          options={{ title: '作品詳細' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
