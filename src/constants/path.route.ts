const path = {
  home: '/',
  login: '/login',
  register: '/register',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart'
} as const

export default path
