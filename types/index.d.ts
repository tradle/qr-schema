// type LinksPerPlatform = {
//   mobile: string
//   web: string
// }

import * as AppLinks from '../links';

declare const links: typeof AppLinks;
declare function toHex(input: AppLinks.QRInput): string;
export { links, toHex };
