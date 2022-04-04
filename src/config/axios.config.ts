import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://api.nicepick.co.kr/api'
      : 'http://192.168.0.22:3000/api', //'http://localhost:3000/api',
})

export default instance
