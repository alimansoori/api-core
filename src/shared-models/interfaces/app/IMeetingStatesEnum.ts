export enum IMeetingStatesEnum {
  'MISSED' = 'missed',
  'CANCELED' = 'canceled',
  'DECLINED' = 'declined',
  'EXPIRED' = 'expired',
  'ENDED' = 'ended',
  'LIVE' = 'live',
  'NOT_STARTED' = 'not-started',
  'OFFLINE' = 'offline',
  'DELAYED' = 'delayed',
  'STARTING_SOON' = 'starting-soon',
  'SCHEDULED' = 'scheduled',
  'START' = 'start',
  'PENDING' = 'PENDING',
  'VOTE_NOW' = 'vote-now',
  'VOTED' = 'voted',
  'VOTING_CONFIRMATION' = 'voting-confirmation',
  'NOT_DEFINED' = 'not-defined',
}

export type IMeetingStatesType = keyof typeof IMeetingStatesEnum
