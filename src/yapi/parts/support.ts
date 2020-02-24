import {
  Unk, Critical, DamageWithFlag,
} from './basic'

import { KoukuStagesForSupport } from './kouku'

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
