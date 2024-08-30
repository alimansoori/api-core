import { MEETING_PERMIT } from '@prisma/client'

export interface MediaRoomSetting {
  presentation: MEETING_PERMIT
  view_transcription_permit: MEETING_PERMIT
}
