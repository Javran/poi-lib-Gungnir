import { SideType } from './base'
import { DayBattleCommon } from '@g/yapi/parts'

type LongDistAirBattle = DayBattleCommon

/*
  ld_airbattle: always vs. enemy single, one kouku phase.

  - api_req_sortie/ld_airbattle: normal vs. normal, long distance.
  - api_req_combined_battle/ld_airbattle: combined vs. normal, long distance.
 */
export type GLongDistAirBattle<FS>
  = FS extends SideType.Normal ? LongDistAirBattle
  : FS extends SideType.Combined ? 'TODO: ld_airbattle for combined'
  : never
