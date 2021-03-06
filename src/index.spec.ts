import * as convert from './convert'
import * as yapi from './yapi'
import { readJsonSync } from 'fs-extra'
import { fromPoiBattleDetail, BattleDetailData } from './index'

/*
  TODO: note that we are not yet need a full sample to test for anything,
  we should break this down into pieces if possible to have smaller and manageable unit tests.
 */
describe('samples', () => {
  test('battle-normal_0.json', () => {
    const raw = readJsonSync('./sample/battle-normal_0.json') as BattleDetailData
    const packets = fromPoiBattleDetail(raw)
    expect(packets.length).toBe(1)
    const [battleRaw] = packets
    const mkCommon =
      (firepower: number, torpedo: number, antiAir: number, armor: number) =>
        ({ attrib: { firepower, torpedo, antiAir, armor } })
    expect(convert.convertBattle(battleRaw)).toStrictEqual({
      deckId: 1,
      engagement: yapi.EngagementE.Parallel,
      formation: {
        friend: yapi.FormationE.Vanguard,
        enemy: yapi.FormationE.LineAhead,
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
      lbasStages: null,
      koukuStages: {
        planeFrom: { friend: [], enemy: [] },
        stage1: {
          airpower: yapi.AirpowerE.AirSupremacy, contactPlane: { friend: -1, enemy: -1 },
          friend: { total: 0, lost: 0 }, enemy: { total: 0, lost: 0 },
        },
        stage2: null,
        stage3: null,
      },
      supportInfo: null,
      openingAntiSub: null,
      openingTorpedo: null,
      houraiPhases: [
        {
          type: 'Hougeki',
          turns: [
            {
              source: { side: yapi.Side.Friend, index: 4 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [282],
              damages: [
                {
                  target: 1,
                  critical: yapi.CriticalE.Hit,
                  protectFlag: false,
                  damage: 50,
                },
              ],
            },
            {
              source: { side: yapi.Side.Enemy, index: 0 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [506],
              damages: [
                {
                  target: 4,
                  critical: yapi.CriticalE.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 2 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [341],
              damages: [
                {
                  target: 3,
                  critical: yapi.CriticalE.Hit,
                  protectFlag: false,
                  damage: 88,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 1 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [63],
              damages: [
                {
                  target: 2,
                  critical: yapi.CriticalE.Hit,
                  protectFlag: false,
                  damage: 22,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 3 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [267],
              damages: [
                {
                  target: 0,
                  critical: yapi.CriticalE.Hit,
                  protectFlag: false,
                  damage: 40,
                },
              ],

            },
            {
              source: { side: yapi.Side.Enemy, index: 2 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [502],
              damages: [
                {
                  target: 2,
                  critical: yapi.CriticalE.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
            {
              source: { side: yapi.Side.Friend, index: 0 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [-1],
              damages: [
                {
                  target: 0,
                  critical: yapi.CriticalE.Hit,
                  protectFlag: false,
                  damage: 4,
                },
              ],

            },
            {
              source: { side: yapi.Side.Enemy, index: 4 },
              attackType: yapi.AttackTypeE.Normal,
              slotitems: [501],
              damages: [
                {
                  target: 4,
                  critical: yapi.CriticalE.Miss,
                  protectFlag: false,
                  damage: 0,
                },
              ],

            },
          ],
        },
        {
          type: 'Raigeki',
          friend: [
            {
              target: 0,
              critical: yapi.CriticalE.Hit,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 62, protectFlag: false },
              },
            },
            {
              target: 4,
              critical: yapi.CriticalE.Hit,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 93, protectFlag: false },
              },
            },
            {
              target: 4,
              critical: yapi.CriticalE.Hit,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 71, protectFlag: false },
              },
            },
            {
              target: 4,
              critical: yapi.CriticalE.Hit,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 89, protectFlag: false },
              },
            },
            {
              target: 4,
              critical: yapi.CriticalE.Hit,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 69, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
          ],
          enemy: [
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 62, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: 1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 322, protectFlag: true },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },
            {
              target: -1,
              critical: yapi.CriticalE.Miss,
              damage: {
                taken: { damage: 0, protectFlag: false },
                dealt: { damage: 0, protectFlag: false },
              },
            },

          ],
        },
      ],
    })
  })
  test('battle-normal_1.json', () => {
    const raw = readJsonSync('./sample/battle-normal_1.json') as BattleDetailData
    const packets = fromPoiBattleDetail(raw)
    // the second one is battleresult packet, which we cannot handle yet.
    expect(packets.length).toBe(2)
    const battleRaw = packets[0]
    expect(convert.convertBattle(battleRaw)).toStrictEqual({
      deckId: 1,
      engagement: 3,
      formation: { friend: 1, enemy: 3 },
      hps: {
        friend: [[54, 54], [66, 66], [59, 62], [27, 45], [35, 38], [38, 45]],
        enemy: [[270, 270], [90, 90], [90, 90], [38, 38], [38, 38], [24, 24]],
      },
      shipInfo: {
        friend: [
          { attrib: { firepower: 32, torpedo: 0, antiAir: 62, armor: 57 } },
          { attrib: { firepower: 48, torpedo: 0, antiAir: 88, armor: 72 } },
          { attrib: { firepower: 40, torpedo: 0, antiAir: 74, armor: 62 } },
          { attrib: { firepower: 56, torpedo: 94, antiAir: 78, armor: 68 } },
          { attrib: { firepower: 69, torpedo: 88, antiAir: 65, armor: 53 } },
          { attrib: { firepower: 66, torpedo: 68, antiAir: 69, armor: 56 } },
        ],
        enemy: [
          {
            attrib: { firepower: 90, torpedo: 90, antiAir: 70, armor: 90 },
            mstId: 1545, level: 1,
            equips: [520, 517, 508, -1, -1],
          },
          {
            attrib: { firepower: 85, torpedo: 0, antiAir: 70, armor: 96 },
            mstId: 1543, level: 1,
            equips: [509, 509, 525, 529, -1],
          },
          {
            attrib: { firepower: 85, torpedo: 0, antiAir: 70, armor: 96 },
            mstId: 1543, level: 1,
            equips: [509, 509, 525, 529, -1],
          },
          {
            attrib: { firepower: 44, torpedo: 72, antiAir: 36, armor: 29 },
            mstId: 1577, level: 1,
            equips: [502, 515, 542, -1, -1],
          },
          {
            attrib: { firepower: 44, torpedo: 72, antiAir: 36, armor: 29 },
            mstId: 1577, level: 1,
            equips: [502, 515, 542, -1, -1],
          },
          {
            attrib: { firepower: 0, torpedo: 52, antiAir: 0, armor: 9 },
            mstId: 1531, level: 50,
            equips: [514, 514, -1, -1, -1],
          },
        ],
      },
      pursueFlag: false,
      detection: {
        friend: { success: true, planeReturned: true },
        enemy: { success: true, planeReturned: true },
      },
      lbasStages: null,
      koukuStages: {
        planeFrom: { friend: [0, 1, 2], enemy: [0] },
        stage1: {
          airpower: 1,
          contactPlane: { friend: 343, enemy: -1 },
          friend: { total: 149, lost: 0 },
          enemy: { total: 192, lost: 75 },
        },
        stage2: {
          friend: { total: 140, lost: 10 },
          enemy: { total: 30, lost: 5 },
          aaci: { source: 5, kind: 8, equips: [308, 307] },
        },
        stage3: {
          friend: [
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: true, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
          ],
          enemy: [
            { raiFlag: true, bakFlag: true, critical: 1, damage: 110, protectFlag: false },
            { raiFlag: true, bakFlag: false, critical: 1, damage: 211, protectFlag: false },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
            { raiFlag: true, bakFlag: true, critical: 1, damage: 484, protectFlag: false },
            { raiFlag: true, bakFlag: true, critical: 1, damage: 104, protectFlag: true },
            { raiFlag: false, bakFlag: false, critical: 0, damage: 0, protectFlag: false },
          ],
        },
      },
      openingAntiSub: {
        type: 'Hougeki',
        turns: [
          {
            attackType: 0,
            slotitems: [343],
            source: { index: 1, side: 0 },
            damages: [{ critical: 1, protectFlag: false, target: 5, damage: 27 }],
          },
        ],
      },
      openingTorpedo: {
        type: 'Raigeki',
        friend: [
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: 0, critical: 1,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 27 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
        ],
        enemy: [
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 27 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
          {
            target: -1, critical: 0,
            damage: {
              taken: { protectFlag: false, damage: 0 },
              dealt: { protectFlag: false, damage: 0 },
            },
          },
        ],
      },
      supportInfo: null,
      houraiPhases: [
        {
          type: 'Hougeki',
          turns: [
            {
              source: { side: 0, index: 0 },
              attackType: 7,
              slotitems: [157, 292, 343],
              damages: [
                { target: 2, critical: 2, protectFlag: true, damage: 351 },
              ],
            },
            {
              source: { side: 0, index: 1 },
              attackType: 0,
              slotitems: [-1],
              damages: [{ target: 0, critical: 1, protectFlag: false, damage: 117 }],
            },
            {
              source: { side: 1, index: 0 },
              attackType: 0,
              slotitems: [508],
              damages: [{ target: 1, critical: 1, protectFlag: false, damage: 6 }],
            },
            {
              source: { side: 0, index: 2 },
              attackType: 0,
              slotitems: [-1],
              damages: [{ target: 0, critical: 1, protectFlag: false, damage: 106 }],
            },
          ],
        }],
    })
  })

  test('airbattle-normal_0.json', () => {
    const raw = readJsonSync('./sample/airbattle-normal_0.json') as BattleDetailData
    const packets = fromPoiBattleDetail(raw)
    const battleRaw = packets[0]
    expect(convert.convertAirBattleNormal(battleRaw as any)).toStrictEqual({
      deckId: 1, engagement: 2, formation: { friend: 3, enemy: 3 },
      hps: {
        friend: [[53, 53], [45, 45], [29, 36], [31, 38], [37, 37], [36, 40]],
        enemy: [[96, 96], [60, 60], [20, 20], [20, 20], [20, 20], [20, 20]],
      },
      shipInfo: {
        friend: [
          { attrib: { firepower: 70, torpedo: 79, antiAir: 74, armor: 69 } },
          { attrib: { firepower: 66, torpedo: 68, antiAir: 69, armor: 56 } },
          { attrib: { firepower: 69, torpedo: 87, antiAir: 71, armor: 50 } },
          { attrib: { firepower: 67, torpedo: 87, antiAir: 66, armor: 53 } },
          { attrib: { firepower: 73, torpedo: 93, antiAir: 59, armor: 52 } },
          { attrib: { firepower: 54, torpedo: 72, antiAir: 91, armor: 52 } },
        ],
        enemy: [
          {
            attrib: { firepower: 25, torpedo: 0, antiAir: 50, armor: 80 },
            mstId: 1528, level: 1, equips: [520, 517, 524, -1, -1],
          },
          {
            attrib: { firepower: 58, torpedo: 42, antiAir: 30, armor: 60 },
            mstId: 1522, level: 1, equips: [505, 506, 525, 525, -1],
          },
          {
            attrib: { firepower: 5, torpedo: 15, antiAir: 6, armor: 5 },
            mstId: 1501, level: 1, equips: [501, -1, -1, -1, -1],
          },
          {
            attrib: { firepower: 5, torpedo: 15, antiAir: 6, armor: 5 },
            mstId: 1501, level: 1, equips: [501, -1, -1, -1, -1],
          },
          {
            attrib: { firepower: 5, torpedo: 15, antiAir: 6, armor: 5 },
            mstId: 1501, level: 1, equips: [501, -1, -1, -1, -1],
          },
          {
            attrib: { firepower: 5, torpedo: 15, antiAir: 6, armor: 5 },
            mstId: 1501, level: 1, equips: [501, -1, -1, -1, -1],
          }],
      },
      pursueFlag: true,
      detection: {
        friend: { success: true, planeReturned: true },
        enemy: { success: true, planeReturned: true },
      },
      lbasStages: null,
      koukuStages: {
        planeFrom: { friend: [0], enemy: [0] },
        stage1: {
          friend: { total: 6, lost: 0 },
          enemy: { total: 96, lost: 35 },
          airpower: 0, contactPlane: { friend: -1, enemy: -1 },
        },
        stage2: {
          friend: { total: 6, lost: 0 },
          enemy: { total: 47, lost: 24 },
          aaci: { source: 5, kind: 34, equips: [308, 308] },
        },
        stage3: {
          friend: [
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: true, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: true, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 }],
          enemy: [
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: true, critical: 1, protectFlag: true, damage: 8 },
            { raiFlag: false, bakFlag: true, critical: 0, protectFlag: true, damage: 24 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: true, critical: 0, protectFlag: false, damage: 25 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 }],
        },
      }, supportInfo: null,
      koukuStagesExtra: {
        planeFrom: { friend: [0], enemy: [0] },
        stage1: {
          friend: { total: 6, lost: 0 },
          enemy: { total: 37, lost: 7 },
          airpower: 0, contactPlane: { friend: -1, enemy: -1 },
        },
        stage2: {
          friend: { total: 6, lost: 1 },
          enemy: { total: 17, lost: 17 },
          aaci: null,
        },
        stage3: {
          friend: [
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 }],
          enemy: [
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: true, critical: 0, protectFlag: false, damage: 5 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: false, critical: 0, protectFlag: false, damage: 0 },
            { raiFlag: false, bakFlag: true, critical: 1, protectFlag: true, damage: 72 }],
        },
      },
    })
  })
})
