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

/*
  This type takes care of normal vs combined.
  - DayHourai is a bit special because some fields must be interpreted
    in different orders therefore we have to distinct between Normal, CTF and STF.
  - for all the other types, it is irrelevant therefore Normal vs Combined will do.
 */
export enum SideType {
  Normal,
  Combined,
  // Carrier Task Force or Transport Escort, only used for DayHourai.
  CTF,
  // Surface Task Force, only used for DayHourai.
  STF,
}
