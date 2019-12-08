const { JSDOM } = require('jsdom')
const urlencode = require('urlencode')

const innerText = element => element.textContent
const innerHTML = element => element.innerHTML
const replaceBrTags = innerHTML => innerHTML.replace(/\<br\>/gi, '\n')
const capitalize = string => string[0].toUpperCase() + string.slice(1)
const toLowerCase = string => string.toLowerCase()
const toUnixTimestamp = string => new Date(string).getTime() / 1000
const toNumber = string => parseInt(string, 10)
const isAlphaNumeric = char => Boolean(char.match(/[a-zA-Z0-9]/))

const encode = string => {
  return string
    .split('')
    .map(char => {
        if (isAlphaNumeric(char)) return char
        if (char === ' ') return '+'
				if (char === '.') return '.'
        return urlencode(char, 'iso-8859-1')
    })
    .join('')
}

const getRating = (upvotes, downvotes, options = {}) => {
	const totalVotes = upvotes + downvotes
	if (options.percentage) return parseFloat((upvotes / totalVotes * 100).toFixed(2))
	return Math.round(upvotes / totalVotes * 10 / 2)
}

const createFormData = data => {
	return Object.entries(data).reduce((acc, [key, value]) => {
		return acc + `${key}=${encode(value)}&`
	}, '').slice(0, -1)
}

const createDom = html => {
	const dom = new JSDOM(html)
	const window = dom.window
	const document = window.document
	const getElementsArray = (selector, element) => Array.from((element || document).querySelectorAll(selector))

	return { dom, window, document, getElementsArray }
}

module.exports = {
	innerText,
	innerHTML,
	replaceBrTags,
	capitalize,
	toLowerCase,
	toUnixTimestamp,
	toNumber,
	isAlphaNumeric,
	encode,
	getRating,
	createFormData,
	createDom
}
