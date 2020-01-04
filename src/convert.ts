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

export const convertBattle = (raw: kcsapi.Battle): yapi.Battle => {
  const [fForm, eForm, engagement] = raw.api_formation
  return {
    deck_id: raw.api_deck_id,
    engagement: convertEngagement(engagement),
    formation: { friend: convertFormation(fForm), enemy: convertFormation(eForm) },
    hps: { friend: [], enemy: [] }, // TODO
  }
}
