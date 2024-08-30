import { PERMISSION, WORKSPACE_ACCESS } from '@app/shared-models/index.js'
import { access, access_role, role, URL_PRIVACY } from '@prisma/client'
import { Context } from '@app/interfaces/index.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'

export type IWorkspaceUserWithRole = {
  role: role & {
    accesses: (access_role & {
      access: access
    })[]
  }
  workspace_user_id: number
  status: number
}

export const permissionManager = {
  userMeeting: {
    /*
    hasPermission: async (
      meeting_id: number,
      user_id: number,
      permission: enum_role_in_meeting,
    ): Promise<boolean> => {
      const meeting = await meetingRepo.getMeetingAttendeeByID(meeting_id, user_id);

      if (!meeting) return false;
      const isGranted = meeting[permission];
      if (isGranted === true) return true;
      else return false;
    },

    hasAtLeastOnePermission: async (
      meeting_id: number,
      user_id: number,
      permissions: enum_role_in_meeting[],
    ): Promise<{
			user_meeting_id: number;
			role_in_meeting: enum_role_in_meeting;
		}> => {
      const att = await meetingRepo.getMeetingAttendeeByID(meeting_id, user_id);
      if (!att) return undefined;

      for (const perm of permissions) {
        if (att.role_in_meeting === perm) break;
      }

      return att;
    },
    */
  },

  meeting: {
    checkRole: async (meeting_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()

      const attendee = await repo.meeting.getAttendeeByUserIdAndStatus(meeting_id, user_id, ['approved'])
      if (!attendee) return undefined

      if (
        !attendee.access_main_room &&
        [PERMISSION.Owner, PERMISSION.Admin].includes(attendee.calc_permission) &&
        attendee.meeting.main_room_id === null
      ) {
        return undefined
      }

      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },
  },
  meetingRoom: {
    hasAccess: async (meeting_id: number, user_id: number) => {
      const repo = getRepo()
      const meeting = await repo.meeting.meetingRoomCheckRole(meeting_id, user_id)
      return !!meeting
    },
  },

  meetingAgenda: {
    checkRole: async (meeting_user_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()
      const attendee = await repo.document.getAgendaUser(meeting_user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },
  },

  note: {
    checkRole: async (note_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()
      const attendee = await repo.document.getNoteUser(note_id, user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },

    checkUrlPrivacy: async (note_id: number, privacies: URL_PRIVACY[]) => {
      const repo = getRepo()
      const note = await repo.document.getNote(
        { note_id },
        {
          url_privacy: true,
        },
      )

      if (note?.url_privacy) {
        if (privacies?.includes(note.url_privacy)) return note.url_privacy
      }
    },
  },

  project: {
    checkRole: async (project_id: number, user_id: number, roles: PERMISSION[], ctx?: Context) => {
      const repo = getRepo()
      const attendee = await repo.project.getProjectUser(project_id, user_id, ctx)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },

    checkUrlPrivacy: async (project_id: number, privacies: URL_PRIVACY[]) => {
      const repo = getRepo()
      const project = await repo.project.getByID(project_id)
      if (!project) return undefined

      if (project?.url_privacy) {
        if (privacies?.includes(project.url_privacy)) return project.url_privacy
      }
    },
  },

  opportunity: {
    checkRole: async (opportunity_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()
      const attendee = await repo.opportunity.getOpportunityUser(opportunity_id, user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },

    checkUrlPrivacy: async (opportunity_id: number, privacies: URL_PRIVACY[]) => {
      const repo = getRepo()
      const opportunity = await repo.opportunity.getByID(opportunity_id)
      if (!opportunity) return undefined

      if (opportunity?.url_privacy) {
        if (privacies?.includes(opportunity.url_privacy)) return opportunity.url_privacy
      }
    },
  },

  service: {
    checkRole: async (service_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()
      const attendee = await repo.service.getServiceUser(service_id, user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },
  },

  private_file: {
    checkRole: async (file_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()

      const shared_user = await repo.privateFile.getFileUser(file_id, user_id)
      if (!shared_user) return undefined
      if (!roles.length) return shared_user

      for (const role of roles) if (shared_user.calc_permission === role) return shared_user

      return undefined
    },
  },
  folder: {
    checkRole: async (folder_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()

      const shared_user = await repo.folder.getFolderUser(folder_id, user_id)
      if (!shared_user) return undefined
      if (!roles.length) return shared_user

      for (const role of roles) if (shared_user.calc_permission === role) return shared_user

      return undefined
    },
  },

  user_profile: {
    checkRole: async (user_profile_id: number, user_id: number, roles: (PERMISSION.Owner | PERMISSION.Viewer)[]) => {
      const repo = getRepo()
      const userProfile = await repo.profile.getUserProfileByID(user_profile_id)

      if (roles.includes(PERMISSION.Owner)) {
        if (userProfile?.workspace_user.user_id === user_id) return userProfile.workspace_user
      }

      const attendee = userProfile?.user_profile_user.find((i) => i.user_id === user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },
  },

  workspace_profile: {
    checkRole: async (
      workspace_profile_id: number,
      user_id: number,
      roles: ('manage_workspace' | 'owner' | PERMISSION.Viewer)[],
    ) => {
      const repo = getRepo()
      const workspaceProfile = await repo.profile.getWorkspaceProfileByID(workspace_profile_id)

      if (roles.includes('manage_workspace') || roles.includes('owner')) {
        const member = workspaceProfile?.workspace.workspace_user.find((i) => i.user_id === user_id)

        if (member) {
          if (!roles.length) return member

          if (member.role?.accesses) {
            if (member.role.accesses.find((i) => roles.includes(i.access.key as any))?.value) {
              return member
            }
          }
        }
      }

      const attendee = workspaceProfile?.workspace_profile_user.find((i) => i.user_id === user_id)
      if (!attendee) return undefined
      if (!roles.length) return attendee

      for (const role of roles) if (attendee.calc_permission === role) return attendee

      return undefined
    },
  },

  workspace: {
    /**
     * Finds at least one of passed roles. if nothing found, returns undefined.
     */
    checkRole: async (
      workspace_id: number,
      user_id: number,
      roles: ('owner' | 'manage_members' | 'manage_workspace' | 'billing_access' | 'workspace_collaboration')[],
      preventGuest = true,
      ctx?: Context,
    ): Promise<IWorkspaceUserWithRole | undefined> => {
      const repo = getRepo()

      const member = await repo.workspace.getWorkspaceMemberRole(workspace_id, user_id, ctx)
      if (!member) return

      if (preventGuest) {
        if (member.is_guest) return
      }

      if (!roles.length) return member

      if (member.role?.accesses) {
        for (const role of roles) {
          let foundMember:
            | (access_role & {
                access: access
              })
            | undefined

          switch (role) {
            case 'owner':
              foundMember = member.role.accesses.find((i) => {
                if (i.access) {
                  return i.access.key === WORKSPACE_ACCESS.IsOwner
                }
              })

              if (foundMember?.value) return member
              break

            case 'manage_members':
              foundMember = member.role.accesses.find((i) => {
                if (i.access) {
                  return i.access.key === WORKSPACE_ACCESS.ManageMembers
                }
              })
              if (foundMember?.value) return member
              break

            case 'manage_workspace':
              foundMember = member.role.accesses.find((i) => {
                if (i.access) {
                  return i.access.key === WORKSPACE_ACCESS.ManageWorkspace
                }
              })

              if (foundMember?.value) {
                return member
              }

              break

            case 'billing_access':
              foundMember = member.role.accesses.find((i) => {
                if (i.access) {
                  return i.access.key === WORKSPACE_ACCESS.ManageWorkspace
                }
              })
              if (foundMember?.value) return member
              break

            case 'workspace_collaboration':
              foundMember = member.role.accesses.find((i) => {
                if (i.access) {
                  return i.access.key === WORKSPACE_ACCESS.WorkspaceCollaboration
                }
              })

              if (foundMember?.value) {
                return member
              }

              break

            default:
              break
          }
        }
      }
    },
    isRoleIncluded: (data: IWorkspaceUserWithRole, role: WORKSPACE_ACCESS) => {
      if (data.role.accesses.find((i) => i.access.key === role)?.value) return true
      else return false
    },
  },

  meeting_recording: {
    checkRole: async (meeting_recording_id: number, user_id: number, roles: PERMISSION[]) => {
      const repo = getRepo()

      const shared_user = await repo.meeting.getMeetingRecordingUser(meeting_recording_id, user_id)
      if (!shared_user) return undefined
      if (!roles.length) return shared_user

      for (const role of roles) if (shared_user.calc_permission === role) return shared_user

      return undefined
    },
  },

  task: {
    checkRole: async (task_id: number, user_id: number, workspace_id: number, role: PERMISSION[]) => {
      const repo = getRepo()

      const task_assignee = await repo.task.findTaskAssigneeByUserID(task_id, user_id)

      if (!task_assignee) {
        const task = await repo.task.findTaskById(task_id, workspace_id)

        if (task?.user_id === user_id) {
          return {
            PERMISSION: PERMISSION.Owner,
          }
        }

        const workspace_permission = permissionManager.workspace.checkRole(workspace_id, user_id, [
          'owner',
          'manage_workspace',
        ])

        if (!workspace_permission) {
          const project_permission = await permissionManager.project.checkRole(workspace_id, user_id, role)

          if (!project_permission) {
            return undefined
          }

          return {
            PERMISSION: project_permission.calc_permission,
          }
        }

        return {
          PERMISSION: PERMISSION.Admin,
        }
      }

      return {
        PERMISSION: PERMISSION.Admin,
        task_assignee_id: task_assignee.task_assignee_id,
      }
    },
  },
}
