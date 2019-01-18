import { Response } from 'express'

export type LinkAttributeValue = string | boolean | number | null | undefined
export type MediaLinks = {
  [p: string]: { href: string, [p: string]: LinkAttributeValue }
}

export function setLinks(res: Response, links: MediaLinks) {
  res.header(
    'Link',
    Object.keys(links)
      .map((key) => `<${links[key].href}>; rel=${key}`)
      .join(', ')
  )
}
