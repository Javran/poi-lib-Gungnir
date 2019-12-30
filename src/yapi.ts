/*
  yapi is the target representation that gungnir operates on.
  (in case you wonder, Y is for Yggdrasil)
 */

export enum Engagement {
  Parallel = 1,
  Headon = 2,
  TAdvantage = 3,
  TDisadvantage = 4,
}

export interface Battle {
  deck_id: number
  engagement: Engagement
}
