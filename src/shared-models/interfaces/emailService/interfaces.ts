import { PERMISSION } from '../app/index.js'

export interface IClickable {
  href: string
}

export type IColorVariant = 'danger' | 'dark' | 'primary' | 'primary-light' | 'secondary' | 'success' | 'warning' | 'gray'

export interface IUserContent {
  innerHTML: {
    text: string
    fullName?: string
    variant: IColorVariant
  }
}

export interface IButtonProps extends IClickable {
  variant: string
  outlined?: boolean
  label: string
  textColor?: string
}

export interface IImageProps {
  src: string
  alt: string
}
export type IAvatarProps = IImageProps

export interface IAttendeeRoles {
  label: string
  color: 'secondary-light' | 'primary-light'
}

export interface IHeaderProps {
  logo: IAvatarProps | null
}

export interface IMainCTAProps extends IUserContent {
  mainButton?: IButtonProps
  leftButton?: IButtonProps
  rightButton?: IButtonProps
  eventName: string
  avatar?: IImageProps
  cover?: IImageProps
  illustration?: IImageProps
  ignoreEmail?: string[]
  workspaceName?: string
  template: string
  message?: string
}

export interface IBookingAppointmentType {
  price: number | undefined
  duration: number
  currency: string
  title: string
  show_free: boolean
}

export interface ITimeSlotProps {
  variant: 'suggestion' | 'fixed' | 'canceled' | 'missed' | 'done' | 'ended'
  // suggestion => #FFEDD3
  // fixed => #CDF0F6
  // canceled => #F1F3F4
  // missed => #FBD9D9
  // done => #6C7D8C
  // ended => #E6EEF9

  time: string
  date: string
}
export interface ITimeSlotsProps {
  amount: number
  timezone: string
  slots: ITimeSlotProps[]
  more: number
  previousTime?: ITimeSlotProps
}

export interface IUserDetail extends IClickable {
  avatar: IAvatarProps
  title: string
  letters?: string
  description?: string | null
  is_guest: boolean
  calc_permission: PERMISSION
  role?: 'Host' | 'Co-Host' | 'Attendee'
  label?: string | null
}
export interface IAttendeesProps {
  amount: number
  users: IUserDetail[]
}

export interface ILocationProps extends IClickable {
  avatar?: IAvatarProps
  title: string
  map?: IImageProps
}

export interface IAgendaAttachmentProps extends IClickable {
  avatar: IAvatarProps
  title: string
}
export interface IAgendaProps extends IUserContent {
  agenda_name: string | null
  time_box: number | null
  userDetails?: IUserDetail[]
  attachments?: IAgendaAttachmentProps[]
}
export interface IAgendaItemsProps {
  amount: number
  items: IAgendaProps[]
}

export interface INoteProps extends IUserContent {
  attachments?: IAgendaAttachmentProps[]
}

export interface IFooterProps {
  avatar: IAvatarProps | null
  similar: string
  copyright?: string
  notifSrc?: string
  cautionLines?: string[]
  manage?: string
  onlineSecurely?: string
  legaler?: string
}

export type IChatProps = IUserContent

export interface IPinCodeProps {
  title: string
  button: IButtonProps
  digits: number
}

export interface ILoginNewUserData {
  deviceName: string
  loginTime: Date
  ip: string
  innerHTML?: string
}
export interface IPasswordChangedUserData {
  deviceName: string
  time: Date
  ip: string
  eventName?: string
  description?: string
}
export interface IWorkspaceProps extends IUserContent {
  avatar: IAvatarProps
  eventName: string
  mainButton?: IButtonProps
  leftButton?: IButtonProps
  rightButton?: IButtonProps
}

export interface IMaintenanceProps extends IUserContent {
  title: string
}
