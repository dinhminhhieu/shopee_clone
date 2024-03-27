import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { ProductListConfig } from '../../types/product.type'
import AsideFilter from './AsideFilter'
import Product from './Product'
import SortProductList from './SortProductList'
import productApi from '../../api/product.api'
import Panigation from '../../components/Panigation'
import categoryApi from '../../api/category.api'
import useQueryConfig from '../../hooks/useQueryConfig'

const ProductList = () => {
  const queryConfig = useQueryConfig()

  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    },
    placeholderData: keepPreviousData
  })

  return (
    <div className='py-6 bg-gray-200'>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {productData.data.data.products.map((product) => (
                  <div key={product._id} className='col-span-1'>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <div className='flex justify-end'>
                <Panigation queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList
