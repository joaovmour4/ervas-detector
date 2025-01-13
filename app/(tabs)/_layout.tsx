import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const router = useRouter();
  
  React.useEffect(() => {
    const checkFirstAccess = async () => {
      const isFirstAccess = await AsyncStorage.getItem('hasLaunched');
      
      if (!isFirstAccess) {
        await AsyncStorage.setItem('hasLaunched', 'false');
        router.push('/onboarding'); // Redireciona para a tela de onboarding
      }
    };

    checkFirstAccess();
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'green',
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
    </Tabs>
  );
}
