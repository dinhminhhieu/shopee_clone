import { User } from '../types/user.type'
import { SuccessResponse } from '../types/utils.type'
import api from './api'

export interface BodyUpdateProfile extends Omit<User, '_id' | 'email' | 'roles' | 'createdAt' | 'updatedAt'> {
  password?: string
  new_password?: string
}

const URL = 'user'

const userApi = {
  getProfile() {
    return api.get<SuccessResponse<User>>('me')
  },
  updateProfile(body: BodyUpdateProfile) {
    return api.put<SuccessResponse<User>>(`${URL}`, body)
  },
  uploadAvatar(body: FormData) {
    return api.post<SuccessResponse<string>>(`${URL}/upload-avatar`, body, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default userApi
