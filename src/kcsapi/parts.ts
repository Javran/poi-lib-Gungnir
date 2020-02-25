import {
  IntFlag, CriticalFlag,
  ShipIndex, AttackType,
  Damage, DamageE,
} from './basic'

import {
  KoukuForSupport,
} from './kouku'

export * from './basic'
export * from './kouku'

export type HougekiSlotitems = Array<number | string> | null

export interface Hougeki {
  // Note: all those top-level arrays are of the same length.
  api_at_eflag: Array<IntFlag>
  api_at_list: Array<ShipIndex>
  api_at_type: Array<AttackType>
  api_df_list: Array<Array<ShipIndex>>
  api_si_list: Array<HougekiSlotitems>
  api_cl_list: Array<Array<CriticalFlag>>
  api_damage: Array<Array<DamageE>>
}

type RaiIndex = ShipIndex | -1

interface RaigekiFriend {
  api_frai: Array<RaiIndex>
  api_fcl: Array<CriticalFlag>
  api_fdam: Array<Damage>
  api_fydam: Array<Damage>
}

interface RaigekiEnemy {
  api_erai: Array<RaiIndex>
  api_ecl: Array<CriticalFlag>
  api_edam: Array<Damage>
  api_eydam: Array<Damage>
}

export type Raigeki = RaigekiFriend & RaigekiEnemy

// [<火力>, <雷装>, <対空>, <装甲>]
export type ShipParam = [number, number, number, number]

export interface SupportInfoCommon {
  api_deck_id: number
  api_ship_id: Array<number>
  api_undressing_flag: Array<IntFlag>
}

export type SupportAirAttack = SupportInfoCommon & KoukuForSupport

export interface SupportHourai extends SupportInfoCommon {
  api_cl_list: Array<number>
  api_damage: Array<number>
}

export interface SupportInfo {
  // NOTE: "airatack" is not a misspell.
  api_support_airatack: SupportAirAttack | null
  api_support_hourai: SupportHourai | null
}
