const deepCopy = value => (
  JSON.parse(JSON.stringify(value))
)

class PlayersRelationship {
  constructor(players) {
    this.players = players
  }

  sortByAmount({ amount: aAmount }, { amount: bAmount }) {
    if (aAmount > bAmount) return 1
    if (aAmount < bAmount) return -1
    return 0
  }

  // 按照 amount 划分出赢家/输家
  classifyPlayers() {
    this.winners = []
    this.losers = []
    this.players.forEach(player => {
      const { amount } = player
      if (amount >= 0) this.winners.push({ ...player })
      else this.losers.push({ ...player })
    })
    this.winners.sort(this.sortByAmount)
    this.losers.sort(this.sortByAmount).reverse()
    // 深拷贝 players 避免修改赢/输家 amount 值存在的问题
    this.players = deepCopy(this.winners.concat(this.losers))
  }

  addPartner(id, newPartner) {
    const current = this.players.find(player => player.id === id)
    const { partner = [] } = current
    partner.push(newPartner)
    current.partner = partner
  }


  /**
   * 判断输赢 amount 数据之和的余数
   * 1. 余数为正：赢家赢了多个输家，当前赢家的 partner 有多个输家
   * 2. 余数为负：输家输给了多个赢家，当前输家的 partner 有多个赢家
   * @param {Object} winner
   * @param {Object} loser
   * @memberof PlayersRelationship
   */
  judgeRemainder(winner, loser) {
    // 剩余筹码
    const remainder = winner.amount + loser.amount
    // 余数为正：赢家赢了多个输家(当前赢家的 partner 不只一个输家)
    if (remainder > 0) {
      this.addPartner(winner.id, {
        id: loser.id,
        name: loser.name,
        amount: -loser.amount
      })
      this.addPartner(loser.id, {
        id: winner.id,
        name: winner.name,
        amount: loser.amount
      })
      // 放回赢家数组 凑其他输家
      winner.amount = remainder
      this.winners.push(winner)
    } else {
      this.addPartner(winner.id, {
        id: loser.id,
        name: loser.name,
        amount: winner.amount
      })
      this.addPartner(loser.id, {
        id: winner.id,
        name: winner.name,
        amount: -winner.amount
      })
      if (remainder !== 0) {
        // 输家输给了多个赢家
        // 放回输家数组 凑其他赢家
        loser.amount = remainder
        this.losers.push(loser)
      }
    }
  }

  /**
   * 凑玩家 amount 数
   * 赢多了/输多了这种分不均的情况只记录给了多少筹码
   * @memberof PlayersRelationship
   */
  markUpAmount() {
    // 取赢家
    const winner = this.winners.pop()
    if (winner.amount !== 0) {
      // 取输家
      const loser = this.losers.pop()
      this.judgeRemainder(winner, loser)
    }
    if (this.winners.length && this.losers.length) {
      return this.markUpAmount()
    }
  }

  generateRelationships() {
    this.classifyPlayers()
    this.markUpAmount()
    return this.players
  }
}

module.exports = PlayersRelationship
