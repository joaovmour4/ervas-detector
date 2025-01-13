import React from 'react';
import { View, ImageBackground, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const onboarding = ({ navigation }: any) => {
  const router = useRouter()
  const handleStart = async () => {
    await AsyncStorage.setItem('hasLaunched', 'true')
    // navigation.navigate('index');
    router.navigate('/(tabs)')
  };

  return (
    <View style={styles.container}>
      <ImageBackground
          source={require('../assets/images/first_view.png')}
          style={styles.imageBackground}
          >

        <Text>Bem-vindo ao App!</Text>
        <Button title="Começar" onPress={handleStart} />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover', // ou 'contain' para ajustar a imagem
    justifyContent: 'center', // Ajuste conforme necessário
  },
})

export default onboarding;
