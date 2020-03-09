/*
  This module deals with shelling attacks (hougeki) and torpedo attacks (raigeki).
 */
import * as _ from 'lodash'

import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertCritical, convertDamageWithFlag,
  convertSide, convertAttackType,
} from './basic'

export const convertHougekiDamage =
  (
    df: kcsapi.ShipIndex,
    cl: kcsapi.CriticalFlag,
    damage: kcsapi.DamageE
  ): yapi.HougekiDamage => {
    return {
      target: df,
      critical: convertCritical(cl),
      ...convertDamageWithFlag(damage),
    }
  }

export const convertHougekiSlotitems = (raw: kcsapi.HougekiSlotitems): yapi.HougekiSlotitems => {
  if (raw === null || raw.length === 0) {
    return null
  }
  return raw.map(x => typeof x === 'string' ? parseInt(x, 10) : x)
}

export const convertHougekiTurn =
  (
    atEflag: kcsapi.IntFlag,
    atList: kcsapi.ShipIndex,
    atType: kcsapi.AttackType,
    dfList: Array<kcsapi.ShipIndex>,
    si: kcsapi.HougekiSlotitems,
    clList: Array<kcsapi.CriticalFlag>,
    damage: Array<kcsapi.DamageE>
  ): yapi.HougekiTurn => {
    return {
      source: {
        side: convertSide(atEflag),
        index: atList,
      },
      attackType: convertAttackType(atType),
      slotitems: convertHougekiSlotitems(si),
      damages: (_.zipWith as any)(dfList, clList, damage, convertHougekiDamage),
    }
  }

export const convertHougeki = (raw: kcsapi.Hougeki): yapi.Hougeki => {
  const turns = (_.zipWith as any)(
    raw.api_at_eflag,
    raw.api_at_list,
    raw.api_at_type,
    raw.api_df_list,
    raw.api_si_list,
    raw.api_cl_list,
    raw.api_damage,
    convertHougekiTurn
  )
  return { type: 'Hougeki', turns }
}

export const convertRaigekiTurn =
  (
    rai: kcsapi.ShipIndex,
    cl: kcsapi.CriticalFlag,
    dam: kcsapi.DamageE,
    ydam: kcsapi.DamageE
  ): yapi.RaigekiTurn => {
    return {
      target: rai,
      critical: convertCritical(cl),
      damage: {
        taken: convertDamageWithFlag(dam),
        dealt: convertDamageWithFlag(ydam),
      },
    }
  }

export const convertRaigeki = (raw: kcsapi.Raigeki): yapi.Raigeki => {
  return {
    type: 'Raigeki',
    friend:
      (_.zipWith as any)(
        raw.api_frai,
        raw.api_fcl,
        raw.api_fdam,
        raw.api_fydam,
        convertRaigekiTurn
      ),
    enemy:
      (_.zipWith as any)(
        raw.api_erai,
        raw.api_ecl,
        raw.api_edam,
        raw.api_eydam,
        convertRaigekiTurn
      ),
  }
}

// NOTE: this ordering is only true for normal battles
// combined fleets are more involved.
// instead of using the unguaranteed ordering,
// we should use other clues to figoure out the type
// thus the ordering of these 4 phases instead of guessing the ordering.
export const convertHouraiPhases =
  (
    [f0, f1, f2, f3]: Array<kcsapi.IntFlag>,
    hougeki1: kcsapi.Hougeki | null,
    hougeki2: kcsapi.Hougeki | null,
    hougeki3: kcsapi.Hougeki | null,
    raigeki: kcsapi.Raigeki | null
  ): yapi.HouraiPhases => {
    const ret: yapi.HouraiPhases = []
    // this looks stupid, anything better?
    if (f0) {
      if (hougeki1 === null) {
        throw new Error(`Cannnot convert hougeki1: null`)
      }
      ret.push(convertHougeki(hougeki1))
    }
    if (f1) {
      if (hougeki2 === null) {
        throw new Error(`Cannnot convert hougeki2: null`)
      }
      ret.push(convertHougeki(hougeki2))
    }
    if (f2) {
      if (hougeki3 === null) {
        throw new Error(`Cannnot convert hougeki3: null`)
      }
      ret.push(convertHougeki(hougeki3))
    }
    if (f3) {
      if (raigeki === null) {
        throw new Error(`Cannnot convert raigeki: null`)
      }
      ret.push(convertRaigeki(raigeki))
    }
    return ret
  }
