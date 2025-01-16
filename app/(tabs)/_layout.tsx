import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Button, Platform } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  
  React.useEffect(() => {
    const checkFirstAccess = async () => {
      const isFirstAccess = await AsyncStorage.getItem('hasLaunched');
      const isLoged = await AsyncStorage.getItem('userToken');
      
      if (!isFirstAccess) {
        await AsyncStorage.setItem('hasLaunched', 'false');
        router.push('/onboarding')
      }else if(!isLoged){
        router.push('/login')
      }
    };

    checkFirstAccess();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6E8B3D',
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {
            height: 60
          },
        }),
        tabBarLabelStyle: {
          fontSize: 14
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: true,
          tabBarIcon: ({ color })=> (
            <Ionicons 
              name='home'
              size={10}
              backgroundColor="transparent"
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='analysies'
        options={{
          title: 'Análises',
          headerShown: true,
          tabBarIcon: ({ color })=> (
            <Ionicons
              name='flask-sharp'
              size={10}
              backgroundColor="transparent"
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='species'
        options={{
          title: 'Espécies',
          headerShown: true,
          tabBarIcon: ({ color })=> (
            <Ionicons
              name='leaf'
              size={10}
              backgroundColor="transparent"
              color={color}
            />
          )
        }}
      />
      <Tabs.Screen 
        name='user'
        options={{
          title: 'Perfil',
          headerShown: true,
          tabBarIcon: ({ color })=> (
            <Ionicons 
              name='person'
              size={10}
              backgroundColor="transparent"
              color={color}
            />
          )
        }}
      />
    </Tabs>
  );
}
