import { generateError } from '@app/core/error/errorGenerator.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { permissionManager } from '@app/lib/permission.js'
import { IGetProjectByDomainResp, SUBDOMAIN_RESERVED_KEY } from '@app/shared-models/index.js'
import {
  getHostname,
  getSubdomainFromHostname,
  replaceSubdomainInHostname,
  respSuccess,
} from '@app/utility/helpers/index.js'
import { workspace_type } from '@prisma/client'
import { FastifyRequest, preHandlerHookHandler } from 'fastify'
import { getConfigs } from '@app/lib/config.validator.js'
import { fetchRequest } from '@app/lib/fetch.js'
import { HEADER_ACCESS_TOKEN_KEY } from '@app/utility/constants/index.js'

type Roles = 'manage_members' | 'manage_workspace' | 'billing_access' | 'workspace_collaboration' | 'owner'
type IOptions<TIsRequired> = {
  /**
   * specifies whether caller must be a workspace member / has one of roles.
   */
  isMember?: boolean | Roles[]
  /**
   * Prevent guest members to access. Not works if isMember is false.
   */
  preventGuest?: boolean
  /**
   * if workspace not passed, returns error. Default is `false`.
   */
  isRequired?: TIsRequired
  /**
   * Won't return HTTP "404" if workspace was not found. Default is `false`.
   * **Notice:** For setting this as `true` requires to set `isRequired` parameter as `false`.
   */
  noRejectOnNotFound?: TIsRequired extends true ? false : true
}

/**
 * Finds workspace and project detail by domain and subdomain information.
 * @param isMember specifies whether caller must be a workspace member / has one of roles.
 * @param preventGuest Prevent guest members to access. Not works if isMember is false.
 * @param isRequired If workspace not passed, returns error. Default is `false`.
 * @param noRejectOnNotFound Won't return HTTP "404" if workspace was not found. Default is `false`.
 * **Notice:** For setting this as `true` requires to set `isRequired` parameter as `false`.
 */
export const catchWorkspace = <TIsRequired extends boolean>({
  isMember = true,
  preventGuest = true,
  isRequired,
  noRejectOnNotFound,
}: IOptions<TIsRequired>): preHandlerHookHandler<any, any, any, any> => {
  return async (req: FastifyRequest<{ Querystring: { subdomain: string } }>, reply) => {
    const repo = getRepo()

    const { domain, subdomain: mainSubdomain } = getHostname(req.hostname)

    const subdomain = (req.query.subdomain as string) || mainSubdomain
    // const isLegalerDomain = await repo.consoleProject.getProjectByDomain([domain]);

    let isLegalerDomain: IGetProjectByDomainResp | workspace_type | null =
      await repo.workspace.getWorkspaceTypeByDomain(domain)

    if (!isLegalerDomain) {
      isLegalerDomain = await repo.consoleProject.getProjectByDomain([domain])
    }

    let workspace: {
      subdomain: string
      user_id: number
      appearance: {
        domain: string | null
      } | null
      console_project: {
        domain: string
        console_project_id: number
        name: string
      }
      name: string
      server: { url: string }
      workspace_id: number
      server_id: number
    } | null = null

    if (isLegalerDomain) {
      if (Object.values(SUBDOMAIN_RESERVED_KEY).includes(subdomain as any)) return

      if (!subdomain) {
        if (isRequired) throw generateError([{ message: 'Workspace is required.' }], 'BAD_REQUEST')
        return
      }

      workspace = await repo.workspace.getByUrlAndDomain({ subdomain, domain })
    } else {
      const isWorkspaceWithCustomDomain = await repo.workspace.getWorkspaceWithCustomDomain(domain)

      workspace = isWorkspaceWithCustomDomain?.workspace ?? null
    }

    if (!workspace) {
      if (noRejectOnNotFound) return
      throw generateError([{ message: 'WORKSPACE_NOTFOUND' }], 'NOT_FOUND')
    }

    if (isMember) {
      if (!req.user) throw generateError([{ message: 'Login required.' }], 'UNAUTHORIZED')
      const isGranted = await permissionManager.workspace.checkRole(
        workspace.workspace_id,
        req.user.user_id,
        isMember === true ? [] : isMember,
        preventGuest,
      )
      if (!isGranted) throw generateError([{ message: 'You are not a member.' }], 'FORBIDDEN')
    }

    req.workspace = workspace
  }
}

export const redirectToAnotherServer = (): preHandlerHookHandler => {
  return async (req, reply) => {
    // set this after =>
    //    authorization()

    const repo = getRepo()
    const target_subdomain: string | undefined = (req.query as any)?.target_subdomain
    const target_custom_domain: string | undefined = (req.query as any)?.target_custom_domain
    const { API_BACKEND_SERVER_ADDRESS } = getConfigs()

    const origin_subdomain = getSubdomainFromHostname(req.hostname)

    if (
      !(target_subdomain && origin_subdomain && target_subdomain === origin_subdomain) &&
      (target_custom_domain || target_subdomain)
    ) {
      let target_server_url: string | undefined

      if (target_subdomain) {
        const getWorkspace = await repo.workspace.getWorkspaceBySubdomain(target_subdomain)
        target_server_url = getWorkspace?.server.url
      } else if (target_custom_domain) {
        const customDomain = await repo.workspace.checkCustomDomainExistence(target_custom_domain)
        target_server_url = customDomain?.workspace.server.url
      }

      if (target_server_url && target_server_url !== API_BACKEND_SERVER_ADDRESS) {
        const final_hostname = target_subdomain
          ? replaceSubdomainInHostname(req.hostname, target_subdomain, target_server_url)
          : target_custom_domain

        const resp = await fetchRequest<any, any>(
          req.method.toUpperCase() as 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT',
          final_hostname + req.url,
          req.body ?? undefined,
          // req.headers,
          {
            Authorization: req.headers?.[HEADER_ACCESS_TOKEN_KEY] as string,
            'x-user': req.user.user_hash,
          },
        )

        return respSuccess<any>(reply, { ...resp?.body?.data })
      }
    }
  }
}
