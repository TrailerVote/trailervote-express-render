import { logger, responseTime } from '@trailervote/express-logger'

import { MediaLinks, setLinks } from '../headers/link.js'
import { ResponseWithRequestTag } from '../ResponseWithRequestTag.js'

export type Renderable<K extends string> = Record<K, MediaLike>

export type MediaLike = {
  _links: MediaLinks
}

export interface Metadata {
  pkg: string
  version: string
}

/**
 * Render a MediaLike
 *
 * @export
 * @param {ResponseWithRequestTag} res the express response
 * @param {MediaLike} content the media like
 * @param {Metadata} metadata the metadata
 */
export function renderMedia<K extends string, C extends Renderable<K>>(
  res: ResponseWithRequestTag,
  content: C,
  metadata: Metadata
) {
  const { requestTag } = res.locals

  const key: K = Object.keys(content)[0] as K
  const links = setLinks(res, content[key]._links)

  const tag = `${requestTag}[render]${responseTime(res)}`
  const localLogger = logger(res)
  localLogger.info(`${tag} render media type "${res.locals.negotiatedAccept}`)

  const { pkg, version } = metadata

  res.header('Vary', 'Authorization, Accept-Encoding').format({
    'text/html'() {
      res.render('wrapper', {
        content,
        links,
        mime_type: res.locals.negotiatedAccept,
        pkg,
        version
      })
    },

    default() {
      res
        .header('Content-Type', res.locals.negotiatedAccept + '; charset=utf-8')
        .send(content)
    }
  })
}

/**
 * Make a function that renders media with the metadata pre-set
 *
 * @export
 * @param {Metadata} metadata the metadata
 * @returns the Render Media function
 */
export function makeRenderMedia(metadata: Metadata) {
  return <K extends string, C extends Renderable<K>>(
    res: ResponseWithRequestTag,
    content: C
  ) => {
    return renderMedia<K, C>(res, content, metadata)
  }
}

export const media = renderMedia
