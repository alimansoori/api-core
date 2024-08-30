import { WsService } from '@app/ws/index.js'
import { container } from 'tsyringe'
import 'isomorphic-fetch'
import EventEmitter from 'events'
import { initJsonValidationSchemaCache } from '@app/lib/validation.js'
import { MediasoupContainer } from './mediasoup/media-container/mediasoup-container.js'
import { MediaserverMessagingController } from '@app/lib/messaging/controllers/mediaserver.messaging.controller.js'
import { mediaserverPromInit } from '@app/lib/promCollectors/mediaserver.prom.js'
import { initHelpers } from '@app/utility/helpers/globalHelper/globalHelper.js'
import { initService } from '@app/utility/services/globalServices.js'

// start application
export const createMediaserverApp = async () => {
  EventEmitter.defaultMaxListeners = 20

  initService()
  initHelpers()

  //* ************************************\\  initialize Json Validations Schema Cache  //************************************* */
  initJsonValidationSchemaCache()

  //* ************************************\\  Initialize Mediasoup Container  //************************************* */
  container.resolve(MediasoupContainer)

  //* ************************************\\  Initialize Websocket  //************************************* */
  container.resolve(WsService)

  //* ************************************\\  Initialize Messaging Controller  //************************************* */
  container.resolve(MediaserverMessagingController)

  mediaserverPromInit()
}
