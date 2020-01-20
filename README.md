# slangopedia

> A Node.js API for slangopedia.se

<!--- [![NPM Version][npm-image]][npm-url] -->

## Install

```bash
npm install slangopedia
```

## Usage

#### Setup
```javascript
const Slangopedia = require('slangopedia')
```

#### Search
##### **.search(searchTerm, [options])**
```javascript
Slangopedia.search('yani').then(console.log)
//=> { 
//=>  definitions: [...],
//=>  word: 'yani',
//=>  url: 'http://www.slangopedia.se/ordlista/?ord=Yani'
//=> }
```
##### Options
###### **includeComments** (default: false)

#### Example of a response definition object
```javascript
{
  "definitionId": 21740,
  "content": "Uttalas ungefär ja:ni eller jæ:ni. Ordet är ett lån från turkiska som i sin tur har lånat det från arabiska. I arabiska är ordet \"yani\" en sorts konjunktion som ofta jämförs med svenskans \"asså, du vet, liksom, typ eller så att\".",
  "example": "Exempel 1.\n- Yani han tror han är smart.\n\nExempel 2.\n- Varför ska vi dit?\n- Yani det är inte för min skull.\n\nExempel 3.\n- Var är Jasmin?\n- Hon sa att hon var tvungen att gå hem.\n- Yani hon låtsas vara upptagen.",
  "author": "Dennis_1996",
  "createdAt": 1377618674000,
  "rating": {
    "upvotes": 102,
    "downvotes": 39,
    "totalVotes": 141,
    "stars": 4,
    "upvotePercentage": 72.34
  },
  "tags": [
    "yani",
    "asså",
    "typ",
    "arabiska",
    "turkiska",
    "yanii"
  ]
}
```

#### Get a random word
##### **.random()**
```javascript
Slangopedia.random()
//=> { 
//=>  definitions: [...],
//=>  word: 'Smalfet',
//=>  url: 'http://www.slangopedia.se/ordlista/?ord=Smalfet'
//=> }
```

#### Get definition comments by definitionId
##### **.comments(definitionId)**
```javascript
Slangopedia.comments(2094).then(console.log)
//=> [{
//=>   content: 'jag göra det?',
//=>   author: 'aa',
//=>   createdAt: 1383778800000
//=> }]
```

#### Vote on a definition
##### **.voteUp(definitionId)**
##### **.voteDown(definitionId)**
```javascript
Slangopedia.voteUp(2094).then(console.log)
//=> { didVote: true }

Slangopedia.voteDown(2094).then(console.log)
//=> { didVote: true }
```

#### Add a definition for a new or existing word
##### **.addDefinition(definitionRequest)**
If the request is successful, Slangopedia moderators will review the definition before publishing it.

```javascript
const definitionRequest = {
	word: 'wörd',
	content: 'The definition goes here',
	example: 'The definition example goes here',
	tags: 'tag, another, third', // minimum of 2
	author: 'Gandalf',
	city: 'Aman',
	email: 'gandalf@gandmail.com'
}

Slangopedia.addDefinition(definitionRequest).then(console.log)
//=> {
//=>	didPost: true|false,
//=>	data: {...}, // Included if post was successful
//=>	reason: 'Something went wrong on definition approval' // Included if post failed
//=> }
```
## License

MIT

[npm-image]: https://img.shields.io/npm/v/slangopedia.svg
[npm-url]: https://npmjs.org/package/live-xxx
[travis-image]: https://img.shields.io/travis/live-js/live-xxx/master.svg
[travis-url]: https://travis-ci.org/live-js/live-xxx
[coveralls-image]: https://img.shields.io/coveralls/live-js/live-xxx/master.svg
[coveralls-url]: https://coveralls.io/r/live-js/live-xxx?branch=master
