import { singleton } from "tsyringe";
import NodeCache from 'node-cache';

/**
 * Service to manage Telegram bot instance.
 */
@singleton()
export default class NodeCacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  getCache(): NodeCache {
    return this.cache;
  }
}
