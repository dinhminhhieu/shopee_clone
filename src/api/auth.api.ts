import { AuthReponse } from '../types/auth.type'
import api from './api'

interface BodyAuth {
  email: string
  password: string
}

export const URL_LOGIN = 'login'
export const URL_REGISTER = 'register'
export const URL_LOGOUT = 'logout'
export const URL_REFRESH_TOKEN = 'refresh-access-token'

const authApi = {
  registerAccount(body: BodyAuth) {
    return api.post<AuthReponse>(URL_REGISTER, body)
  },
  loginAccount(body: BodyAuth) {
    return api.post<AuthReponse>(URL_LOGIN, body)
  },
  logoutAccount() {
    return api.post(URL_LOGOUT)
  }
}

export default authApi
