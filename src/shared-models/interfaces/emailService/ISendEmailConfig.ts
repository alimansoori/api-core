import { IEmailTemplates } from './IEmailTemplates.js'

export interface ISendEmailConfig<T = any> {
  subject: string
  senderName?: string
  to: string
  template: IEmailTemplates
  locale: string
  data?: T
}
