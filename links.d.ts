declare namespace links {
  interface QRInput {
    schema: string;
    data: any;
  }

  interface Query {
    [key: string]: any;
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
    unpacked?: boolean;
  }

  function getAppLink (opts: GetAppLinkOpts): string;
  // function getAppLinks: (opts: any): LinksPerPlatform
  function getChatLink (opts: any): string;
  // function getChatLinks: (opts: any): LinksPerPlatform
  function getImportDataLink (opts: any): string;
  // function getImportDataLinks (opts: any): LinksPerPlatform
  function getApplyForProductLink (opts: any): string;
  function getResourceLink (opts: GetResourceLinkOpts): string;
  // function getApplyForProductLinks (opts: any): LinksPerPlatform
  function inferSchemaAndData (opts: any): QRInput;

  function stringifyQuery(query: Query, unpacked?: boolean): string;
  function parseQueryString(query: URLSearchParams | string | Record<string, string | ReadonlyArray<string>> | Iterable<[string, string]> | ReadonlyArray<[string, string]>): any
  function parseLink(url: string | URL): URL & {
    query: any
  }
}

export = links
