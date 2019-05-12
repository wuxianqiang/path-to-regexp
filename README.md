# path-to-regexp

这个库在很多地方都使用到，所以自己编写了一个方法，简单的根据路径返回正则，如果你不想安装原始的模块，那么复制下面代码，就可以直接使用了。

```js
const pathToRegexp = (path, paramNames=[], {end=false}) => {
  path = path
    .concat(end ? '' : '/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
      slash = slash || '';
      paramNames.push({name: key});
      return ''
        + (optional ? '' : slash)
        + '(?:'
        + (optional ? slash : '')
        + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
        + (optional || '')
        + (star ? '(/*)?' : '');
    })
    .replace(/([\/.])/g, '\\$1')
    .replace(/\*/g, '(.*)');
  return new RegExp('^' + path + '$')
}

module.exports = pathToRegexp
```

 代码不是很长，原始的模块核心原理就在这里了，包括Koa，React，Vue，中的路径都会使用到这个模块进行匹配。使用起来也和原始的模块类似，但是减少了很多不必要的参数。

 ```js
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
 ```
