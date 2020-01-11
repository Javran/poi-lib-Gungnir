import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

import {
  convertEngagement, convertFormation, convertHps, convertIntFlag,
  convertDetection, convertDamageWithFlag,
  convertCritical, convertKoukuPlaneFrom, convertAirpower, convertAaci,
} from './convert'

describe('convertEngagement', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Unk<yapi.Engagement>) =>
      expect(convertEngagement(inp as kcsapi.Engagement)).toBe(expected)

    testCase(1, yapi.EngagementE.Parallel)
    testCase(2, yapi.EngagementE.HeadOn)
    testCase(3, yapi.EngagementE.TAdvantage)
    testCase(4, yapi.EngagementE.TDisadvantage)

    expect(convertEngagement(1234 as kcsapi.Engagement)).toBeInstanceOf(yapi.Unknown)
  })
})

describe('convertFormation', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Unk<yapi.Formation>) =>
      expect(convertFormation(inp as kcsapi.Formation)).toBe(expected)

    testCase(1, yapi.FormationE.LineAhead)
    testCase(2, yapi.FormationE.DoubleLine)
    testCase(3, yapi.FormationE.Diamond)
    testCase(4, yapi.FormationE.Echelon)
    testCase(5, yapi.FormationE.LineAbreast)
    testCase(6, yapi.FormationE.Vanguard)

    testCase('11', yapi.FormationE.CruisingFormation1)
    testCase('12', yapi.FormationE.CruisingFormation2)
    testCase('13', yapi.FormationE.CruisingFormation3)
    testCase('14', yapi.FormationE.CruisingFormation4)

    expect(convertFormation(1551 as kcsapi.Formation)).toBeInstanceOf(yapi.Unknown)
  })
})

describe('convertHps', () => {
  test('samples', () => {
    expect(convertHps([44, 45, 54], [184, 185, 318])).toStrictEqual([[44, 184], [45, 185], [54, 318]])
    expect(() => convertHps([44, 45, 54], [184, 185, 318, 1])).toThrow()
  })
})

describe('convertIntFlag', () => {
  test('samples', () => {
    expect(convertIntFlag(0)).toBe(false)
    expect(convertIntFlag(1)).toBe(true)
  })
})

describe('convertDetection', () => {
  test('samples', () => {
    expect(convertDetection(1)).toStrictEqual({ success: true, planeReturned: true })
    expect(convertDetection(2)).toStrictEqual({ success: true, planeReturned: false })
    expect(convertDetection(5)).toStrictEqual({ success: true, planeReturned: null })

    expect(convertDetection(4)).toStrictEqual({ success: false, planeReturned: true })
    expect(convertDetection(3)).toStrictEqual({ success: false, planeReturned: false })
    expect(convertDetection(6)).toStrictEqual({ success: false, planeReturned: null })
  })
})

describe('convertDamageWithFlag', () => {
  test('samples', () => {
    expect(convertDamageWithFlag(0)).toStrictEqual({ protectFlag: false, damage: 0 })
    expect(convertDamageWithFlag(0.1)).toStrictEqual({ protectFlag: true, damage: 0 })
    expect(convertDamageWithFlag(123.1)).toStrictEqual({ protectFlag: true, damage: 123 })
    expect(convertDamageWithFlag(456)).toStrictEqual({ protectFlag: false, damage: 456 })
  })
})

describe('convertCritical', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Critical) =>
      expect(convertCritical(inp as kcsapi.CriticalFlag)).toBe(expected)

    testCase(0, yapi.CriticalE.Miss)
    testCase(1, yapi.CriticalE.Hit)
    testCase(2, yapi.CriticalE.Critical)
  })
})

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
