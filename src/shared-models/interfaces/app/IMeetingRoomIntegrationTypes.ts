export enum IMeetingRoomIntegrationEnum {
  youtube = 'youtube',
  miro = 'miro',
  googleDrive = 'googleDrive',
  figma = 'figma',
}

export type IMeetingRoomIntegrationTypes = keyof typeof IMeetingRoomIntegrationEnum
