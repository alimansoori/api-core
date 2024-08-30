import { authenticator } from 'otplib'

import QRcode from 'qrcode'

export const generateQRcode = async (email: string, projectName: string) => {
  const secret = authenticator.generateSecret()
  const otp = authenticator.keyuri(email, projectName, secret)

  return { QRcode: await QRcode.toDataURL(otp), secret }
}

export const validateCode = async (token: string, secret: string) => {
  return authenticator.verify({
    secret,
    token,
  })
}
