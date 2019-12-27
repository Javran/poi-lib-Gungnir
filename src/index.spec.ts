import { readJsonSync } from 'fs-extra'

import { fromPoiBattleDetail, BattleDetailData } from './index'

test('sample0', () => {
  const raw = readJsonSync('./sample/sample0.json')
  expect(fromPoiBattleDetail(raw as BattleDetailData).length).toBe(1)
})
