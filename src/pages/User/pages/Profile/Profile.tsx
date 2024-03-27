import { useContext, useEffect, useMemo, useState } from 'react'
import { UserSchema, userSchema } from '../../../../utils/rules'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { AppContext } from '../../../../contexts/app.context'
import { setProfileToLS } from '../../../../utils/auth'
import { getAvatarUrl } from '../../../../utils/utils.format'
import { isAxiosUnprocessableEntityError } from '../../../../utils/utils.error'
import { ErrorResponse } from '../../../../types/utils.type'
import InputNumber from '../../../../components/InputNumber'
import Input from '../../../../components/Input'
import Button from '../../../../components/Button'
import userApi, { BodyUpdateProfile } from '../../../../api/user.api'
import DateSelect from '../../components/DateSelect'
import InputFile from '../../../../components/InputFile'

type FormDataUser = Pick<UserSchema, 'name' | 'address' | 'phone' | 'date_of_birth' | 'avatar'>
type FormDataError = Omit<FormDataUser, 'date_of_birth'> & {
  date_of_birth?: string
}
const profileSchema = userSchema.pick(['name', 'address', 'phone', 'date_of_birth', 'avatar'])

const Profile = () => {
  const { setProfile } = useContext(AppContext)
  const [uploadFileImage, setUploadFileImage] = useState<File>()

  const previewImage = useMemo(() => {
    return uploadFileImage ? URL.createObjectURL(uploadFileImage) : ''
  }, [uploadFileImage])

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setError,
    setValue
  } = useForm<FormDataUser>({
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      avatar: '',
      date_of_birth: new Date(1990, 0, 1)
    },
    resolver: yupResolver(profileSchema)
  })

  const avatar = watch('avatar')

  const { data: getProfileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })

  const profile = getProfileData?.data.data

  const updateProfileMutation = useMutation({
    mutationFn: (body: BodyUpdateProfile) => userApi.updateProfile(body)
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: (body: FormData) => userApi.uploadAvatar(body)
  })

  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile, setValue])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (uploadFileImage) {
        const form = new FormData()
        form.append('image', uploadFileImage)
        const uploadResponse = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadResponse.data.data
        setValue('avatar', avatarName)
      }
      const response = await updateProfileMutation.mutateAsync({
        ...data,
        date_of_birth: data.date_of_birth?.toISOString(),
        avatar: avatarName
      })
      setProfile(response.data.data)
      setProfileToLS(response.data.data)
      refetch()
      toast.success(response.data.message)
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: 'Server'
            })
          })
        }
      }
    }
  })

  const handleChangeFile = (file: File) => {
    setUploadFileImage(file)
  }

  return (
    <div className='rounded-md bg-white px-2 pb-10 md:ml-14 shadow md:px-7 md:pb-20'>
      <div className='border-b border-b-gray-200 py-6'>
        <h1 className='text-lg font-medium capitalize text-gray-900'>Hồ Sơ Của Tôi</h1>
        <div className='mt-1 text-sm text-gray-700'>Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
      </div>
      <form onSubmit={onSubmit} className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
        <div className='mt-6 flex-grow md:mt-0 md:pr-12'>
          <div className='flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize mb-6 sm:w-[20%] sm:text-right'>Email:</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <div className='pt-3 text-gray-700 mb-6'>{profile?.email}</div>
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Tên:</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='name'
                placeholder='Tên'
                errorMessage={errors.name?.message}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Số điện thoại:</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <InputNumber
                    classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                    placeholder='Số điện thoại'
                    errorMessage={errors.phone?.message}
                    {...field}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
          <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
            <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Địa chỉ:</div>
            <div className='sm:w-[80%] sm:pl-5'>
              <Input
                classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm'
                register={register}
                name='address'
                placeholder='Địa chỉ'
                errorMessage={errors.address?.message}
              />
            </div>
          </div>
          <Controller
            control={control}
            name='date_of_birth'
            render={({ field }) => (
              <DateSelect errorMessage={errors.date_of_birth?.message} onChange={field.onChange} value={field.value} />
            )}
          />
          <div className='mt-6 flex flex-col flex-wrap sm:flex-row'>
            <div className='sm:w-[20%] sm:text-right' />
            <div className='sm:w-[80%] sm:pl-5'>
              <Button
                type='submit'
                className='bg-orange h-9 px-5 text-white flex items-center text-center rounded-sm hover:bg-orange/80'
              >
                Lưu
              </Button>
            </div>
          </div>
        </div>
        <div className='flex justify-center md:w-72 md:border-l md:border-l-gray-200'>
          <div className='flex flex-col items-center'>
            <div className='my-5 h-24 w-24'>
              <img
                src={previewImage || getAvatarUrl(avatar)}
                alt=''
                className='h-full w-full rounded-full object-cover'
              />
            </div>
            <InputFile onChange={handleChangeFile} />
            <div className='mt-3 text-gray-400 text-center'>
              <div>Dung lượng tối đa 1MB</div>
              <div>Định dạng: .png, .jpg, .jpeg</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Profile
