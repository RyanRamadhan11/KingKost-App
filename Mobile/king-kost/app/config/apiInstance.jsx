import axios from 'axios'
import { BASE_HOST } from './BaseUrl'
import AsyncStorage from '@react-native-async-storage/async-storage'

axios.defaults.baseURL = BASE_HOST

const apiInstance = axios.create()

apiInstance.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token')
        if (token) {
            config.headers.Authorization =`Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export default apiInstance