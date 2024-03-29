import { links, toHex, schema } from '@tradle/qr-schema';

links.getAppLink({
  path: 'abcd',
  platform: 'x'
});

toHex({
  data: 'abcd',
  schema: 'abcd'
});

links.parseQueryString(links.stringifyQuery({}));
links.stringifyQuery({}, true);
const query: any = links.parseLink('https://google.com').query;
schema.AddProvider.decode(Buffer.from('abcd'));
