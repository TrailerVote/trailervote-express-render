import { LinkAttributeValue, MediaLinks, setLinks } from './response/headers/link'
import { addWarning, WarnCode } from './response/headers/warning'
import { error, renderError } from './response/render/error'
import { media, renderMedia } from './response/render/media'

export { LinkAttributeValue, MediaLinks, WarnCode, renderError, renderMedia, addWarning, setLinks }

export const headers = { addWarning, setLinks }
export const render = { error, media }
