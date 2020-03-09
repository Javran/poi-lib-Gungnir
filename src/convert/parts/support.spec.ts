import * as yapi from '@g/yapi'

import {
  convertSupportType,
  convertSupportInfo,
} from './support'

describe('convertSupportType', () => {
  test('samples', () => {
    const testCase = (inp: number, expected: yapi.Unk<yapi.SupportType | null>) =>
      expect(convertSupportType(inp)).toBe(expected)

    testCase(0, null)
    testCase(1, yapi.SupportTypeE.Airstrike)
    testCase(2, yapi.SupportTypeE.Shelling)
    testCase(3, yapi.SupportTypeE.Torpedo)
    testCase(4, yapi.SupportTypeE.AntiSub)

    expect(convertSupportType(9999)).toBeInstanceOf(yapi.Unknown)
  })
})

describe('convertSupportInfo', () => {
  test('samples', () => {
    expect(convertSupportInfo(
      2,
      {
        api_support_airatack: null,
        api_support_hourai: {
          api_deck_id: 3,
          api_ship_id: [123687, 86122, 29771, 488, 124152, 408],
          api_undressing_flag: [0, 0, 0, 0, 0, 0],
          api_cl_list: [0, 0, 1, 0, 2, 0, 0],
          api_damage: [0, 0, 234, 0, 254, 0, 0],
        },
      })).toStrictEqual({
        type: 2,
        deckId: 3,
        ships: [
          { rosterId: 123687, undressing: false },
          { rosterId: 86122, undressing: false },
          { rosterId: 29771, undressing: false },
          { rosterId: 488, undressing: false },
          { rosterId: 124152, undressing: false },
          { rosterId: 408, undressing: false },
        ],
        attackInfo: [
          { critical: 0, damage: { damage: 0, protectFlag: false } },
          { critical: 0, damage: { damage: 0, protectFlag: false } },
          { critical: 1, damage: { damage: 234, protectFlag: false } },
          { critical: 0, damage: { damage: 0, protectFlag: false } },
          { critical: 2, damage: { damage: 254, protectFlag: false } },
          { critical: 0, damage: { damage: 0, protectFlag: false } },
          { critical: 0, damage: { damage: 0, protectFlag: false } },
        ],
      })
  })
})
