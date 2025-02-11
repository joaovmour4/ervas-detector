import { StyleSheet, Text, Image, View, FlatList, Alert } from 'react-native'
import React, { useContext } from 'react'
import { ProfileButtonPropsType, UserType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import ProfileOptionButton from '@/components/ProfileOptionButton'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'
import { useFocusEffect, useRouter } from 'expo-router'
import { AuthContext } from '../contexts/AuthContext'

export default function user() {
  const Context = useContext(AuthContext)
  const router = useRouter()
  const [updatePhoto, setUpdatePhoto] = React.useState<number>()
  const buttons: Array<ProfileButtonPropsType> = [
    {
      text: 'Editar Perfil',
      iconName: 'person-outline',
      callbackFn: () => router.navigate('/editProfile')
    },
    {
      text: 'Sobre',
      iconName: 'information-circle-outline',
      callbackFn: () => router.navigate('/about')
    },
    {
      text: 'Sair',
      iconName: 'log-out-outline',
      callbackFn: ()=> logout()
    }
  ]

  const logout = () => {
    Alert.alert(
      "Sair",
      "Tem certeza que deseja sair da conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Ok",
          onPress: async () => {
            await Context.signOut()
            router.replace('/login')
          }
        },
      ]
    );
    
  }


  useFocusEffect(
    React.useCallback(()=>{
      const fetchUpdatedProfile = async () => {
        setUpdatePhoto(new Date().getTime())
      };
      fetchUpdatedProfile()
    }, [])
  )

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {Context.user?.profileImage && <Image style={styles.profileImage} source={{ uri: `${Context.user.profileImage}?timestamp=${updatePhoto}` }} />}
        {!Context.user?.profileImage && <Ionicons name='person-circle-outline' size={styles.profileIcon.height} color={'#666666'} style={styles.profileIcon}/>}
      </View>
      <Text style={styles.nameText}>{Context.user?.name}</Text>
      <Text style={styles.otherText}>{Context.user?.email}</Text>
      <Text style={styles.otherText}>{Context.user?.city}</Text>

      <View style={styles.optionsContainer}>
        <FlatList
          data={buttons}
          renderItem={({item}) => 
            <ProfileOptionButton 
              text={item.text}
              iconName={item.iconName}
              callbackFn={item.callbackFn}
            />}
          keyExtractor={item => item.text}
        />
      </View>
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
  optionsContainer: {
    flex: 1,
    width: '85%'
  },
  imageContainer: {
    paddingBlockStart: 25,
    paddingBlockEnd: 20
  },
  profileImage: {
    height: 250,
    width: 250,
    borderRadius: 200,
    flex: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
  },
  editIcon: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#000000cc',
    padding: 6,
    borderWidth: 0.5,
    borderColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10,
  },
  profileIcon: {
    height: 300,
    width: 300,
    borderRadius: 60,
    flex: 0,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'black',
    color: '#4A4A4A'
  },
  otherText: {
    fontSize: 16,
    color: '#4A4A4A'
  }
})