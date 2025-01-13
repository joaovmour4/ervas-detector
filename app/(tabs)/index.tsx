import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, useRouter } from 'expo-router';

const Index = () => { 
  const clearFirstLaunch = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage limpo com sucesso!');
      // router.push('/onboarding')
    } catch (error) {
      console.error('Erro ao remover a chave "hasLaunched":', error);
    }
  };

  return(
    <View style={styles.container}>
      <Text>Bem-vindo de volta!</Text>
      <Button title="Limpar AsyncStorage" onPress={clearFirstLaunch} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Index;
