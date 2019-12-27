/*
  kcsapi is intended to closely match the structure of game's current API.
 */

type Formation = number | string
type Engagement = number
type Detection = number
type IntFlag = 0 | 1
type Contact = number
type Airpower = number
type SupportFlag = number
type ShipIndex = number
type AttackType = number
// Damage with escort flag
type DamageE = number
type Damage = number
type CriticalFlag = number

interface KoukuPlaneInfo {
    api_f_count: number
    api_f_lostcount: number
    api_e_count: number
    api_e_lostcount: number
}

interface KoukuStage1 extends KoukuPlaneInfo {
    api_disp_seiku?: Airpower
}

type KoukuStage2 = KoukuPlaneInfo

interface KoukuStage3Enemy {
    api_erai_flag: Array<IntFlag> | null
    api_ebak_flag: Array<IntFlag>
    api_ecl_flag: Array<IntFlag> | null
    api_edam: Array<number> | null
}

interface KoukuStage3Friend {
    api_frai_flag: Array<IntFlag> | null
    api_fbak_flag: Array<IntFlag>
    api_fcl_flag: Array<IntFlag> | null
    api_fdam: Array<number> | null
}

type KoukuStage3 = KoukuStage3Friend & KoukuStage3Enemy

type KoukuStageFlags = [IntFlag, IntFlag, IntFlag]

interface Kouku {
    api_stage1: KoukuStage1 | null
    api_stage2: KoukuStage2 | null
    api_stage3: KoukuStage3 | null
    api_stage3_combined?: KoukuStage3 | null
}

interface KoukuLbas extends Kouku {
    api_base_id: number
    api_stage_flag: KoukuStageFlags
    api_squadron_plane: any
}

interface Hougeki {
    api_at_eflag: Array<IntFlag>
    api_at_list: Array<ShipIndex>
    api_at_type: Array<AttackType>
    api_df_list: Array<Array<ShipIndex>>
    api_si_list: Array<Array<number>>
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

type Raigeki = RaigekiFriend & RaigekiEnemy

type ShipParam = [number, number, number, number]

interface Battle {
    api_deck_id: number
    api_formation: [Formation, Formation, Engagement]
    api_f_nowhps: Array<number>
    api_f_maxhps: Array<number>
    api_fParam: Array<ShipParam>
    api_ship_ke: Array<number>
    api_ship_lv: Array<number>
    api_ship_ke_combined?: Array<number>
    api_ship_lv_combined?: Array<number>
    api_e_nowhps: Array<number>
    api_e_maxhps: Array<number>
    api_e_nowhps_combined?: Array<number>
    api_e_maxhps_combined?: Array<number>
    api_eSlot: Array<Array<number>>
    api_eParam: Array<ShipParam>
    api_midnight_flag: IntFlag
    api_escape_idx: any
    api_escape_idx_combined: any
    api_combat_ration: any
    api_combat_ration_combined: any
    api_search: [Detection, Detection]
    // TODO
    api_air_base_injection?: any
    api_injection_kouku?: Kouku
    api_air_base_attack: Array<KoukuLbas>
    api_stage_flag: KoukuStageFlags
    api_kouku: Kouku
    api_support_flag: SupportFlag
    api_support_info: any | null
    api_stage_flag2?: SupportFlag
    api_kouku2?: Kouku
    api_opening_taisen_flag: IntFlag
    api_opening_taisen: any | null
    api_opening_flag: IntFlag
    api_opening_attack: Raigeki | null
    api_hourai_flag: [IntFlag, IntFlag, IntFlag, IntFlag]
    api_hougeki1: Hougeki | null
    api_hougeki2: Hougeki | null
    api_hougeki3: Hougeki | null
    api_raigeki: Raigeki | null
}
