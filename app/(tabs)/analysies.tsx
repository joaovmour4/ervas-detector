import { Alert, FlatList, Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnalysisItemList from '@/components/AnalysisItemList'
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
import api from '../api';
import { AxiosError } from 'axios';
import FormData from 'form-data';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { AnalysisItemListType } from '@/types/types';
import * as SecureStorage from 'expo-secure-store'

export default function analysies() {
  const navigation = useNavigation()
  const [idUser, setIdUser] = React.useState<string | null>()
  const router = useRouter()
  const [analysies, setAnalysies] = React.useState<Array<AnalysisItemListType>>([])
  const [image, setImage] = React.useState<string>()

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
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Permissão para acessar a câmera é necessária!');
      return;
    }

    // Abre a câmera para capturar uma imagem
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images', // Apenas imagens
      allowsEditing: true, // Permite edição
      quality: 0.5, // Qualidade máxima da imagem,
      aspect: [1, 1]
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      await sendAnalysis(result.assets[0])
    }
  };

  const takePhotoFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      alert('Permissão para acessar os arquivos é necessária!');
      return;
    }

    // Abre a câmera para capturar uma imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', // Apenas imagens
      allowsEditing: true, // Permite edição
      quality: 0.5, // Qualidade máxima da imagem,
      aspect: [1, 1]
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      await sendAnalysis(result.assets[0])
    }
  };

  const sendAnalysis = async (asset: ImagePicker.ImagePickerAsset) => {
    const formData = new FormData()
    const fileResizedUri = await resizeImage(asset.uri)

    formData.append('file', {
      uri: fileResizedUri,
      type: "image/jpeg",
      name: 'image.jpg'
    })

    api
      .post('/analysis', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(response => {
        Alert.alert('Sucesso', 'Imagem enviada com sucesso: ')
        api
          .put(`/analysis/name/${response.data.id}`, { name: `Análise ${response.data.id}` })
          .then(()=> {
            router.navigate({
              pathname: '/resultAnalysis',
              params: { id: response.data.id }
            })
          })
      })
      .catch((error: AxiosError) => {
        Alert.alert('Erro', `Falha ao enviar a imagem. ${error.response?.status}`);
      })
  }

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons.Button 
          name='add'
          size={25}
          backgroundColor="transparent"
          color="#6E8B3D"
          onPress={takePhoto}
        />
      ),
    });
  }, [navigation]);

  const getAnalysies = async ()=> {
    const user = SecureStorage.getItem('user')
    const parsedUser = user && JSON.parse(user)
    api
      .get(`/analysis/user/${parsedUser.id}`)
      .then(response => setAnalysies(response.data))
  }

  React.useEffect(() => {
    getAnalysies()
  }, [idUser])
  useFocusEffect(
    React.useCallback(()=>{
      getAnalysies()
    }, [])
  )

  if(analysies.length === 0){
    return <View style={styles.container}><Text style={styles.text}>Nenhuma análise encontrada.</Text></View>
  }

  return (
    <View style={styles.container}>
      <FlatList 
        data={analysies}
        renderItem={({item}) => <AnalysisItemList 
            id={item.id}
            name={item.name}
            thumbnail={item.thumbnail}
            analysis_date={new Date(item.analysis_date)}
            key={item.id}
          />}
        keyExtractor={item => String(item.id)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DBE7C9',
    },
    text: {
      fontSize: 18,
      fontStyle: 'italic',
      paddingBlockStart: 20,
      alignSelf: 'center'
    }
})