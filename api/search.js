const axios = require('axios')
const {
	innerText,
	innerHTML,
	replaceBrTags,
	stripTags,
	capitalize,
	toLowerCase,
	toUnixTimestamp,
	toNumber,
	encode,
	getRating,
	createDom
} = require('../utils')

const search = async (searchTerm, options = {}) => {
	if ((!searchTerm || typeof searchTerm !== 'string') && !options.random) return false
	searchTerm = searchTerm && searchTerm.trim()

	const response = await axios(options.random ? 'http://mobil.slangopedia.se/mobil/slumpa/' : `http://mobil.slangopedia.se/mobil/ordlista/?ord=${searchTerm}`)
	if (response.status !== 200) throw new Error('Could not connect to Slangopedia')

	const { document, getElementsArray } = createDom(response.data)

	const definitionWords = getElementsArray('.defcontainer h1')
		.map(innerText)
		.map(capitalize)

	if (!definitionWords[0]) return false

	const contents = getElementsArray('.defcontainer .definition')
		.map(innerText)
		.map(capitalize)

	const examples = getElementsArray('.defcontainer .example')
		.map(innerHTML)
		.map(replaceBrTags)
		.map(stripTags)
		.map(capitalize)

	const tags = getElementsArray('.defcontainer .tags')
		.map(tagsContainer => getElementsArray('a', tagsContainer)
			.map(innerText)
			.map(toLowerCase)
		)

	const upvotes = getElementsArray('.defcontainer span:nth-child(3)')
		.map(innerText)
		.map(toNumber)

	const downvotes = getElementsArray('.defcontainer span:nth-child(5)')
		.map(innerText)
		.map(toNumber)

	const authors = getElementsArray('.defcontainer .av i')
		.map(innerText)

	const timestamps = getElementsArray('.defcontainer .av span')
		.map(span => toUnixTimestamp(`${span.textContent} ${span.title}`))

	const definitionIds = getElementsArray('.defcontainer span:nth-child(3)')
		.map(span => parseInt(span.id.replace('upvotes', '')))

	const finalDefinitions = definitionWords.reduce(async (accPromise, word, i) => {
		const acc = await accPromise

		return [
			...acc, {
				definitionId: definitionIds[i],
				content: contents[i],
				example: examples[i],
				author: authors[i],
				createdAt: timestamps[i],
				rating: {
					upvotes: upvotes[i],
					downvotes: downvotes[i],
					totalVotes: upvotes[i] + downvotes[i],
					stars: getRating(upvotes[i], downvotes[i]),
					upvotePercentage: getRating(upvotes[i], downvotes[i], {percentage: true})
				},
				tags: tags[i],
				...(options.includeComments && {
					comments: await getComments(definitionIds[i])
				})
			}
		]
	}, Promise.resolve([]))

	return {
		word: definitionWords[0],
		definitions: await finalDefinitions,
		url:`http://www.slangopedia.se/ordlista/?ord=${encode(definitionWords[0])}`
	}
}

module.exports = search
