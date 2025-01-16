import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnalysisItemList from '@/components/AnalysisItemList'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
import api from '../api';
import { AxiosError } from 'axios';
import mime from 'mime';
import FormData from 'form-data';

export default function analysies() {
  const navigation = useNavigation()
  const router = useRouter()
  const [analysies, setAnalysies] = React.useState<Array<any>>([])
  const [image, setImage] = React.useState<string>()

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      alert('Permissão para acessar a câmera é necessária!');
      return;
    }

    // Abre a câmera para capturar uma imagem
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images', // Apenas imagens
      allowsEditing: false, // Permite edição
      quality: 0.4, // Qualidade máxima da imagem
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      await sendAnalysis(result.assets[0])
    }
  };

  const sendAnalysis = async (asset: ImagePicker.ImagePickerAsset) => {
    const formData = new FormData()
    const trimmedURI = (Platform.OS === 'android') ? asset.uri : asset.uri.replace("file://", "")
    const response = await fetch(trimmedURI)
    const blob = await response.blob()

    formData.append('file', {
      uri: asset.uri,
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
        console.log(response)
        Alert.alert('Sucesso', 'Imagem enviada com sucesso: ');
      })
      .catch((error: AxiosError) => {
        Alert.alert('Erro', `Falha ao enviar a imagem. ${error.response?.status}`);
        console.log(error.code)
      })
  }

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons.Button 
          name='add'
          size={25}
          backgroundColor="transparent"
          color="#322E2C"
          onPress={takePhoto}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {!analysies.length ? 
        <Text style={styles.text}>Não há análises no histórico</Text>
      :
      analysies.map(analysies => {
        return (
          <AnalysisItemList 
          />
        )
      })
      }
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#DBE7C9'
    },
    text: {
      fontSize: 20, 
      fontWeight: 'thin', 
      textAlign: 'center', 
      paddingBlockStart: 15
    },
    image: {
      width: 200,
      height: 200,
      marginTop: 20,
    },
})