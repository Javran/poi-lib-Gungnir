/*
  a class for indicating unknown values that
  are not recognized but its value is not critically important.
 */
export class Unknown {
  public val: any
  // context is some optional piece of info that would be useful for debugging.
  public context: any

  constructor(val: any, context: any = null) {
    this.val = val
    this.context = context
  }

  public toString = (): string => `?${this.val}?`
}

Object.defineProperty(Unknown, 'val', { enumerable: true })
Object.defineProperty(Unknown, 'context', { enumerable: true })

// Wrapper a type so it can fallback
// to store arbitrary data in Unknown rather than throwing errors.
export type Unk<T> = T | Unknown

/*
  For information that can be organized into "friend" side
  and "enemy" side.
 */
export interface TwoSides<T> {
  friend: T
  enemy: T
}

export enum EngagementE {
  Parallel = 1,
  HeadOn = 2,
  TAdvantage = 3,
  TDisadvantage = 4,
}

export type Engagement = Unk<EngagementE>

export enum FormationE {
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

export type Formation = Unk<FormationE>

export type Hp = [number, number] // current and max.

export interface DetectionInl {
  success: boolean
  // true: plane returned
  // false: plane not returned
  // null: without plane
  planeReturned: boolean | null
}

export type Detection = Unk<DetectionInl>

export enum Side {
  Friend = 0,
  Enemy = 1,
}

// a ShipIndex always starts with 0.
export type ShipIndex = number
export enum AttackTypeE {
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

export type AttackType = Unk<AttackTypeE>

export enum CriticalE {
  Miss = 0,
  Hit = 1,
  Critical = 2,
}

export type Critical = Unk<CriticalE>

export interface DamageWithFlag {
  protectFlag: boolean
  damage: number
}

export interface ShipAttributes {
  firepower: number
  torpedo: number
  antiAir: number
  armor: number
}

export interface ShipInfoCommon {
  // api_fParam & api_eParam
  attrib: ShipAttributes
}

export interface ShipInfoExtra {
  // api_ship_ke
  mstId: number
  // api_ship_lv
  level: number
  /*
    the equipment array, if present, will be kept as it is.
    this is because number 0, -1 can be used to indicate
    that a slot is available but is unequipped.
    maybe there is something more clever we can do,
    but for now let's just make sure the conversion does not drop any info.
   */
  // api_eSlot
  equips: Array<number>
}

export type ShipInfoFriend = ShipInfoCommon
export type ShipInfoEnemy = ShipInfoCommon & ShipInfoExtra
