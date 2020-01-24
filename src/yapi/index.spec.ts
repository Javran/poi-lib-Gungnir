import * as yapi from './index'

describe('Unknown', () => {
  test('enumerable', () => {
    expect(
      JSON.parse(
        JSON.stringify(new yapi.Unknown(123))
      )
    ).toStrictEqual({ val: 123, context: null })

    expect(
      JSON.parse(
        JSON.stringify(new yapi.Unknown('v', 'c'))
      )
    ).toStrictEqual({ val: 'v', context: 'c' })
  })

  test('toString', () => {
    expect(`${new yapi.Unknown(1)}`).toBe('?1?')
    expect(`${new yapi.Unknown('foo', 'zzz')}`).toBe('?foo?')
  })
})
