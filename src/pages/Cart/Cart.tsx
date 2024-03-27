import { useMutation, useQuery } from '@tanstack/react-query'
import { purchasesStatus } from '../../constants/purchase.status'
import { Purchase } from '../../types/purchase.type'
import { Fragment, useContext, useEffect, useMemo } from 'react'
import { produce } from 'immer'
import { Link, useLocation } from 'react-router-dom'
import { formatCurrency, generateNameId } from '../../utils/utils.format'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import purchaseApi from '../../api/purchase.api'
import path from '../../constants/path.route'
import QuantityController from '../../components/QuantityController'
import Button from '../../components/Button'

const Cart = () => {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => {
      return purchaseApi.getPurchase({ status: purchasesStatus.inCart })
    }
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.updatePurchase(body),
    onSuccess: () => {
      refetch()
    }
  })

  const deletePurchaseMutation = useMutation({
    mutationFn: (purchaseId: string[]) => purchaseApi.deletePurchase(purchaseId),
    onSuccess: () => {
      refetch()
    }
  })

  const buyProductsMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }[]) => purchaseApi.buyProducts(body),
    onSuccess: (data) => {
      refetch(),
        toast.success(data.data.message, {
          position: 'top-center',
          autoClose: 2000
        })
    }
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const location = useLocation() // Lấy state được gửi qua bằng useNavigate()
  const choosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  const totalCheckedPurchasesPrice = useMemo(
    () =>
      checkedPurchases.reduce((total, pro_price) => {
        return total + pro_price.price * pro_price.buy_count
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchasesSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((total, pro_price) => {
        return total + (pro_price.price_before_discount - pro_price.price) * pro_price.buy_count
      }, 0),
    [checkedPurchases]
  )
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchsesObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = choosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disable: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchsesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, choosenPurchaseIdFromLocation, setExtendedPurchases])

  // Hủy state của location khi F5 bằng cleanup function
  useEffect(() => {
    return () => {
      window.history.replaceState(null, '')
    }
  }, [])

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce(extendedPurchases, (draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disable = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleOnChangeInput = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  const handleDeletePurchase = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  const handleDeleteManyPurchases = () => {
    const purchasesIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchasesIds)
  }

  const handleBuyPurchase = () => {
    if (checkedPurchases.length > 0) {
      const buy = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(buy)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases && extendedPurchases.length > 0 ? (
          <Fragment>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                          className='h-5 w-5 accent-orange'
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn giá</div>
                      <div className='col-span-1'>Số lượng</div>
                      <div className='col-span-1'>Số tiền</div>
                      <div className='col-span-1'>Thao tác</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='mb-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                      >
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                                className='h-5 w-5 accent-orange'
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                  className='h-20 w-20 flex-shrink-0'
                                >
                                  <img alt={purchase.product.name} src={purchase.product.image} />
                                </Link>
                                <div className='flex-grow px-2 pt-1 pb-2'>
                                  <Link
                                    to={`${path.home}${generateNameId({
                                      name: purchase.product.name,
                                      id: purchase.product._id
                                    })}`}
                                    className='text-left line-clamp-2'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3 text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                maxInput={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onChangeInput={handleOnChangeInput(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disable}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDeletePurchase(index)}
                                className='bg-orange px-4 py-2 text-white transition-colors'
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    checked={isAllChecked}
                    onChange={handleCheckedAll}
                    className='h-5 w-5 accent-orange'
                  />
                </div>
                <button onClick={handleCheckedAll} className='mx-3 border-none bg-none'>
                  Chọn tất cả ({extendedPurchases.length} : sản phẩm)
                </button>
                <button onClick={handleDeleteManyPurchases} className='mx-3 border-none bg-none'>
                  Xóa
                </button>
              </div>
              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasesPrice)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedPurchasesSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchase}
                  disabled={buyProductsMutation.isPending}
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                >
                  Mua hàng
                </Button>
              </div>
            </div>
          </Fragment>
        ) : (
          <div className='text-center'>
            <img
              src='	https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/c44984f18d2d2211.png'
              alt='no-product'
              className='h-20 w-20 mx-auto'
            />
            <div className='font-bold text-gray-500 mt-5'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className='bg-orange rounded-sm px-8 py-2 hover:bg-orange/80 transition-opacity uppercase text-white'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
