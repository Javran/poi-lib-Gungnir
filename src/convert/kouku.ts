import * as _ from 'lodash'

import * as kcsapi from '../kcsapi'
import * as yapi from '../yapi'

import {
  convertIntFlag, convertCritical, convertDamageWithFlag,
} from './basic'

export const convertKoukuPlaneFrom = (raw: kcsapi.KoukuPlaneFrom): yapi.KoukuPlaneFrom => {
  const convert =
    (xs: any): Array<yapi.ShipIndex> =>
      Array.isArray(xs) ? xs.map(x => x - 1) : []
  return {
    friend: convert(_.get(raw, '0')),
    enemy: convert(_.get(raw, '1')),
  }
}

export const convertAirpower = (v: kcsapi.Airpower): yapi.Airpower => {
  if (v >= 0 && v <= 4) {
    return v as yapi.Airpower
  } else {
    return new yapi.Unknown(v, 'Airpower')
  }
}

export const convertKoukuStagePlaneCount = (raw: kcsapi.KoukuPlaneInfo): yapi.KoukuStagePlaneCount => {
  const {
    api_f_count: fTotal, api_f_lostcount: fLost,
    api_e_count: eTotal, api_e_lostcount: eLost,
  } = raw
  return {
    friend: { total: fTotal, lost: fLost },
    enemy: { total: eTotal, lost: eLost },
  }
}

export const convertContactPlane = (raw?: kcsapi.ContactPlane): yapi.ContactPlane => {
  if (raw) {
    const convert = (ind: number) => _.get(raw, ind) || -1
    return { friend: convert(0), enemy: convert(1) }
  } else {
    return { friend: -1, enemy: -1 }
  }
}

export const convertKoukuStage1 =
  (raw: kcsapi.KoukuStage1): yapi.KoukuStage1 => ({
    ...convertKoukuStagePlaneCount(raw),
    airpower: convertAirpower(raw.api_disp_seiku),
    contactPlane: convertContactPlane(raw.api_touch_plane),
  })

export const convertAaci = (raw: kcsapi.Aaci): yapi.Aaci => {
  const { api_idx: source, api_kind: kind, api_use_items: equips } = raw
  return { source, kind, equips }
}

export const convertKoukuStage2 =
  (raw: kcsapi.KoukuStage2): yapi.KoukuStage2 => ({
    ...convertKoukuStagePlaneCount(raw),
    aaci: raw.api_air_fire ? convertAaci(raw.api_air_fire) : null,
  })

export const convertKoukuStage3Damage =
  (
    raiFlag: kcsapi.IntFlag | null | undefined,
    bakFlag: kcsapi.IntFlag | null | undefined,
    clFlag: kcsapi.CriticalFlag,
    dam: kcsapi.DamageE
  ): yapi.KoukuStage3Damage => {
    const convert = (v: kcsapi.IntFlag | null | undefined) =>
      typeof v === 'number' && convertIntFlag(v)
    return {
      raiFlag: convert(raiFlag),
      bakFlag: convert(bakFlag),
      critical: convertCritical(clFlag),
      ...convertDamageWithFlag(dam),
    }
  }

export const convertKoukuStage3 =
  (raw: kcsapi.KoukuStage3): yapi.KoukuStage3 => ({
    friend:
      (_.zipWith as any)(
        raw.api_frai_flag || [],
        raw.api_fbak_flag || [],
        raw.api_fcl_flag || [],
        raw.api_fdam || [],
        convertKoukuStage3Damage
      ),
    enemy:
      (_.zipWith as any)(
        raw.api_erai_flag || [],
        raw.api_ebak_flag || [],
        raw.api_ecl_flag || [],
        raw.api_edam || [],
        convertKoukuStage3Damage),
  })

export const convertKoukuStages =
  ([f1, f2, f3]: kcsapi.KoukuStageFlags, raw: kcsapi.Kouku): yapi.KoukuStages => {
    const ret: yapi.KoukuStages = {
      planeFrom: convertKoukuPlaneFrom(raw.api_plane_from),
      stage1: null, stage2: null, stage3: null,
    }
    if (f1) {
      if (raw.api_stage1 === null) {
        throw new Error(`Cannnot convert stage1: null`)
      }
      ret.stage1 = convertKoukuStage1(raw.api_stage1)
    }
    if (f2) {
      if (raw.api_stage2 === null) {
        throw new Error(`Cannnot convert stage2: null`)
      }
      ret.stage2 = convertKoukuStage2(raw.api_stage2)
    }
    if (f3) {
      if (raw.api_stage3 === null) {
        throw new Error(`Cannnot convert stage3: null`)
      }
      ret.stage3 = convertKoukuStage3(raw.api_stage3)
    }
    return ret
  }
