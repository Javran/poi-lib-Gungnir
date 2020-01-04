import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

import { convertEngagement, convertFormation, convertHps } from './convert'

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
