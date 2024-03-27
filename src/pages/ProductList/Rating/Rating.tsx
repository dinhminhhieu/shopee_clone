import { createSearchParams, useNavigate } from 'react-router-dom'
import { QueryConfig } from '../../../hooks/useQueryConfig'
import icons from '../../../assets/icons'
import path from '../../../constants/path.route'

interface Props {
  queryConfig: QueryConfig
}

const Rating = ({ queryConfig }: Props) => {
  const { FaRegStar, FaStar } = icons

  const navigate = useNavigate()

  const handleFilterStar = (ratingFilter: number) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        rating_filter: String(ratingFilter)
      }).toString()
    })
  }

  return (
    <ul className='my-2'>
      {Array(5)
        .fill(0)
        .map((_, index) => (
          <li key={index} className='py-1'>
            <div
              onClick={() => handleFilterStar(5 - index)}
              className='flex items-center mb-2 cursor-pointer'
              tabIndex={0}
              role='button'
              aria-hidden='true'
            >
              {Array(5)
                .fill(0)
                .map((_, indexStar) => {
                  if (indexStar < 5 - index) {
                    return <FaStar key={indexStar} size={18} className='mr-1' color='orange' />
                  }
                  return <FaRegStar key={indexStar} size={18} className='mr-1' color='orange' />
                })}
            </div>
          </li>
        ))}
    </ul>
  )
}

export default Rating
