import * as convert from './convert'
import * as yapi from './yapi'
import { readJsonSync } from 'fs-extra'
import { fromPoiBattleDetail, BattleDetailData } from './index'

describe('samples', () => {
  test('sample0.json', () => {
    const raw = readJsonSync('./sample/sample0.json') as BattleDetailData
    const packets = fromPoiBattleDetail(raw)
    expect(packets.length).toBe(1)
    const [battleRaw] = packets
    const mkCommon =
      (firepower: number, torpedo: number, antiAir: number, armor: number) =>
        ({ attrib: { firepower, torpedo, antiAir, armor } })
    expect(convert.convertBattle(battleRaw)).toStrictEqual({
      deckId: 1,
      engagement: yapi.Engagement.Parallel,
      formation: {
        friend: yapi.Formation.Vanguard,
        enemy: yapi.Formation.LineAhead,
      },
      hps: {
        friend: [[37, 37], [37, 37], [42, 59], [35, 38], [45, 45]],
        enemy: [[57, 57], [37, 37], [37, 37], [20, 20], [20, 20]],
      },
      shipInfo: {
        friend: [
          mkCommon(69, 88, 70, 52),
          mkCommon(73, 93, 59, 52),
          mkCommon(73, 70, 70, 75),
          mkCommon(68, 88, 70, 53),
          mkCommon(66, 68, 69, 56),
        ],
        enemy: [
          {
            ...mkCommon(48, 80, 30, 39),
            mstId: 1555,
            level: 1,
            equips: [506, 525, 542, 543, -1],
          },
          {
            ...mkCommon(38, 66, 32, 26),
            mstId: 1576,
            level: 1,
            equips: [502, 545, 542, -1, -1],
          },
          {
            ...mkCommon(38, 66, 32, 26),
            mstId: 1576,
            level: 1,
            equips: [502, 545, 542, -1, -1],
          },
          {
            ...mkCommon(5, 15, 6, 5),
            mstId: 1501,
            level: 1,
            equips: [501, -1, -1, -1, -1],
          },
          {
            ...mkCommon(5, 15, 6, 5),
            mstId: 1501,
            level: 1,
            equips: [501, -1, -1, -1, -1],
          },
        ],
      },
      pursueFlag: true,
      detection: {
        friend: { success: true, planeReturned: null },
        enemy: { success: true, planeReturned: true },
      },
      houraiPhases: [
        {
          type: 'Hougeki',
          turns: [
            {
              source: { side: yapi.Side.Friend, index: 4 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 1,
                  slotitem: 282,
                  critical: yapi.Critical.Hit,
                  protectFlag: false,
                  damage: 50,
                },
              ],
            },
            {
              source: { side: yapi.Side.Enemy, index: 0 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 4,
                  slotitem: 506,
                  critical: yapi.Critical.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 2 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 3,
                  slotitem: 341,
                  critical: yapi.Critical.Hit,
                  protectFlag: false,
                  damage: 88,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 1 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 2,
                  slotitem: 63,
                  critical: yapi.Critical.Hit,
                  protectFlag: false,
                  damage: 22,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 3 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 0,
                  slotitem: 267,
                  critical: yapi.Critical.Hit,
                  protectFlag: false,
                  damage: 40,
                },
              ],

            },
            {
              source: { side: yapi.Side.Enemy, index: 2 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 2,
                  slotitem: 502,
                  critical: yapi.Critical.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 0 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 0,
                  slotitem: -1,
                  critical: yapi.Critical.Hit,
                  protectFlag: false,
                  damage: 4,
                },
              ],

            },
            {
              source: { side: yapi.Side.Enemy, index: 4 },
              attackType: yapi.AttackType.Normal,
              damages: [
                {
                  target: 4,
                  slotitem: 501,
                  critical: yapi.Critical.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
          ],
        },
        { type: 'Raigeki' },
      ],
    })
  })
})
