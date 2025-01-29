import { StyleSheet, Text, Image, TouchableOpacity, View, FlatList, Alert, TextInput } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from './api'
import { ProfileButtonPropsType, UserType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import ProfileOptionButton from '@/components/ProfileOptionButton'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'
import { Router, useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { AxiosError } from 'axios'
import FormData from 'form-data'
import ProfileEditField from '@/components/ProfileEditField'


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

export default function editProfile() {
  const [user, setUser] = React.useState<UserType>()

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
      .post(`/users/image/${user?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(() => {
        Alert.alert('Sucesso', 'Imagem enviada com sucesso: ')
        fetchUserInfo()
      })
      .catch((error: AxiosError) => {
        Alert.alert('Erro', `Falha ao enviar a imagem. ${error.response?.status}`);
        console.log(error.code)
      })
  }

  const fetchUserInfo = () => {
    AsyncStorage.getItem('idUser')
      .then(id =>{
        api
          .get(`/users/id/${id && id.replace(/(?<=^)"|"(?=$)/g, '')}`)
          .then(response => {
            setUser(response.data)
          })
          .catch(err=>{
            console.log(err.message)
          })
      })
  }

  React.useEffect(()=>{
    AsyncStorage.getItem('idUser')
      .then(id =>{
        api
          .get(`/users/id/${id && id.replace(/(?<=^)"|"(?=$)/g, '')}`)
          .then(response => {
            setUser(response.data)
          })
          .catch(err=>{
            console.log(err.message)
          })
      })
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {user?.profileImage && <Image style={styles.profileImage} source={{ uri: `${user.profileImage}?timestamp=${new Date().getTime()}` }} />}
        {!user?.profileImage && <Ionicons name='person-circle-outline' size={styles.profileIcon.height} color={'#666666'} style={styles.profileIcon}/>}
        <TouchableOpacity onPress={takePhoto} style={styles.editIcon}>
          <Ionicons name='pencil' size={20} color={'white'} />
        </TouchableOpacity>
      </View>
      <View style={styles.fieldsContainer}>
        <ProfileEditField label='Nome' placeholder={user?.name} />
        <ProfileEditField label='E-Mail' placeholder={user?.email} />
        <ProfileEditField label='Cidade' placeholder={user?.city} />
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
  fieldsContainer: {
    rowGap: 10
  },
  otherText: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'gray',
    width: '30%'
  }
})