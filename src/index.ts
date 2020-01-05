import { Battle } from './kcsapi'

export interface BattleDetailData {
  version: string
  desc?: string
  packet: Packet
}

export type Packet = Array<Battle>

export const fromPoiBattleDetail = (raw: BattleDetailData): Packet => raw.packet
