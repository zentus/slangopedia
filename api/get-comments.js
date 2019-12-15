const axios = require('axios')
const { innerText, toUnixTimestamp, createDom } = require('../utils')

const getComments = async definitionId => {
  const response = await axios(`http://mobil.slangopedia.se/kommentarer/?id=${definitionId}`)

  if (response.status !== 200) throw new Error('Could not connect to Slangopedia')

  const { getElementsArray } = createDom(response.data)

  const commentElements = getElementsArray('td.comment')

  const contents = commentElements
    .map(td => td.textContent.split('Skrivet av')[0].trim())

  const authors = getElementsArray('td.comment .av b')
    .map(innerText)

  const timestamps = getElementsArray('td.comment .av')
    .map(td => toUnixTimestamp(td.childNodes[2].nodeValue.trim()))

  const comments = contents
    .reduce((acc, content, i) => {
      return [
        ...acc, {
          content,
          author: authors[i],
          createdAt: timestamps[i]
        }
      ]
    }, [])

  return comments
}

module.exports = getComments
