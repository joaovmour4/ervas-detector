import { StyleSheet, Text, Image, TouchableOpacity, View, FlatList, Alert } from 'react-native'
import React, { useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../api'
import { ProfileButtonPropsType, UserType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import ProfileOptionButton from '@/components/ProfileOptionButton'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'
import { Router, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { AxiosError } from 'axios'
import FormData from 'form-data'
import { AuthContext } from '../contexts/AuthContext'


const resizeImage = async (uri: string) => {
    try {
      const manipulatedImage = await manipulateAsync(
        uri,
        [{ resize: { width: 640, height: 640 } }], // Redimensiona para 640x640
        { compress: 1, format: SaveFormat.JPEG } // Comprime e converte para JPEG
      );
      return manipulatedImage.uri;
    } catch (error) {
      console.error('Erro ao redimensionar a imagem:', error);
      return null;
    }
};

export default function user() {
  const Context = useContext(AuthContext)
  const router = useRouter()
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

  const takePhoto = async ()=> {
    const options = ['Tirar uma foto', 'Escolher da biblioteca', 'Cancelar']
    const cancelIndex = 2;
    Alert.alert(
      'Escolha uma opção',
      '',
      options.map((option, index) => ({
        text: option,
        onPress: () => {
          if (index === 0) {
            takePhotoFromCamera()
          } else if (index === 1) {
            takePhotoFromLibrary()
          }
        },
        style: index === cancelIndex ? 'cancel' : 'default',
      }))
    );
  }

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
          onPress: async () => {
            await Context.signOut()
            router.replace('/login')
          }
        },
      ]
    );
    
  }

  const takePhotoFromCamera = async () => {
    const statusCamera = await ImagePicker.requestCameraPermissionsAsync()
  
    if (!statusCamera.granted) {
      alert('Permissão para acessar a câmera é necessária!')
      return;
    }
  
    // Abre a câmera para capturar uma imagem
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images', // Apenas imagens
      allowsEditing: true, // Permite edição
      quality: 0.7, // Qualidade máxima da imagem,
      aspect: [1, 1] // Aceita apenas imagens quadradas
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await sendProfileImage(result.assets[0])
    }
  };

  const takePhotoFromLibrary = async () => {
    const statusLibrary = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (!statusLibrary.granted) {
      alert('Permissão para acessar os arquivos é necessária!');
      return;
    }
  
    // Abre a galeria para selecionar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Apenas imagens
      allowsEditing: true, // Permite edição
      quality: 0.7, // Qualidade máxima da imagem,
      aspect: [1, 1] // Aceita apenas imagens quadradas
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await sendProfileImage(result.assets[0])
    }
  };
  
  const sendProfileImage = async (asset: ImagePicker.ImagePickerAsset) => {
    const formData = new FormData()
    const fileResizedUri = await resizeImage(asset.uri)
  
    formData.append('file', {
      uri: fileResizedUri,
      type: "image/jpeg",
      name: 'image.jpg'
    })
  
    api
      .post(`/users/image/${Context.user?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(() => {
        Alert.alert('Sucesso', 'Imagem enviada com sucesso: ')
        // fetchUserInfo()
      })
      .catch((error: AxiosError) => {
        Alert.alert('Erro', `Falha ao enviar a imagem. ${error.response?.status}`);
        console.log(error.code)
      })
  }

  // const fetchUserInfo = () => {
  //   const user = SecureStorage.getItem('user')
  //   const parsedUser = user && JSON.parse(user)
  //   AsyncStorage.getItem('idUser')
  //   api
  //     .get(`/users/id/${parsedUser}`)
  //     .then(response => {
  //       setUser(response.data)
  //     })
  //     .catch(err=>{
  //       console.log(err.message)
  //     })
  // }

  // React.useEffect(()=>{
  //   const user = SecureStorage.getItem('user')
  //   const parsedUser = user && JSON.parse(user)
  //   api
  //     .get(`/users/id/${parsedUser.id}`)
  //     .then(response => {
  //       setUser(response.data)
  //     })
  //     .catch(err=>{
  //       console.log(err.message)
  //     })
  // }, [])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {Context.user?.profileImage && <Image style={styles.profileImage} source={{ uri: `${Context.user.profileImage}?timestamp=${new Date().getTime()}` }} />}
        {!Context.user?.profileImage && <Ionicons name='person-circle-outline' size={styles.profileIcon.height} color={'#666666'} style={styles.profileIcon}/>}
        <TouchableOpacity onPress={takePhoto} style={styles.editIcon}>
          <Ionicons name='pencil' size={20} color={'white'} />
        </TouchableOpacity>
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
          ItemSeparatorComponent={
              () => <ListSeparatorComponent />
          }
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
    fontWeight: 'black'
  },
  otherText: {
    fontSize: 16,
  }
})