import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import { Category } from '../../../types/category.type'
import { useForm, Controller } from 'react-hook-form'
import { schema, Schema } from '../../../utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NonUndefined } from '../../../types/utils.type'
import { omit } from 'lodash'
import { ObjectSchema } from 'yup'
import { QueryConfig } from '../../../hooks/useQueryConfig'
import path from '../../../constants/path.route'
import icons from '../../../assets/icons'
import Button from '../../../components/Button'
import classNames from 'classnames'
import InputNumber from '../../../components/InputNumber'
import Rating from '../Rating'

interface Props {
  queryConfig: QueryConfig
  categories: Category[]
}

type FormData = NonUndefined<Pick<Schema, 'price_min' | 'price_max'>>
const priceSchema = schema.pick(['price_min', 'price_max'])

const AsideFilter = ({ queryConfig, categories }: Props) => {
  const { TiThList, FaChevronRight, FaFilter } = icons

  const { category } = queryConfig
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver<FormData>(priceSchema as ObjectSchema<FormData>),
    shouldFocusError: false
  })

  // const valueForm = watch()
  // console.log(errors)

  const onSubmit = handleSubmit((data) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        price_min: data.price_min,
        price_max: data.price_max
      }).toString()
    })
  })

  const handleRemoveAll = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(queryConfig, ['price_min', 'price_max', 'category', 'rating_filter', 'name'])
      ).toString()
    })
  }

  return (
    <div className='p-4'>
      <Link
        to={path.home}
        className={classNames('flex items-center font-bold', {
          'text-orange': !category
        })}
      >
        <TiThList size={20} className='mr-3' />
        Tất cả danh mục
      </Link>
      <div className='bg-gray-400 h-[1px] my-4' />
      <ul>
        {categories.map((categoryItem) => {
          const isActiveCategory = category === categoryItem._id
          return (
            <li key={categoryItem._id} className='py-1 pl-2'>
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
                className={classNames('relative px-1 text-sm', {
                  'text-orange font-semibold': isActiveCategory
                })}
              >
                <FaChevronRight size={10} className='fill-orange absolute top-1 left-[-10px]' />
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>
      <Link to={path.home} className='flex items-center font-bold mt-4'>
        <FaFilter className='mr-3' />
        Bộ lọc
      </Link>
      <div className='bg-gray-400 h-[1px] my-3' />
      <div className='my-5'>
        <div className='text-sm'>Khoảng giá</div>
        <form className='mt-2' onSubmit={onSubmit}>
          <div className='flex items-start'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='form'
                    classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm '
                    classNameError='hidden'
                    placeholder='₫Từ'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
            <div className='mx-2 mt-1 shrink-0'>-</div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    className='grow'
                    name='form'
                    classNameInput='p-1 text-sm w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm '
                    classNameError='hidden'
                    placeholder='₫Đến'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                  />
                )
              }}
            />
          </div>
          <div className='mt-1 min-h-[1.25rem] text-sm text-center text-red-600'>{errors.price_min?.message}</div>
          <Button className='w-full p-1 bg-orange uppercase text-white text-sm hover:bg-orange/80 flex justify-center items-center'>
            Áp dụng
          </Button>
        </form>
        <div className='bg-gray-400 h-[1px] my-4' />
        <div className='text-sm'>Đánh giá</div>
        <Rating queryConfig={queryConfig} />
        <div className='bg-gray-400 h-[1px] my-4' />
        <Button
          onClick={handleRemoveAll}
          className='w-full p-1 bg-orange uppercase text-white text-sm hover:bg-orange/80 flex justify-center items-center'
        >
          Xóa tất cả
        </Button>
      </div>
    </div>
  )
}

export default AsideFilter
