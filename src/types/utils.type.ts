export interface SuccessResponse<Data> {
  message: string
  data: Data
}

export interface ErrorResponse<Data> {
  message: string
  data?: Data
}
// -? Loại bỏ undefined của key optional
export type NonUndefined<T> = {
  [K in keyof T]-?: Exclude<T[K], undefined>
}
