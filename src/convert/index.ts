import * as _ from 'lodash'

import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertIntFlag, convertHps, convertDetection,
  convertEngagement, convertFormation,
  convertShipInfoFriend, convertShipInfoEnemy,
  convertKoukuStages,
  convertSupportInfo,
  convertKoukuForLbas,
  convertOpeningAntiSub, convertOpeningTorpedo,
  convertHouraiPhases,
} from './parts'

export * from './parts'

export const convertBattleCommon = (raw: kcsapi.BattleCommon): yapi.BattleCommon => {
  // IIFE for now, until do-expression becomes available.
  const [fForm, eForm, engagement] = raw.api_formation

  const enemyShipInfo = (() => {
    const l = raw.api_eParam.length
    if ([raw.api_ship_ke, raw.api_ship_lv, raw.api_eSlot].some(arr => arr.length !== l)) {
      throw new Error(`Cannot convert enemy ship info, some array lengths are mismatching.`)
    }
    return _.zipWith(raw.api_eParam, raw.api_ship_ke, raw.api_ship_lv, raw.api_eSlot, convertShipInfoEnemy)
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
  }
}

export const convertDayBattleCommon = (raw: kcsapi.DayBattleCommon): yapi.DayBattleCommon => {
  const detection = (() => {
    const [f, e] = raw.api_search
    return {
      friend: convertDetection(f),
      enemy: convertDetection(e),
    }
  })()

  return {
    ...convertBattleCommon(raw),
    pursueFlag: convertIntFlag(raw.api_midnight_flag),
    detection,
    lbasStages: raw.api_air_base_attack ? convertKoukuForLbas(raw.api_air_base_attack) : null,
    koukuStages: convertKoukuStages(raw.api_stage_flag, raw.api_kouku),
    supportInfo: convertSupportInfo(raw.api_support_flag, raw.api_support_info),
  }
}

export const convertBattle = (raw: kcsapi.Battle): yapi.Battle => {
  return {
    ...convertDayBattleCommon(raw),
    openingAntiSub: convertOpeningAntiSub(raw.api_opening_taisen_flag, raw.api_opening_taisen || null),
    openingTorpedo: convertOpeningTorpedo(raw.api_opening_flag, raw.api_opening_atack || null),
    houraiPhases: convertHouraiPhases(
      raw.api_hourai_flag,
      raw.api_hougeki1,
      raw.api_hougeki2,
      raw.api_hougeki3,
      raw.api_raigeki
    ),
  }
}

// TODO: definitely need some shorthands on use sites.
type AirBattleNormal = yapi.GBattle<yapi.BattleType.DayAir, yapi.SideType.Normal, yapi.SideType.Normal>

export const convertAirBattleNormal = (raw: kcsapi.AirBattleNormal): AirBattleNormal => {
  return {
    ...convertDayBattleCommon(raw),
    koukuStagesExtra: convertKoukuStages(raw.api_stage_flag2, raw.api_kouku2),
  }
}
