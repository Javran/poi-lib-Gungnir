export interface BattleDetailData {
  version: string
  desc?: string
  packet: Array<Packet>
}

export type Packet = object

export const fromPoiBattleDetail = (raw: BattleDetailData): Array<Packet> => raw.packet
