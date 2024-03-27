import classNames from 'classnames'
import icons from '../../../assets/icons'
import path from '../../../constants/path.route'
import { ProductListConfig } from '../../../types/product.type'
import { sortBy, order as orderConstant } from '../../../constants/product'
import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { omit } from 'lodash'
import { QueryConfig } from '../../../hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const SortProductList = ({ queryConfig, pageSize }: Props) => {
  const { IoChevronBackSharp, IoChevronForward } = icons

  const { sort_by = sortBy.createdAt, order } = queryConfig

  const navigate = useNavigate()

  const currPage = Number(queryConfig.page)

  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }

  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }

  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }

  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap justify-between items-center gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 capitalize bg-orange text-sm text-center hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 capitalize bg-orange text-sm text-center hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize bg-orange text-sm text-center hover:bg-orange/80', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Bán chạy
          </button>
          <div>
            <select
              value={order || ''}
              onChange={(event) =>
                handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)
              }
              className={classNames('text-sm block w-full px-4 h-8 outline-none ', {
                'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
                'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
              })}
            >
              <option value='' disabled className='bg-white text-black'>
                Giá
              </option>
              <option value={orderConstant.asc} className='bg-white text-black'>
                Giá: Thấp đến cao
              </option>
              <option value={orderConstant.desc} className='bg-white text-black'>
                Giá: Cao đến thấp
              </option>
            </select>
          </div>
        </div>
        <div className='flex items-center'>
          <div>
            <span className='text-orange'>{currPage}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='ml-2 flex items-center'>
            {currPage === 1 ? (
              <span className='flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow-sm'>
                <IoChevronBackSharp />
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currPage - 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 shadow-sm'
              >
                <IoChevronBackSharp />
              </Link>
            )}

            {currPage === pageSize ? (
              <span className='flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow-sm'>
                <IoChevronForward />
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (currPage + 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center px-3 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 shadow-sm'
              >
                <IoChevronForward />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SortProductList
