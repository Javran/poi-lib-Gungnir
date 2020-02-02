import { Unk, ShipIndex, TwoSides, DamageWithFlag, Critical } from './basic'

export type KoukuPlaneFromSide = Array<ShipIndex>
export type KoukuPlaneFrom = TwoSides<KoukuPlaneFromSide>

export interface PlaneInfo {
  total: number,
  lost: number,
}

export type KoukuStagePlaneCount = TwoSides<PlaneInfo>

export enum AirpowerE {
  AirParity = 0,
  AirSupremacy = 1,
  AirSuperiority = 2,
  AirDenial = 3,
  AirIncapability = 4,
}

export type Airpower = Unk<AirpowerE>

export type ContactPlane = TwoSides<number>

export interface KoukuStage1 extends KoukuStagePlaneCount {
  airpower: Airpower
  contactPlane: ContactPlane | null
}

// Support info only contains plane count from both sides.
export type KoukuStage1ForSupport = KoukuStagePlaneCount

export interface Aaci {
  source: ShipIndex,
  kind: number,
  equips: Array<number>,
}

export interface KoukuStage2 extends KoukuStagePlaneCount {
  aaci: Aaci | null,
}

// Support info only contains plane count from friend side.
export interface KoukuStage2ForSupport {
  friend: PlaneInfo
}

// every data of this type describes
// how a ship is taking damage in stage3
// (targeted by dive bomber / torpedo bomber, hit/miss/crit, etc.)
// this data is indexed into an Array to match with ship info.
export interface KoukuStage3Damage extends DamageWithFlag {
  raiFlag: boolean,
  bakFlag: boolean,
  critical: Critical,
}

export type KoukuStage3 = TwoSides<Array<KoukuStage3Damage>>

export interface KoukuStage3EnemyOnly {
  enemy: Array<KoukuStage3Damage>
}

export type KoukuStage3ForSupport = KoukuStage3EnemyOnly

export interface KoukuStages {
  planeFrom: KoukuPlaneFrom,
  stage1: KoukuStage1 | null,
  stage2: KoukuStage2 | null,
  stage3: KoukuStage3 | null,
}

export interface KoukuStagesForSupport {
  planeFrom: KoukuPlaneFrom,
  stage1: KoukuStage1ForSupport | null,
  stage2: KoukuStage2ForSupport | null,
  stage3: KoukuStage3ForSupport | null,
}

export type KoukuStage1ForInjection = KoukuStagePlaneCount
export type KoukuStage2ForInjection = KoukuStagePlaneCount
export type KoukuStage3ForInjection = KoukuStage3

export interface KoukuStagesForInjection {
  planeFrom: KoukuPlaneFrom,
  stage1: KoukuStage1ForInjection,
  stage2: KoukuStage2ForInjection,
  stage3: KoukuStage3ForInjection,
}

export type KoukuStage1ForAirBase = KoukuStage1
export type KoukuStage2ForAirBase = KoukuStagePlaneCount
export type KoukuStage3ForAirBase = KoukuStage3EnemyOnly

// TODO: consistent style: drop commas or not?
export interface AirBaseSquadron {
  masterId: number,
  count: number,
}

export interface KoukuStagesForAirBase {
  baseId: number,
  planeFrom: KoukuPlaneFrom,
  squadrons: Array<AirBaseSquadron>,
  stage1: KoukuStage1ForAirBase | null,
  stage2: KoukuStage2ForAirBase | null,
  stage3: KoukuStage3ForAirBase | null,
}
