// code snippet that allows querying battle records
(() => {
  const {_} = window
  const battles = getExt().indexes.filter(b => b.time_ >= 1510898400000)
  const ps = battles.map(async bMeta => {
    const battle = await AppData.loadBattle(bMeta.time_, false)
    if (battle.packet.some(p => !_.isEmpty(p['api_injection_kouku'])))
      console.log(battle)
  })

  Promise.all(ps).then(() => console.log('done'))
})()