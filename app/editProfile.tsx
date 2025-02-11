import { StyleSheet, Text, Image, TouchableOpacity, View, Alert } from 'react-native'
import React, { useContext } from 'react'
import api from './api'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'
import { AxiosError } from 'axios'
import FormData from 'form-data'
import ProfileEditField from '@/components/ProfileEditField'
import { AuthContext } from './contexts/AuthContext'


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
  const Context = useContext(AuthContext)
  const navigation = useNavigation()
  const [userName, setUserName] = React.useState<string>(`${Context.user?.name}`)
  const [email, setEmail] = React.useState<string>(`${Context.user?.email}`)
  const [city, setCity] = React.useState<string>(`${Context.user?.city}`)
  const [refreshImage, setRefreshImage] = React.useState<string | null | undefined>(new Date().toString())

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
      .post(`/users/image/${Context.user?.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(() => {
        setRefreshImage(asset.fileName)
        console.log(asset.fileName)
        Alert.alert('Sucesso', 'Imagem enviada com sucesso: ')
        Context.fetchUserInfo()
      })
      .catch((error: AxiosError) => {
        Alert.alert('Erro', `Falha ao enviar a imagem. ${error.response?.status}`);
      })
  }

  const saveEditInfo = async () => {
    api
      .put(`/users/${Context.user?.id}`, {
        name: userName.trim(),
        email: email.trim(),
        city: city.trim()
      })
      .then((response) => {
        Context.updateUserData(response.data)
        Alert.alert(
          'Sucesso',
          'Usuário editado com sucesso.',
          [
            {
                text: "OK",
            },
          ],
        )
        navigation.goBack()
      })
      .catch(err => {
        Alert.alert(
          'Falha',
          `${err.data.message}`,
          [
            {
                text: "OK",
            },
          ],
        )
      })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPressOut={saveEditInfo}>
            <Ionicons 
                name='save-outline'
                size={25}
                backgroundColor="transparent"
                color="black"
                style={{ paddingInlineEnd: 10 }}
            />
        </TouchableOpacity>
      ),
    });
  }, [navigation, userName, email, city]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {Context.user?.profileImage && <Image style={styles.profileImage} source={{ uri: `${Context.user.profileImage}?base64=${refreshImage}` }} />}
        {!Context.user?.profileImage && <Ionicons name='person-circle-outline' size={styles.profileIcon.height} color={'#666666'} style={styles.profileIcon}/>}
        <TouchableOpacity onPress={takePhoto} style={styles.editIcon}>
          <Ionicons name='pencil' size={20} color={'white'} />
        </TouchableOpacity>
      </View>
      <View style={styles.fieldsContainer}>
        <ProfileEditField label='Nome' useState={[userName, setUserName]} />
        <ProfileEditField label='E-Mail' useState={[email, setEmail]} />
        <ProfileEditField label='Cidade' useState={[city, setCity]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#DBE7C9',
    rowGap: 25
  },
  fieldsContainer: {
    flex: 1,
    width: '85%',
    rowGap: 10
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