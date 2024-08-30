/**
 * Enums
 */

export const IDENTITY_TYPE = {
  email: 'email',
  phone: 'phone',
}

export type IDENTITY_TYPE = keyof typeof IDENTITY_TYPE

export const IDENTITY_CATEGORY = {
  work: 'work',
  personal: 'personal',
  company: 'company',
}

export type IDENTITY_CATEGORY = keyof typeof IDENTITY_CATEGORY

export const URL_PRIVACY = {
  can_view_only: 'can_view_only',
  can_join: 'can_join',
  can_ask_for_access: 'can_ask_for_access',
  disabled: 'disabled',
  public: 'public',
  bylink: 'bylink',
  private: 'private',
}

export type URL_PRIVACY = keyof typeof URL_PRIVACY

export const HEADER_TYPE = {
  logo: 'logo',
  cover: 'cover',
}

export type HEADER_TYPE = keyof typeof HEADER_TYPE

export const HEADER_SHAPE = {
  empty: 'empty',
  img: 'img',
  letter: 'letter',
}

export type HEADER_SHAPE = keyof typeof HEADER_SHAPE

export const SYSTEM_ASSET_TYPE = {
  cover: 'cover',
}

export type SYSTEM_ASSET_TYPE = keyof typeof SYSTEM_ASSET_TYPE

export const MEETING_TYPE = {
  meeting: 'meeting',
  breakoutroom: 'breakoutroom',
  room: 'room',
  booking: 'booking',
  template: 'template',
}

export type MEETING_TYPE = keyof typeof MEETING_TYPE

export const MEETING_PERMIT = {
  anyone: 'anyone',
  admins_only: 'admins_only',
  host_only: 'host_only',
}

export type MEETING_PERMIT = keyof typeof MEETING_PERMIT

export const MEETING_TIMER_STATUS = {
  played: 'played',
  paused: 'paused',
  not_started: 'not_started',
}

export type MEETING_TIMER_STATUS = keyof typeof MEETING_TIMER_STATUS

export const DATE_INTERVAL = {
  monthly: 'monthly',
  yearly: 'yearly',
  daily: 'daily',
  weekly: 'weekly',
  custom: 'custom',
  none: 'none',
}

export type DATE_INTERVAL = keyof typeof DATE_INTERVAL

export const RECURRENCE_RECUR_TYPE = {
  day: 'day',
  week: 'week',
  month: 'month',
  year: 'year',
}

export type RECURRENCE_RECUR_TYPE = keyof typeof RECURRENCE_RECUR_TYPE

export const MONTHLY_RECURRENCE_TYPE = {
  NTH_WEEKDAY: 'NTH_WEEKDAY',
  LAST_WEEKDAY: 'LAST_WEEKDAY',
}

export type MONTHLY_RECURRENCE_TYPE = keyof typeof MONTHLY_RECURRENCE_TYPE

export const MEETING_ANALYSIS_TYPE = {
  part_summarized: 'part_summarized',
  total_summarized: 'total_summarized',
  total_action_list: 'total_action_list',
}

export type MEETING_ANALYSIS_TYPE = keyof typeof MEETING_ANALYSIS_TYPE

export const NOTIFICATION_TEMPLATE = {
  meeting_canceled: 'meeting_canceled',
  meeting_poll_canceled: 'meeting_poll_canceled',
  meeting_poll_declined_one: 'meeting_poll_declined_one',
  meeting_declined_one: 'meeting_declined_one',
  meeting_poll_updated: 'meeting_poll_updated',
  meeting_knock_request: 'meeting_knock_request',
  meeting_all_voted: 'meeting_all_voted',
  meeting_vote: 'meeting_vote',
  meeting_invite_poll: 'meeting_invite_poll',
  meeting_invite: 'meeting_invite',
  meeting_updated: 'meeting_updated',
  meeting_reminder_tomorrow: 'meeting_reminder_tomorrow',
  meeting_reminder_1hr: 'meeting_reminder_1hr',
  meeting_reminder_30min: 'meeting_reminder_30min',
  meeting_reminder_now: 'meeting_reminder_now',
  meeting_start: 'meeting_start',
  meeting_confirmed: 'meeting_confirmed',
  meeting_missed: 'meeting_missed',
  meeting_invitation_approved: 'meeting_invitation_approved',
  meeting_attended: 'meeting_attended',
  room_opened: 'room_opened',
  room_invitation_approved: 'room_invitation_approved',
  room_added: 'room_added',
  booking_declined: 'booking_declined',
  booking_canceled: 'booking_canceled',
  booking_confirmed: 'booking_confirmed',
  booking_pending: 'booking_pending',
  booking_rescheduled: 'booking_rescheduled',
  booking_auto_confirm: 'booking_auto_confirm',
  booking_invited: 'booking_invited',
  module_request_access: 'module_request_access',
  module_request_access_reply: 'module_request_access_reply',
  workspace_invite: 'workspace_invite',
  workspace_join: 'workspace_join',
  workspace_left: 'workspace_left',
  page_invite: 'page_invite',
  page_update: 'page_update',
  matter_added: 'matter_added',
  notification_test: 'notification_test',
  opportunity_updated: 'opportunity_updated',
  opportunity_expressed: 'opportunity_expressed',
  opportunity_assigned: 'opportunity_assigned',
  opportunity_invited: 'opportunity_invited',
  service_invite: 'service_invite',
  service_host_changed: 'service_host_changed',
  meeting_recording_invite: 'meeting_recording_invite',
}

