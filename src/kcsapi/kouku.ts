import {
  Airpower, IntFlag,
} from './basic'

/*
  TODO:

  This module is meant for exporting.

  We might try to parameterize to get the type looks like `Kouku<T>`,
  where T can be an enum of Battle | Support | Injection | Airbase, etc. if this is possible.

  And this module will be further break down into non-user-facing APIs like
  `KoukuForSupport`, which is exactly the same as Kouku<Support>, but the user of the kouku module
  do not need to be aware of that.
 */

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
  api_idx: number
  api_kind: number
  api_use_items: Array<number> // TODO
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

export type KoukuStage1ForSupport = KoukuPlaneInfo
export type KoukuStage2ForSupport = KoukuPlaneInfoFriend
export type KoukuStage3ForSupport = KoukuStage3Enemy

export interface KoukuForSupport {
  api_stage_flag: KoukuStageFlags
  api_plane_from: KoukuPlaneFrom
  api_stage1: KoukuStage1ForSupport | null
  api_stage2: KoukuStage2ForSupport | null
  api_stage3: KoukuStage3ForSupport | null
}

export type KoukuStage1ForInjection = KoukuPlaneInfo
export type KoukuStage2ForInjection = KoukuPlaneInfo
export type KoukuStage3ForInjection = KoukuStage3

export interface KoukuForInjection {
  api_plane_from: KoukuPlaneFrom
  api_stage1: KoukuStage1ForInjection
  api_stage2: KoukuStage2ForInjection
  api_stage3: KoukuStage3ForInjection
}

export type KoukuStage1ForAirBase = KoukuStage1
export type KoukuStage2ForAirBase = KoukuPlaneInfo
export type KoukuStage3ForAirBase = KoukuStage3Enemy

export interface AirBaseSquadron {
  api_mst_id: number
  api_count: number
}

export interface KoukuForAirBase {
  api_base_id: number
  api_stage_flag: KoukuStageFlags
  api_plane_from: KoukuPlaneFrom
  api_squadron_plane: Array<AirBaseSquadron>
  api_stage1: KoukuStage1ForAirBase
  api_stage2: KoukuStage2ForAirBase
  api_stage3: KoukuStage3ForAirBase
}
