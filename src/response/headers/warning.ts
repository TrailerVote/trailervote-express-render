import { logger } from '@trailervote/express-logger'

import { ResponseWithRequestTag } from '../ResponseWithRequestTag'

export type WarnCode =
  | 110 /** @note Response is Stale */
  | 111 /** @note Revalidation Failed */
  | 112 /** @note Disconnected Operation */
  | 113 /** @note Heuristic Expiration */
  | 199 /** @note Miscellaneous Warning */
  | 214 /** @note Transformation Applied */
  | 299 /** @note Miscellaneous Persistent Warning */

/**
 * Adds a warning to the Response
 *
 * @see https://www.iana.org/assignments/http-warn-codes/http-warn-codes.xhtml
 *
 * @example
 *
 *   addWarning(response, "Too many languages in Accept-Language", 199)
 *   // Warning: <warn-code> <warn-agent> <warn-text> [<warn-date>]
 *   // Warning: 199 @trailervote/express-render/1.0.0 "Too many languages in Accept-Langage"
 *
 * @note you *must* escape double quotes in {text} yourself
 *
 * @export
 * @param {Response} res the response
 * @param {string} text the warning text ()
 * @param {WarnCode} [code=199] the warning code
 * @param {string} [agent=DEFAULT_AGENT] the generating agent
 */
export function addWarning(
  res: ResponseWithRequestTag,
  text: string,
  code: WarnCode = 199,
  agent: string
) {
  const tag = `${res.locals.requestTag}[warn]`

  const warning = `${code} ${agent} "${text}"`.trim()
  logger(res).warn(`${tag}: ${warning}`)

  res.header('Warning', warning)
}

/**
 * Make an add warning function with the agent predefined, based on a package and version
 *
 * @export
 * @param {string} pkg package
 * @param {string} version version of the package
 * @returns
 */
export function makeAddWarning(pkg: string, version: string) {
  const agent = `${pkg}/${version}`
  return (res: ResponseWithRequestTag, text: string, code: WarnCode = 199) => {
    return addWarning(res, text, code, agent)
  }
}