export type NOTIFICATION_TEMPLATE = keyof typeof NOTIFICATION_TEMPLATE

export const BOOKING_CONFIRMATION = {
  auto: 'auto',
  pending: 'pending',
}

export type BOOKING_CONFIRMATION = keyof typeof BOOKING_CONFIRMATION

export const SERVICE_PRICE_TYPE = {
  paid: 'paid',
  not_paid: 'not_paid',
  donation: 'donation',
}

export type SERVICE_PRICE_TYPE = keyof typeof SERVICE_PRICE_TYPE

export const CANCELLATION_FEE_TYPE = {
  percentage_fee: 'percentage_fee',
  no_fee: 'no_fee',
}

export type CANCELLATION_FEE_TYPE = keyof typeof CANCELLATION_FEE_TYPE

export const AVAILABILITY_TYPE = {
  default: 'default',
  date: 'date',
}

export type AVAILABILITY_TYPE = keyof typeof AVAILABILITY_TYPE

export const WEEK_DAY = {
  sunday: 'sunday',
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
}

export type WEEK_DAY = keyof typeof WEEK_DAY

export const AVAILABILITY_TEMPLATE_TYPE = {
  general: 'general',
  template: 'template',
  service: 'service',
}

export const TASK_PRIORITY = {
  Urgent: 'Urgent',
  High: 'High',
  Normal: 'Normal',
  Low: 'Low',
  None: 'None',
}

export type TASK_PRIORITY = keyof typeof TASK_PRIORITY

export type AVAILABILITY_TEMPLATE_TYPE = keyof typeof AVAILABILITY_TEMPLATE_TYPE

export const TASK_STATUS_TYPE = {
  closed: 'closed',
  active: 'active',
  done: 'done',
}

export type TASK_STATUS_TYPE = keyof typeof TASK_STATUS_TYPE

export const PAYMENT_METHOD = {
  none: 'none',
  card: 'card',
  credit: 'credit',
  invoice: 'invoice',
}

export type PAYMENT_METHOD = keyof typeof PAYMENT_METHOD

export const ACCESS_TYPE = {
  console: 'console',
  client: 'client',
}

export type ACCESS_TYPE = keyof typeof ACCESS_TYPE

export const SOCIAL_ACCOUNT_TYPE = {
  facebook: 'facebook',
  instagram: 'instagram',
  twitter: 'twitter',
  youtube: 'youtube',
  linkedin: 'linkedin',
}

export type SOCIAL_ACCOUNT_TYPE = keyof typeof SOCIAL_ACCOUNT_TYPE

export const AGENDA_STATUS = {
  played: 'played',
  paused: 'paused',
  not_started: 'not_started',
}

export type AGENDA_STATUS = keyof typeof AGENDA_STATUS

export const DOCUMENT_MARK_TYPE = {
  bold: 'bold',
  code: 'code',
  italic: 'italic',
  underline: 'underline',
  link: 'link',
  text_color: 'text_color',
  strike_through: 'strike_through',
  text_highlight: 'text_highlight',
}

export type DOCUMENT_MARK_TYPE = keyof typeof DOCUMENT_MARK_TYPE

