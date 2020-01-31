// 1=単縦陣, 2=複縦陣, 3=輪形陣, 4=梯形陣, 5=単横陣, 6=警戒陣
// "11"-"14"=第n警戒航行序列
export type Formation = number | string

// 1=同航戦, 2=反航戦, 3=T字有利, 4=T字不利
export type Engagement = number

// 1=成功, 2=失敗?, 5=失敗
export type Detection = number

export type IntFlag = 0 | 1
export type Airpower = number

// the convension here is that XXXIndex starts with 0,
// and XXXId starts with 1.
export type ShipIndex = number

export type AttackType = number

// Damage with escort flag
// escort flag is present when there is a ".1" bit
// e.g. 10.1 instead of just 10.
export type DamageE = number
export type Damage = number

// 0=miss, 1=hit, 2=critical
export type CriticalFlag = number
