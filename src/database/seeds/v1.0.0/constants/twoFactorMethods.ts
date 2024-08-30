import { Prisma, TWO_FACTOR_METHOD_TYPE } from '@prisma/client'

export const twoFactorMethods: Prisma.two_factor_methodCreateArgs['data'][] = [
  {
    type: TWO_FACTOR_METHOD_TYPE.authenticator_app,
    description: 'Use authenticator applications like Google Authenticator to scan generated QR code.',
  },
]
