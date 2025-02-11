import React from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';

const Index = () => {
  const router = useRouter()

  const onPressButton = async () => {
    router.navigate('/(tabs)/analysies')
  }

  return(
    <View style={styles.container}>
      <Image style={styles.logo} source={ require('@/assets/images/logo.png') } />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.text}>
          Com o Ervas Detector, você pode analisar e identificar ervas daninhas em seu pasto de forma rápida e precisa. Isso ajuda a melhorar a qualidade da alimentação do gado e facilita a escolha dos herbicidas mais adequados para o controle eficiente das plantas invasoras.
        </Text>
      </View>
        <TouchableOpacity style={styles.button} onPress={onPressButton}>
          <Text style={styles.buttonText}>
            MINHAS ANÁLISES
          </Text>
        </TouchableOpacity>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#DBE7C9',
    paddingBlock: 50
  },
  textContainer: {
    paddingBlock: 20,
    paddingInline: 25,
  },
  logo: {
    width: 350,
    height: 183
  },
  title: {
    fontSize: 48,
    textAlign: 'center',
    color: '#4A4A4A'
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    color: '#4A4A4A'
  },
  button: {
    borderRadius: 10,

    //sombra ios
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Sombra para Android
    elevation: 3,
    height: 50,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: '#4A4A4A'
  }
});

export default Index;
