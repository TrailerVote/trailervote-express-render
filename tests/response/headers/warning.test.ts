import test from 'tape'

import { Response } from 'express'

import { addWarning } from '../../../src/index'

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

  addWarning(fakeResponse as unknown as Response, 'Too many languages in Accept-Language', 199, 'test/1.0')
  t.deepEquals(fakeResponse.headers.Warning, ['199 test/1.0 "Too many languages in Accept-Language"'])

  t.end()
})
