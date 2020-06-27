const sortByAmount = ({ amount: aAmount }, { amount: bAmount }) => {
  if (aAmount > bAmount) return 1
  if (aAmount < bAmount) return -1
  return 0
}

const deepCopy = value => (
  JSON.parse(JSON.stringify(value))
)

// 按照 amount 划分出赢家/输家
const classifyPlayers = players => {
  const winners = []
  const losers = []
  players.forEach(player => {
    const { amount } = player
    if (amount >= 0) winners.push({ ...player })
    else losers.push({ ...player })
  })
  winners.sort(sortByAmount)
  losers.sort(sortByAmount).reverse()
  // 深拷贝一份 players 避免修改赢/输家 amount 值存在的问题
  const newPlayers = deepCopy(winners.concat(losers))
  return { winners, losers, players: newPlayers }
}

const generateRelationship = partners => {
  const { winners, losers, players } = classifyPlayers(partners)

  // 添加 partner 属性
  const addPartnerProp = (id, partner) => {
    players.forEach(player => {
      if (player.id === id) player.partner = partner
    })
  }

  // 赢家赢了哪些输家
  let winnerPartner = []
  // 输家输给了哪些赢家
  let loserPartner = []

  // 取赢家进行凑数 输家可能有没给出的，不处理
  while (winners.length) {
    const winner = winners.pop()
    const {
      id: winnerId,
      name: winnerName,
      amount: winnerAmount
    } = winner

    if (winnerAmount === 0) {
      addPartnerProp(winnerId, [])
      continue
    }
    // 输家已经凑完 还有多余赢家
    if (!losers.length) {
      addPartnerProp(winnerId, winnerPartner)
      winnerPartner = []
      continue
    }

    const loser = losers.pop()
    const {
      id: loserId,
      name: loserName,
      amount: loserAmount
    } = loser

    const remainder = winnerAmount + loserAmount
    // 余数为正：赢家赢了多个输家
    if (remainder > 0) {
      winnerPartner.push({
        id: loserId,
        name: loserName,
        amount: -loserAmount
      })
      // 放回赢家数组 凑其他输家
      winner.amount = remainder
      winners.push(winner)

      // 当前赢家就是当前输家的唯一 partner
      loserPartner.push({
        id: winnerId,
        name: winnerName,
        amount: loserAmount
      })
      addPartnerProp(loserId, loserPartner)
      loserPartner = []
    } else if (remainder === 0) {
      winnerPartner.push({
        id: loserId,
        name: loserName,
        amount: winnerAmount
      })
      loserPartner.push({
        id: winnerId,
        name: winnerName,
        amount: -winnerAmount
      })
      addPartnerProp(winnerId, winnerPartner)
      addPartnerProp(loserId, loserPartner)
      winnerPartner = []
      loserPartner = []
    } else {
      // 输家输给了多个赢家
      loserPartner.push({
        id: winnerId,
        name: winnerName,
        amount: -winnerAmount
      })
      // 放回输家数组 凑其他赢家
      loser.amount = remainder
      losers.push(loser)

      winnerPartner.push({
        id: loserId,
        name: loserName,
        amount: winnerAmount
      })
      addPartnerProp(winnerId, winnerPartner)
      winnerPartner = []
    }
  }

  // 如果输家还存在没凑齐的筹码
  if (loserPartner.length) {
    const loser = losers.pop()
    const { id } = loser
    addPartnerProp(id, loserPartner)
  }

  return players
}

module.exports = generateRelationship