import { getConfigs } from '@app/lib/config.validator.js'

export const getServerAddressURL = (subdomain: string, workspace_type_domain?: string, custom_domain?: string | null) => {
  const { FRONT_SERVER_ADDRESS } = getConfigs()

  const serverAddress = custom_domain
    ? custom_domain === workspace_type_domain
      ? `https://${subdomain}.${workspace_type_domain}`
      : `https://${custom_domain}`
    : `https://${subdomain}.${workspace_type_domain ?? FRONT_SERVER_ADDRESS}`
  return serverAddress
}