export const USER_ROLE = {
  user: 'user',
  guest: 'guest',
  anonymous: 'anonymous',
  deleted: 'deleted',
  bot: 'bot',
  system: 'system',
}

export type USER_ROLE = keyof typeof USER_ROLE

export const SHARE_TYPE = {
  child: 'child',
  parent: 'parent',
}

export type SHARE_TYPE = keyof typeof SHARE_TYPE

export const MEETING_USER_STATUS = {
  joined: 'joined',
  invited: 'invited',
  missed: 'missed',
  waiting: 'waiting',
  online: 'online',
  left: 'left',
}

export type MEETING_USER_STATUS = keyof typeof MEETING_USER_STATUS

export const ATTENDEE_REQUEST_TYPE = {
  invited: 'invited',
  knocked: 'knocked',
  knock_canceled: 'knock_canceled',
  joined_with_link: 'joined_with_link',
}

export type ATTENDEE_REQUEST_TYPE = keyof typeof ATTENDEE_REQUEST_TYPE

export const ATTENDEE_REQUEST_STATUS = {
  pending: 'pending',
  approved: 'approved',
  declined: 'declined',
}

export type ATTENDEE_REQUEST_STATUS = keyof typeof ATTENDEE_REQUEST_STATUS

export const LOGOTYPE = {
  img: 'img',
  text: 'text',
}

export type LOGOTYPE = keyof typeof LOGOTYPE

export const PROJECT_STATUS = {
  open: 'open',
  closed: 'closed',
  archived: 'archived',
}

export type PROJECT_STATUS = keyof typeof PROJECT_STATUS

export const AUDIENCE_TYPE = {
  public: 'public',
  private: 'private',
  partners: 'partners',
}

export type AUDIENCE_TYPE = keyof typeof AUDIENCE_TYPE

export const OPPORTUNITY_STATUS = {
  open: 'open',
  closed: 'closed',
  assigned: 'assigned',
  archived: 'archived',
}

export type OPPORTUNITY_STATUS = keyof typeof OPPORTUNITY_STATUS

export const OPPORTUNITY_SERVICE_REQUIREMENTS = {
  remote: 'remote',
  in_person: 'in_person',
  remote_or_in_person: 'remote_or_in_person',
}

export type OPPORTUNITY_SERVICE_REQUIREMENTS = keyof typeof OPPORTUNITY_SERVICE_REQUIREMENTS

export const CLIENT_TYPE = {
  individual: 'individual',
  company: 'company',
}

export type CLIENT_TYPE = keyof typeof CLIENT_TYPE

export const booking_status = {
  reserved: 'reserved',
  confirmed: 'confirmed',
  canceled: 'canceled',
}

export type booking_status = keyof typeof booking_status

export const HTTP_METHOD = {
  POST: 'POST',
  PATCH: 'PATCH',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS',
}

export type HTTP_METHOD = keyof typeof HTTP_METHOD

export const URI_TYPE = {
  deauthorize: 'deauthorize',
  redirect: 'redirect',
}

export type URI_TYPE = keyof typeof URI_TYPE

export const PAYMENT_STATUS = {
  opened: 'opened',
  completed: 'completed',
  authorized: 'authorized',
  refunded: 'refunded',
  failed: 'failed',
}

export type PAYMENT_STATUS = keyof typeof PAYMENT_STATUS

export const TWO_FACTOR_METHOD_TYPE = {
  authenticator_app: 'authenticator_app',
}

export type TWO_FACTOR_METHOD_TYPE = keyof typeof TWO_FACTOR_METHOD_TYPE

export const HISTORY_ACTION = {
  create: 'create',
  update: 'update',
  add_share: 'add_share',
  delete_share: 'delete_share',
  change_owner: 'change_owner',
  accept_booking: 'accept_booking',
  decline_booking: 'decline_booking',
  url_privacy: 'url_privacy',
  open: 'open',
  close: 'close',
  archive: 'archive',
  enable: 'enable',
  disable: 'disable',
  reschedule: 'reschedule',
  trash: 'trash',
  restore: 'restore',
  upload: 'upload',
  add_to_project: 'add_to_project',
  remove_from_project: 'remove_from_project',
  opportunity_express_interest: 'opportunity_express_interest',
  opportunity_cancel_express_interest: 'opportunity_cancel_express_interest',
  opportunity_assign_provider: 'opportunity_assign_provider',
  opportunity_unassign_provider: 'opportunity_unassign_provider',
  enable_chat: 'enable_chat',
  disable_chat: 'disable_chat',
  start_chat: 'start_chat',
  confirm: 'confirm',
  vote: 'vote',
  cancel: 'cancel',
  accept: 'accept',
  decline: 'decline',
  workspace_join: 'workspace_join',
  workspace_left: 'workspace_left',
  invite: 'invite',
  delete: 'delete',
}

