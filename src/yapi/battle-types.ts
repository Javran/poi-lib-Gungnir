/*
  This module is for exploring ideas about supporting all battle types.
 */

/*
  TODO: Listing out API paths that we need to support:
  (following is arranged as they appear in main.js.)

  - normal battles:

    normal vs (normal or combined)
    + /kcsapi/api_req_sortie/battle: normal vs. normal.
    + /kcsapi/api_req_combined_battle/ec_battle: normal vs combined

  - combined battles:

    + /kcsapi/api_req_combined_battle/battle: CTF vs. single
    + /kcsapi/api_req_combined_battle/each_battle: CTF vs. combined
    + /kcsapi/api_req_combined_battle/battle_water: STF vs single.
    + /kcsapi/api_req_combined_battle/each_battle_water: STF vs. combined

  - airbattle: always vs. enemy single, consists of only 2 kouku phases.

    + /kcsapi/api_req_sortie/airbattle: normal vs. normal, two kouku stages.
    + /kcsapi/api_req_combined_battle/airbattle: combined vs. single (2 kouku stages)

  - ld_airbattle: always vs. enemy single, one kouku phase.

    + /kcsapi/api_req_sortie/ld_airbattle: normal vs. normal, long distance.
    + /kcsapi/api_req_combined_battle/ld_airbattle: combined vs. normal, long distance.

  - openning with night battle:
    + /kcsapi/api_req_combined_battle/sp_midnight: openning with night battle, combined vs. single.
    + /kcsapi/api_req_battle_midnight/sp_midnight: openning with night battle, single vs. single.

    + /kcsapi/api_req_sortie/night_to_day: proceed to day, single vs. single (I doubt if we have any sample for this).
    + /kcsapi/api_req_combined_battle/ec_night_to_day: proceed to day, single vs. combined

  - ld_shooting: this one seems to have only "single or combined" distinct,
    and enemy fleet is always single.

    + /kcsapi/api_req_sortie/ld_shooting: ?
    + /kcsapi/api_req_combined_battle/ld_shooting: ?

  - proceeding to night battle:

    + /kcsapi/api_req_combined_battle/ec_midnight_battle: combined vs combined, night.
    + /kcsapi/api_req_battle_midnight/battle: normal vs. normal, night battle.
    + /kcsapi/api_req_combined_battle/midnight_battle: combined vs single, night battle.

  - practice:

    + /kcsapi/api_req_practice/battle: normal vs normal, pvp.
    + /kcsapi/api_req_practice/midnight_battle: normal vs. normal, night, pvp.

  From main.js:
  0=非戦闘セル, 1=通常戦闘, 2=夜戦, 3=夜昼戦, 4=航空戦, 5=敵連合艦隊戦, 6=長距離空襲戦, 7=夜昼戦(対連合艦隊), 8=レーダー射撃

  - isNightStart: 2 or 3 or 7
  - isNightToDayStart: 3 or 7
  - isAirBattle: 4
  - isVS12: 5 or 7
  - isAirRaid: 6
  - isLongRangeFires: 8

  Note:
  - it seems TE can be treated as CTF.
  - naming patterns:
    + "ec_" for normal vs. abyssal combined ("ec" probably means "enemy combined")
    + "each_" when two sides are both combined.
    + "_water" are for STFs
  - day battle and night battle can be processed separately.
  - for day battles, as long as there's no hourai phase involved, most of the functions / types can be shared.
    (use of a different API path might be due to having to apply hourai phases differently)

 */

/*
  This type determines what field does a specific type of battle have,
  ignoring "_combined" fields.
 */
export enum BattleType {
  DayHourai,
  DayAir,
  DayLongDistAir,
  DayLongDistShooting,
  Night,
  NightToDay,
}

export enum SideType {
  Normal,
  Combined,
  // Carrier Task Force or Transport Escort, only used for DayHourai.
  CTF,
  // Surface Task Force, only used for DayHourai.
  STF,
}

type GAirBattle<FS>
  = FS extends SideType.Normal ? 'TODO: normal air battle'
  : FS extends SideType.Combined ? 'TODO: combined air battle'
  : never

type GLongDistAirBattle<FS>
  = FS extends SideType.Normal ? 'TODO: ld_airbattle for normal'
  : FS extends SideType.Combined ? 'TODO: ld_airbattle for combined'
  : never

type GLongDistShootingBattle<FS>
  = FS extends SideType.Normal ? 'TODO: ld_shooting for normal'
  : FS extends SideType.Combined ? 'TODO: ld_shooting for combined'
  : never

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
 */
export type GBattle<BT, FS, ES>
  = BT extends BattleType.DayHourai ? GHouraiBattle<FS, ES>
  : BT extends BattleType.DayAir ? LimitEnemySide<ES, GAirBattle<FS>>
  : BT extends BattleType.DayLongDistAir ? LimitEnemySide<ES, GLongDistAirBattle<FS>>
  : BT extends BattleType.DayLongDistShooting ? LimitEnemySide<ES, GLongDistShootingBattle<FS>>
  : BT extends BattleType.Night ? LimitEnemySide<ES, GNightBattle<FS>>
  : BT extends BattleType.NightToDay ? LimitEnemySide<ES, GNightToDayBattle<FS>>
  : never
