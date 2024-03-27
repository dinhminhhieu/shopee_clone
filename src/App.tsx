import { useContext, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { AppContext } from './contexts/app.context'
import { LocalStorageEventTarget } from './utils/auth'
import useRouteElement from './useRouteElement'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const routeElements = useRouteElement()
  const { reset } = useContext(AppContext)

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  )
}

export default App
