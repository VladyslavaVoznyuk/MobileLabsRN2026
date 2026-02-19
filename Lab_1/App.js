import React from 'react';
import { Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ color, size }) => {
      let iconName;

      if (route.name === 'Головна') {
        iconName = 'home';
      } else if (route.name === 'Фотогалерея') {
        iconName = 'images';
      } else if (route.name === 'Профіль') {
        iconName = 'person';
      }

      return <Ionicons name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: '#007AFF',
    tabBarInactiveTintColor: 'gray',
  })}
>
  <Tab.Screen name="Головна" component={HomeScreen} />
  <Tab.Screen name="Фотогалерея" component={GalleryScreen} />
  <Tab.Screen name="Профіль" component={ProfileScreen} />
</Tab.Navigator>


      <View style={{ alignItems: 'center', padding: 6 }}>
        <Text style={{ fontSize: 12 }}>
         Вознюк Владислава ВТ-22-1
        </Text>
      </View>
    </NavigationContainer>
  );
}
