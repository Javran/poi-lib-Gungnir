/*
  kcsapi is intended to closely match the structure of game's current API.

  Reference:
  https://github.com/andanteyk/ElectronicObserver/blob/master/ElectronicObserver/Other/Information/apilist.txt

 */
import {
  IntFlag,
  Formation, Engagement, Detection,
} from './basic'

import {
  KoukuStageFlags,
  Kouku,
  KoukuForInjection, KoukuForAirBase,
} from './kouku'

import {
  ShipParam, SupportInfo, Hougeki, Raigeki,
} from './parts'

export * from './basic'
export * from './kouku'
export * from './parts'

/*
  Structure that are shared between day and night battles.
 */
export interface BattleCommon {
  api_deck_id: number
  api_formation: [Formation, Formation, Engagement]

  // "_f_" for friendly units (ourselves)
  api_f_nowhps: Array<number>
  api_f_maxhps: Array<number>

  api_fParam: Array<ShipParam>

  api_eSlot: Array<Array<number>>
  api_eParam: Array<ShipParam>

  // enemy ship ids.
  api_ship_ke: Array<number>
  // enemy ship levels.
  api_ship_lv: Array<number>

  api_e_nowhps: Array<number>
  api_e_maxhps: Array<number>
}

/*
  Structure that are shared among all day time battles.
 */
export interface DayBattleCommon extends BattleCommon {
  api_midnight_flag: IntFlag
  api_search: [Detection, Detection]
  api_air_base_injection?: any // TODO
  api_injection_kouku?: KoukuForInjection
  api_air_base_attack?: Array<KoukuForAirBase>

  api_support_flag: number
  api_support_info: SupportInfo | null
  api_stage_flag: KoukuStageFlags
  api_kouku: Kouku
}

export interface Battle extends DayBattleCommon {
  api_ship_ke_combined?: Array<number>
  api_ship_lv_combined?: Array<number>
  // those two only exists if the enemy fleet is combined.
  api_e_nowhps_combined?: Array<number>
  api_e_maxhps_combined?: Array<number>

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

export interface AirBattleNormal extends DayBattleCommon {
  api_stage_flag2: KoukuStageFlags
  api_kouku2: Kouku
}

export type LongDistAirBattleNormal = DayBattleCommon
