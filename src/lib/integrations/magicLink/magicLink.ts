import { singleton } from 'tsyringe'
import { Magic, WalletType } from '@magic-sdk/admin'
import { getConfigs } from '@app/lib/config.validator.js'
@singleton()
export class MagicLinkService {
  magic!: Magic
  constructor() {
    this.init()
  }

  private readonly init = async () => {
    const { MAGIC_LINK_CLIENT_ID, MAGIC_LINk_SECRET_KEY } = getConfigs()
    const magic = await Magic.init(MAGIC_LINk_SECRET_KEY, {
      clientId: MAGIC_LINK_CLIENT_ID,
    })
    this.magic = magic
  }

  getIssuerId = (DIDToken: string) => {
    return this.magic.token.getIssuer(DIDToken)
  }

  getUserWallets = async (issuer: string) => {
    const metadata = await this.magic.users.getMetadataByIssuerAndWallet(issuer, WalletType.ANY)
    return metadata
  }
}
