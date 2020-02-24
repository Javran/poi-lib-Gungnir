import { SideType } from './base'

/*
  fields:
  - api_deck_id
  - api_formation
  - api_f_nowhps
  - api_f_maxhps
  - api_fParam
  - api_ship_ke
  - api_ship_lv
  - api_e_nowhps
  - api_e_maxhps
  - api_eSlot
  - api_eParam
  - api_midnight_flag
  - api_search
  - api_air_base_injection (presumably)
  - api_air_base_attack (presumably)
  - api_injection_kouku (presumably)
  - api_stage_flag
  - api_kouku
  - api_support_flag
  - api_support_info
  - api_stage_flag2
  - api_kouku2
 */
interface AirBattleNormal { } // TODO

/*
  airbattle: always vs. enemy single, consists of only 2 kouku phases.

  - api_req_sortie/airbattle: normal vs. normal, two kouku stages.
  - api_req_combined_battle/airbattle: combined vs. single (2 kouku stages)
 */
export type GAirBattle<FS>
  =
  FS extends SideType.Normal ? AirBattleNormal
  : FS extends SideType.Combined ? 'TODO: combined air battle'
  : never
