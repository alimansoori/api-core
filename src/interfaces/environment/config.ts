export interface IAppConfig {
  pagination: {
    limit: number
    page: number
  }
  googleOAuth: {
    web: {
      project_id: string
      auth_uri: string
      token_uri: string
      auth_provider_x509_cert_url: string
      redirect_uris: string[]
      javascript_origins: string[]
    }
  }
}
