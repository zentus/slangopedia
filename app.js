const search = require('./api/search')
const getComments = require('./api/get-comments')
const vote = require('./api/vote')
const addDefinition = require('./api/add-definition')

const Slangopedia = {
  search,
  random: async () => Slangopedia.search(false, { random: true }),
  comments: getComments,
  voteUp: async definitionId => vote('up', definitionId),
  voteDown: async definitionId => vote('down', definitionId),
  addDefinition
}

module.exports = Slangopedia
