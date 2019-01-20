import { logger, responseTime } from '@trailervote/express-logger'
import metadata from '../../../package.json'

import { Response } from 'express'
import { MediaLinks, setLinks } from '../headers/link.js'

const version = metadata.version

export type MediaLike = {
  _links?: MediaLinks
}

export type WrappedMediaLike = {
  [P: string]: MediaLike
}

/**
 * Render a MediaLike
 *
 * @export
 * @param {Response} res the express response
 * @param {MediaLike} content the media like
 */
export function renderMedia(res: Response, content: MediaLike | WrappedMediaLike) {
  const { requestTag } = res.locals

  const links = (content._links || (content as any)[Object.keys(content)[0]]._links) as MediaLinks
  setLinks(res, links)

  const tag = `${requestTag}[render]${responseTime(res)}`
  const localLogger = logger(res)
  localLogger.info(`${tag} render media type "${res.locals.negotiatedAccept}`)

  res.header('Vary', 'Authorization, Accept-Encoding').format({
    'text/html'() {
      res.render('wrapper', {
        content,
        links,
        mime_type: res.locals.negotiatedAccept,
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

export const media = renderMedia
