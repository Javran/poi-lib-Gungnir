import * as _ from 'lodash'

import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertIntFlag, convertHps, convertDetection,
  convertEngagement, convertFormation,
  convertShipInfoFriend, convertShipInfoEnemy,
  convertCritical, convertDamageWithFlag,
} from './basic'

import {
  convertKoukuStages,
  convertKoukuStagesForSupport,
  convertKoukuForLbas,
} from './kouku'

import { convertHougeki, convertRaigeki, convertHouraiPhases } from './hourai'

export * from './basic'
export * from './kouku'
export * from './hourai'

/*
  TODO: we have been seeing this pattern of looking at a 0/1 flag and then check if it is consistent
  with the actual field. We should probably look into how the game client itself use this piece of info:
  for example, in my previous studies, api_hourai_flag is not used at all, which makes more sense
  because it relies on a single source of truth (whether it is null), and
  I feel we can do something similar to openning antisub and torpedo.
 */
export const convertOpeningAntiSub = (flag: kcsapi.IntFlag, raw: kcsapi.Hougeki | null): yapi.Hougeki | null => {
  if (convertIntFlag(flag) && raw) {
    return convertHougeki(raw)
  }
  return null
}

export const convertOpeningTorpedo = (flag: kcsapi.IntFlag, raw: kcsapi.Raigeki | null): yapi.Raigeki | null => {
  if (convertIntFlag(flag) && raw) {
    return convertRaigeki(raw)
  }
  return null
}

export const convertSupportType = (flag: number): yapi.SupportType | null =>
  (flag === 0) ? null
    : (flag >= 1 && flag <= 4) ? (flag as yapi.SupportTypeE)
      : new yapi.Unknown(flag, 'SupportType')

// TODO: test.
export const convertSupportInfo =
  (flag: number, raw: kcsapi.SupportInfo | null): yapi.SupportInfo | null => {
    if (raw === null) {
      return null
    }
    const type = convertSupportType(flag)
    const convertShips =
      (
        shipIds: Array<number>,
        undressingFlags: Array<kcsapi.IntFlag>
      ): Array<yapi.SupportInfoShip> => (_.zipWith as any)(
        shipIds, undressingFlags,
        (rosterId: number, uFlg: kcsapi.IntFlag) => ({
          rosterId,
          undressing: convertIntFlag(uFlg),
        }))
    if (type === yapi.SupportTypeE.Shelling || type === yapi.SupportTypeE.Torpedo) {
      // should convert to SupportInfoHourai
      const rawDetail = raw.api_support_hourai
      if (rawDetail === null) {
        throw new Error(`api_support_hourai shouldn't be null.`)
      }
      const attackInfo: Array<yapi.SupportInfoHouraiDamage> = (_.zipWith as any)(
        rawDetail.api_cl_list,
        rawDetail.api_damage,
        (cl: kcsapi.CriticalFlag, dmg: kcsapi.DamageE) => ({
          critical: convertCritical(cl),
          damage: convertDamageWithFlag(dmg),
        })
      )
      return {
        type,
        deckId: rawDetail.api_deck_id,
        ships: convertShips(rawDetail.api_ship_id, rawDetail.api_undressing_flag),
        attackInfo,
      }
    }
    if (type === yapi.SupportTypeE.Airstrike || type === yapi.SupportTypeE.AntiSub) {
      const rawDetail = raw.api_support_airatack
      if (rawDetail === null) {
        throw new Error(`api_support_airatack shouldn't be null.`)
      }
      return {
        type,
        deckId: rawDetail.api_deck_id,
        ships: convertShips(rawDetail.api_ship_id, rawDetail.api_undressing_flag),
        koukuStages: convertKoukuStagesForSupport(rawDetail),
      }
    }
    return new yapi.Unknown({ flag, raw }, 'SupportInfo')
  }

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
