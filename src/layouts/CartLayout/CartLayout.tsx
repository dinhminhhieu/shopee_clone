import React from 'react'
import Footer from '../../components/Footer'
import CartHeader from '../../components/CartHeader'

interface Props {
  children?: React.ReactNode
}
const CartLayout = ({ children }: Props) => {
  return (
    <div>
      <CartHeader />
      {children}
      <Footer />
    </div>
  )
}

export default CartLayout
