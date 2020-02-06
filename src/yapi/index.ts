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

import {
  Unk, TwoSides, Hp, Formation, Engagement, ShipIndex,
  Side, Detection, Critical, AttackType, DamageWithFlag,
} from './basic'
import { KoukuStages, KoukuStagesForSupport, KoukuStagesForAirBase } from './kouku'
import { KoukuStage1ForInjection } from '@g/kcsapi'

export * from './basic'
export * from './kouku'

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

export interface HougekiDamage {
  target: ShipIndex
  critical: Unk<Critical>
  protectFlag: boolean
  damage: number
}

// either a non-empty list or null
export type HougekiSlotitems = Array<number> | null

// A Kanmusu starts her shelling turn of attack,
// in which multiple damages can be dealt
// with a fixed attack type.
export interface HougekiTurn {
  source: {
    side: Side
    index: ShipIndex
  }
  attackType: AttackType
  slotitems: HougekiSlotitems
  damages: Array<HougekiDamage>
}

export interface Hougeki {
  type: 'Hougeki'
  turns: Array<HougekiTurn>
}

export interface RaigekiTurn {
  target: ShipIndex
  critical: Unk<Critical>
  damage: {
    taken: DamageWithFlag
    dealt: DamageWithFlag
  }
}

export interface Raigeki extends TwoSides<Array<RaigekiTurn>> {
  type: 'Raigeki',
}

export type HouraiPhases = Array<Hougeki | Raigeki>

export enum SupportTypeE {
  Airstrike = 1,
  Shelling = 2,
  Torpedo = 3,
  AntiSub = 4,
}

export type SupportType = Unk<SupportTypeE>

export interface SupportInfoShip {
  rosterId: number // roster id of the ship.
  undressing: boolean // true: moderate damage or worst.
}

export interface SupportInfoCommon {
  type: SupportType
  deckId: number
  ships: Array<SupportInfoShip>
}

export interface SupportInfoHouraiDamage {
  critical: Critical
  damage: DamageWithFlag
}

export interface SupportHourai extends SupportInfoCommon {
  type: SupportTypeE.Shelling | SupportTypeE.Torpedo
  attackInfo: Array<SupportInfoHouraiDamage>
}

// TODO: the naming is confusing for now
// because kcsapi.SupportAirAttack does not correspond to yapi.SupportAirAttack.
export interface SupportAirAttack extends SupportInfoCommon {
  type: SupportTypeE.Airstrike | SupportTypeE.AntiSub
  koukuStages: KoukuStagesForSupport
}

export type SupportInfo = Unk<SupportHourai | SupportAirAttack>

export interface Battle {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<Hp>>
  shipInfo: {
    friend: Array<ShipInfoFriend>
    enemy: Array<ShipInfoEnemy>
  }
  pursueFlag: boolean
  detection: TwoSides<Detection>
  // TODO: air base injection
  // TODO: injection kouku
  // TODO: air base attack
  lbasStages: Array<KoukuStagesForAirBase> | null
  koukuStages: KoukuStages
  supportInfo: SupportInfo | null
  openingAntiSub: Hougeki | null
  openingTorpedo: Raigeki | null
  houraiPhases: HouraiPhases
}

// TODO: night battle.
