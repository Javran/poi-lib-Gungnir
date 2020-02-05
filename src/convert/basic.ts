/*
  This module contains things that only involves conversion of simple data types.
 */

import * as _ from 'lodash'

import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

export const convertEngagement = (raw: kcsapi.Engagement): yapi.Unk<yapi.Engagement> => {
  if (raw >= 1 && raw <= 4) {
    return raw as yapi.EngagementE
  }
  return new yapi.Unknown(raw, 'Engagement')
}

export const convertFormation = (raw: kcsapi.Formation): yapi.Unk<yapi.Formation> => {
  if (raw >= 1 && raw <= 6) {
    return raw as yapi.Formation
  }
  switch (raw) {
    case '11': return yapi.FormationE.CruisingFormation1
    case '12': return yapi.FormationE.CruisingFormation2
    case '13': return yapi.FormationE.CruisingFormation3
    case '14': return yapi.FormationE.CruisingFormation4
    default: return new yapi.Unknown(raw, 'Formation')
  }
}

export const convertHps = (rawCurHps: Array<number>, rawMaxHps: Array<number>): Array<yapi.Hp> => {
  if (rawCurHps.length !== rawMaxHps.length) {
    throw new Error(`Cannot convert Hps, length mismatched: cur=${rawCurHps.length}, max=${rawMaxHps.length}.`)
  }
  return _.zip(rawCurHps, rawMaxHps) as Array<yapi.Hp>
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
    default: return new yapi.Unknown(v, 'Detection')
  }
}

/*
  damage with protect flag (if there's an extra `.1`)

  main.js extracts these two piece of info using:

  - Math.floor(v)
  - v % 1 != 0

 */
export const convertDamageWithFlag = (v: kcsapi.DamageE): yapi.DamageWithFlag =>
  ({ protectFlag: v % 1 !== 0, damage: Math.floor(v) })

export const convertCritical = (v: kcsapi.CriticalFlag): yapi.Critical => {
  if (yapi.CriticalE[v] != null) {
    return v
  } else {
    return new yapi.Unknown(v, 'Critical')
  }
}

// TODO: avoid conditions and use the following technique if possible:
// https://stackoverflow.com/a/55258341/315302
export const convertAttackType = (v: kcsapi.AttackType): yapi.AttackType => {
  if (yapi.AttackTypeE[v] != null) {
    return v
  } else {
    return new yapi.Unknown(v, 'AttackType')
  }
}

export const convertSide = (v: kcsapi.IntFlag): yapi.Side => (v as yapi.Side)
