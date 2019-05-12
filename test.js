const pathToRegexp = require('./index')

let paramNames = []
let regexp = pathToRegexp('/user/:id', paramNames, { end: false })
console.log(paramNames) // [ { name: 'id' } ]

let realPath = '/user/66'
let [url, ...values] = regexp.exec(realPath)
console.log(values) // [ '66' ]

paramNames = paramNames.map(item => item.name)
let params = {}
for (let i = 0; i < paramNames.length; i++) {
  params[paramNames[i]] = values[i]
}
console.log(params) // { id: '66' }
