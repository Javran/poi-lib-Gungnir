// import { } from './types'

const id = (x: Ship) => x

function getBattleState(raw: any): BattleState {
    const placeholder = { main: null, escort: null }
    return {
        ourFleets: placeholder,
        enemyFleets: placeholder,
    }
}

const testStr = 'a test string'

export {
    id,
    getBattleState,
    testStr,
}