export type HISTORY_ACTION = keyof typeof HISTORY_ACTION

export const RESERVATION_STATUS = {
  pending: 'pending',
  confirmed: 'confirmed',
  cancelled: 'cancelled',
}

export type RESERVATION_STATUS = keyof typeof RESERVATION_STATUS

export const TRANSCRIPTION_ENGINE = {
  openai: 'openai',
  ctranslate2: 'ctranslate2',
  iotype: 'iotype',
}

export type TRANSCRIPTION_ENGINE = keyof typeof TRANSCRIPTION_ENGINE

/** types */
export type meeting_user = {
  meeting_user_id: number
  meeting_id: number
  meeting_user_note: {
    note_id: number | null
  }[]
  user_id: number
  status: MEETING_USER_STATUS
  joined_at: Date | null
  left_at: Date | null
  talking_time: number | null
  calc_permission: number
  is_voted: boolean
  is_seen: boolean
  is_shared_explicitly: boolean
  meta: any
  is_busy: boolean
  request_type: ATTENDEE_REQUEST_TYPE
  request_status: ATTENDEE_REQUEST_STATUS
  is_starred: boolean
  updated_at: Date
  created_at: Date
  knocking_time: Date | null
  viewed_at: Date | null
  access_main_room: boolean
  is_visible_on_profile: boolean
}

export type meeting = {
  meeting_id: number
  meeting_hash: string
  url: string
  type: MEETING_TYPE
  max_attendee: number | null
  workspace_id: number
  is_poll: boolean
  user_id: number
  meeting_recurrence_id: number | null
  server_id: number | null
  main_room_id: number | null
  name: string
  description: string | null
  meta: any
  chat_id: string | null
  chat_name: string | null
  status: number
  is_enabled: boolean
  url_privacy: URL_PRIVACY
  url_password: string | null
  url_expire_at: Date | null
  is_search_indexable: boolean
  is_e2ee: boolean
  is_chat_enable: boolean
  reset_after_close: boolean
  started_at: Date | null
  ended_at: Date | null
  created_at: Date
  updated_at: Date
  max_session_length: number | null
  enable_presentation_permit: MEETING_PERMIT
  enable_chat_permit: MEETING_PERMIT
  enable_recording_permit: MEETING_PERMIT
  enable_raise_hand_permit: MEETING_PERMIT
  view_transcription_permit: MEETING_PERMIT
  add_agenda_permit: MEETING_PERMIT
  is_local_recording_enable: boolean
  is_cloud_recording_enable: boolean
  is_cloud_recording_autostart: boolean
  is_transcription_autostart: boolean
  meeting_timer_status: MEETING_TIMER_STATUS
  elapsed_time: number
}

export type breakoutroom_setting = {
  meeting_room_setting_id: number
  is_enabled: boolean
  is_allowed_to_main_room: boolean
  closure_timeout: number
  terminate_on_minute: number | null
}

export type meeting_recurrence = {
  meeting_recurrence_id: number
  type: DATE_INTERVAL
  recur_type: RECURRENCE_RECUR_TYPE | null
  repeat_every: number | null
  repeat_interval: number | null
  monthly_at_same_week_and_day: boolean | null
  monthly_type: MONTHLY_RECURRENCE_TYPE | null
  weekly_days: any
  end_date: Date | null
}

export type meeting_timeslot = {
  meeting_timeslot_id: number
  meeting_id: number
  is_confirmed: boolean
  initial_order: number | null
  start: Date
  end: Date
}

export type meeting_location = {
  meeting_location_id: number
  value: string | null
  meta: any
  meeting_id: number
  location_id: number | null
}

export type meeting_project = {
  meeting_project_id: number
  user_id: number
  project_id: number
  meeting_id: number
  created_at: Date
}

export type meeting_share = {
  meeting_share_id: number
  share_id: number
  meeting_id: number
}

export type timezone = {
  timezone_id: number
  name: string
  offset: number | null
  abbr: string | null
}

