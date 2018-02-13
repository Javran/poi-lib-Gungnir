/*
  using tuple (fixed length Array) as I can imagine
  this being created or modified frequently

  [<nowHP, maxHP>]
 */
type HP = [number, number]

/*

  EquipId is one of the following:

  - number: must be master id, positive number
  - null: the slot is available but nothing is equipped
  - 'n/a': this slot is not available
  - to avoid confusion, value 0 and -1 should never be used when EquipId is expected

 */
type EquipId = number | null | 'n/a'

interface Ship {
  hp: HP
  // slots: Array<EquipId>;
  // slotEx: EquipId;
}

/*
  a Fleet should never be empty
 */
type Fleet = Array<Ship>

/*
  generalized fleet to unify single & combined fleet
 */
interface GFleet {
  main: Fleet | null
  escort: Fleet | null
}

interface BattleState {
  ourFleets: GFleet
  enemyFleets: GFleet
}
