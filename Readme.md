# @tradle/qr-schema

Data parser and creator for the creation of deep links for mycloud applications.

## Usage

```js
const { links: { getAppLink, parseLink } } = require('.')

const link = getAppLink({
  platform: 'mobile',
  path: 'chat',
  query: { foo: 'bar' },
  baseUrl: 'https://link.tradle.io',
  provider: 'abc',
  host: 'https://some.tradle.server',
})

console.log(link)
console.log(parseLink(link))
```

## License

MIT
