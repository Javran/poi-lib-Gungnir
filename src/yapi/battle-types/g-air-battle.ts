import { SideType } from './base'
import { DayBattleCommon, KoukuStages } from '@g/yapi/parts'

/*
  extra fields:
  - api_stage_flag2
  - api_kouku2
 */
interface AirBattleNormal extends DayBattleCommon {
  koukuStagesExtra: KoukuStages
}

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
