import { singleton } from 'tsyringe'
import { getConfigs } from '@app/lib/config.validator.js'
import Mp from 'mixpanel'
import { FastifyRequest } from 'fastify'
import { getDeviceData, getIP, getUserAgent } from '@app/utility/helpers/index.js'
import { logger } from '../logger.js'
import { USER_ROLE } from '@prisma/client'
import { Log } from '@app/shared-models/index.js'

type UserProfile = {
  first_name?: string
  last_name?: string
  nickname?: string
  email?: string
  phone?: string
  avatar?: string
  role?: USER_ROLE
  username?: string
  language?: string
  timezone?: string
  user_record_deleted?: string
}

@singleton()
export default class Mixpanel {
  mixpanel: Mp.Mixpanel
  constructor() {
    const { MIXPANEL_TOKEN } = getConfigs()
    this.mixpanel = Mp.init(MIXPANEL_TOKEN)
  }

  public trackBackend(event: Mp.Event) {
    try {
      if (event.properties.user_hash) event.properties.distinct_id = event.properties.user_hash
      event.properties.source = 'backend' satisfies Log['source']
      event.properties.level = 'marketing' satisfies Log['level']

      this.mixpanel.track(event.event, event.properties)
    } catch (err) {
      logger.error(err, { msg: 'trackBackend error' })
    }
  }

  public sendBatch(events: Mp.Event[]) {
    this.mixpanel.track_batch(events)
  }

  public trackByReq(event: Mp.Event, req: FastifyRequest) {
    try {
      const ip = getIP(req)
      const ipv4 = ip.includes(',') ? ip.split(',').pop()?.trim() : ip

      const userAgent = getUserAgent(req)
      const device = getDeviceData(userAgent)

      event.properties.ip = ipv4
      event.properties.$os = device.os_name + ' ' + device.os_ver
      event.properties.$browser = device.browser_name + ' ' + device.browser_ver

      if (device.device_vendor) {
        event.properties.$device =
          device.device_vendor + ' ' + device.device_model + (device.device_type ? ` (${device.device_type})` : '')
      }

      if (!event.properties.user_hash && req.user?.user_hash) event.properties.user_hash = req.user.user_hash

      this.trackBackend(event)
    } catch (err) {
      logger.error(err, { req, msg: 'trackByReq error' })
    }
  }

  public setUserProperties(user_hash: string, properties: UserProfile, req?: FastifyRequest) {
    try {
      const data: Mp.PropertyDict = {
        $first_name: properties.first_name,
        $last_name: properties.last_name,
        $email: properties.email,
        $phone: properties.phone,
        $avatar: properties.avatar,
        role: properties.role,
        username: properties.username,
        language: properties.language,
        user_record_deleted: properties.user_record_deleted,
      }

      if (req) {
        const ip = getIP(req)
        const ipv4 = ip.includes(',') ? ip.split(',').pop()?.trim() : ip

        const userAgent = getUserAgent(req)
        const device = getDeviceData(userAgent)

        data.ip = ipv4
        data.$os = device.os_name + ' ' + device.os_ver
        data.$browser = device.browser_name + ' ' + device.browser_ver

        if (device.device_vendor) {
          data.$device =
            device.device_vendor + ' ' + device.device_model + (device.device_type ? ` (${device.device_type})` : '')
        }
      }

      this.mixpanel.people.set(user_hash, data)
    } catch (err) {
      logger.error(err, { msg: 'setUserProperties error' })
    }
  }

  public deleteUserProperties(user_hash: string, properties: (keyof UserProfile)[]) {
    try {
      this.mixpanel.people.unset(user_hash, properties)
    } catch (err) {
      logger.error(err, { msg: 'deleteUserProperties error' })
    }
  }
}
