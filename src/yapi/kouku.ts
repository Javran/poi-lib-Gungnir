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

export interface Aaci {
  source: ShipIndex,
  kind: number,
  equips: Array<number>,
}

export interface KoukuStage2 extends KoukuStagePlaneCount {
  aaci: Aaci | null,
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

export interface KoukuStages {
  planeFrom: KoukuPlaneFrom,
  stage1: KoukuStage1 | null,
  stage2: KoukuStage2 | null,
  stage3: KoukuStage3 | null,
}
