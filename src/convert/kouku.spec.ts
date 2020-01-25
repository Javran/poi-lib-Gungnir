import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertKoukuPlaneFrom, convertAirpower, convertAaci,
  convertKoukuStagePlaneCount, convertContactPlane, convertKoukuStage3Damage,
} from './kouku'

describe('convertKoukuPlaneFrom', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: any) =>
      expect(
        convertKoukuPlaneFrom(inp as kcsapi.KoukuPlaneFrom)
      ).toStrictEqual(expected)

    testCase(null, { friend: [], enemy: [] })
    testCase([null], { friend: [], enemy: [] })
    testCase([[1, 2, 3], null], { friend: [0, 1, 2], enemy: [] })
    testCase([[1, 2, 3], [2, 3]], { friend: [0, 1, 2], enemy: [1, 2] })
  })
})

describe('convertAirpower', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Airpower) =>
      expect(convertAirpower(inp as kcsapi.Airpower)).toBe(expected)

    testCase(0, yapi.AirpowerE.AirParity)
    testCase(1, yapi.AirpowerE.AirSupremacy)
    testCase(2, yapi.AirpowerE.AirSuperiority)
    testCase(3, yapi.AirpowerE.AirDenial)
    testCase(4, yapi.AirpowerE.AirIncapability)

    expect(convertAirpower(9999)).toBeInstanceOf(yapi.Unknown)
  })
})

describe('convertAaci', () => {
  test('samples', () => {
    expect(
      convertAaci({ api_idx: 5, api_kind: 8, api_use_items: [308, 307] })
    ).toStrictEqual({ source: 5, kind: 8, equips: [308, 307] })
  })
})

describe('convertKoukuStagePlaneCount', () => {
  test('samples', () => {
    expect(
      convertKoukuStagePlaneCount({
        api_f_count: 1234,
        api_f_lostcount: 234,
        api_e_count: 2000,
        api_e_lostcount: 1111,
      })).toStrictEqual({
        friend: { total: 1234, lost: 234 },
        enemy: { total: 2000, lost: 1111 },
      })
  })
})

describe('convertContactPlane', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.ContactPlane) =>
      expect(
        convertContactPlane(inp as kcsapi.ContactPlane | undefined)
      ).toStrictEqual(expected)

    testCase(undefined, { friend: -1, enemy: -1 })
    testCase(null, { friend: -1, enemy: -1 })
    testCase(null, { friend: -1, enemy: -1 })
    testCase([], { friend: -1, enemy: -1 })
    testCase([343], { friend: 343, enemy: -1 })
    testCase([343, 123], { friend: 343, enemy: 123 })
  })
})

describe('convertKoukuStage3Damage', () => {
  test('samples', () => {
    expect(
      convertKoukuStage3Damage(1, 0, 2, 123.1)
    ).toStrictEqual({
      raiFlag: true,
      bakFlag: false,
      critical: yapi.CriticalE.Critical,
      damage: 123,
      protectFlag: true,
    })
    expect(
      convertKoukuStage3Damage(undefined, null, 0, 0)
    ).toStrictEqual({
      raiFlag: false,
      bakFlag: false,
      critical: yapi.CriticalE.Miss,
      damage: 0,
      protectFlag: false,
    })
  })
})
