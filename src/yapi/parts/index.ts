/*
  yapi is the target representation that gungnir operates on.
  (in case you wonder, Y is for Yggdrasil)

  Naming convensions:

  - postfix "E" (e.g. FormationE) for enum types representing known API values.
  - postfix "Inl" (e.g. DetectionInl) for non-enum types representing known API values
  - Foo could be a wrapper type of FooE or FooInl, with the possibility to have a unknown value.
    i.e. "type Foo = FooE | Unknown" or "type Foo = FooInl | Unknown"
  - all cap abbrs should only keep the first character in upper case.
    (AACI => Aaci)

 */

import {
  TwoSides, Hp, Formation, Engagement, Detection,
  ShipInfoFriend, ShipInfoEnemy,
} from './basic'
import { KoukuStages, KoukuStagesForAirBase } from './kouku'
import { SupportInfo } from './support'
import { Hougeki, Raigeki, HouraiPhases } from './hourai'

export * from './basic'
export * from './kouku'
export * from './support'
export * from './hourai'

// Common fields all types of battles are supposed to have.
/*
  TODO: here the plan is to have fine-grained interfaces,
  and let those battle types be a combination of them.
 */
export interface BattleCommon {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<Hp>>
  shipInfo: {
    friend: Array<ShipInfoFriend>
    enemy: Array<ShipInfoEnemy>
  }
}

export interface DayBattleCommon extends BattleCommon {
  pursueFlag: boolean
  detection: TwoSides<Detection>
  lbasStages: Array<KoukuStagesForAirBase> | null
  supportInfo: SupportInfo | null
  // TODO: persumably, all day battle could support (excluding ld_shooting perhaps)
  // - api_air_base_injection
  // - api_air_base_attack
  // - api_injection_kouku
  koukuStages: KoukuStages
}

export interface Battle extends DayBattleCommon {
  openingAntiSub: Hougeki | null
  openingTorpedo: Raigeki | null
  houraiPhases: HouraiPhases
}

// TODO: night battle.
