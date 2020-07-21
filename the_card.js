// A 已知数字，B 已知花色，求这张牌
function theCard() {
  // 所有的牌
  const cards = {
    '♥️': ['A', 'Q', '4'],
    '♠️': ['J', '8', '4', '2', '7', '3'],
    '♣️': ['K', 'Q', '5', '4', '6'],
    '♦️': ['A', '5'],
  }
  // 所有的花色和数字
  const suits = ['a', 'b', 'c', 'd']
  const numbers = ['A', '2', '3', '4', '5', '6', '7', '8', 'J', 'Q', 'K']
  // 可能的牌
  let possibleCards = {}
  // 数字数量
  let numberObj = {}
  // 可能的花色和数字
  let possibleSuits = []
  let possibleNumbers = []
  // 不可能的花色和数字
  let impossibleNumbers = []
  let impossibleSuits = []
  // 所求结果
  let res = {
    suit: '',
    number: '',
  }

  // 求对应数字牌的数量
  function getNumberCount(cards) {
    let numberObj = {}
    for (const numbers of Object.values(cards)) {
      for (const num of numbers) {
        if (!numberObj[num]) {
          numberObj[num] = 1
        } else {
          numberObj[num]++
        }
      }
    }
    return numberObj
  }

  // 1. A: 我不知道这张牌
  // 这句话说明：这张牌的数字（A 看到的数字）有重复（如果是只出现一次的数字，A 就能确定这张牌）
  // 从而确定可能的数字

  // 求出数字数量
  numberObj = numberObj = getNumberCount(cards)
  // 求出可能的数字和不可能的数字
  for (const [num, count] of Object.entries(numberObj)) {
    if (count === 1) {
      impossibleNumbers.push(num)
    } else {
      possibleNumbers.push(num)
    }
  }
  // 求出可能的牌
  for (const [suit, numbers] of Object.entries(cards)) {
    possibleCards[suit] = []
    for (const number of numbers) {
      if (possibleNumbers.includes(number)) {
        possibleCards[suit].push(number)
      }
    }
  }

  // 2. B: 我早知道你不知道
  // 这句话说明：花色就能决定这张牌的一个特性——只知道数字无法确定这张牌
  // 也就是说，假设这张牌的花色为 'x'，花色为 'x' 的牌里每张牌的数字在所有牌里都有重复
  // 从而确定可能的花色

  // 求出不可能的花色
  for (const [suit, numbers] of Object.entries(cards)) {
    for (const num of numbers) {
      if (impossibleNumbers.includes(num)) {
        impossibleSuits.push(suit)
        break
      }
    }
  }
  // 求出可能的花色
  possibleSuits = suits.filter((suit) => impossibleSuits.indexOf(suit) === -1)
  // 求出可能的牌
  for (const suit of impossibleSuits) {
    delete possibleCards[suit]
  }

  // 3. B: 但是我也不知道
  // 这句话说明：只凭花色无法确定这张牌
  // 也就是说，排除：对应的花色只有一张牌

  for (const [suit, numbers] of Object.entries(possibleCards)) {
    if (numbers.length === 1) {
      delete possibleCards[suit]
    }
  }

  // 4. A: 我现在知道这张牌了
  // 这句话说明：此时 A 根据数字就能确定这张牌了，那这张牌数字在所有可能的牌里一定不是重复的

  // 求出可能的数字的数量
  numberObj = getNumberCount(possibleCards)
  // 求出可能的数字
  for (const numbers of Object.values(possibleCards)) {
    for (const number of numbers) {
      if (numberObj[number] > 1) {
        possibleNumbers.splice(possibleNumbers.indexOf(number), 1)
        delete numberObj[number]
      }
    }
  }
  // 求出可能的牌
  for (const [suit, numbers] of Object.entries(possibleCards)) {
    possibleCards[suit] = []
    for (const number of numbers) {
      if (possibleNumbers.includes(number)) {
        possibleCards[suit].push(number)
      }
    }
  }

  // 5. B: 我也知道了
  // 这句话说明：此时 B 根据花色能确定这张牌了
  // 也就是所有可能花色中只有一个数字的牌

  for (const [suit, numbers] of Object.entries(possibleCards)) {
    if (numbers.length === 1) {
      res = {
        suit: suit,
        number: numbers[0],
      }
    }
  }
  
  return res
}
console.log(theCard())
