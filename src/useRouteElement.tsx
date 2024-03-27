import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { Suspense, lazy, useContext } from 'react'
import { AppContext } from './contexts/app.context'
// import Login from './pages/Login'
// import ProductList from './pages/ProductList'
// import Register from './pages/Register'
import RegisterLayout from './layouts/RegisterLayout'
import MainLayout from './layouts/MainLayout'
import path from './constants/path.route'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
// import Profile from './pages/User/pages/Profile'
// import PageNotFound from './pages/PageNotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const PageNotFound = lazy(() => import('./pages/PageNotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElement() {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: (
        <MainLayout>
          <Suspense fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}>
            <ProductList />
          </Suspense>
        </MainLayout>
      ),
      index: true
    },

    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <Suspense fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      ),
      index: true
    },

    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),
          children: [
            {
              path: path.profile,
              element: (
                <Suspense
                  fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
                >
                  <Profile />
                </Suspense>
              )
            },
            {
              path: path.changePassword,
              element: (
                <Suspense
                  fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
                >
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense
                  fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
                >
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        },
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense
                fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
              >
                <Cart />
              </Suspense>
            </CartLayout>
          )
        }
      ]
    },

    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense
                fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
              >
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense
                fallback={<div className='flex justify-center items-center font-bold text-orange'>loading...</div>}
              >
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        }
      ]
    },

    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <PageNotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
