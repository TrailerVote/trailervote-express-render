import { Response } from 'express'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ResponseWithRequestTag = Omit<Response, 'locals'> & {
  locals: {
    requestTag: string
    [P: string]: any
  }
}
