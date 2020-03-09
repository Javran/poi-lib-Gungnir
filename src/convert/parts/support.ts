import * as _ from 'lodash'

import * as kcsapi from '@g/kcsapi'
import * as yapi from '@g/yapi'

import {
  convertIntFlag, convertCritical,
  convertDamageWithFlag,
} from './basic'

import { convertKoukuStagesForSupport } from './kouku'

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
