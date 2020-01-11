import * as _ from 'lodash'

import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

/*
  TODO: non-critical conversion errors should fail gracefully.
  It's expected that the API changes from time to time, but it should not crash
  the whole conversion. Cases include a unknown engagement or formation etc.
 */

export const convertEngagement = (raw: kcsapi.Engagement): yapi.Unk<yapi.Engagement> => {
  if (raw >= 1 && raw <= 4) {
    return raw as yapi.Engagement
  }
  return new yapi.Unknown(raw, 'Engagement')
}

export const convertFormation = (raw: kcsapi.Formation): yapi.Unk<yapi.Formation> => {
  if (raw >= 1 && raw <= 6) {
    return raw as yapi.Formation
  }
  switch (raw) {
    case '11': return yapi.Formation.CruisingFormation1
    case '12': return yapi.Formation.CruisingFormation2
    case '13': return yapi.Formation.CruisingFormation3
    case '14': return yapi.Formation.CruisingFormation4
    default: return new yapi.Unknown(raw, 'Formation')
  }
}

export const convertHps = (rawCurHps: Array<number>, rawMaxHps: Array<number>): Array<HP> => {
  if (rawCurHps.length !== rawMaxHps.length) {
    throw new Error(`Cannot convert Hps, length mismatched: cur=${rawCurHps.length}, max=${rawMaxHps.length}.`)
  }
  return _.zip(rawCurHps, rawMaxHps) as Array<HP>
}

export const convertShipInfoCommon = ([firepower, torpedo, antiAir, armor]: kcsapi.ShipParam): yapi.ShipInfoCommon =>
  ({ attrib: { firepower, torpedo, antiAir, armor } })

export const convertShipInfoExtra = (mstId: number, level: number, equips: Array<number>): yapi.ShipInfoExtra =>
  ({ mstId, level, equips })

export const convertShipInfoFriend = convertShipInfoCommon
export const convertShipInfoEnemy =
  (xParam: kcsapi.ShipParam, mstId: number, level: number, equips: Array<number>): yapi.ShipInfoEnemy =>
    ({ ...convertShipInfoCommon(xParam), ...convertShipInfoExtra(mstId, level, equips) })

export const convertIntFlag = (v: kcsapi.IntFlag) => Boolean(v)

export const convertDetection = (v: number): yapi.Unk<yapi.Detection> => {
  switch (v) {
    case 1: return { success: true, planeReturned: true }
    case 2: return { success: true, planeReturned: false }
    case 3: return { success: false, planeReturned: false }
    case 4: return { success: false, planeReturned: true }
    case 5: return { success: true, planeReturned: null }
    case 6: return { success: false, planeReturned: null }
    default: return new yapi.Unknown(v, 'Detection')
  }
}

/*
  damage with protect flag (if there's an extra `.1`)

  main.js extracts these two piece of info using:

  - Math.floor(v)
  - v % 1 != 0

 */
export const convertDamageE = (v: kcsapi.DamageE): yapi.DamageE =>
  ({ protectFlag: v % 1 !== 0, damage: Math.floor(v) })

export const convertCritical = (v: kcsapi.CriticalFlag): yapi.Unk<yapi.Critical> => {
  switch (v) {
    case 0: return yapi.Critical.Miss
    case 1: return yapi.Critical.Hit
    case 2: return yapi.Critical.Critical
    default: return new yapi.Unknown(v, 'Critical')
  }
}

// TODO: being a bit sloppy here.
export const convertAttackType = (v: kcsapi.AttackType): yapi.AttackType =>
  (v as yapi.AttackType)

export const convertSide = (v: kcsapi.IntFlag): yapi.Side => (v as yapi.Side)

export const convertHougekiDamage =
  (
    df: kcsapi.ShipIndex,
    cl: kcsapi.CriticalFlag,
    damage: kcsapi.DamageE
  ): yapi.HougekiDamage => {
    return {
      target: df,
      critical: convertCritical(cl),
      ...convertDamageE(damage),
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
        taken: convertDamageE(dam),
        dealt: convertDamageE(ydam),
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

export const convertKoukuPlaneFrom = (raw: kcsapi.KoukuPlaneFrom): yapi.KoukuPlaneFrom => {
  const convert =
    (xs: any): Array<yapi.ShipIndex> =>
      Array.isArray(xs) ? xs.map(x => x - 1) : []
  return {
    friend: convert(_.get(raw, '0')),
    enemy: convert(_.get(raw, '1')),
  }
}

export const convertAirpower = (v: kcsapi.Airpower): yapi.Unk<yapi.Airpower> => {
  if (v >= 0 && v <= 4) {
    return v as yapi.Airpower
  } else {
    return new yapi.Unknown(v, 'Airpower')
  }
}

export const convertAaci = (raw: kcsapi.Aaci): yapi.Aaci => {
  const { api_idx: source, api_kind: kind, api_use_items: equips } = raw
  return { source, kind, equips }
}

export const convertBattle = (raw: kcsapi.Battle): yapi.Battle => {
  // IIFE for now, until do-expression becomes available.
  const [fForm, eForm, engagement] = raw.api_formation

  const enemyShipInfo = (() => {
    const l = raw.api_eParam.length
    if ([raw.api_ship_ke, raw.api_ship_lv, raw.api_eSlot].some(arr => arr.length !== l)) {
      throw new Error(`Cannot convert enemy ship info, some array lengths are mismatching.`)
    }
    return _.zipWith(raw.api_eParam, raw.api_ship_ke, raw.api_ship_lv, raw.api_eSlot, convertShipInfoEnemy)
  })()

  const detection = (() => {
    const [f, e] = raw.api_search
    return {
      friend: convertDetection(f),
      enemy: convertDetection(e),
    }
  })()

  return {
    deckId: raw.api_deck_id,
    engagement: convertEngagement(engagement),
    formation: {
      friend: convertFormation(fForm),
      enemy: convertFormation(eForm),
    },
    hps: {
      friend: convertHps(raw.api_f_nowhps, raw.api_f_maxhps),
      enemy: convertHps(raw.api_e_nowhps, raw.api_e_maxhps),
    },
    shipInfo: {
      friend: _.map(raw.api_fParam, convertShipInfoFriend),
      enemy: enemyShipInfo,
    },
    pursueFlag: convertIntFlag(raw.api_midnight_flag),
    detection,
    houraiPhases: convertHouraiPhases(
      raw.api_hourai_flag,
      raw.api_hougeki1,
      raw.api_hougeki2,
      raw.api_hougeki3,
      raw.api_raigeki
    ),
  }
}
