import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import { convertSupportInfo } from './index'

describe('convertSupportInfo', () => {
  test('samples', () => {
    expect(convertSupportInfo(
      2,
      {
        "api_support_airatack": null,
        "api_support_hourai": {
          "api_deck_id": 3,
          "api_ship_id": [123687, 86122, 29771, 488, 124152, 408],
          "api_undressing_flag": [0, 0, 0, 0, 0, 0],
          "api_cl_list": [0, 0, 1, 0, 2, 0, 0],
          "api_damage": [0, 0, 234, 0, 254, 0, 0]
        }
      })).toStrictEqual({ type: 2, deckId: 3, ships: [] })
  })
})
