import { useRef } from 'react'
import { toast } from 'react-toastify'
import { Fragment } from 'react/jsx-runtime'
import config from '../../constants/config'

interface Props {
  onChange?: (file: File) => void
}

const InputFile = ({ onChange }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if ((fileFromLocal && fileFromLocal.size >= config.maxSizeUploadAvatar) || !fileFromLocal?.type.includes('image')) {
      toast.error('Dung lượng tối đa 1MB. Định dạng: .png, .jpg, .jpeg', {
        position: 'top-center'
      })
    } else {
      onChange && onChange(fileFromLocal)
    }
  }
  return (
    <Fragment>
      <input
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          ;(event.target as any).value = null
        }}
        type='file'
        accept='.jpg, .jpeg, .png'
        className='hidden'
      />
      <button
        onClick={handleUpload}
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border-2 border-gray-400 bg-white px-6 text-sm text-gray-600 shadow-sm'
      >
        Chọn ảnh
      </button>
    </Fragment>
  )
}

export default InputFile
