import { Category } from '../types/category.type'
import { SuccessResponse } from '../types/utils.type'
import api from './api'

const URL = 'categories'

const categoryApi = {
  getCategories() {
    return api.get<SuccessResponse<Category[]>>(URL)
  }
}

export default categoryApi
