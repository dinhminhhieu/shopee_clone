import { Link, createSearchParams } from 'react-router-dom'
import { QueryConfig } from '../../hooks/useQueryConfig'
import icons from '../../assets/icons'
import classNames from 'classnames'
import path from '../../constants/path.route'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}

const RANGE = 2

const Panigation = ({ queryConfig, pageSize }: Props) => {
  const { FaChevronLeft, FaChevronRight } = icons

  const currPage = Number(queryConfig.page)

  const renderPanigation = () => {
    let dotAfter = false
    let dotBefore = false

    const renderDotBefore = (index: number) => {
      if (!dotBefore) {
        dotBefore = true
        return (
          <li key={index}>
            <span className='flex items-center justify-center px-4 h-9 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
              ...
            </span>
          </li>
        )
      }
      return null
    }

    const renderDotAfter = (index: number) => {
      if (!dotAfter) {
        dotAfter = true
        return (
          <li key={index}>
            <span className='flex items-center justify-center px-4 h-9 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
              ...
            </span>
          </li>
        )
      }
      return null
    }
    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1
        if (currPage <= RANGE * 2 + 1 && pageNumber > currPage + RANGE && pageNumber < pageSize - RANGE + 1) {
          return renderDotAfter(index)
        } else if (currPage > RANGE * 2 + 1 && currPage < pageSize - RANGE * 2) {
          if (pageNumber < currPage - RANGE && pageNumber > RANGE) {
            return renderDotBefore(index)
          } else if (pageNumber > currPage + RANGE && pageNumber < pageSize - RANGE + 1) {
            return renderDotAfter(index)
          }
        } else if (currPage >= pageSize - RANGE * 2 && pageNumber > RANGE && pageNumber < currPage - RANGE) {
          return renderDotBefore(index)
        }
        return (
          <Link
            key={index}
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: pageNumber.toString()
              }).toString()
            }}
            className={classNames(
              'flex items-center justify-center px-3 h-9 shadow-sm leading-tight text-gray-500 border border-gray-300  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white',
              {
                'bg-orange text-white': pageNumber === currPage,
                'bg-white hover:bg-gray-100': pageNumber !== currPage
              }
            )}
          >
            {pageNumber}
          </Link>
        )
      })
  }
  return (
    <ul className='flex items-center -space-x-px h-8 text-sm mt-6'>
      {currPage === 1 ? (
        <li>
          <span className='flex items-center justify-center cursor-not-allowed px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
            <FaChevronLeft />
          </span>
        </li>
      ) : (
        <li>
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (currPage - 1).toString()
              }).toString()
            }}
            className='flex items-center justify-center px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            <FaChevronLeft />
          </Link>
        </li>
      )}
      {renderPanigation()}
      {currPage === pageSize ? (
        <li>
          <span className='flex items-center justify-center cursor-not-allowed px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'>
            <FaChevronRight />
          </span>
        </li>
      ) : (
        <li>
          <Link
            to={{
              pathname: path.home,
              search: createSearchParams({
                ...queryConfig,
                page: (currPage + 1).toString()
              }).toString()
            }}
            className='flex items-center justify-center px-3 h-9 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
          >
            <FaChevronRight />
          </Link>
        </li>
      )}
    </ul>
  )
}

export default Panigation
