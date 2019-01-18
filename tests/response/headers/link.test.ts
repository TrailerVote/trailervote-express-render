import test from 'tape'

import { Response } from 'express'

import { setLinks } from '../../../src/index'

test('it adds a warning', (t) => {
  const fakeResponse = {
    headers: {} as { [p: string]: any[] | undefined },
    locals: {},

    header: (field: any, value: any) => {
      if (!fakeResponse.headers[field]) {
        fakeResponse.headers[field] = []
      }
      fakeResponse.headers[field]!.push(value)
    }
  }

  const mediaLinks = {
    self: { href: 'https://test.trailervote.com/response/headers/link' },
    warning: { href: 'https://test.trailervote.com/response/headers/warning' }
  }

  setLinks(fakeResponse as unknown as Response, mediaLinks)
  t.deepEquals(fakeResponse.headers.Link, [
    '<https://test.trailervote.com/response/headers/link>; rel=self, ' +
    '<https://test.trailervote.com/response/headers/warning>; rel=warning'
  ])

  t.end()
})
