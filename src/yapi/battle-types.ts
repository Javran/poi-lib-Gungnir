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
