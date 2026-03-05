import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainScreen     from '../screens/MainScreen';
import DetailsScreen  from '../screens/DetailsScreen';
import ContactsScreen from '../screens/ContactsScreen';
import CustomDrawer   from '../components/CustomDrawer';

const Stack  = createStackNavigator();
const Drawer = createDrawerNavigator();

const HEADER = {
  headerStyle:      { backgroundColor: '#1976D2' },
  headerTintColor:  '#fff',
  headerTitleStyle: { fontWeight: '700' },
};

const NewsStack = ({ navigation }) => (
  <Stack.Navigator screenOptions={HEADER}>
    <Stack.Screen
      name="MainScreen"
      component={MainScreen}
      options={{
        title: 'Сайт Новин',
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 16 }}>
            <Text style={{ color: '#fff', fontSize: 22 }}>☰</Text>
          </TouchableOpacity>
        ),
      }}
    />
    <Stack.Screen
      name="DetailsScreen"
      component={DetailsScreen}
      options={{ title: '' }}
    />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false, drawerStyle: { width: 270 } }}
    >
      <Drawer.Screen name="NewsStack" component={NewsStack} />
      <Drawer.Screen
        name="ContactsScreen"
        component={ContactsScreen}
        options={{ headerShown: true, ...HEADER, title: 'Контакти' }}
      />
    </Drawer.Navigator>
  );
}
