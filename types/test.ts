import { links, toHex } from '@tradle/qr-schema';

links.getAppLink({
  path: 'abcd',
  platform: 'x'
});

toHex({
  data: 'abcd',
  schema: 'abcd'
});