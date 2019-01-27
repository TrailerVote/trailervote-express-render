import {
  LinkAttributeValue,
  MediaLinks,
  setLinks
} from './response/headers/link'
import { addWarning, WarnCode } from './response/headers/warning'
import { error, renderError } from './response/render/error'
import { makeRenderMedia, media, renderMedia } from './response/render/media'
import { ResponseWithRequestTag } from './response/ResponseWithRequestTag'

export {
  addWarning,
  LinkAttributeValue,
  makeRenderMedia,
  MediaLinks,
  renderError,
  renderMedia,
  ResponseWithRequestTag,
  setLinks,
  WarnCode
}

export const headers = { addWarning, setLinks }
export const render = { error, media }
