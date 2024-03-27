import { InputHTMLAttributes, useState } from 'react'
import { UseFormRegister, RegisterOptions } from 'react-hook-form'
import icons from '../../assets/icons'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegister<any>
  rules?: RegisterOptions
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
  classNameEye?: string
}

const Input = ({
  className,
  register,
  name,
  rules,
  errorMessage,
  classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
  classNameError = 'mt-1 min-h-[1.25rem] text-sm text-red-600',
  classNameEye = 'absolute top-[8px] right-[10px] cursor-pointer',
  ...rest
}: Props) => {
  const registerResult = register && name ? register(name, rules) : null
  const [visibleEye, setVisibleEye] = useState(true)
  const { IoEyeOutline, IoEyeOffOutline } = icons

  const toggleEye = () => {
    setVisibleEye((prev) => !prev)
  }

  const handleType = () => {
    if (rest.type === 'password') {
      return visibleEye ? 'password' : 'text'
    }
    return rest.type
  }

  return (
    <div className={'relative ' + className}>
      <input className={classNameInput} {...registerResult} {...rest} type={handleType()} />
      {rest.type === 'password' && visibleEye && (
        <IoEyeOffOutline size={22} className={classNameEye} onClick={toggleEye} />
      )}
      {rest.type === 'password' && !visibleEye && (
        <IoEyeOutline size={22} className={classNameEye} onClick={toggleEye} />
      )}
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}

export default Input
