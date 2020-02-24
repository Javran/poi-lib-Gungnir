import {
  BattleType, SideType,
} from './base'
import { GAirBattle } from './g-air-battle'

export * from './base'
export * from './g-air-battle'

/*
  ld_airbattle: always vs. enemy single, one kouku phase.

  - api_req_sortie/ld_airbattle: normal vs. normal, long distance.
  - api_req_combined_battle/ld_airbattle: combined vs. normal, long distance.
 */
type GLongDistAirBattle<FS>
  = FS extends SideType.Normal ? 'TODO: ld_airbattle for normal'
  : FS extends SideType.Combined ? 'TODO: ld_airbattle for combined'
  : never

/*
  ld_shooting: this one seems to have only "single or combined" distinct,
  and enemy fleet is always single.

  - api_req_sortie/ld_shooting: ?
  - api_req_combined_battle/ld_shooting: ?
 */
type GLongDistShootingBattle<FS>
  = FS extends SideType.Normal ? 'TODO: ld_shooting for normal'
  : FS extends SideType.Combined ? 'TODO: ld_shooting for combined'
  : never

/*
  proceeding to night battle:

  - api_req_combined_battle/ec_midnight_battle: combined vs combined, night.
  - api_req_battle_midnight/battle: normal vs. normal, night battle.
  - api_req_combined_battle/midnight_battle: combined vs single, night battle.

  openning with night battle:
  - /kcsapi/api_req_combined_battle/sp_midnight: openning with night battle, combined vs. single.
  - /kcsapi/api_req_battle_midnight/sp_midnight: openning with night battle, single vs. single.

  - /kcsapi/api_req_sortie/night_to_day: proceed to day, single vs. single (I doubt if we have any sample for this).
  - /kcsapi/api_req_combined_battle/ec_night_to_day: proceed to day, single vs. combined

  TODO: typing is not quite right here. we'll need to get both FriendSide and EnemySide involved.

 */
type GNightBattle<FS>
  = FS extends SideType.Normal ? 'TODO: night battle for normal'
  : FS extends SideType.Combined ? 'TODO: night battle for combined'
  : never

type GNightToDayBattle<FS>
  = FS extends SideType.Normal ? 'TODO: night to day battle for normal'
  : FS extends SideType.Combined ? 'TODO: night to day battle for combined'
  : never

type GHouraiBattle<FS, ES>
  = FS extends SideType.Normal ? (
    ES extends SideType.Normal ? 'TODO: 6 vs 6'
    : ES extends SideType.Combined ? 'TODO: 6 vs 12'
    : never
  ) : FS extends SideType.CTF ? (
    ES extends SideType.Normal ? 'TODO: CTF vs 6'
    : ES extends SideType.Combined ? 'TODO: CTF vs 12'
    : never
  ) : FS extends SideType.STF ? (
    ES extends SideType.Normal ? 'TODO: STF vs 6'
    : ES extends SideType.Combined ? 'TODO: STF vs 12'
    : never
  ) : never

/* aux type to limit enemy side to Normal or Combined */
type LimitEnemySide<ES, ThenType>
  = ES extends SideType.Normal ? ThenType
  : ES extends SideType.Combined ? ThenType
  : never

/*
  GBattle merges all types of battles into one, parameterized by various things.

  FS for "Friend side", ES for "Enemy side".
 */
export type GBattle<BT, FS, ES>
  = BT extends BattleType.DayHourai ? GHouraiBattle<FS, ES>
  : BT extends BattleType.DayAir ? LimitEnemySide<ES, GAirBattle<FS>>
  : BT extends BattleType.DayLongDistAir ? LimitEnemySide<ES, GLongDistAirBattle<FS>>
  : BT extends BattleType.DayLongDistShooting ? LimitEnemySide<ES, GLongDistShootingBattle<FS>>
  : BT extends BattleType.Night ? LimitEnemySide<ES, GNightBattle<FS>>
  : BT extends BattleType.NightToDay ? LimitEnemySide<ES, GNightToDayBattle<FS>>
  : never
