/*
  Shelling (hougeki) and torpedo (raigeki) related fields.
 */
import {
  Unk, TwoSides, ShipIndex,
  Side, Critical, AttackType, DamageWithFlag,
} from './basic'

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
