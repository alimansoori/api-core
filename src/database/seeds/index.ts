import { PrismaClient } from '@prisma/client'
import { readdirSync } from 'fs'
import semver from 'semver'
import { GENERAL_CONFIG_KEY } from '../../shared-models/index.js'
import { ISeedUpItem } from '../../interfaces/prisma/seedUpItem.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { logger } from '@app/lib/logger.js'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export class SeedManager {
  private prisma: PrismaClient
  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  private async getSeedVersion() {
    const seed = await this.prisma.general_config.findFirst({ where: { key: 'seed_version' } })
    if (!seed?.value) return undefined
    return seed?.value
  }

  // read dirs inside the seed directory and import obj dynamically
  private async getSeedsInDirectory(): Promise<ISeedUpItem[]> {
    const availableSeedVersions: string[] = readdirSync(__dirname, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .reduce((res: string[], i) => {
        const { name } = i
        if (!name.startsWith('v')) return res
        res.push(name.substring(1, name.length))
        return res
      }, [])

    const sortedSeeds: ISeedUpItem[] = []

    // sort seeds based on their version
    for (const version of semver.sort(availableSeedVersions)) {
      const seedPath = './' + 'v' + version + '/index.js'
      const seedFile = await import(seedPath)
      sortedSeeds.push({ version, up: seedFile?.default?.up })
    }

    return sortedSeeds
  }

  public async run() {
    const currentVersion = await this.getSeedVersion()
    const seeds = await this.getSeedsInDirectory()

    for (const seed of seeds) {
      if (!currentVersion || semver.gt(seed.version, currentVersion)) {
        await seed.up(this.prisma)
      }

      await this.prisma.general_config.update({
        where: { key: GENERAL_CONFIG_KEY.seed_version },
        data: { value: seed.version },
      })
    }
  }
}
