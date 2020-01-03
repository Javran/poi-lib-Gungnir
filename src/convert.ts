import * as kcsapi from './kcsapi'
import * as yapi from './yapi'

export const convertEngagement = (raw: kcsapi.Engagement): yapi.Engagement => {
  if (raw >= 1 && raw <= 4) {
    return raw as yapi.Engagement
  }
  throw new Error(`Cannot convert Engagement ${raw}.`)
}

export const convertBattle = (raw: kcsapi.Battle): yapi.Battle => {
  const [fForm, eForm, engagement] = raw.api_formation
  return {
    deck_id: raw.api_deck_id,
    engagement: convertEngagement(engagement),
    formation: { friend: yapi.Formation.LineAhead, enemy: yapi.Formation.LineAhead }, // TODO
    hps: { friend: [], enemy: [] }, // TODO
  }
}
