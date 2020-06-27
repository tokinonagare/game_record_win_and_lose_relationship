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
  return [winners, losers, newPlayers]
}

// 修改玩家 partner 属性
const modifyPartner = (id, newPartner, players) => {
  const current = players.find(player => player.id === id)
  const { partner = [] } = current
  partner.push(newPartner)
  current.partner = partner
}

/**
 * 凑玩家 amount 数
 * 赢多了/输多了 分不均的情况只记录给了多少筹码
 * 
 * @param {Array} winners
 * @param {Array} losers
 * @param {Array} players
 */
const markUpAmount = (winners, losers, players) => {
  // 取赢家
  const winner = winners.pop()
  const {
    id: winnerId,
    name: winnerName,
    amount: winnerAmount
  } = winner
  if (winnerAmount === 0) {
    modifyPartner(id, [], players)
  }
  // 取输家
  const loser = losers.pop()
  const {
    id: loserId,
    name: loserName,
    amount: loserAmount
  } = loser
  // 剩余筹码
  const remainder = winnerAmount + loserAmount
  // 余数为正：赢家赢了多个输家(当前赢家的 partner 不只一个输家)
  if (remainder > 0) {
    modifyPartner(winnerId, {
      id: loserId,
      name: loserName,
      amount: -loserAmount
    }, players)
    modifyPartner(loserId, {
      id: winnerId,
      name: winnerName,
      amount: loserAmount
    }, players)
    // 放回赢家数组 凑其他输家
    winner.amount = remainder
    winners.push(winner)
  } else {
    modifyPartner(winnerId, {
      id: loserId,
      name: loserName,
      amount: winnerAmount
    }, players)
    modifyPartner(loserId, {
      id: winnerId,
      name: winnerName,
      amount: -winnerAmount
    }, players)
    if (remainder !== 0) {
      // 输家输给了多个赢家
      // 放回输家数组 凑其他赢家
      loser.amount = remainder
      losers.push(loser)
    }
  }
  if (winners.length && losers.length) {
    return markUpAmount(winners, losers, players)
  }
  return players
}

const generateRelationship = partners => {
  return markUpAmount(...classifyPlayers(partners))
}

module.exports = generateRelationship
