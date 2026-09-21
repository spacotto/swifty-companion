import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Search"
      screenOptions={{
        headerStyle: { backgroundColor: '#18181b' },
        headerTintColor: '#00babc',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ title: 'Swifty Companion' }} 
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ route }) => ({ title: route.params?.user?.login || 'Profile' })} 
      />
    </Stack.Navigator>
  );
}
