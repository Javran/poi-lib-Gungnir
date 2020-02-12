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
  Unk, TwoSides, Hp, Formation, Engagement,
  Detection, Critical, DamageWithFlag,
  ShipInfoFriend, ShipInfoEnemy,
} from './basic'

import { KoukuStages, KoukuStagesForSupport, KoukuStagesForAirBase } from './kouku'
import { Hougeki, Raigeki, HouraiPhases } from './hourai'

export * from './basic'
export * from './kouku'
export * from './hourai'

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

// Common fields all types of battles are supposed to have.
/*
  TODO: here the plan is to have fine-grained interfaces,
  and let those battle types be a combination of them.
 */
export interface BattleCommon {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<Hp>>
  shipInfo: {
    friend: Array<ShipInfoFriend>
    enemy: Array<ShipInfoEnemy>
  }
  lbasStages: Array<KoukuStagesForAirBase> | null
  supportInfo: SupportInfo | null
}

export interface HasKoukuStages {
  koukuStages: KoukuStages
}

export interface Battle extends BattleCommon, HasKoukuStages {
  pursueFlag: boolean
  detection: TwoSides<Detection>
  // TODO: air base injection
  // TODO: injection kouku
  // TODO: air base attack

  openingAntiSub: Hougeki | null
  openingTorpedo: Raigeki | null
  houraiPhases: HouraiPhases
}

// TODO: night battle.
