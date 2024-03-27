/* eslint-disable jsx-a11y/heading-has-content */
import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { formatCurrency, formatNumberToSosialStyle, getIdFromNameId, rateSale } from '../../utils/utils.format'
import { Product as ProductType, ProductListConfig } from '../../types/product.type'
import { purchasesStatus } from '../../constants/purchase.status'
import { toast } from 'react-toastify'
import productApi from '../../api/product.api'
import icons from '../../assets/icons'
import ProductRating from '../../components/ProductRating'
import DOMPurify from 'dompurify'
import useQueryConfig from '../../hooks/useQueryConfig'
import Product from '../ProductList/Product'
import QuantityController from '../../components/QuantityController'
import purchaseApi from '../../api/purchase.api'
import path from '../../constants/path.route'

type Cart = {
  buy_count: number
  product_id: string
}

const ProductDetail = () => {
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const [buyCount, setBuyCount] = useState(1)
  const navigate = useNavigate()

  const { FaChevronLeft, FaChevronRight, IoCartOutline } = icons
  const { nameId } = useParams()

  const id = getIdFromNameId(nameId as string)
  const queryConfig = useQueryConfig()

  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => {
      return productApi.getProductDetail(id as string)
    }
  })

  const product = productDetailData?.data.data

  const { data: productData, refetch } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    staleTime: Infinity,
    enabled: Boolean(product)
  })

  const imageRef = useRef<HTMLImageElement>(null)

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const preImg = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((pre) => [pre[0] - 1, pre[1] - 1])
    }
  }

  const nextImg = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((pre) => [pre[0] + 1, pre[1] + 1])
    }
  }

  const hoverActiveImg = (img: string) => {
    setActiveImage(img)
  }

  const handleZoomImg = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalHeight, naturalWidth } = image
    // Cách 1: Lấy offsetX, offsetY đơn giản khi chúng ta đã xử lý được bubble event
    // const { offsetX, offsetY } = event.nativeEvent

    // Cách 2: Lấy offsetX, offsetY khi chúng ta không xử lý được bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCartMutation = useMutation({
    mutationFn: (body: Cart) => purchaseApi.addToCart(body),
    onSuccess: () => {
      refetch()
    }
  })

  const queryClient = useQueryClient()

  const addToCart = () => {
    addToCartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 2000, position: 'top-center' })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchasesStatus.inCart }] })
        }
      }
    )
  }

  const buyNow = async () => {
    const response = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = response.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  if (typeof product === 'undefined') return null

  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                onMouseMove={handleZoomImg}
                onMouseLeave={handleRemoveZoom}
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                  className='absolute pointer-events-none top-0 left-0 bg-white object-cover'
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={preImg}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <FaChevronLeft />
                </button>
                {currentImages.slice(0, 5).map((img, index) => {
                  const isActive = img === activeImage
                  return (
                    <div onMouseEnter={() => hoverActiveImg(img)} key={index} className='relative w-full pt-[100%]'>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 bg-white w-full h-full object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange' />}
                    </div>
                  )
                })}
                <button
                  onClick={nextImg}
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassName='fill-orange text-orange h-4 w-4'
                    nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSosialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Đã Bán</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-2xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  Giảm {rateSale(product.price_before_discount, product.price)}
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onChangeInput={handleBuyCount}
                  value={buyCount}
                  maxInput={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <IoCartOutline className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange' />
                  Thêm vào giỏ hàng
                </button>
                <button
                  onClick={buyNow}
                  className='flex ml-4 h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <div className=' bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mt-12 mb-4 text-sm leading-loose'>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8'>
        <div className='container'>
          <span className='text-gray-400 text-xl uppercase'>Có thể bạn cũng thích</span>
          {productData && (
            <div className='mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
              {productData.data.data.products.map((product) => (
                <div key={product._id} className='col-span-1'>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
