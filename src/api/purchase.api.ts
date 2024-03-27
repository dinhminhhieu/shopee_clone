import { Purchase, PurchaseListStatus } from '../types/purchase.type'
import { SuccessResponse } from '../types/utils.type'
import api from './api'

const URL = 'purchases'

const purchaseApi = {
  addToCart(body: { product_id: string; buy_count: number }) {
    return api.post<SuccessResponse<Purchase>>(`${URL}/add-to-cart`, body)
  },
  getPurchase(params: { status: PurchaseListStatus }) {
    return api.get<SuccessResponse<Purchase[]>>(`${URL}`, {
      params
    })
  },
  buyProducts(body: { product_id: string; buy_count: number }[]) {
    return api.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
  },
  updatePurchase(body: { product_id: string; buy_count: number }) {
    return api.put<SuccessResponse<Purchase>>(`${URL}/update-purchase`, body)
  },
  deletePurchase(purchaseIdS: string[]) {
    return api.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}`, {
      data: purchaseIdS
    })
  }
}

export default purchaseApi
