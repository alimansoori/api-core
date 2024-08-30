import { logger } from '@app/lib/logger.js'
import safe from 'safe-regex'

/**
 * Checks if a given string matches a regular expression.
 * @param key - The key associated with the regular expression.
 * @param regex - The regular expression to match against.
 * @returns A boolean indicating whether the string matches the regular expression.
 *
 * @author Ali Mansoori
 */
export const regexChecker = (key: string, regex: RegExp): boolean => {
  const isSafe = safe(regex)
  if (!isSafe) {
    logger.error(new Error(`Unsafe regex detected: ${key}: ${regex}`))
  }
  return isSafe
}
