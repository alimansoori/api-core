/**
 * Imports necessary modules and functions.
 * @author Ali Mansoori
 */
import { getConfigs } from '@app/lib/config.validator.js'
import { logger } from '@app/lib/logger.js'
import { checkRegExs } from '@app/utility/helpers/index.js'

/**
 * Logs an error message.
 * @param {Error} err - The error to log.
 * @param {string} msg - The message to log with the error.
 */
const handleError = (err: Error, msg: string) => {
  logger.error(err, { msg })
}

/**
 * Runs the application after performing necessary checks and operations.
 * It runs mock data, checks regular expressions, and seeds storage if the SEED_MINIO configuration is set.
 * @async
 * @function
 * @returns {Promise} A promise that resolves when the application has been run.
 */
export const postApplicationRun = async () => {
  try {
  } catch (err: any) {
    // Explicitly type the 'err' parameter as 'Error'
    handleError(err, 'error:: mockData')
  }

  checkRegExs()

  const { SEED_MINIO } = getConfigs()
}