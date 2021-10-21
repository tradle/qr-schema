// type LinksPerPlatform = {
//   mobile: string
//   web: string
// }

export interface QRInput {
  schema: string;
  data: any;
}

interface GetResourceLinkOpts {
  platform: string;
  baseUrl?: string;
  type: string;
  permalink?: string;
  link?: string;
}

interface GetAppLinkOpts {
  platform: string;
  baseUrl?: string;
  path: string;
  query?: any;
}

export interface AppLinks {
  getAppLink: (opts: GetAppLinkOpts) => string;
  // getAppLinks: (opts: any) => LinksPerPlatform
  getChatLink: (opts: any) => string;
  // getChatLinks: (opts: any) => LinksPerPlatform
  getImportDataLink: (opts: any) => string;
  // getImportDataLinks: (opts: any) => LinksPerPlatform
  getApplyForProductLink: (opts: any) => string;
  getResourceLink: (opts: GetResourceLinkOpts) => string;
  // getApplyForProductLinks: (opts: any) => LinksPerPlatform
  inferSchemaAndData: (opts: any) => QRInput;
}

declare const links: AppLinks;
declare function toHex(input: QRInput): string;
export { links, toHex };