export type share = {
  share_id: number
  workspace_id: number
  src_user_id: number
  dst_user_id: number | null
  dst_usergroup_id: number | null
  type: SHARE_TYPE
  permission: number
  module_id: number
  meta: any
  sharing_label_id: number | null
  created_at: Date
}

export type workspace_user = {
  workspace_user_id: number
  user_id: number
  invited_by_user_id: number | null
  chat_user_id: string | null
  chat_username: string | null
  currency_id: number
  status: number
  is_guest: boolean
  workspace_id: number
  availability_template_id: number | null
  order: number | null
  created_at: Date
  role_id: number
  first_week_day: WEEK_DAY
  notification_count: number
}

export type workspace = {
  workspace_id: number
  user_id: number
  console_project_id: number
  name: string
  subdomain: string
  server_id: number
  workspace_type_id: number | null
  meta: any
  url_privacy: URL_PRIVACY
  url_password: string | null
  url_expire_at: Date | null
  is_search_indexable: boolean
  chat_id: string | null
  chat_name: string | null
  created_at: Date
  updated_at: Date
}

export type usergroup = {
  usergroup_id: number
  owner_id: number
  workspace_id: number
  module_id: number
  name: string
  description: string | null
  chat_id: string | null
  chat_name: string | null
  file_id: number | null
  created_at: Date
  updated_at: Date
  is_starred: boolean
}

export type user = {
  user_id: number
  user_hash: string
  console_project_id: number
  usertype_id: number | null
  username: string
  ban_count: number
  timezone_id: number | null
  country_id: number | null
  avatar_file_id: number | null
  status: number
  password: string | null
  role: USER_ROLE
  first_name: string
  last_name: string
  nickname: string | null
  is_2fa_enabled: boolean
  meta: any
  username_updated_at: Date | null
  last_signin: Date | null
  is_insider: boolean | null
  created_at: Date
  updated_at: Date | null
  last_visit: Date | null
}

export type location = {
  location_id: number
  name: string
  key: string
  icon: string
  created_at: Date
  updated_at: Date
}

export type file = {
  file_id: number
  file_hash: string
  name: string
  mime: string | null
  size: number | null
  path: string
  meta: any
  user_id: number | null
  workspace_id: number | null
  is_sys: boolean
  created_at: Date
}

export type private_file = {
  private_file_id: number
  name: string
  private_file_hash: string
  mime: string
  size: number
  path: string
  storage_bucket_id: number
  user_id: number
  trashed_at: Date | null
  is_parent_trashed: boolean | null
  folder_id: number | null
  trashed_by_user_id: number | null
  meta: any
  url_privacy: URL_PRIVACY
  url_password: string | null
  url_expire_at: Date | null
  is_search_indexable: boolean
  created_at: Date
  updated_at: Date
}
export type meeting_timeslot_vote = {
  meeting_timeslot_vote_id: number
  meeting_timeslot_id: number
  meeting_user_id: number
  order: number
  is_unavailable: boolean
  created_at: Date
}

export type header = {
  header_id: number
  type: HEADER_TYPE
  shape: HEADER_SHAPE
  position_y: string | null
  file_id: number | null
  user_id: number | null
  workspace_id: number | null
  module_id: number
  is_default: boolean
  created_at: Date
}

export type meeting_google = {
  google_event_id: string
  gmail: string
  user_id: number
  meeting_id: number
  created_at: Date
}

export type server = {
  server_id: number
  name: string
  url: string
  core_api_address: string
  core_ws_address: string
  hostname: string
  region: string
  country_id: number
  console_project_id: number
}

export type company = {
  company_id: number
  name: string
  file_id: number | null
  created_at: Date
}

export type job_position = {
  job_position_id: number
  name: string
  created_at: Date
}

export type country = {
  country_id: number
  name: string
  native_name: string
  alpha_2: string
  emoji: string
  phone_code: string
}

export type booking = {
  booking_id: number
  service_id: number | null
  user_id: number
  status: booking_status
  price: number
  duration: number
  location_id: number | null
  location_value: string | null
  currency_id: number
  variation_title: string | null
  book_time: Date
  meeting_id: number | null
  meta: any
  payment_id: number | null
  created_at: Date
  service_price_id: number | null
  show_company_name: boolean
  show_host_name: boolean
  updated_at: Date
}

