import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function about() {
  return (
    <View style={styles.container}>
      <View style={styles.containerText}>
      <Image style={styles.logo} source={ require('@/assets/images/logo.png') } />
        {/* <Text style={styles.title}>App Ervas Detector</Text> */}
        <Text style={styles.text}>Desenvolvido por:</Text>
        <Text style={styles.text}>João Vitor Moura Batista</Text>
        <Text style={styles.text}>Mayara Alves Ferreira</Text>
        <Text style={styles.text}>Gabriel Baia</Text>
      </View>
      <Text style={styles.footerText}>Todos os direitos reservados</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#DBE7C9'
  },
  logo: {
    width: 350,
    height: 183
  },
  containerText: {
    flex: 1,
    justifyContent: 'center'
  },
  title: {
    fontSize: 40,
    paddingBottom: 25
  },
  text: {
    fontSize: 25,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#4A4A4A'
  },
  footerText: {
    fontSize: 35,
    paddingBottom: 15,
    color: '#4A4A4A'
  }
})