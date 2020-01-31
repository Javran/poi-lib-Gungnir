/*
  kcsapi is intended to closely match the structure of game's current API.

  Reference:
  https://github.com/andanteyk/ElectronicObserver/blob/master/ElectronicObserver/Other/Information/apilist.txt

 */
import {
  IntFlag, CriticalFlag,
  ShipIndex, AttackType,
  Formation, Engagement, Detection,
  Damage, DamageE,
} from './basic'

import {
  KoukuStageFlags,
  Kouku, KoukuLbas, KoukuForSupport,
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

export interface Battle {
  api_deck_id: number
  api_formation: [Formation, Formation, Engagement]

  // "_f_" for friendly units (ourselves)
  api_f_nowhps: Array<number>
  api_f_maxhps: Array<number>

  api_fParam: Array<ShipParam>

  // enemy ship ids.
  api_ship_ke: Array<number>
  // enemy ship levels.
  api_ship_lv: Array<number>

  api_ship_ke_combined?: Array<number>
  api_ship_lv_combined?: Array<number>

  api_e_nowhps: Array<number>
  api_e_maxhps: Array<number>

  // those two only exists if the enemy fleet is combined.
  api_e_nowhps_combined?: Array<number>
  api_e_maxhps_combined?: Array<number>

  api_eSlot: Array<Array<number>>
  api_eParam: Array<ShipParam>

  api_midnight_flag: IntFlag
  api_search: [Detection, Detection]
  api_air_base_injection?: any // TODO
  api_injection_kouku?: Kouku // TODO
  api_air_base_attack?: Array<KoukuLbas> // TODO

  api_stage_flag: KoukuStageFlags
  api_kouku: Kouku

  api_support_flag: number
  api_support_info: SupportInfo | null
  api_opening_taisen_flag: IntFlag
  api_opening_taisen: Hougeki | null
  api_opening_flag: IntFlag
  // No I'm not misspelling "atack", the API has been keeping it this way.
  api_opening_atack: Raigeki | null

  api_hourai_flag: [IntFlag, IntFlag, IntFlag, IntFlag]
  // TODO:
  // the following 4 fields are kind of context-sensitive to battle types:
  // STF and CTF has a different ordering of those
  // for now I believe it is important to **not** rely on the packet structure itself,
  // but on name of that API.
  api_hougeki1: Hougeki | null
  api_hougeki2: Hougeki | null
  api_hougeki3: Hougeki | null
  api_raigeki: Raigeki | null

  // TODO
  api_escape_idx?: any
  api_escape_idx_combined?: any
  api_combat_ration: any
  api_combat_ration_combined: any

  api_stage_flag2?: KoukuStageFlags
  api_kouku2?: Kouku
}