export type cancelled_meeting = {
  meeting_id: number
  cancellation_cause: string | null
  user_id: number
  created_at: Date
}

export type currency = {
  currency_id: number
  code: string
  symbol: string | null
  symbol_native: string | null
  name: string | null
  decimal_digits: number
}

export type usergroup_user = {
  usergroup_user_id: number
  usergroup_id: number
  user_id: number | null
  contact_id: number | null
  created_at: Date
}

export type user_identity = {
  user_identity_id: number
  console_project_id: number
  user_id: number
  value: string
  type: IDENTITY_TYPE
  is_verified: boolean
  is_primary: boolean
  created_at: Date
  updated_at: Date
}

export type language = {
  language_id: number
  name: string | null
  native_name: string | null
  alpha_2: string | null
  is_rtl: boolean
  created_at: Date
}

export type usertype = {
  usertype_id: number
  console_project_id: number
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export type user_authorized_app = {
  authorized_app_id: number
  client_id: string
  user_id: number
}

export type api_connect = {
  api_connect_id: number
  user_id: number
  is_trust: boolean
  file_id: number | null
}

export type action = {
  action_id: number
  path: string | null
  method: HTTP_METHOD | null
  name: string
  scope: string
  parent_id: number | null
}

export type api_connect_client_action = {
  api_connect_client_action_id: number
  action_id: number
  client_id: string
  created_at: Date
}

export type profile_social = {
  profile_social_id: number
  link: string | null
  user_profile_id: number
  type: SOCIAL_ACCOUNT_TYPE
  created_at: Date
  updated_at: Date
}

export type profile_experience = {
  profile_experience_id: number
  user_profile_id: number
  order: number
  is_primary: boolean
  company_id: number | null
  job_position_id: number | null
  start_date: Date
  end_date: Date | null
  location: string
  created_at: Date
  updated_at: Date
}

export type profile_education = {
  profile_education_id: number
  user_profile_id: number
  order: number
  school_id: number | null
  degree_id: number | null
  start_date: Date
  end_date: Date | null
  created_at: Date
  updated_at: Date
}

export type school = {
  school_id: number
  name: string
  file_id: number | null
  created_at: Date
}

export type degree = {
  degree_id: number
  name: string
  created_at: Date
}

export type profile_certification = {
  profile_certification_id: number
  user_profile_id: number
  order: number
  title: string
  certification_number: string
  date: Date
  created_at: Date
  updated_at: Date
}

export type user_profile_association = {
  profile_association_id: number
  user_profile_id: number
  order: number
  company_id: number | null
  job_position_id: number | null
  start_date: Date
  end_date: Date | null
  location: string
  created_at: Date
  updated_at: Date
}

export type user_profile_address = {
  profile_address_id: number
  location_latitude: number | null
  location_longitude: number | null
  address: string | null
  user_profile_id: number
  is_visible_by_map: boolean | null
  created_at: Date
  updated_at: Date
}

export type user_profile_award = {
  profile_award_id: number
  user_profile_id: number
  order: number
  title: string
  company_id: number | null
  date: Date
  created_at: Date
  updated_at: Date
}

export type service_price = {
  service_price_id: number
  title: string | null
  type: SERVICE_PRICE_TYPE
  service_id: number
  currency_id: number
  price: number
  show_free: boolean
  is_active: boolean
  duration: number
  order: number
  location_id: number | null
  location_value: string | null
  meta: any
  pay_with_stripe: boolean
  created_at: Date
  updated_at: Date | null
}

export type service = {
  service_id: number
  name: string
  url: string
  service_hash: string
  description: string | null
  availability_template_id: number | null
  from_date: Date | null
  to_date: Date | null
  period_time: number | null
  is_active: boolean
  max_booking_per_day: number | null
  min_booking_notice: number
  buffer_before_meeting: number
  buffer_after_meeting: number
  user_id: number
  url_privacy: URL_PRIVACY
  url_password: string | null
  url_expire_at: Date | null
  is_search_indexable: boolean
  booking_confirmation: BOOKING_CONFIRMATION
  max_attendee_booking_block: number | null
  is_draft: boolean
  start_time_increment: number
  workspace_id: number
  form_id: number | null
  meta: any
  terms_and_conditions: string | null
  created_at: Date
  updated_at: Date
  show_company_name: boolean
  show_host_name: boolean
  is_login_required: boolean | null
  meeting_id: number | null
}

export type availability_template = {
  availability_template_id: number
  name: string | null
  timezone_id: number | null
  type: AVAILABILITY_TEMPLATE_TYPE
  user_id: number | null
  workspace_id: number | null
}

export type availability = {
  availability_id: number
  start_time: Date
  end_time: Date
  date: Date | null
  type: AVAILABILITY_TYPE
  week_day: WEEK_DAY | null
  is_available: boolean | null
  availability_template_id: number
  created_at: Date
  updated_at: Date | null
}

export type service_project = {
  meeting_project_id: number
  project_id: number
  service_id: number
  user_id: number
  created_at: Date
}

export type service_host = {
  service_host_id: number
  service_id: number
  is_required: boolean | null
  user_id: number
}

export type service_booking_policy = {
  service_booking_policy_id: number
  allow_rescheduling: boolean | null
  cancellation_fee_type: CANCELLATION_FEE_TYPE
  cancellation_fee_amount: number | null
  title: string | null
  auto_generate_policy: boolean
  policy_message: string | null
  cancellation_window_minutes: number
  is_enabled: boolean | null
  service_id: number
}

export type service_user = {
  service_user_id: number
  user_id: number
  service_id: number
  calc_permission: number
  is_shared_explicitly: boolean
  created_at: Date
  updated_at: Date
  viewed_at: Date | null
  is_visible_on_profile: boolean
}

export type api_connect_key = {
  client_id: string
  secret_key: string
  name: string
  website_url: string | null
  file_id: number | null
  api_connect_id: number
  created_at: Date
  updated_at: Date
}

export type api_connect_log = {
  api_connect_log_id: number
  status: number
  method: HTTP_METHOD
  api_connect_id: number
  description: string | null
  ip: string | null
  module_id: number
  origin: string | null
  created_at: Date
  updated_at: Date
}

export type note_project = {
  note_project_id: number
  user_id: number
  project_id: number
  note_id: number
  created_at: Date
}

export type project = {
  project_id: number
  project_hash: string
  id: string | null
  user_id: number
  workspace_id: number
  name: string
  description: string | null
  created_at: Date
  updated_at: Date
  url_privacy: URL_PRIVACY
  url_password: string | null
  url_expire_at: Date | null
  is_search_indexable: boolean
  meta: any
  status: PROJECT_STATUS
  due_date: Date | null
}

export type virtual_background = {
  virtual_background_id: number
  user_id: number | null
  thumbnail: string | null
  file_id: number
}

export type console_project_module = {
  console_project_module_id: number
  user_id: number | null
  module_id: number
  console_project_id: number
  created_at: Date
}

export type role = {
  role_id: number
  name: string
  workspace_id: number | null
  is_default: boolean
  created_at: Date
  updated_at: Date
}

export type sharing_label = {
  sharing_label_id: number
  title: string
  workspace_user_id: number
  created_at: Date
}

export type widget = {
  widget_id: number
  key: string
  name: string
  parent_id: number | null
}

export type user_widget = {
  user_widget_id: number
  user_id: number
  workspace_id: number
  order: number | null
  widget_id: number
  created_at: Date
  updated_at: Date
}

export type search_history = {
  search_history_id: number
  user_id: number
  workspace_id: number
  keyword: string
  created_at: Date
  searched_at: Date
}

export type workspace_profile_association = {
  profile_association_id: number
  workspace_profile_id: number
  order: number
  company_id: number | null
  job_position_id: number | null
  start_date: Date
  end_date: Date | null
  location: string
  created_at: Date
  updated_at: Date
}

export type workspace_profile_address = {
  profile_address_id: number
  location_latitude: number | null
  location_longitude: number | null
  address: string | null
  workspace_profile_id: number
  is_visible_by_map: boolean | null
  created_at: Date
  updated_at: Date
}

export type workspace_profile_award = {
  profile_award_id: number
  workspace_profile_id: number
  order: number
  title: string
  company_id: number | null
  date: Date
  created_at: Date
  updated_at: Date
}

export type module = {
  module_id: number
  key: string
  name: string
  subtitle: string | null
  description: string
  version: string
  file_id: number | null
  parent_id: number | null
  is_sys: boolean
  is_visible: boolean
  is_on_marketplace: boolean
  status: number
  user_id: number | null
  module_category_id: number | null
  created_at: Date
  updated_at: Date
}

export type IDocumentChildFeatures = {
  document_child_id: number
  document_child_hash: string
  document_block_id: number
  text: string | null
  document_block_type: {
    document_block_type_id: number
    key: string
  }
  placeholder: string | null
  document_mark_color: string | null
  document_mark_type:
    | {
        document_mark_type_id: number
        key: DOCUMENT_MARK_TYPE
        document_child_id: number
      }[]
    | null
}

// export type document_child = {
//   document_child_id: number;
//   document_child_hash: string;
//   document_block_id: number;
//   text: string | null;
//   document_block_type: {
//     document_block_type_id: number;
//     key: string;
//   };
//   placeholder: string | null;
//   document_mark_color: string | null;
//   document_mark_type: {
//     document_mark_type_id: number;
//     key: DOCUMENT_MARK_TYPE;
//     document_child_id: number;
//   }[] | null;
//   children?: document_child[];
// };

// This is for maximum 5 layers of children
// If our children layers be increased we should increase this layers too
export type document_child = {
  children?: {
    children?: {
      children?: {
        children?: {
          children?: IDocumentChildFeatures[]
        } & IDocumentChildFeatures[]
      } & IDocumentChildFeatures[]
    } & IDocumentChildFeatures[]
  } & IDocumentChildFeatures[]
} & IDocumentChildFeatures

export type module_config = {
  module_config_id: number
  module_id: number
  name: string
  description: string | null
  is_visible: boolean | null
  is_editable: boolean
  system_asset_id: number | null
  parent_id: number | null
}

export type notification = {
  notification_id: number
  workspace_id: number | null
  src_user_id: number | null
  dst_user_id: number
  template: NOTIFICATION_TEMPLATE
  meta: any
  is_seen: boolean
  is_read: boolean
  created_at: Date
  updated_at: Date
}

export const ONBOARDING_INDUSTRY = {
  technology: 'technology',
  finance: 'finance',
  food_beverage: 'food_beverage',
  legal_services: 'legal_services',
  real_estate: 'real_estate',
  consumer_goods: 'consumer_goods',
  automotive: 'automotive',
  arts: 'arts',
  healthcare: 'healthcare',
  insurance: 'insurance',
  hospitality: 'hospitality',
  education: 'education',
  media: 'media',
  sports: 'sports',
  other: 'other',
}

export type ONBOARDING_INDUSTRY = keyof typeof ONBOARDING_INDUSTRY

export const ONBOARDING_ROLE_AT_WORK = {
  executive_business_owner: 'executive_business_owner',
  legal: 'legal',
  analyst: 'analyst',
  project_manager: 'project_manager',
  finance: 'finance',
  human_resources: 'human_resources',
  marketing: 'marketing',
  consultant: 'consultant',
  sales: 'sales',
  engineer: 'engineer',
  content_creator: 'content_creator',
  educator: 'educator',
  healthcare_professional: 'healthcare_professional',
  other: 'other',
}

export type ONBOARDING_ROLE_AT_WORK = keyof typeof ONBOARDING_ROLE_AT_WORK

export const ONBOARDING_USING_PLATFORM_FOR = {
  sell_my_services_online: 'sell_my_services_online',
  book_meetings: 'book_meetings',
  team_collaboration: 'team_collaboration',
  meet_with_clients: 'meet_with_clients',
  client_relationship_management: 'client_relationship_management',
}

export type ONBOARDING_USING_PLATFORM_FOR = keyof typeof ONBOARDING_USING_PLATFORM_FOR

export const ONBOARDING_TEAM_MEMBERS_NUMBER = {
  n_1: 'n_1',
  n_2_10: 'n_2_10',
  n_11_50: 'n_11_50',
  n_51_100: 'n_51_100',
  n_more_than_100: 'n_more_than_100',
}

export type ONBOARDING_TEAM_MEMBERS_NUMBER = keyof typeof ONBOARDING_TEAM_MEMBERS_NUMBER

export const AI_SESSION_TYPE = {
  assistant: 'assistant',
  chrome_app: 'chrome_app',
  meeting: 'meeting',
  project: 'project',
  note: 'note',
  sql: 'sql',
}

export type AI_SESSION_TYPE = keyof typeof AI_SESSION_TYPE
export const AI_SESSION_STATE = {
  open: 'open',
  close: 'close',
}

export type AI_SESSION_STATE = keyof typeof AI_SESSION_STATE
