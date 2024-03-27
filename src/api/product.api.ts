import api from './api'
import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { SuccessResponse } from '../types/utils.type'

const URL = 'products'

const productApi = {
  getProducts(params: ProductListConfig) {
    return api.get<SuccessResponse<ProductList>>(URL, {
      params
    })
  },
  getProductDetail(id: string) {
    return api.get<SuccessResponse<Product>>(`${URL}/${id}`)
  }
}

export default productApi
