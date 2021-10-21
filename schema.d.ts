/* eslint-disable @typescript-eslint/array-type */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/naming-convention */
import { Buffer } from 'buffer'
interface Codec <T> {
  buffer: true
  encodingLength: (input: T) => number
  encode: (input: T, buffer?: Buffer, offset?: number) => Buffer
  decode: (input: Buffer, offset?: number, end?: number) => T
}
declare namespace schema {
  namespace def {
    interface ImportData {
      provider: Buffer
      dataHash: Buffer
      host?: string
    }
    interface Pair {
      key: string
      url: string
    }
    interface ProductAuthorization {
      contextId: string
      product: string
      firstName: string
    }
    interface AddProvider {
      host: string
      provider: Buffer
    }
    interface ApplyForProduct {
      host: string
      provider: Buffer
      product: string
      contextId?: Buffer
    }
    interface IdentityStub {
      permalink: Buffer
      link: Buffer
    }
    interface Profile {
      permalink: Buffer
      link: Buffer
      firstName: string
      lastName?: string
    }
    interface OrgProfile {
      permalink: Buffer
      link: Buffer
      orgPermalink: Buffer
      orgLink: Buffer
      name: string
    }
  }
  const ImportData: Codec<def.ImportData>
  const Pair: Codec<def.Pair>
  const ProductAuthorization: Codec<def.ProductAuthorization>
  const AddProvider: Codec<def.AddProvider>
  const ApplyForProduct: Codec<def.ApplyForProduct>
  const IdentityStub: Codec<def.IdentityStub>
  const Profile: Codec<def.Profile>
  const OrgProfile: Codec<def.OrgProfile>
}
export = schema
