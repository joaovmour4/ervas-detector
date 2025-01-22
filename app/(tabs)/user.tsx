import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProfileButton from '@/components/ProfileButton'

export default function user() {
  const [user, setUser] = React.useState<string | null>()

  React.useEffect(()=>{
    AsyncStorage.getItem('idUser')
                .then(user => setUser(user))
  }, [])

  return (
    <View style={styles.container}>
      <Text>{user}</Text>
      <ProfileButton 
        text='Sair'
        buttonColor='red'
        textColor='white'
        type='logout'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  option: {

  }
})