import { useForm } from 'react-hook-form'
import { Schema, schema } from '../../utils/rules'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '../../utils/utils.error'
import { ErrorResponse } from '../../types/utils.type'
import { Link, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../../contexts/app.context'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from '../../components/Input'
import Button from '../../components/Button'
import path from '../../constants/path.route'
import authApi from '../../api/auth.api'

type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])

const Login = () => {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit((data) => {
    loginAccountMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate({
          pathname: path.home
        })
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
                type: 'Server'
              })
            })
          }
        }
      }
    })
  })

  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form onSubmit={onSubmit} noValidate className='p-10 rounded bg-white shadow-sm'>
              <div className='text-2xl'>Đăng nhập</div>
              <Input
                className='mt-5'
                type='email'
                placeholder='Email'
                register={register}
                name='email'
                errorMessage={errors.email?.message}
              />
              <Input
                className='mt-3'
                classNameEye='absolute top-[12px] right-[10px] cursor-pointer'
                type='password'
                placeholder='Password'
                register={register}
                name='password'
                errorMessage={errors.password?.message}
                autoComplete='on'
              />
              <div className='mt-3'>
                <Button
                  type='submit'
                  isLoading={loginAccountMutation.isPending}
                  disabled={loginAccountMutation.isPending}
                  className='px-2 py-4 w-full text-white text-sm bg-orange hover:bg-red-600 uppercase flex justify-center items-center'
                >
                  Đăng nhập
                </Button>
              </div>
              <div className='mt-5 text-center text-sm'>
                <div className='flex justify-center items-center'>
                  <span className='opacity-60'>Bạn chưa có tài khoản?</span>
                  <Link to={path.register} className='text-orange ml-1'>
                    Đăng Ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
