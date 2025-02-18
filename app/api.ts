import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: `http://192.168.1.50:8080`,
});

api.interceptors.request.use(
  async config => {
    // const token = await AsyncStorage.getItem('userToken')
    const token = SecureStore.getItem('userToken')
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if(error.response && error.response.status === 401){
      SecureStore.deleteItemAsync('userToken')
      AsyncStorage.removeItem('idUser')
    }
    return Promise.reject(error)
  }
)

export default api;