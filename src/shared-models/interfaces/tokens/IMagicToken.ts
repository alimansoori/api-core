import { IGetProjectByDomainResp } from '../app/index.js'
import { ATTENDEE_REQUEST_STATUS } from '../backend.js'
import { IRequestToJoinRespond } from '../database/index.js'

export type ICreateMagicTokenOption = {
  /**
   * Expiration time in minutes. Default is non-expirable.
   */
  expiry_time?: number
}

export type IMagicTokenType =
  | 'integration-state'
  | 'integration-state-google'
  | 'email-action:meeting-invite'
  | 'email-action:workspace-invite'
  | 'email-action:user'
  | 'email-action:booking'
  | 'meeting-invite'
  | 'project-invite'
  | 'opportunity-invite'
  | 'meeting-request'
  | 'note-request'
  | 'workspace-invite'
  | 'user'
  | 'booking'
  | 'google-auth'
  | 'ms-auth'
  | 'clio-auth'
  | 'clickup-auth'

type IDefaults = {
  remove_after_usage: boolean
  reusing_times?: number
  times_used?: number
  workspace_id?: number
  auto_login?: boolean
}

// export type IMagicToken =
//   | ({
//       module: 'meeting';
//       meeting_id: number;
//       action: 'invite';
//       user_id: number;
//     } & IDefaults)
//   | ({
//       module: 'workspace';
//       workspace_id: number;
//       action: 'invite';
//       user_id: number;
//     } & IDefaults)
//   | ({
//       module: 'user';
//       action: 'reset_password' | 'auto_login' | 'auto_signup';
//       email: string;
//       refresh_token?: string;
//     } & IDefaults)
//   | ({
//       module: 'booking';
//       action: 'accept' | 'decline';
//       booking_id: number;
//       user_id: number;
//     } & IDefaults);

export type IMagicTokenData<T extends IMagicTokenType> = IDefaults &
  (T extends 'integration-state'
    ? {
        user_id: number
        workspace_id: number
        redirect_url?: string
        subdomain: string
        domain: string | undefined
      }
    : T extends 'integration-state-google'
      ? {
          user_id: number
          workspace_id: number
          subdomain: string
          type: 'calendar' | 'contact'
          redirect_url?: string
          domain: string | undefined
        }
      : T extends 'meeting-invite'
        ? {
            module: 'meeting'
            meeting_hash: string
            meeting_id: number
            action: 'manage-invite'
            user_id: number
            workspace_id: number
            request_status: ATTENDEE_REQUEST_STATUS
            email: string
          }
        : T extends 'meeting-request'
          ? {
              module: 'meeting'
              meeting_hash: string
              meeting_id: number
              action: 'manage-request'
              user_id: number
              workspace_id: number
              request_status: IRequestToJoinRespond
              email: string
            }
          : T extends 'workspace-invite'
            ? {
                module: 'workspace'
                workspace_id: number
                action: 'invite'
                user_id: number
                share_id: number
                project: IGetProjectByDomainResp
                email: string
                respond: IRequestToJoinRespond
              }
            : T extends 'project-invite'
              ? {
                  module: 'project'
                  project_hash: string
                  action: 'project-invite'
                  user_id: number
                  share_id: number
                  workspace_id: number
                  request_status: IRequestToJoinRespond
                  project: IGetProjectByDomainResp
                  email: string
                }
              : T extends 'opportunity-invite'
                ? {
                    module: 'opportunity'
                    opportunity_hash: string
                    action: 'opportunity-invite'
                    user_id: number
                    share_id: number
                    workspace_id: number
                    request_status: IRequestToJoinRespond
                    project: IGetProjectByDomainResp
                    email: string
                  }
                : T extends 'note-request'
                  ? {
                      module: 'note'
                      note_hash: string
                      action: 'note-request'
                      user_id: number
                      share_id: number
                      workspace_id: number
                      request_status: IRequestToJoinRespond
                      project: IGetProjectByDomainResp
                      email: string
                    }
                  : T extends 'user'
                    ? {
                        module: 'user'
                        action: 'reset_password' | 'auto_login' | 'auto_signup'
                        email: string
                        refresh_token?: string
                        redirect_url?: string
                        workspace_id?: number
                      }
                    : T extends 'booking'
                      ? {
                          module: 'booking'
                          action: 'accept' | 'decline'
                          booking_id: number
                          meeting_id: number
                          user_id: number
                          email: string
                          workspace_id?: number
                        }
                      : T extends 'google-auth'
                        ? {
                            state: string
                            type: 'auth'
                            workspace_id?: number
                          }
                        : T extends 'ms-auth'
                          ? {
                              state: string
                              workspace_id?: number
                            }
                          : T extends 'clio-auth'
                            ? {
                                state: string
                                workspace_id?: number
                              }
                            : T extends 'clickup-auth'
                              ? {
                                  workspace_id: number
                                  user_id: number
                                  custom_domain: string | undefined
                                }
                              : null)
