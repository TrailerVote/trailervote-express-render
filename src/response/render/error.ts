import { logger, responseTime } from '@trailervote/express-logger'

import crypto from 'crypto'

import { ResponseWithRequestTag } from '../ResponseWithRequestTag'

type ErrorLike = Error & {
  trailer_vote_error_code?: number | string
  trailerVoteErrorCode?: number | string
  errorCode?: number | string
  error_code?: number | string
  code?: number | string
}

/**
 * Send back an error in the correct format
 *
 * @export
 * @param {Response} res the express response
 * @param {number} status the status (HTTP) code
 * @param {(string | ErrorLike)} messageOrError the error message
 */
export function renderError(
  res: ResponseWithRequestTag,
  status: number,
  messageOrError: string | ErrorLike
) {
  const tag = `${res.locals.requestTag}[render]${responseTime(res)}`
  const message =
    typeof messageOrError === 'string' ? messageOrError : messageOrError.message
  logger(res).info(`${tag} status: ${status}, message: ${message}`)

  res
    .status(status)
    .header('Content-Type', 'application/vnd.trailervote.errors.v1+json')
    .send({ errors: [{ message, code: errorCode(messageOrError) }] })
}

function errorCode(source: string | ErrorLike) {
  if (typeof source === 'string') {
    return undefined
  }

  const internalErrorCode =
    source.trailer_vote_error_code ||
    source.trailerVoteErrorCode ||
    source.error_code ||
    source.errorCode ||
    source.code ||
    undefined

  if (internalErrorCode) {
    return `Ex${internalErrorCode}`
  }

  return `Gx${crypto
    .createHash('md5')
    .update(source.constructor.name)
    .digest('hex')}`
}

export const error = renderError
