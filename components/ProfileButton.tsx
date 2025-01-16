import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

interface props{
    text: string
    textColor: string
    buttonColor: string
    type: 'logout' | 'geral'
}

export default function ProfileButton(props: props) {
  const router = useRouter()
  const logout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da conta?",
      [
        {
          text: "Cancelar",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: () => Promise.resolve([AsyncStorage.removeItem('userToken'), AsyncStorage.removeItem('user')])
                                .then(()=> router.replace('/login')),
        },
      ]
    );
    
  }
  return (
    <TouchableOpacity onPress={logout} style={[styles.button, {backgroundColor: props.buttonColor}]}>
        <Text style={[styles.textButton, {color: props.textColor}]}>{props.text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 15,
        paddingBlock: 5,
        paddingInline: 10,
    },
    textButton: {
      fontSize: 25
    }
})