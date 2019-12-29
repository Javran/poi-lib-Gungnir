import { Battle } from './kcsapi'

export interface BattleDetailData {
  version: string
  desc?: string
  packet: Array<Packet>
}

export type Packet = Array<Battle>

export const fromPoiBattleDetail = (raw: BattleDetailData): Array<Packet> => raw.packet
