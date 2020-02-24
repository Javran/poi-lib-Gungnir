import { SideType } from './base'

/*
  airbattle: always vs. enemy single, consists of only 2 kouku phases.

  - api_req_sortie/airbattle: normal vs. normal, two kouku stages.
  - api_req_combined_battle/airbattle: combined vs. single (2 kouku stages)
 */
export type GAirBattle<FS>
  =
  FS extends SideType.Normal ? 'TODO: normal air battle'
  : FS extends SideType.Combined ? 'TODO: combined air battle'
  : never
