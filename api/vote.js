const axios = require('axios')

const vote = async (voteType, definitionId) => {
  const voteTypes = {
    up: 1,
    down: -1
  }

  const response = await axios(`http://www.slangopedia.se/rosta/?definition=${definitionId}&rosta=${voteTypes[voteType]}&tid=${Date.now()}`)
  if (response.status !== 200) throw new Error('Could not connect to Slangopedia')

  const [status] = response.data.split('|')

  const errorStatuses = {
    toomanyvotesfromip: 'Too many votes from IP Address',
    alreadyvoted: 'Already voted on definition'
  }

  if (status !== 'ok') {
    return {
      didVote: false,
      reason: errorStatuses[status]
    }
  }

  return {
    didVote: true
  }
}

module.exports = vote
