import * as _ from 'lodash'

import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

/*
  TODO: non-critical conversion errors should fail gracefully.
  It's expected that the API changes from time to time, but it should not crash
  the whole conversion. Cases include a unknown engagement or formation etc.
 */

export const convertEngagement = (raw: kcsapi.Engagement): yapi.Engagement => {
  if (raw >= 1 && raw <= 4) {
    return raw as yapi.Engagement
  }
  throw new Error(`Cannot convert Engagement ${raw}.`)
}

export const convertFormation = (raw: kcsapi.Formation): yapi.Formation => {
  if (raw >= 1 && raw <= 6) {
    return raw as yapi.Formation
  }
  switch (raw) {
    case '11': return yapi.Formation.CruisingFormation1
    case '12': return yapi.Formation.CruisingFormation2
    case '13': return yapi.Formation.CruisingFormation3
    case '14': return yapi.Formation.CruisingFormation4
    default: throw new Error(`Cannot convert Formation ${raw}.`)
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

export const convertDetection = (v: number): yapi.Detection => {
  switch (v) {
    case 1: return { success: true, planeReturned: true }
    case 2: return { success: true, planeReturned: false }
    case 3: return { success: false, planeReturned: false }
    case 4: return { success: false, planeReturned: true }
    case 5: return { success: true, planeReturned: null }
    case 6: return { success: false, planeReturned: null }
    default: throw new Error(`Cannot convert Detection: ${v}.`)
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

export const convertCritical = (v: kcsapi.CriticalFlag) => {
  switch (v) {
    case 0: return yapi.Critical.Miss
    case 1: return yapi.Critical.Hit
    case 2: return yapi.Critical.Critical
  }
}

export const convertHougeki = (raw: kcsapi.Hougeki): yapi.Hougeki => {
  const convertTurn = (
    atEflag: kcsapi.IntFlag,
    atList: kcsapi.ShipIndex,
    atType: kcsapi.AttackType,
    dfList: Array<kcsapi.ShipIndex>,
    siList: Array<number>,
    clList: Array<kcsapi.CriticalFlag>,
    damage: Array<kcsapi.DamageE>,
  ) => 'TODO'

  const turns = (_.zipWith as any)(
    raw.api_at_eflag,
    raw.api_at_list,
    raw.api_at_type,
    raw.api_df_list,
    raw.api_si_list,
    raw.api_cl_list,
    raw.api_damage,
    convertTurn,
  )
  return { type: 'Hougeki', turns }
}

export const convertRaigeki =
  // TODO
  _ignored => ({ type: 'Raigeki' })

// NOTE: this ordering is only true for normal battles
// combined fleets are more involved.
export const convertHouraiPhases =
  (
    [f0, f1, f2, f3]: Array<kcsapi.IntFlag>,
    hougeki1: kcsapi.Hougeki | null,
    hougeki2: kcsapi.Hougeki | null,
    hougeki3: kcsapi.Hougeki | null,
    raigeki: kcsapi.Raigeki | null,
  ): yapi.HouraiPhases => {
    const ret: yapi.HouraiPhases = []
    // TODO: there should be some way to figure out key ordering
    // even if JSON is intentionally ignoring key orders.
    if (f0) {
      if (hougeki1 === null) {
        throw new Error(`Cannnot convert hougeki1: null`)
      }
      ret.push(convertHougeki(hougeki1))
    }
    // TODO: remaining hougeki2,3 and raigeki.
    return ret
  }

export const convertBattle = (raw: kcsapi.Battle): yapi.Battle => {
  const [fForm, eForm, engagement] = raw.api_formation
  // IIFE for now, until do-expression becomes available.
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
      raw.api_raigeki,
    ),
  }
}
