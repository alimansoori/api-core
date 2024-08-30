import { DefaultMediasoupBranch, IEmitEventTypes, IWSEmitDataModel, MediasoupBranch } from '@app/shared-models/index.js'
import { WsMediaHandler } from '@app/ws/helpers/wsMediaHandler.js'
import { inject, singleton } from 'tsyringe'
import MediaserverTracker from '../tracker/mediaserver-tracker.js'
import MediasoupRoom from '../mediasoup/room/mediasoup-room.js'

@singleton()
export default class NotificationManager {
  constructor(
    @inject(MediaserverTracker) private mediaserverTracker: MediaserverTracker,
    @inject(WsMediaHandler) private wsMediaHandler: WsMediaHandler,
  ) {}

  public emit<T extends IEmitEventTypes>(user_id: string, type: T, data: IWSEmitDataModel<T>['data']) {
    this.wsMediaHandler.emit(user_id, type, data)
  }

  public broadcastEmitByBranch<T extends IEmitEventTypes>(
    type: T,
    data: IWSEmitDataModel<T>['data'],
    mediaRoom: MediasoupRoom,
    branch: MediasoupBranch,
    excludeId?: string,
  ) {
    this.wsMediaHandler.broadcastEmitByBranch(type, data, mediaRoom.meeting_id, [branch], excludeId)

    // track and log to meeting_log
    this.mediaserverTracker.track(
      {
        type,
        meeting_id: branch.hash === DefaultMediasoupBranch.hash ? mediaRoom.meeting_id : branch.id,
        fired_by: 'notification',
        fired_target: 'branch_emit',
        extra: data,
      },
      mediaRoom,
    )
  }

  public broadcastEmit<T extends IEmitEventTypes>(
    type: T,
    data: IWSEmitDataModel<T>['data'],
    mediaRoom: MediasoupRoom,
    excludeId?: string,
  ) {
    this.wsMediaHandler.broadcastEmit(type, data, mediaRoom.meeting_id, excludeId)

    // track and log to meeting_log
    this.mediaserverTracker.track(
      {
        type,
        meeting_id: mediaRoom.meeting_id,
        fired_by: 'notification',
        fired_target: 'broadcast_emit',
        extra: { ...data, meeting_id: mediaRoom.meeting_id },
      },
      mediaRoom,
    )
  }
}
