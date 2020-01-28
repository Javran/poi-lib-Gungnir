/*
  kcsapi is intended to closely match the structure of game's current API.

  Reference:
  https://github.com/andanteyk/ElectronicObserver/blob/master/ElectronicObserver/Other/Information/apilist.txt

 */

// 1=単縦陣, 2=複縦陣, 3=輪形陣, 4=梯形陣, 5=単横陣, 6=警戒陣
// "11"-"14"=第n警戒航行序列
export type Formation = number | string

// 1=同航戦, 2=反航戦, 3=T字有利, 4=T字不利
export type Engagement = number

// 1=成功, 2=失敗?, 5=失敗
type Detection = number

export type IntFlag = 0 | 1
export type Airpower = number

// the convension here is that XXXIndex starts with 0,
// and XXXId starts with 1.
export type ShipIndex = number

export type AttackType = number

// Damage with escort flag
// escort flag is present when there is a ".1" bit
// e.g. 10.1 instead of just 10.
export type DamageE = number
type Damage = number

// 0=miss, 1=hit, 2=critical
export type CriticalFlag = number

export interface KoukuPlaneInfoFriend {
  api_f_count: number
  api_f_lostcount: number
}

export interface KoukuPlaneInfoEnemy {
  api_e_count: number
  api_e_lostcount: number
}

export type KoukuPlaneInfo = KoukuPlaneInfoFriend & KoukuPlaneInfoEnemy

export type ContactPlane = null | Array<number>

export interface KoukuStage1 extends KoukuPlaneInfo {
  api_disp_seiku: Airpower
  api_touch_plane?: ContactPlane
}

export interface Aaci {
  api_idx: number,
  api_kind: number,
  api_use_items: Array<number>, // TODO
}

export interface KoukuStage2 extends KoukuPlaneInfo {
  api_air_fire?: Aaci
}

interface KoukuStage3Enemy {
  api_erai_flag: Array<IntFlag> | null
  api_ebak_flag: Array<IntFlag> | null
  api_ecl_flag: Array<IntFlag> | null
  api_edam: Array<number> | null
}

interface KoukuStage3Friend {
  api_frai_flag: Array<IntFlag> | null
  api_fbak_flag: Array<IntFlag> | null
  api_fcl_flag: Array<IntFlag> | null
  api_fdam: Array<number> | null
}

export type KoukuStage3 = KoukuStage3Friend & KoukuStage3Enemy

// there are in total 3 stages per air battle,
// this flag is used as an indicate whether a particular stage exists
// (a non-existing one has that corresponding stage set to null)
export type KoukuStageFlags = [IntFlag, IntFlag, IntFlag]

export type KoukuPlaneFrom = Array<Array<number> | null> | null

export interface Kouku {
  api_plane_from: KoukuPlaneFrom
  api_stage1: KoukuStage1 | null
  api_stage2: KoukuStage2 | null
  api_stage3: KoukuStage3 | null
  // api_stage3_combined?: KoukuStage3 | null
}

interface KoukuLbas extends Kouku {
  api_base_id: number
  api_stage_flag: KoukuStageFlags
  api_squadron_plane: any
}

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

/*
  TODO: Kouku is slightly different that we usually expect:
  - api_stage1 won't have contact / airpower
  - api_stage2 won't have plane count from enemy side and no aaci
  - api_stage3 won't have a friend side.
  Let's see if we can capture those by type.
 */
export type KoukuStage1ForSupport = KoukuPlaneInfo
export type KoukuStage2ForSupport = KoukuPlaneInfoFriend
export type KoukuStage3ForSupport = KoukuStage3Enemy

export interface SupportAirAttack extends SupportInfoCommon {
  api_stage_flag: KoukuStageFlags
  api_plane_from: KoukuPlaneFrom
  api_stage1: KoukuStage1ForSupport | null
  api_stage2: KoukuStage2ForSupport | null
  api_stage3: KoukuStage3ForSupport | null
}

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
  api_stage_flag: KoukuStageFlags
  api_kouku: Kouku

  api_support_flag: number
  api_support_info: SupportInfo | null
  api_opening_taisen_flag: IntFlag
  api_opening_taisen: Hougeki | null // TODO
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

  api_air_base_injection?: any
  api_injection_kouku?: Kouku
  api_air_base_attack: Array<KoukuLbas>

  api_stage_flag2?: KoukuStageFlags
  api_kouku2?: Kouku
}
