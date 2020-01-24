/*
  a class for indicating unknown values that
  are not recognized but its value is not critically important.
 */
export class Unknown {
  public val: any
  // context is some optional piece of info that would be useful for debugging.
  public context: any

  constructor(val: any, context: any = null) {
    this.val = val
    this.context = context
  }

  public toString = (): string => `?${this.val}?`
}

Object.defineProperty(Unknown, 'val', { enumerable: true })
Object.defineProperty(Unknown, 'context', { enumerable: true })

// Wrapper a type so it can fallback
// to store arbitrary data in Unknown rather than throwing errors.
export type Unk<T> = T | Unknown

/*
  For information that can be organized into "friend" side
  and "enemy" side.
 */
export interface TwoSides<T> {
  friend: T,
  enemy: T,
}

export enum EngagementE {
  Parallel = 1,
  HeadOn = 2,
  TAdvantage = 3,
  TDisadvantage = 4,
}

export type Engagement = Unk<EngagementE>

export enum FormationE {
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

export type Formation = Unk<FormationE>

export type Hp = [number, number] // current and max.
