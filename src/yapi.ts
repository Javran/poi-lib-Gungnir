/*
  yapi is the target representation that gungnir operates on.
  (in case you wonder, Y is for Yggdrasil)
 */

/*
  For information that can be organized into "friend" side
  and "enemy" side.
 */
export interface TwoSides<T> {
  friend: T,
  enemy: T,
}

export enum Engagement {
  Parallel = 1,
  HeadOn = 2,
  TAdvantage = 3,
  TDisadvantage = 4,
}

export enum Formation {
  LineAhead = 1,
  DoubleLine = 2,
  Diamond = 3,
  Echelon = 4,
  LineAbreast = 5,
  Vanguard = 6,
  CruisingFormation1 = 11,
  CruisingFormation2 = 12,
  CruisingFormation3 = 13,
  CruisingFormation4 = 14,
}

export type HP = [number, number] // current and max.

export interface Battle {
  deckId: number
  engagement: Engagement
  formation: TwoSides<Formation>
  hps: TwoSides<Array<HP>>
}
