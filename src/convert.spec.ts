import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

import {
  convertEngagement, convertFormation, convertHps, convertIntFlag,
  convertDetection, convertDamageE,
} from './convert'

describe('convertEngagement', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Engagement) =>
      expect(convertEngagement(inp as kcsapi.Engagement)).toBe(expected)

    testCase(1, yapi.Engagement.Parallel)
    testCase(2, yapi.Engagement.HeadOn)
    testCase(3, yapi.Engagement.TAdvantage)
    testCase(4, yapi.Engagement.TDisadvantage)
  })
})

describe('convertFormation', () => {
  test('samples', () => {
    const testCase = (inp: any, expected: yapi.Formation) =>
      expect(convertFormation(inp as kcsapi.Formation)).toBe(expected)

    testCase(1, yapi.Formation.LineAhead)
    testCase(2, yapi.Formation.DoubleLine)
    testCase(3, yapi.Formation.Diamond)
    testCase(4, yapi.Formation.Echelon)
    testCase(5, yapi.Formation.LineAbreast)
    testCase(6, yapi.Formation.Vanguard)

    testCase('11', yapi.Formation.CruisingFormation1)
    testCase('12', yapi.Formation.CruisingFormation2)
    testCase('13', yapi.Formation.CruisingFormation3)
    testCase('14', yapi.Formation.CruisingFormation4)
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

describe('convertDamageE', () => {
  test('samples', () => {
    expect(convertDamageE(0)).toStrictEqual({ protectFlag: false, damage: 0 })
    expect(convertDamageE(0.1)).toStrictEqual({ protectFlag: true, damage: 0 })
    expect(convertDamageE(123.1)).toStrictEqual({ protectFlag: true, damage: 123 })
    expect(convertDamageE(456)).toStrictEqual({ protectFlag: false, damage: 456 })
  })
})
