import { useState } from 'react'
import icons from '../../assets/icons'
import InputNumber, { InputNumberProps } from '../InputNumber'

interface Props extends InputNumberProps {
  maxInput?: number
  onIncrease?: (value: number) => void
  onDecrease?: (value: number) => void
  onChangeInput?: (value: number) => void
  onFocusOut?: (value: number) => void
  classNameWrapper?: string
}

const QuantityController = ({
  maxInput,
  onIncrease,
  onDecrease,
  onChangeInput,
  onFocusOut,
  classNameWrapper = 'ml-10',
  value,
  ...rest
}: Props) => {
  const [localValue, setLocalValue] = useState<number>(Number(value || 0))
  const { FaMinus, FaPlus } = icons

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let _value = Number(event.target.value)
    if (maxInput !== undefined && _value > maxInput) {
      _value = maxInput - 1
    } else if (_value < 1) {
      _value = 1
    }
    onChangeInput && onChangeInput(_value)
    setLocalValue(_value)
  }

  const increase = () => {
    let _value = Number(value || localValue) + 1
    if (maxInput !== undefined && _value > maxInput) {
      _value = maxInput
    }
    onIncrease && onIncrease(_value)
    setLocalValue(_value)
  }

  const decrease = () => {
    let _value = Number(value || localValue) - 1
    if (_value < 1) {
      _value = 1
    }
    onDecrease && onDecrease(_value)
    setLocalValue(_value)
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    onFocusOut && onFocusOut(Number(event.target.value))
  }

  return (
    <div className={'flex items-center ' + classNameWrapper}>
      <button
        onClick={decrease}
        className='flex h-10 w-10 items-center justify-center rounded-l-sm border border-gray-300 text-gray-600'
      >
        <FaMinus size={15} />
      </button>
      <InputNumber
        onChange={handleChange}
        value={value || localValue}
        classNameInput='h-10 w-14 border-t border-b border-gray-300 p-1 text-center outline-none'
        classNameError='hidden'
        onBlur={handleBlur}
        {...rest}
      />
      <button
        onClick={increase}
        className='flex h-10 w-10 items-center justify-center rounded-r-sm border border-gray-300 text-gray-600'
      >
        <FaPlus size={15} />
      </button>
    </div>
  )
}

export default QuantityController
