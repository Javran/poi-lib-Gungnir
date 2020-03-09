import {
  convertOpeningAntiSub,
  convertOpeningTorpedo,
} from './hourai'

describe('convertOpeningAntiSub', () => {
  test('samples', () => {
    expect(
      convertOpeningAntiSub(
        1,
        {
          api_at_eflag: [0, 0, 0, 0, 0],
          api_at_list: [0, 2, 4, 1, 3],
          api_at_type: [0, 0, 0, 0, 0],
          api_df_list: [[3], [2], [1], [0], [4]],
          api_si_list: [['45'], ['45'], ['45'], ['288'], ['287']],
          api_cl_list: [[1], [1], [1], [2], [1]],
          api_damage: [[121], [116], [118], [132], [98]],
        })).toStrictEqual(
          {
            type: 'Hougeki',
            turns: [
              {
                source: { side: 0, index: 0 },
                attackType: 0, slotitems: [45],
                damages: [{ target: 3, critical: 1, protectFlag: false, damage: 121 }],
              },
              {
                source: { side: 0, index: 2 },
                attackType: 0, slotitems: [45],
                damages: [{ target: 2, critical: 1, protectFlag: false, damage: 116 }],
              },
              {
                source: { side: 0, index: 4 }, attackType: 0, slotitems: [45],
                damages: [{ target: 1, critical: 1, protectFlag: false, damage: 118 }],
              },
              {
                source: { side: 0, index: 1 },
                attackType: 0, slotitems: [288],
                damages: [{ target: 0, critical: 2, protectFlag: false, damage: 132 }],
              },
              {
                source: { side: 0, index: 3 },
                attackType: 0, slotitems: [287],
                damages: [{ target: 4, critical: 1, protectFlag: false, damage: 98 }],
              },
            ],
          })
  })
})

describe('convertOpeningTorpedo', () => {
  test('samples', () => {
    expect(convertOpeningTorpedo(
      1,
      {
        api_frai: [-1, -1, -1, 0, -1, -1, -1],
        api_fcl: [0, 0, 0, 1, 0, 0, 0],
        api_fdam: [0, 0, 0, 0, 0, 0, 0],
        api_fydam: [0, 0, 0, 27, 0, 0, 0],
        api_erai: [-1, -1, -1, -1, -1, -1, -1],
        api_ecl: [0, 0, 0, 0, 0, 0, 0],
        api_edam: [27, 0, 0, 0, 0, 0, 0],
        api_eydam: [0, 0, 0, 0, 0, 0, 0],
      }
    )).toStrictEqual(
      {
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
            damage:
            {
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
          }],
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
      }
    )

  })
})
