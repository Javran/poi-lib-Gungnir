/*
  yapi is the target representation that gungnir operates on.
  (in case you wonder, Y is for Yggdrasil)

  Naming convensions:

  - postfix "E" (e.g. FormationE) for enum types representing known API values.
  - postfix "Inl" (e.g. DetectionInl) for non-enum types representing known API values
  - Foo could be a wrapper type of FooE or FooInl, with the possibility to have a unknown value.
    i.e. "type Foo = FooE | Unknown" or "type Foo = FooInl | Unknown"
  - all cap abbrs should only keep the first character in upper case.
    (AACI => Aaci)

 */

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
  friend: T,
  enemy: T,
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

export interface DetectionInl {
  success: boolean,
  // true: plane returned
  // false: plane not returned
  // null: without plane
  planeReturned: boolean | null,
}

export type Detection = Unk<DetectionInl>

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

 */
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
  protectFlag: boolean,
  damage: number,
}

export interface HougekiDamage {
  target: ShipIndex,
  critical: Unk<Critical>,
  protectFlag: boolean,
  damage: number,
}

// either a non-empty list or null
export type HougekiSlotitems = Array<number> | null

// A Kanmusu starts her shelling turn of attack,
// in which multiple damages can be dealt
// with a fixed attack type.
export interface HougekiTurn {
  source: {
    side: Side,
    index: ShipIndex,
  },
  attackType: AttackType,
  slotitems: HougekiSlotitems,
  damages: Array<HougekiDamage>,
}

export interface Hougeki {
  type: 'Hougeki'
  turns: Array<HougekiTurn>,
}

export interface RaigekiTurn {
  target: ShipIndex,
  critical: Unk<Critical>,
  damage: {
    taken: DamageWithFlag,
    dealt: DamageWithFlag,
  },
}

export interface Raigeki extends TwoSides<Array<RaigekiTurn>> {
  type: 'Raigeki',
}

export type HouraiPhases = Array<Hougeki | Raigeki>

export type KoukuPlaneFromSide = Array<ShipIndex>
export type KoukuPlaneFrom = TwoSides<KoukuPlaneFromSide>

export interface PlaneInfo {
  total: number,
  lost: number,
}

export type KoukuStagePlaneCount = TwoSides<PlaneInfo>

export enum AirpowerE {
  AirParity = 0,
  AirSupremacy = 1,
  AirSuperiority = 2,
  AirDenial = 3,
  AirIncapability = 4,
}

export type Airpower = Unk<AirpowerE>

export interface KoukuStage1 extends KoukuStagePlaneCount {
  airpower: Airpower
}

export interface Aaci {
  source: ShipIndex,
  kind: number,
  equips: Array<number>,
}

export interface KoukuStage2 extends KoukuStagePlaneCount {
  aaci: Aaci | null,
}

export interface KoukuStages {
  planeFrom: KoukuPlaneFrom,
  stage1: KoukuStage1,
  stage2: KoukuStage2,
  stage3: 'TODO',
}

export interface Battle {
  deckId: number,
  engagement: Engagement,
  formation: TwoSides<Formation>,
  hps: TwoSides<Array<Hp>>,
  shipInfo: {
    friend: Array<ShipInfoFriend>,
    enemy: Array<ShipInfoEnemy>,
  },
  pursueFlag: boolean,
  detection: TwoSides<Unk<Detection>>,
  houraiPhases: HouraiPhases,
}
