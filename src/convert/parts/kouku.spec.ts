import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertKoukuPlaneFrom, convertAirpower, convertAaci,
  convertKoukuStagePlaneCount, convertContactPlane, convertKoukuStage3Damage,
  convertKoukuStagesForInjection, convertKoukuStagesForAirBase,
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

describe('convertKoukuStagesForInjection', () => {
  test('samples', () => {
    expect(convertKoukuStagesForInjection({
      api_plane_from: [[2], null],
      api_stage1: { api_f_count: 9, api_f_lostcount: 0, api_e_count: 0, api_e_lostcount: 0 },
      api_stage2: { api_f_count: 9, api_f_lostcount: 2, api_e_count: 0, api_e_lostcount: 0 },
      api_stage3: {
        api_frai_flag: [0, 0, 0, 0, 0, 0], api_erai_flag: [0, 0, 0, 0, 0, 0],
        api_fbak_flag: [0, 0, 0, 0, 0, 0], api_ebak_flag: [0, 0, 0, 0, 0, 1],
        api_fcl_flag: [0, 0, 0, 0, 0, 0], api_ecl_flag: [0, 0, 0, 0, 0, 0],
        api_fdam: [0, 0, 0, 0, 0, 0], api_edam: [0, 0, 0, 0, 0, 10],
      },
    })).toStrictEqual({
      planeFrom: { friend: [1], enemy: [] },
      stage1: { friend: { total: 9, lost: 0 }, enemy: { total: 0, lost: 0 } },
      stage2: { friend: { total: 9, lost: 2 }, enemy: { total: 0, lost: 0 } },
      stage3: {
        friend: [
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
        ],
        enemy: [
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: true, critical: 0, protectFlag: false, damage: 10 },
        ],
      },
    })
  })
})

describe('convertKoukuStagesForAirBase', () => {
  test('samples', () => {
    expect(convertKoukuStagesForAirBase({
      api_base_id: 1,
      api_stage_flag: [1, 1, 1],
      api_plane_from: [null, [1, 2, 3, 4, 7, 8, 9]],
      api_squadron_plane: [
        { api_mst_id: 225, api_count: 18 }, { api_mst_id: 222, api_count: 18 },
        { api_mst_id: 170, api_count: 18 }, { api_mst_id: 187, api_count: 18 },
      ],
      api_stage1: {
        api_f_count: 72, api_f_lostcount: 10,
        api_e_count: 373, api_e_lostcount: 119,
        api_disp_seiku: 0, api_touch_plane: [-1, -1],
      },
      api_stage2: {
        api_f_count: 31, api_f_lostcount: 0,
        api_e_count: 0, api_e_lostcount: 0,
      },
      api_stage3: {
        api_erai_flag: [0, 0, 0, 0, 0, 0],
        api_ebak_flag: [0, 0, 0, 0, 0, 0],
        api_ecl_flag: [0, 0, 0, 0, 0, 0],
        api_edam: [0, 0, 0, 0, 0, 0],
      },
      /*
        TODO: we are not yet ready for "_combined"
        "api_stage3_combined": { "api_erai_flag": [1, 0, 0, 0, 1, 0], "api_ebak_flag": [0, 0, 0, 0, 0, 0], "api_ecl_flag": [0, 0, 0, 0, 0, 0], "api_edam": [107, 0, 0, 0, 132, 0]
       */
    })).toStrictEqual({
      baseId: 1,
      planeFrom: {
        friend: [],
        enemy: [0, 1, 2, 3, 6, 7, 8],
      },
      squadrons: [
        { masterId: 225, count: 18 }, { masterId: 222, count: 18 },
        { masterId: 170, count: 18 }, { masterId: 187, count: 18 },
      ],
      stage1: {
        friend: { total: 72, lost: 10 },
        enemy: { total: 373, lost: 119 },
        airpower: 0, contactPlane: { friend: -1, enemy: -1 },
      },
      stage2: { friend: { total: 31, lost: 0 }, enemy: { total: 0, lost: 0 } },
      stage3: {
        enemy: [
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
          { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
        ],
      },
    })
  })
})
