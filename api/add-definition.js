const axios = require('axios')
const { createFormData } = require('../utils')

const addDefinition = async data => {
  const mapData = data => {
    const keyMap = {
      word: 'ord',
      content: 'definition',
      example: 'exempel',
      tags: 'taggar',
      author: 'namn',
      city: 'ort',
      email: 'epost'
    }

    return Object.entries(data).reduce((acc, [key, value]) => {
      const mappedKey = keyMap[key] || key

      return {
        ...acc,
        [mappedKey]: value
      }
    }, {})
  }

  const formData = createFormData(mapData(data))

  const submitResponse = await axios.post('http://www.slangopedia.se/laggtill/index.asp?action=laggtill', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  if (!submitResponse.request.path.startsWith('/godkann/?kod=')) {
    return {
      didPost: false,
      reason: 'Make sure you filled in all the required fields, and that you have at least 2 tags'
    }
  }

  const [_, code, definitionId] = submitResponse.request.path.match(/godkann\/\?kod=([0-9].*)x([0-9].*)/) // eslint-disable-line no-unused-vars
  const acceptResponse = await axios(`http://www.slangopedia.se/godkann/?kod=${code}x${definitionId}&godkann=ja`)
  const didPost = acceptResponse.data.includes('ndringar (Granskas av redakt')

  return {
    didPost,
    ...(didPost && {
      data: {
        definitionId,
        code,
        ...data
      }
    }),
    ...(!didPost && {
      reason: 'Something went wrong on definition approval'
    })
  }
}

module.exports = addDefinition
