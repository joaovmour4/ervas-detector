import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios"

const api = axios.create({
  baseURL: `http://192.168.1.11:8080`,
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('userToken')
    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.log("entrou no erro")
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if(error.response && error.response.status === 401){
      AsyncStorage.removeItem('userToken')
      AsyncStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

export default api;