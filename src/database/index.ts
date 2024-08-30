import { PrismaClient } from '@prisma/client'
import * as ioredis from 'ioredis'
import { singleton } from 'tsyringe'
import mongoDB from 'mongodb'
import { getConfigs } from '@app/lib/config.validator.js'
import { isDevelopment } from '@app/utility/helpers/index.js'
import { logger } from '@app/lib/logger.js'
import { generateError } from '@app/core/error/errorGenerator.js'
import { ROCKETCHAT_COLLECTIONS } from '@app/interfaces/index.js'
import { ChromaClient } from 'chromadb'

@singleton()
export default class Database {
  private prisma!: PrismaClient
  private redis!: ioredis.Redis
  private redisConfig!: ioredis.RedisOptions

  private mongo!: mongoDB.Db
  private chroma!: ChromaClient
  mongoCollections!: string[]
  constructor() {
    this.initiateDatabases()
  }

  private initiateDatabases = async () => {
    const { REDIS_NO_CLUSTER, MONGO_SERVER_URL, CHAT_DATABASE_NAME } = getConfigs()
    //* * Prisma Initiate
    const prisma = new PrismaClient({
      errorFormat: 'pretty',
      // log: isDevelopment() ? [ { emit: 'stdout', level: 'query' } ] : [],
    })
    // prisma.$on('query', (e) => {
    //   console.log('Query: ' + e.query);
    //   console.log('Params: ' + e.params);
    //   console.log('Duration: ' + e.duration + 'ms');
    // });
    this.prisma = prisma
    const chroma = new ChromaClient()
    this.chroma = chroma

    //* * Redis Initiate
    const { REDIS_NO_CLUSTER_HOST, REDIS_NO_CLUSTER_PORT, REDIS_NO_CLUSTER_PASSWORD, REDIS_NO_CLUSTER_DATABASE_INDEX } =
      getConfigs()

    const redisConfig: ioredis.RedisOptions = {
      port: REDIS_NO_CLUSTER_PORT,
      host: REDIS_NO_CLUSTER_HOST,
      connectTimeout: 10000,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      db: REDIS_NO_CLUSTER_DATABASE_INDEX,
    }
    if (REDIS_NO_CLUSTER_PASSWORD) redisConfig.password = REDIS_NO_CLUSTER_PASSWORD

    if (isDevelopment() && !REDIS_NO_CLUSTER) {
      throw generateError([{ message: 'Redis Cluster is not implemented' }], 'INTERNAL_SERVER_ERROR')
      // let redisClusterConfig: ClusterNode[] = [];

      // if (REDIS_USE_EXTERNAL_PORT) {
      //   redisClusterConfig = [
      //     {
      //       host: REDIS_HOST_1,
      //       port: REDIS_EXTERNAL_PORT_1,
      //     },
      //     {
      //       host: REDIS_HOST_2,
      //       port: REDIS_EXTERNAL_PORT_2,
      //     },
      //     {
      //       host: REDIS_HOST_3,
      //       port: REDIS_EXTERNAL_PORT_3,
      //     },
      //     {
      //       host: REDIS_HOST_4,
      //       port: REDIS_EXTERNAL_PORT_4,
      //     },
      //     {
      //       host: REDIS_HOST_5,
      //       port: REDIS_EXTERNAL_PORT_5,
      //     },
      //     {
      //       host: REDIS_HOST_6,
      //       port: REDIS_EXTERNAL_PORT_6,
      //     },
      //   ];
      // } else {
      //   redisClusterConfig = [
      //     {
      //       host: REDIS_HOST_1,
      //       port: REDIS_DOCKER_PORT_1,
      //     },
      //     {
      //       host: REDIS_HOST_2,
      //       port: REDIS_DOCKER_PORT_2,
      //     },
      //     {
      //       host: REDIS_HOST_3,
      //       port: REDIS_DOCKER_PORT_3,
      //     },
      //     {
      //       host: REDIS_HOST_4,
      //       port: REDIS_DOCKER_PORT_4,
      //     },
      //     {
      //       host: REDIS_HOST_5,
      //       port: REDIS_DOCKER_PORT_5,
      //     },
      //     {
      //       host: REDIS_HOST_6,
      //       port: REDIS_DOCKER_PORT_6,
      //     },
      //   ];
      // }

      // const redis = new Redis.Cluster(redisClusterConfig);

      // this.redis = redis;
    } else {
      this.redis = new ioredis.Redis(redisConfig)
      this.redisConfig = redisConfig
    }

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(MONGO_SERVER_URL, {
      maxPoolSize: 4,
      // useUnifiedTopology: true,
    })
    await client.connect().catch((error) => {
      logger.log(error)
    })
    this.mongo = client.db(CHAT_DATABASE_NAME)
  }

  public getPrisma = () => {
    return this.prisma
  }

  public getMongo = (collection: ROCKETCHAT_COLLECTIONS) => {
    return this.mongo.collection(collection)
  }

  public getRedis = () => {
    return this.redis
  }
  public getRedisConfig = () => {
    return this.redisConfig
  }

  public getChroma = () => {
    return this.chroma
  }
}
