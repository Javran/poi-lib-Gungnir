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

export interface Detection {
  success: boolean,
  // true: plane returned
  // false: plane not returned
  // null: without plane
  planeReturned: boolean | null,
}

/*
  TODO: some "bare minimal"s to be converted:

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
export enum Side {
  Friend = 0,
  Enemy = 1,
}

export type ShipIndex = number

// TODO: tolerate unknown attack type.
export enum AttackType {
  // 0=通常攻撃
  Normal = 0,
  // 1=レーザー攻撃
  Lazer = 1,
  // 2=連続射撃
  Double = 2,
  // 3=カットイン(主砲/副砲)
  PrimarySecondaryCutin = 3,
  // 4=カットイン(主砲/電探)
  PrimaryRadarCutin = 4,
  // 5=カットイン(主砲/徹甲)
  PrimaryApCutin = 5,
  // 6=カットイン(主砲/主砲)
  PrimaryPrimaryCutin = 6,
  // 7=空母カットイン
  CarrierCutin = 7,
  // 100=Nelson Touch
  NelsonTouch = 100,
  // 101=一斉射かッ…胸が熱いな！
  NagatoCutin = 101,
  // 102=長門、いい？ いくわよ！ 主砲一斉射ッ！
  MutsuCutin = 102,
  // 103=Colorado (_colorado_cutin)
  ColoardoCutin = 103,
  // 200=瑞雲立体攻撃
  ZuiunCutin = 200,
  // 201=海空立体攻撃
  SuiseiCutin = 201,
}

export enum Critical {
  Miss = 0,
  Hit = 1,
  Critical = 2,
}

export interface DamageE {
  protectFlag: boolean,
  damage: number,
}

export interface HougekiDamage {
  target: ShipIndex,
  // TODO: SI is for slotitem, but I'm not sure what this one does...
  slotitem: number,
  critical: Critical,
  // TODO: to extract the flag: null != e && (!(e.length <= t) && e[t] % 1 != 0)
  protectFlag: boolean,
  damage: number,
}

// A Kanmusu starts her shelling turn of attack,
// in which multiple damages can be dealt
// with a fixed attack type.
export interface HougekiTurn {
  source: {
    side: Side,
    index: ShipIndex,
  },
  attackType: AttackType,
  damages: Array<HougekiDamage>,
}

export interface Hougeki {
  type: 'Hougeki'
  turns: Array<HougekiTurn>,
}

export interface RaigekiTurn {
  target: ShipIndex,
  critical: Critical,
  damage: {
    taken: DamageE,
    dealt: DamageE,
  },
}

export interface Raigeki extends TwoSides<Array<RaigekiTurn>> {
  type: 'Raigeki',
}

export type HouraiPhases = Array<Hougeki | Raigeki>

export interface Battle {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<HP>>
  shipInfo: {
    friend: Array<ShipInfoFriend>,
    enemy: Array<ShipInfoEnemy>,
  },
  pursueFlag: boolean,
  detection: TwoSides<Detection>,
  houraiPhases: HouraiPhases,
}
