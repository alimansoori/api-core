const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
import { randomBytes } from 'crypto'
import { customAlphabet } from 'nanoid'

export function generateRandomNumber() {
  return parseFloat((parseInt(randomBytes(4).toString('hex'), 16) * 10e-11).toFixed(11))
}

export function generateRandomString(length = 31) {
  return customAlphabet(characters, length)()
}
