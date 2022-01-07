// type LinksPerPlatform = {
//   mobile: string
//   web: string
// }

import * as AppLinks from '../links';
import * as Schema from '../schema';

declare const links: typeof AppLinks;
declare const schema: typeof Schema;
declare function toHex(input: AppLinks.QRInput): string;
export { links, toHex, schema };
