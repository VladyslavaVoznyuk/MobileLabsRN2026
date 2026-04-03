import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FileViewerScreen from './screens/FileViewerScreen';
import FileEditorScreen from './screens/FileEditorScreen';
import FileInfoScreen from './screens/FileInfoScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#0A0A0F" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0A0A0F' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FileViewer" component={FileViewerScreen} />
        <Stack.Screen name="FileEditor" component={FileEditorScreen} />
        <Stack.Screen name="FileInfo" component={FileInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
