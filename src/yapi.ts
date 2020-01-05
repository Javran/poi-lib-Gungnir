/*
  yapi is the target representation that gungnir operates on.
  (in case you wonder, Y is for Yggdrasil)
 */

/*
  For information that can be organized into "friend" side
  and "enemy" side.
 */
export interface TwoSides<T> {
  friend: T,
  enemy: T,
}

export enum Engagement {
  Parallel = 1,
  HeadOn = 2,
  TAdvantage = 3,
  TDisadvantage = 4,
}

export enum Formation {
  LineAhead = 1,
  DoubleLine = 2,
  Diamond = 3,
  Echelon = 4,
  LineAbreast = 5,
  Vanguard = 6,
  CruisingFormation1 = 11,
  CruisingFormation2 = 12,
  CruisingFormation3 = 13,
  CruisingFormation4 = 14,
}

export type HP = [number, number] // current and max.

export interface ShipAttributes {
  firepower: number,
  torpedo: number,
  antiAir: number,
  armor: number,
}

export interface ShipInfoCommon {
  // api_fParam & api_eParam
  attrib: ShipAttributes,
}

export interface ShipInfoExtra {
  // api_ship_ke
  mstId: number,
  // api_ship_lv
  level: number,
  /*
    the equipment array, if present, will be kept as it is.
    this is because number 0, -1 can be used to indicate
    that a slot is available but is unequipped.
    maybe there is something more clever we can do,
    but for now let's just make sure the conversion does not drop any info.
   */
  // api_eSlot
  equips: Array<number>,
}

export type ShipInfoFriend = ShipInfoCommon
export type ShipInfoEnemy = ShipInfoCommon & ShipInfoExtra

/*
  TODO: some "bare minimal"s to be converted:

  api_search
  api_stage_flag
  api_kouku

  api_support_flag
  api_support_info
  api_opening_taisen_flag
  api_opening_taisen
  api_opening_flag
  api_opening_attack

  api_hourai_flag
  api_hougeki1
  api_hougeki2
  api_hougeki3
  api_raigeki

 */

export interface Battle {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<HP>>
  shipInfo: {
    friend: Array<ShipInfoFriend>,
    enemy: Array<ShipInfoEnemy>,
  },
  canPursue: boolean,
}
