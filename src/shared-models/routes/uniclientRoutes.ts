import { IPaginationReq, MODULE_KEY_TYPE, RequestMethods } from '../interfaces/index.js'

// const base = '/api/v1';
const base = '/api/v1'
const imageBase = '/api/upload/'
const auth = base + '/auth'
const service = base + '/service'
const oauth = base + '/oauth'
const workspace = base + '/workspace'
const document = base + '/document'
const meeting = base + '/meeting'
const breakoutRoom = base + '/breakoutroom'
const user = base + '/user'
const integration = base + '/integration'
const gallery = base + '/header'
const error = base + '/error/send'
const _module = base + '/module'
const virtualBackground = base + '/virtual.background'
const booking = base + '/booking'
const availability_template = service + '/template-availability'
const locations = base + '/locations'
const legalerConnect = base + '/connect'
const sharing = base + '/sharing'
const room = base + '/room'
const billing = base + '/billing'
const file = base + '/file'
const task = base + '/task'
const enum PathConstant {
  BASE_PATH = '/api',
}

const enum BasePath {
  V1 = PathConstant.BASE_PATH + '/v1',
}

export const enum Prefixes {
  AUTH = '/auth',
  BILLING = '/billing',
  BOOKING = '/booking',
  MEETING = '/meeting',
  ROOM = '/room',
  PROJECT = '/project',
  OPPORTUNITY = '/opportunity',
  CONTACT = '/contact',
  DOCUMENT = '/document',
  WORKSPACE = '/workspace',
  WORKSPACE_SETTINGS = '/workspace/settings',
  USER = '/user',
  INTEGRATION = '/integration',
  SHARING = '/sharing',
  OAUTH = '/oauth',
  TEMPLATE_AVAILABILITY = '/template-availability',
  LOCATIONS = '/locations',
  LEGALER_CONNECT = '/connect',
  SERVICE = '/service',
  BREAKOUTROOM = '/breakoutroom',
  CHAT = '/chat',
  FILE = '/file',
  TASK = '/task',
}

export const enum Routes {
  AUTH = BasePath.V1 + Prefixes.AUTH,
  BILLING = BasePath.V1 + Prefixes.BILLING,
  BOOKING = BasePath.V1 + Prefixes.BOOKING,
  MEETING_ = BasePath.V1 + Prefixes.MEETING,
  ROOM = BasePath.V1 + Prefixes.ROOM,
  PROJECT = BasePath.V1 + Prefixes.PROJECT,
  CONTACT = BasePath.V1 + Prefixes.CONTACT,
  DOCUMENT = BasePath.V1 + Prefixes.DOCUMENT,
  WORKSPACE = BasePath.V1 + Prefixes.WORKSPACE,
  WORKSPACE_SETTINGS = BasePath.V1 + Prefixes.WORKSPACE_SETTINGS,
  USER = BasePath.V1 + Prefixes.USER,
  INTEGRATION = BasePath.V1 + Prefixes.INTEGRATION,
  SHARING = BasePath.V1 + Prefixes.SHARING,
  OAUTH = BasePath.V1 + Prefixes.OAUTH,
  TEMPLATE_AVAILABILITY = BasePath.V1 + Prefixes.TEMPLATE_AVAILABILITY,
  LOCATIONS = BasePath.V1 + Prefixes.LOCATIONS,
  LEGALER_CONNECT = BasePath.V1 + Prefixes.LEGALER_CONNECT,
  SERVICE = BasePath.V1 + Prefixes.SERVICE,
  BREAKOUTROOM = BasePath.V1 + Prefixes.BREAKOUTROOM,
  ROOT = BasePath.V1,
  CHAT = BasePath.V1 + Prefixes.CHAT,
  FILE = BasePath.V1 + Prefixes.FILE,
  TASK = BasePath.V1 + Prefixes.TASK,
}

export const uniclientRoutes = {
  baseAddress: base,
  imageBase,
  /** @see {@link IGetServerLocationsApi} @method GET */
  getServerLocations: `${base}/server.location`,

  /** @see {@link IInitAppApi} @method GET */
  initApp: `${base}/init-app`,

  /** @see {@link IGetDummyDataApi} @method GET */
  dummyData: `${base}/mock-data`,

  /** @see {@link IGetAllKnockMusicsApi} @method GET */
  getKnockMusics: `${base}/music/knock`,

  /** @see {@link IHandleUploadImageApi} @method POST */
  upload: `${base}/upload`,

  /** @see {@link IHandleMagicTokenResponseApi} @method POST */
  handleMagicTokenResponse: (token: string) => `${base}/handle.token/${token}`,

  /** @see {@link IGetMagicTokenInfoApi} @method GET */
  magicTokenInfo: (token: string) => `${base}/token.info/${token}`,

  /** @see {@link IGetMapAutoCompletedApi} @method POST */
  mapAutoCompleted: `${base}/map/autoCompleted`,

  /** @see {@link IGetMapPlaceDetailApi} @method POST */
  mapDetail: `${base}/map/detail`,

  currency: {
    /** @see {@link IGetAllCurrenciesApi} @method GET */
    get: `${base}/currency`,
  },

  /** @see {@link IUniclientIntegrationAuthCallbackApi} @method GET */
  integrationAuthCallback: `${base}/integration-auth/callback`,

  /** @see {@link IStarApi} @method POST */
  star: `${base}/star`,

  /** @see {@link IStoreLogsApi} @method POST */
  storeLogs: `${base}/logs`,

  timezone: {
    /** @see {@link IGetAllTimezonesApi} @method GET */
    get: `${base}/timezone`,
  },

  language: {
    /** @see {@link IGetAllLanguagesApi} @method GET */
    get: `${base}/language`,
  },

  accessList: {
    /** @see {@link IGetAccessListApi} @method GET */
    get: `${base}/access`,
  },

  label: {
    /** @see {@link IGetAvailableLabelsApi} @method GET */
    get: `${base}/label`,
  },

  ratings: {
    /** @see {@link ICreateModuleRatingApi} @method POST */
    create: (module_key: MODULE_KEY_TYPE) => `${base}/rating/${module_key}`,

    /** @see {@link IGetModuleRatingsApi} @method GET */
    getAll: (module_key: MODULE_KEY_TYPE) => `${base}/rating/${module_key}`,
  },

  ai: {
    /** @see {@link IAskAIApi} @method POST */
    askAI: () => `${base}/ai`,
    /** @see {@link IGetAiSessionApi} @method GET */
    getAiSession: (ai_session_hash: string) => `${base}/ai/${ai_session_hash}`,
    /** @see {@link IGetAiSessionsListApi} @method GET */
    getAiSessionsList: () => `${base}/ai`,
  },

  auth: {
    /** @see {@link ICheckEmailApi} @method POST */
    checkEmail: auth + '/check',

    /** @see {@link IValidateUniclientOTPApi} @method POST */
    validateOTP: auth + '/validate-otp',

    /** @see {@link IGenerateUniclientOTPApi} @method POST */
    generateOTP: auth + '/generate-otp',

    /** @see {@link IUniclientSignupApi} @method POST */
    signUp: auth + '/signup',

    /** @see {@link ISignupGuestApi} @method POST */
    signupGuest: auth + '/signup-guest',

    /** @see {@link IUniclientLogoutApi} @method POST */
    logout: auth + '/logout',

    /** @see {@link IUniclientLogoutAllApi} @method POST */
    logoutAll: auth + '/logout-all',

    /** @see {@link ISigninTokenApi} @method POST */
    signInWithToken: auth + '/signin-token',

    /** @see {@link IForgotPasswordApi} @method POST */
    forgotPassword: auth + '/forgot-password',

    /** @see {@link ISetGuestPasswordApi} @method POST */
    setGuestPassword: auth + '/set-guest-password',
  },
  oauth: {
    /** @see {@link IUniclientOAuthAuthorizeApi} @method GET */
    google: oauth + '/google',

    /** @see {@link IHandleClioOAuthCallbackApi} @method GET */
    clio: oauth + '/clio',

    /** @see {@link IHandleFacebookOAuthCallbackApi} @method GET */
    facebook: oauth + '/facebook',

    /** @see {@link IGenerateMicrosoftAuthUrlApi} @method GET */
    microsoft: oauth + '/microsoft',

    /** @see {@link IMagicLinkLoginApi} @method POST */
    magicLink: oauth + '/magic-link',

    uniclient: {
      /** @see {@link IUniclientOAuthAuthorizeApi} @method POST */
      signIn: oauth + '/authorize',

      /** @see {@link IRefreshAccessTokenApi} @method POST */
      refreshAccessToken: oauth + '/token',

      /** @see {@link IUniclientConnectAppApi} @method POST */
      connectApp: oauth + '/authorize/accept',
    },
  },
  integrations: {
    GoogleCalendar: {
      /** @see {@link IGenerateCalendarAuthUrlResData} @method GET */
      connect: () => `${integration}/google.calendar/connect`,

      /** @see {@link IDisconnectGoogleCalendarApi} @method DELETE */
      disconnect: () => `${integration}/google.calendar/disconnect`,

      /** @see {@link IUniclientGCalendarSelectCalendarApi} @method POST */
      selectCalendar: () => `${integration}/google.calendar/select-calendar`,

      /** @see {@link IUniclientGCalendarGetEventRes} @method GET */
      get_event: `${integration}/google.calendar/get_event`,

      /** @see {@link IUniclientGCalendarAddEventRes} @method POST */
      add_event: `${integration}/google.calendar/`,
    },
    GoogleContacts: {
      /** @see {@link IGenerateContactsAuthUrlApi} @method GET */
      connect: () => `${integration}/google.contacts/connect`,

      /** @see {@link IDisconnectGoogleContactsApi} @method DELETE */
      disconnect: () => `${integration}/google.contacts/disconnect`,

      /** @see {@link ISyncGoogleContactsApi} @method GET */
      sync: (user_gmail: string) => `${integration}/google.contacts/connect/sync/${user_gmail}`,
    },
    clio: {
      /** @see {@link IConnectClioApi} @method  GET */
      connect: () => `${integration}/clio/connect`,

      /** @see {@link IDisconnectClioApi} @method DELETE */
      disconnect: (user_integrated_module_id: number) => `${integration}/clio/${user_integrated_module_id}/disconnect`,

      /** @see {@link IImportClioDataApi} @method POST */
      import: () => `${integration}/clio/import`,

      /** @see {@link IExportClioDataApi} @method POST */
      export: () => `${integration}/clio/export`,
    },
    miro: {
      /** @see {@link IMiroConnectApi} @method GET */
      miroJWT: () => `${integration}/miro`,
    },
    outlookCalendar: {
      /** @see {@link IUniclientOutlookCalendarConnectApi} @method GET */
      connect: () => `${integration}/outlook/connect`,

      /** @see {@link IDisconnectOutlookCalendarApi} @method DELETE */
      disconnect: () => `${integration}/outlook/disconnect`,

      /** @see {@link IUniclientOutlookCalendarGetEventApi} @method DELETE */
      getEvent: `${integration}/outlook/get_event`,

      /** @see {@link IUniclientOutlookCalendarAddEventApi} @method POST */
      addEvent: `${integration}/outlook/`,

      /** @see {@link IUniclientOutlookCalendarUpdateEventApi} @method PATCH */
      updateEvent: (eventId: string) => `${integration}/outlook/${eventId}`,

      /** @see {@link IUniclientOutlookCalendarDeleteEventApi} @method PATCH */
      deleteEvent: (eventId: string) => `${integration}/outlook/delete/${eventId}`,

      /** @see {@link IOutlookSelectCalendarApi} @method POST */
      selectCalendar: () => `${integration}/outlook/select-calendar`,
    },
    stripe: {
      /** @see {@link IConnectStripeApi} @method POST */
      connect: `${integration}/stripe/connect`,

      /** @see {@link IDisconnectStripeApi} @method POST */
      disconnect: () => `${integration}/stripe/disconnect`,

      /** @see {@link IGetUserStripeAccountApi} @method GET */
      getUserAccountDetails: () => `${integration}/stripe/detail`,
    },
    slack: {
      /** @see {@link IEditSlackIntegrationApi} @method PUT */
      sync: (workspace_user_slack_hash: string) => `${integration}/slack/${workspace_user_slack_hash}`,
    },

    magicLink: {
      /** @see {@link IMagicLinkConnectApi} @method POST */
      connect: () => `${integration}/magic-link/connect`,
    },

    clickup: {
      /** @see {@link IGenerateClickUpAuthUrlApi} @method GET */
      connect: () => `${integration}/clickup/connect`,

      /** @see {@link IClickUPListSpacesApi} @method GET */
      getAllSpaces: (team_id: string) => `${integration}/clickup/space/${team_id}`,

      /** @see {@link IClickUPListFoldersApi} @method GET */
      getAllFolders: (space_id: string) => `${integration}/clickup/folder/${space_id}`,

      /** @see {@link IClickUPGetAllListsApi} @method GET */
      getAllLists: (list_id: string) => `${integration}/clickup/list/${list_id}`,

      /** @see {@link IClickUPGetAllListsApi} @method POST */
      selectClickUpList: () => `${integration}/clickup/select-list`,

      /** @see {@link IClickUPDisconnectApi} @method DELETE */
      disconnect: (user_integrated_module_id: number) => `${integration}/clickup/disconnect/${user_integrated_module_id}`,
    },
  },

  chat: {
    /** @see {@link IEnableChatApi} @method POST */
    enable: `${Routes.CHAT}/enable`,

    /** @see {@link IDisableChatApi} @method POST */
    disable: () => `${Routes.CHAT}/disable`,

    /** @see {@link IStartChatApi} @method POST */
    start: `${Routes.CHAT}/start`,

    /** @see {@link ICheckUserRoleForChatActionApi} @method POST */
    checkRole: () => `${Routes.CHAT}/check-role`,

    /** @see {@link IStartDirectMessageApi} @method POST */
    startDirectMessage: () => `${Routes.CHAT}/direct`,

    /** @see {@link ICheckUserStatusApi} @method POST */
    status: `${Routes.CHAT}/status`,

    /** @see {@link ISetUserStatusApi} @method POST */
    setStatus: `${Routes.CHAT}/set-status`,
  },
  user: {
    /** @see {@link IGetMeApi} @method GET */
    getMe: `${user}/me`,

    /** @see {@link IGetMyAccountsApi} @method GET */
    getMyAccounts: `${user}/accounts`,

    /** @see {@link IGetActiveModulesApi} @method GET */
    getActiveModules: `${user}/modules`,

    /** @see {@link IGetUserApi} @method GET */
    getUser: (user_hash: string) => `${user}/user/${user_hash}`,

    notification: {
      /** @see {@link IGetAllNotificationsApi}  @method GET */
      getAll: `${user}/notification`,

      /** @see {@link IBulkNotificationsActionApi}  @method POST */
      bulkAction: `${user}/notification/status/bulk-action`,

      /** @see {@link IUpdateNotificationStatusApi}  @method PUT */
      updateStatus: (notif_user_id: number) => `${user}/notification/status/${notif_user_id}`,

      /** @see {@link ITestNotificationApi}  @method GET */
      testNotification: `${user}/notification/test`,
    },
    profile: {
      /** @see {@link IGetUserProfileDetailApi} @method GET */
      getUserProfile: (url: string) => `${user}/profile/${url}`,

      /** @see {@link IGetMyUserProfileDetailApi} @method GET */
      getMyUserProfile: () => `${user}/profile.me`,

      /** @see {@link IUpdateUserProfileApi} @method PUT */
      editUserProfile: () => `${user}/profile`,
    },
    settings: {
      account: {
        /** @see {@link IGetAccountSettingsApi} @method GET */
        get: `${user}/settings/account`,

        /** @see {@link IUpdateAccountSettingsApi} @method PUT */
        edit: `${user}/settings/account`,

        /** @see {@link IUpdateAccountPasswordApi} @method PUT */
        editPassword: `${user}/settings/account/password`,

        /** @see {@link IUpdateUsernameApi} @method PUT */
        editUsername: `${user}/settings/account/username`,

        /** @see {@link IUpdatePrimaryEmailApi} @method PUT */
        editPrimaryEmail: `${user}/settings/account/primary-email`,

        /** @see {@link ICheckUsernameApi} @method POST */
        checkUsername: `${user}/settings/account/check-username`,

        /** @see {@link IRemoveLoggedInSessionApi} @method DELETE */
        removeSession: (session_hash: string) => `${user}/settings/account/session/${session_hash}`,

        /** @see {@link IRemoveLoggedInSessionBulkApi} @method DELETE */
        removeSessionBulk: `${user}/settings/account/session/_bulk`,

        /** @see {@link IAddUserEmailApi} @method POST */
        addEmail: `${user}/settings/account/emails`,

        /** @see {@link IRemoveUserEmailApi} @method DELETE */
        removeEmail: (user_email_id: number) => `${user}/settings/account/emails/${user_email_id}`,

        /** @see {@link IDeleteUserApi} @method DELETE */
        deleteUser: `${user}/settings/account`,

        /** @see {@link IDisconnectAuthorizedAppApi} @method DELETE */
        deauthorize: (client_id: string) => `${user}/settings/account/authorized-apps/${client_id}`,
      },
      notifications: {
        /** @see {@link IGetUserNotificationSettingApi} @method GET */
        get: `${user}/settings/notifications`,

        /** @see {@link IUpdateUserNotificationSettingApi} @method PUT */
        update: `${user}/settings/notifications`,

        /** @see {@link IUpdateUserNotificationSettingApi} @method PATCH */
        updateToken: `${user}/settings/notification/token`,
      },
      integrations: {
        /** @see {@link IGetUserIntegrationsApi} @method GET */
        getAll: `${user}/settings/integrations`,

        /** @see {@link IGetIntegrationApi} @method GET */
        get: (module_key: MODULE_KEY_TYPE) => `${user}/settings/integrations/${module_key}`,

        /** @see {@link IEditIntegrationConfigApi} @method PUT */
        editIntegrationConfig: (module_id: number, user_integrated_module_id: number) =>
          `${user}/settings/integrations/${module_id}/config/${user_integrated_module_id}`,
      },
    },
  },
  gallery: {
    // not set
    /** @see {@link IGetAllGalleryApi} @method GET */
    getAll: `${gallery}`,

    /** @see {@link IGetRecentGalleryUploadsApi} @method POST */
    getRecentUploads: `${gallery}/recent.uploads`,
  },

  error: {
    /** @see {@link IErrorSendApi} @method GET */
    send: `${error}`,
  },

  firebase: {
    /** @see {@link IGetFirebaseConstantsApi} @method GET */
    getFirebaseConstants: `${BasePath.V1}/firebase/constants`,
  },

  module: {
    // not set
    /** @see {@link ISetImageAsDefaultToModuleApi} @method POST */
    setImageAsDefault: `${_module}/set.image.default`,

    /** @see {@link IGetModuleCoverAndLogoApi} @method GET */
    getCoverAndLogo: `${_module}/get.module.header`,

    /** @see {@link ISelectImageToModuleHeaderApi} @method POST */
    selectImageHeader: `${_module}/select.image.header`,

    /** @see {@link IGetModuleDefaultApi} @method POST */
    getModuleDefault: `${_module}/get.image.default`,

    /** @see {@link IUpdateImageHeaderApi} @method PATCH */
    updateHeader: `${_module}/update-image-header`,

    /** @see {@link IMakeLogoToLetterApi} @method POST */
    makeLogoToLetter: `${_module}/letter-logo`,

    /** @see {@link IRemoveImageFromModuleHeaderApi} @method POST */
    removeImageHeader: `${_module}/remove.image.header`,

    /** @see {@link IAddToProjectApi} @method POST */
    addToProject: `${_module}/add-to-project`,

    /** @see {@link IRemoveFromProjectApi} @method DELETE */
    removeFromProject: `${_module}/remove-from-project`,

    /** @see {@link IGetStoredInProjectApi} @method GET */
    getStoredInProject: `${_module}/get-stored-in-project`,

    /** @see {@link IGetModuleProjectsApi} @method GET */
    getModuleProject: `${_module}/projects`,

    /** @see {@link ICheckModuleExistenceApi} @method GET */
    checkExistence: `${_module}/check`,
  },

  virtualBackground: {
    // not set
    /** @see {@link IGetAllVirtualBackgroundApi} @method GET */
    getAll: `${virtualBackground}`,
  },

  workspace: {
    /** @see {@link ICreateWorkspaceApi} @method POST @description req should be miltipart data should be stringified */
    create: workspace,

    /** @see {@link IGetWorkspacesApi}  @method GET */
    getAll: workspace,

    /** @see {@link IGetWorkspaceApi}  @method GET */
    get: `${workspace}/detail`,

    /** @see {@link IChangeWorkspaceOrderApi}   @method PATCH */
    changeOrder: `${workspace}/order`,

    /** @see {@link ISelectWorkspaceApi}  @method POST */
    select: () => `${workspace}/select`,

    /** @see {@link IUpdateWorkspaceApi} @method PUT */
    updateWorkspace: () => `${workspace}`,

    /** @see {@link IDeleteWorkspaceApi} @method DELETE */
    deleteWorkspace: () => `${workspace}`,

    /** @see {@link IRemoveWorkspaceLogoApi} @method DELETE */
    removeWorkspaceLogo: () => `${workspace}/logo`,

    /** @see {@link IUpdateWorkspaceLogoApi} @method POST */
    updateWorkspaceLogo: () => `${workspace}/logo`,

    /** @see {@link IInviteUsersToWorkspaceApi} @method POST */
    inviteUsersToWorkspace: () => `${workspace}/invite`,

    /** @see {@link ISearchUserApi} @method GET */
    searchUser: `${workspace}/search/user`,

    /** @see {@link ICheckWorkspaceApi}  @method POST */
    check: `${workspace}/check`,

    // /** @see {@link IReservationApi}  @method POST */
    // reservation: `${workspace}/reservation`,

    /** @see {@link ICheckMeInWorkspaceApi}  @method POST */
    checkMe: `${workspace}/check-me`,

    /** @see {@link IGetCalendarDataApi} @method GET */
    getCalendarData: () => `${workspace}/calendar`,

    /** @see {@link IGetEventDetailApi} @method POST */
    getEventDetail: () => `${workspace}/calendar/event.detail`,

    /** @see {@link IGetQuickAccessApi} @method GET */
    getQuickAccess: () => `${workspace}/quick-access`,

    /** @see {@link ISearchInModulesApi} @method GET */
    searchInModules: () => `${workspace}/search/modules`,

    /** @see {@link IAddToSearchHistoryApi} @method POST */
    addToHistory: () => `${workspace}/search/history`,

    /** @see {@link IRemoveFromSearchHistoryApi} @method DELETE */
    removeFromHistory: (search_history_id: number) => `${workspace}/search/history/${search_history_id}`,

    /** @see {@link IGetSearchHistoriesApi} @method GET */
    getHistories: () => `${workspace}/search/history`,

    /** @see {@link ISearchInPeopleApi} @method GET */
    searchInPeople: () => `${workspace}/search/people`,

    /** @see {@link IGetWorkspaceStorageUsageApi} @method GET */
    getStorage: () => `${workspace}/storage`,

    /** @see {@link ISetBlockingEventApi} @method POST */
    setBlockingEvent: () => `${workspace}/set-block-event`,

    /** @see {@link ICheckCalendarAvailabilityApi} @method POST */
    checkCalendarAvailability: `${workspace}/check-calendar-availability`,

    /** @see {@link IWorkspaceChatSearchApi} @method GET */
    chats: `${workspace}/chats`,
    profile: {
      /** @see {@link IGetTeamProfileDetailApi} @method GET */
      getTeamProfile: () => `${workspace}/profile`,

      /** @see {@link IUpdateTeamProfileApi} @method PUT */
      editTeamProfile: () => `${workspace}/profile`,
    },

    meeting: {
      /** @see {@link IInstantMeetingApi}  @method POST */
      instantMeeting: () => `${meeting}/instant`,

      /** @see {@link IAddMeetingAndRoomApi}  @method POST */
      addMeetingAndRoom: () => `${meeting}/meeting_room`,

      /** @see {@link IAddMeetingApi}  @method POST */
      addMeeting: () => `${meeting}`,

      /** @see {@link IStartMeetingApi} @method POST */
      start: (meeting_hash: string) => `${meeting}/${meeting_hash}/start`,

      /** @see {@link IGetMeetingListApi} @method POST */
      list: () => `${meeting}/list`,

      /** @see {@link IKnockToMeetingApi} @method POST */
      knock: (meeting_hash: string) => `${meeting}/${meeting_hash}/knock`,

      /** @see {@link ICancelKnockingApi} @method PATCH */
      cancelKnocking: (url: string) => `${meeting}/${url}/cancel.knock`,

      /** @see {@link ICloseMRApi}  @method POST */
      close: (meeting_hash: string) => `${meeting}/${meeting_hash}/close`,

      /** @see {@link ICancelCloseMRApi}  @method POST */
      cancelClose: (meeting_hash: string) => `${meeting}/${meeting_hash}/close/cancel`,

      /** @see {@link IReplyToJoiningAttendeeRequestApi} @method POST  */
      replyToJoiningAttendeeReq: (meeting_hash: string) => `${meeting}/${meeting_hash}/reply.join.attendee.req`,

      /** @see {@link IGetMeetingNotesApi} @method GET */
      getNotes: (meeting_hash: string) => `${meeting}/${meeting_hash}/note`,

      /** @see {@link ITranscribeMeetingAudioFileApi} @method POST */
      transcribeAudioFile: (meeting_hash: string) => `${meeting}/${meeting_hash}/transcription`,

      /** @see {@link IGetMeetingTranscriptionsApi} @method GET */
      getTranscriptions: (meeting_hash: string) => `${meeting}/${meeting_hash}/transcription`,

      /** @see {@link IMeetingAiApi} @method POST  */
      meetingAI: (meeting_hash: string) => `${meeting}/${meeting_hash}/ai`,

      /** @see {@link IGetMeetingAiApi} @method GET  */
      getMeetingAI: (meeting_hash: string) => `${meeting}/${meeting_hash}/ai`,

      /** @see {@link IPastMeetingAiApi} @method POST  */
      pastMeetingAI: (meeting_hash: string) => `${meeting}/${meeting_hash}/past.meeting.ai`,

      /** @see {@link IGetSuggestedAgendasAIApi} @method POST  */
      suggestedAgendaAI: (meeting_hash: string) => `${meeting}/${meeting_hash}/suggested.agenda.ai`,

      /** @see {@link IInitializeMeetingRoomApi} @method POST */
      initMR: (url: string) => `${meeting}/room/${url}/init.mr`,

      /** @see {@link IGetMeetingDetailApi} @method GET */
      getMeetingDetail: (meeting_hash: string) => `${meeting}/${meeting_hash}/detail`,

      /** @see {@link IVoteToMeetingTimeApi} @method POST */
      vote: (meeting_hash: string) => `${meeting}/${meeting_hash}/vote`,

      /** @see {@link IDeleteRoomApi} @method DELETE */
      deleteRoom: (meeting_hash: string) => `${meeting}/room/${meeting_hash}`,

      /** @see {@link IToggleChatApi} @method POST */
      toggleChat: () => `${meeting}/chat`,

      /** @see {@link IDeleteTemplateApi} @method DELETE  */ // wait what?
      delete: (availability_template_id: number) => `${availability_template}/${availability_template_id}`,

      /** @see {@link IConfirmMeetingApi}  @method POST */
      confirm: (meeting_hash: string) => `${meeting}/${meeting_hash}/confirm`,

      /** @see {@link ICancelMeetingApi}  @method POST */
      cancel: (meeting_hash?: string) => `${meeting}/${meeting_hash}/cancel`,

      /** @see {@link IGetAvailableAttendeesApi}  @method POST */
      getAvailablePeople: `${meeting}/available-people`,

      /** @see {@link IUserManageMeetingInviteApi}  @method POST */
      userManageMeetingInvite: (meeting_hash: string) => `${meeting}/${meeting_hash}/user.manage.invite`,

      /** @see {@link IEditMeetingApi}  @method PUT */
      edit: (meeting_hash: string) => `${meeting}/${meeting_hash}`,

      /** @see {@link IRemoveMeetingApi}  @method DELETE */
      removeMeeting: (meeting_hash: string) => `${meeting}/${meeting_hash}`,

      /** @see {@link IChangeFreeBusyStatusApi}  @method POST */
      freeBusy: (meeting_hash: string) => `${meeting}/free-busy/${meeting_hash}`,

      /** @see {@link IGetFreeBusyStatusApi}  @method GET */
      getFreeBusy: (meeting_hash: string) => `${meeting}/free-busy/${meeting_hash}`,

      /** @see {@link IIntegrationControlApi}  @method POST */
      integrationsControl: (meeting_hash: string) => `${meeting}/${meeting_hash}/integration`,

      /** @see {@link IGetMRWidgetsApi}  @method GET */
      mrWidgets: (meeting_hash: string) => `${meeting}/${meeting_hash}/widgets`,

      /** @see {@link IMRToolsPermissionsHandlingApi} @method PATCH  */
      mrToolsPermissionsHandling: (meeting_hash: string) => `${meeting}/${meeting_hash}/mr.tools.permissions`,

      /** @see {@link IMainRoomAccessApi} @method PATCH  */
      accessMain: (meeting_hash: string) => `${meeting}/${meeting_hash}/access.main`,

      /** @see {@link IConvertEventToMeetApi}  @method POST */
      eventDetails: () => `${meeting}/convert.event`,

      /** @see {@link MRDetailsApi} @method GET  */
      mrDetails: (meeting_hash: string) => `${meeting}/${meeting_hash}/mr.details`,

      /** @see {@link IMeetingFeedbackApi} @method POST  */
      feedback: (meeting_hash: string) => `${meeting}/${meeting_hash}/feedback`,

      /** @see {@link IGetOnlineAttendeesApi} @method GET  */
      onlineAttendees: (url: string) => `${meeting}/online.attendees/${url}`,

      /** @see {@link IMatterMeetingsApi} @method GET  */
      matterMeetings: (matter_status: string) => `${meeting}/matter.meetings/${matter_status}`,

      /** @see {@link ITotalTimeApi} @method GET  */
      totalTime: (time_period: string) => `${meeting}/total.time/${time_period}`,

      /** @see {@link IPeopleMetApi} @method GET  */
      peopleMet: (time_period: string) => `${meeting}/people.met/${time_period}`,

      /** @see {@link IJoinMeetingApi} @method PATCH  */
      join: (meeting_hash: string) => `${meeting}/${meeting_hash}/join`,

      /** @see {@link ILeftMeetingApi} @method PATCH  */
      left: (meeting_hash: string) => `${meeting}/${meeting_hash}/left`,

      /** @see {@link IControlExternalMeetingApi} @method PATCH  */
      controlExternalMeeting: (meeting_hash: string) => `${meeting}/${meeting_hash}/control`,

      /** @see {@link IGetMeetingLogsApi} @method GET  */
      getMeetingLogs: (meeting_recording_hash: string) => `${meeting}/recording/${meeting_recording_hash}/logs`,

      /** @see {@link IGetRecordingsApi} @method GET  */
      getRecordings: (hash: string) => `${meeting}/${hash}/recording`,

      /** @see {@link IGetRecordingDetailApi} @method GET  */
      getRecordingDetail: (meeting_recording_hash: string) => `${meeting}/recording/${meeting_recording_hash}/detail`,

      /** @see {@link IGetRecordingStateApi} @method GET  */
      getRecordingState: (meeting_recording_hash: string) =>
        `${meeting}/recording/${meeting_recording_hash}/recording-state`,

      /** @see {@link IRenameRecordingApi} @method PATCH  */
      renameRecording: (meeting_recording_hash: string) => `${meeting}/recording/rename/${meeting_recording_hash}`,

      /** @see {@link IRemoveRecordingApi} @method DELETE  */
      removeRecording: (meeting_recording_hash: string) => `${meeting}/recording/${meeting_recording_hash}`,

      /** @see {@link IUploadPreviewScreenshotsApi} @method POST  */
      uploadPreviewScreenshots: (meeting_recording_hash: string) =>
        `${meeting}/recording/${meeting_recording_hash}/upload-preview`,

      /** @see {@link IAddMeetingUserToSubModulesApi} @method PATCH  */
      addMeetingUserToSubModules: () => `${meeting}/add.meeting.user`,

      breakoutRoom: {
        /** @see {@link ICreateBreakoutRoomApi}  @method POST */
        create: () => `${breakoutRoom}`,

        /** @see {@link IGetBreakoutRoomListApi}  @method GET */
        list: (url: string) => `${breakoutRoom}/${url}`,

        /** @see {@link IUpdateBreakoutRoomApi}  @method PATCH */
        edit: (url: string) => `${breakoutRoom}/${url}`,

        /** @see {@link IRemoveBreakoutRoomApi}  @method DELETE */
        remove: (url: string) => `${breakoutRoom}/${url}`,

        /** @see {@link IMoveMeetingAttendeesToBRApi}  @method POST */
        move: () => `${breakoutRoom}/attendee/move`,

        /** @see {@link IMoveOneAttendeeToBORApi}  @method POST */
        moveOne: () => `${breakoutRoom}/attendee/move.one`,

        /** @see {@link IOpenBreakoutRoomApi}  @method POST */
        open: (url: string) => `${breakoutRoom}/${url}/open`,

        /** @see {@link ICloseBreakoutRoomApi}  @method POST */
        close: () => `${breakoutRoom}/close`,

        /** @see {@link ICloseAllBORsApi}  @method POST */
        closeAll: (url: string) => `${breakoutRoom}/${url}/close.all`,
      },

      project: {
        /** @see {@link IAddProjectApi} @method POST */
        add: () => `${workspace}/project/`,

        /** @see {@link IGetUclprojectApi} @method GET */
        get: (project_hash: string) => `${workspace}/project/${project_hash}`,

        /** @see {@link IGetAllUclProjectsApi} @method GET */
        getAll: () => `${workspace}/project`,

        /** @see {@link IRemoveUclProjectApi} @method DELETE */
        remove: (project_hash: string) => `${workspace}/project/${project_hash}`,

        /** @see {@link IUpdateUclProjectApi} @method PUT */
        update: (project_hash: string) => `${workspace}/project/${project_hash}`,

        /** @see {@link IGetProjectActivitiesApi} @method GET */
        getActivity: (project_hash: string, pagination: IPaginationReq) =>
          `${workspace}/project/${project_hash}/` + `activity?page=${pagination.page}&limit=${pagination.limit}`,

        /** @see {@link IGetProjectChatsApi} @method GET */
        getChats: (project_hash: string) => `${workspace}/project/${project_hash}/chats`,

        /** @see {@link IGetRecentProjectsApi} @method GET */
        getRecentProjects: () => `${workspace}/project/recent`,

        /** @see {@link IHandleProjectInvitationApi} @method GET */
        handleInvitation: (project_hash: string) => `${workspace}/project/${project_hash}/handle-invite`,
      },

      template: {
        /** @see {@link IAddMeetingTemplateApi} @method POST */
        add: (meeting_hash: string) => `${meeting}/${meeting_hash}/template`,

        /** @see {@link IGetAllMeetingTemplatesApi} @method GET */
        getAll: () => `${meeting}/template`,

        /** @see {@link IGetMeetingTemplateApi} @method GET */
        get: (template_id: number) => `${meeting}/template/${template_id}`,

        /** @see {@link IRemoveMeetingTemplateApi} @method DELETE */
        remove: (template_id: number) => `${meeting}/template/${template_id}`,
      },
    },
    document: {
      /** @see {@link IDocumentInitApi} @method POST  */
      initDocument: () => `${document}`,

      /** @see {@link IGetDocumentBlocksApi} @method GET  */
      getNote: (document_hash: string) => `${document}/${document_hash}`,

      /** @see {@link IUpdateNoteDocumentBlockApi} @method POST  */
      updateNoteDocumentBlock: (document_hash: string) => `${document}/${document_hash}/note/document-block`,

      /** @see {@link IUpdateDocumentBlockApi} @method POST  */
      updateDocumentBlock: (document_hash: string) => `${document}/${document_hash}/document-block`,

      /** @see {@link IGetDocumentBlockTypesApi} @method GET  */
      getBlockTypes: () => `${document}/block/type`,

      /** @see {@link IDocumentUploadApi} @method POST @description this request should be multipart */
      upload: (document_block_hash: string, document_hash: string) =>
        `${document}/${document_hash}/block/${document_block_hash}/upload`,

      /** @see {@link IRemoveDocumentApi} @method DELETE  */
      remove: (document_hash: string) => `${document}/${document_hash}`,

      /** @see {@link IRemoveAllMyDocumentsApi} @method DELETE  */
      removeAllMyDocuments: () => `${document}`,

      /** @see {@link IReorderDocumentBlocksApi} @method PATCH  */
      reorderBlock: (document_hash: string) => `${document}/${document_hash}/reorder.block`,

      /** @see {@link IDocumentAiApi} @method POST  */
      documentAI: (document_hash: string) => `${document}/${document_hash}/ai`,

      /** @see {@link IAskDocumentAiApi} @method POST  */
      askDocumentAI: () => `${document}/ai/ask.doc`,

      /** @see {@link IAddDocumentAiApi} @method POST  */
      addDocumentAI: () => `${document}/ai/add.doc`,

      /** @see {@link IDeletePromptAiApi} @method DELETE  */
      deletePromptAI: (ai_prompt_hash: string) => `${document}/ai/${ai_prompt_hash}`,

      /** @see {@link IUpdatePromptAiApi} @method PATCH  */
      updatePromptAI: (ai_prompt_hash: string) => `${document}/ai/${ai_prompt_hash}`,

      /** @see {@link IGetAllPromptTemplatesApi} @method GET  */
      getAllPromptTemplates: () => `${document}/prompt.template`,

      /** @see {@link IAddPromptTemplateApi} @method POST  */
      addPromptTemplate: () => `${document}/prompt.template`,

      /** @see {@link IUpdatePromptTemplateApi} @method PATCH  */
      updatePromptTemplate: (ai_prompt_template_hash: string) => `${document}/prompt.template/${ai_prompt_template_hash}`,

      /** @see {@link IDeletePromptTemplateApi} @method DELETE  */
      deletePromptTemplate: (ai_prompt_template_hash: string) => `${document}/prompt.template/${ai_prompt_template_hash}`,
    },

    note: {
      /** @see {@link IUpdateNoteApi} @method PATCH  */
      update: (note_hash: string) => `${document}/note/${note_hash}`,

      /** @see {@link IGetAllNotesApi} @method GET  */
      getAllNotes: () => `${document}/note`,

      /** @see {@link IGetNoteApi} @method GET  */
      getNote: (note_hash: string) => `${document}/note/${note_hash}`,

      /** @see {@link IDuplicateNoteApi} @method POST */
      duplicate: (note_hash: string) => `${document}/${note_hash}/duplicate`,
    },

    agenda: {
      /** @see {@link IUpdateAgendaApi} @method PATCH  */
      update: (agenda_hash: string) => `${document}/agenda/${agenda_hash}`,

      /** @see {@link IGetMeetingAgendaApi} @method GET */
      getAgendas: (meeting_hash: string) => `${meeting}/${meeting_hash}/agenda`,

      /** @see {@link IRemoveMeetingAgendaApi} @method DELETE */
      removeAgendas: (meeting_hash: string) => `${meeting}/${meeting_hash}/agenda`,

      /** @see {@link IChangeAgendaOrderApi} @method POST */
      dragAgenda: (meeting_hash: string) => `${meeting}/${meeting_hash}/agenda/change.order`,

      /** @see {@link IUpdateAllMeetingAgendasApi} @method PATCH  */
      updateAllAgendas: (meeting_hash: string) => `${meeting}/${meeting_hash}/agenda/update.all`,
    },

    settings: {
      workspace: {
        /** @see {@link IGetProfileSettingsApi} @method GET */
        get: () => `${workspace}/settings/profile`,
      },
      appearance: {
        /** @see {@link IGetWorkspaceAppearanceApi} @method GET */
        get: () => `${workspace}/settings/appearance`,

        /** @see {@link IUpdateWorkspaceAppearanceApi} @method PUT */
        update: () => `${workspace}/settings/appearance`,
      },
      workspaceRoles: {
        /** @see {@link ICreateWorkspaceRoleApi} @method POST */
        create: () => `${workspace}/settings/roles`,

        /** @see {@link IGetWorkspaceRoleApi} @method GET */
        get: (role_id: number) => `${workspace}/settings/roles/${role_id}`,

        /** @see {@link IGetAllWorkspaceRolesApi} @method GET */
        getAll: () => `${workspace}/settings/roles`,

        /** @see {@link IUpdateWorkspaceRoleApi} @method PUT */
        edit: (role_id: number) => `${workspace}/settings/roles/${role_id}`,

        /** @see {@link IRemoveWorkspaceRoleApi} @method DELETE */
        remove: (role_id: number) => `${workspace}/settings/roles/${role_id}`,
      },
      workspaceMembers: {
        /** @see {@link IGetWorkspaceMembersApi} @method GET */
        getAllMembers: () => `${workspace}/settings/members`,

        /** @see {@link IUpdateWorkspaceUserApi} @method PUT */
        updateMember: (workspace_user_id: number) => `${workspace}/settings/members/${workspace_user_id}`,

        /** @see {@link IRemoveWorkspaceMemberApi} @method DELETE */
        removeMember: (workspace_user_id: number) => `${workspace}/settings/members/${workspace_user_id}`,
      },
      /** @see {@link ICheckCustomDomainDnsApi} @method GET */

      checkDomain: () => `${workspace}/settings/check-domain`,
    },
    contact: {
      /** @see {@link INewContactApi} @method POST */
      add: () => `${workspace}/contact`,

      /** @see {@link IAddContactByUsernameApi} @method POST */
      addByUsername: () => `${workspace}/contact/username`,

      /** @see {@link IGetContactApi} @method GET */
      get: (contact_hash: string) => `${workspace}/contact/${contact_hash}`,

      /** @see {@link IGetAllContactsApi} @method GET */
      getAll: () => `${workspace}/contact`,

      /** @see {@link IEditContactApi} @method PUT */
      edit: (contact_hash: string) => `${workspace}/contact/${contact_hash}`,

      /** @see {@link IStarContactApi} @method PUT */
      star: (contact_hash: string) => `${workspace}/contact/star/${contact_hash}`,

      /** @see {@link IRemoveContactApi} @method DELETE */
      remove: (contact_hash: string) => `${workspace}/contact/${contact_hash}`,

      /** @see {@link IGetContactActivitiesApi} @method GET */
      getActiviy: (contact_hash: string, pagination: IPaginationReq) =>
        `${workspace}/contact/${contact_hash}/activity?page=${pagination.page}&limit=${pagination.limit}`,

      /** @see {@link IGetContactChatsApi} @method GET */
      getContactChat: (contact_hash: string) => `${workspace}/contact/${contact_hash}/chats`,

      group: {
        /** @see {@link INewGroupApi} @method POST @description this api should be multipart */
        create: () => `${workspace}/contact/group`,

        /** @see {@link IEditGroupApi} @method PUT @description this api should be multipart */
        edit: (usergroup_id: number) => `${workspace}/contact/group/${usergroup_id}`,

        /** @see {@link IStarGroupApi} @method PUT */
        star: (usergroup_id: number) => `${workspace}/contact/group/star/${usergroup_id}`,

        /** @see {@link IGetAllGroupsApi} @method GET  */
        getAll: () => `${workspace}/contact/group`,

        /** @see {@link IGetGroupApi} @method GET  */
        get: (usergroup_id: number) => `${workspace}/contact/group/${usergroup_id}`,

        /** @see {@link IGetUserAddedGroupsApi} @method GET  */
        getUserAddedGroups: (user_id: number) => `${workspace}/contact/group/${user_id}/groups`,

        /** @see {@link IRemoveGroupApi} @method DELETE  */
        remove: (usergroup_id: number) => `${workspace}/contact/group/${usergroup_id}`,

        /** @see {@link IRemoveGroupAvatarApi} @method DELETE  */
        removeAvatar: (usergroup_id: number) => `${workspace}/contact/group/${usergroup_id}/avatar`,
      },
    },
  },
  usertype: {
    /** @see {@link IGetMermbertypesApi} @method GET */ // not set
    getUsertypes: `${base}/usertype`, // get
  },
  booking: {
    /** @see {@link ICreateBookingApi} @method POST  */
    create: booking,

    /** @see {@link IRescheduleBookingApi} @method PATCH  */
    reschedule: (booking_id: number) => `${booking}/reschedule/${booking_id}`,

    /** @see {@link ICancelBookingApi} @method PATCH  */
    cancel: (booking_id: number) => `${booking}/cancel/${booking_id}`,

    /** @see {@link IConfirmBookingApi} @method PATCH  */
    confirm: (booking_id: number) => `${booking}/confirm/${booking_id}`,

    /** @see {@link IGetBookingApi} @method GET  */
    get: (booking_id: number) => `${booking}/${booking_id}`,

    /** @see {@link IGetBookingByQueryApi} @method GET  */
    getAll: booking,
  },
  locations: {
    // not set
    /** @see {@link IGetAllLocationsApi} @method GET  */
    getAll: locations,
  },
  service: {
    /** @see {@link IUniclientCreateServiceApi} @method POST  */
    create: service,

    // /** @see {@link IUniclientSpreadTimeApi} @method GET  */
    // spreadTime: (service_id: number) => `${service}/spread-time/${service_id}`,

    /** @see {@link IUniclientGetAvailableTimesApi} @method GET  */
    getAvailableTimes: (service_id: number) => `${service}/${service_id}/available-times`,

    /** @see {@link IUniclientEditServiceApi} @method PATCH  */
    edit: (service_hash: string) => `${service}/${service_hash}`,

    /** @see {@link IUniclientDuplicateServiceApi} @method POST  */
    duplicate: () => `${service}/duplicate`,

    /** @see {@link IUniclientDeleteServiceApi} @method DELETE  */
    delete: (url: string) => `${service}/${url}`,

    /** @see {@link IUniclientGetServiceApi} @method GET  */
    get: (url: string) => `${service}/${url}`,

    /** @see {@link IUniclientGetServiceDetailForBookingApi} @method GET  */
    getDetailsForBooking: (url: string) => `${service}/details/${url}`,

    /** @see {@link IUniclientIGetServiceByQueryApi} @method GET  */
    getAllSelf: service,

    /** @see {@link IUniclientIGetAllServicesByQueryApi} @method GET  */
    getAllOthers: `${service}/search/all`,

    /** @see {@link IAddMeetingTemplateToServiceApi} @method POST  */
    addMeetingTemplateToService: (url: string) => `${service}/${url}/meeting_template`,
  },
  availability_template: {
    /** @see {@link ICreateTemplateApi} @method POST  */
    create: availability_template,

    /** @see {@link IEditTemplateApi} @method PATCH  */
    edit: (availability_template_id: number) => `${availability_template}/${availability_template_id}`,

    /** @see {@link IDeleteTemplateApi} @method DELETE  */
    delete: (availability_template_id: number) => `${availability_template}/${availability_template_id}`,

    /** @see {@link IGetTemplateApi} @method GET  */
    get: (availability_template_id: number) => `${availability_template}/${availability_template_id}`,

    /** @see {@link IGetAllTemplatesApi} @method GET  */
    getAll: availability_template,
  },
  room: {
    /** @see {@link ICreateRoomApi} @method POST  */
    create: room,

    /** @see {@link IEditRoomApi} @method PATCH  */
    edit: (url: string) => `${room}/${url}`,

    /** @see {@link IResetRoomApi} @method PATCH  */
    reset: (url: string) => `${room}/${url}/reset`,

    /** @see {@link IGetRoomApi} @method GET  */
    get: (Url: string) => `${room}/${Url}/detail`,

    /** @see {@link ICheckRoomURLApi} @method GET  */
    checkURL: (url: string) => `${room}/check/${url}`,

    /** @see {@link IGetAllRoomsApi} @method GET  */
    getAll: room,

    /** @see {@link IGetRecordingsApi} @method GET  */
    getRecordings: (hash: string) => `${meeting}/${hash}/recordings`,
  },
  moduleSharing: {
    /** @see {@link IAddToSharedWithApi} @method POST  */
    add: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}`,

    /** @see {@link IAddToSharedWithBulkApi} @method POST  */
    addBulk: `${sharing}/_bulk/create`,

    /** @see {@link IResendInviteEmailApi} @method POST */
    resendInvite: (module: string, module_id: number | string) => `${sharing}/resend-invite/${module}/${module_id}`,

    /** @see {@link IRemoveSharedWithApi} @method DELETE  */
    remove: (module: string, module_id: number | string, share_id: number) =>
      `${sharing}/${module}/${module_id}/${share_id}`,

    /** @see {@link IChangeSharedWithRoleApi} @method PATCH  */
    changeRole: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}/edit-or-create`,

    /** @see {@link IGetAllSharedWithApi} @method GET  */
    getAll: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}`,

    /** @see {@link IUpdateUrlSettingApi} @method PATCH  */
    updateUrl: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}/setting`,

    /** @see {@link IShareProjectModulesApi} @method POST  */
    shareProjectModules: (project_hash: string, share_id: number) =>
      `${sharing}/setting/project/${project_hash}/${share_id}`,

    /** @see {@link ILeaveModuleApi} @method POST  */
    leave: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}/leave`,

    /** @see {@link IRequestToJoinApi} @method POST  */
    requestToJoin: (module: string, module_id: number | string) => `${sharing}/${module}/${module_id}/request`,

    /** @see {@link IHandleRequestToJoinApi} @method PUT  */
    handleRequestToJoin: (module: string, module_id: number | string, share_id: number) =>
      `${sharing}/${module}/${module_id}/request/${share_id}`,

    /** @see {@link ICreateSharingLabelApi} @method POST  */
    createSharingLabel: () => `${sharing}/label`,

    /** @see {@link IEditSharingLabelApi} @method PATCH  */
    editSharingLabel: (sharing_label_id: number) => `${sharing}/label/${sharing_label_id}`,

    /** @see {@link IRemoveSharingLabelApi} @method DELETE  */
    removeSharingLabel: (sharing_label_id: number) => `${sharing}/label/${sharing_label_id}`,

    /** @see {@link IGetAllUserSharingLabelApi} @method GET  */
    getAllUserSharingLabel: () => `${sharing}/label`,

    /** @see {@link IAssignLabelToSharingApi} @method POST  */
    assignLabelToSharing: () => `${sharing}/label/assign`,
  },
  legalerConnect: {
    /** @see {@link ILegalerConnectEnableApi} @method POST  */
    enable: `${legalerConnect}`,

    /** @see {@link IGetLegalerConnectApi} @method GET  */
    get: `${legalerConnect}`,

    /** @see {@link ILegalerConnectGetDetailsApi} @method GET  */
    getDetails: `${legalerConnect}/details`,

    /** @see {@link ILegalerConnectGetScopesApi} @method GET  */
    getScopes: `${legalerConnect}/scopes`,

    /** @see {@link ILegalerConnectGetLogsApi} @method GET  */
    getLogs: `${legalerConnect}/logs`,

    /** @see {@link ILegalerConnectAuthorizeClientApi} @method POST  */
    generateAuthCode: `${legalerConnect}/redirect-url`,

    apikey: {
      /** @see {@link ILegalerConnectCreateApikeyApi} @method POST  */
      create: `${legalerConnect}/apikey`,

      /** @see {@link ILegalerConnectEditApikeyApi} @method PATCH  */
      edit: (client_id: string) => `${legalerConnect}/apikey/${client_id}`,

      /** @see {@link ILegalerConnectGetApikeysApi} @method GET  */
      getAll: `${legalerConnect}/apikey`,

      /** @see {@link ILegalerConnectGetApikeyApi} @method GET  */
      get: (client_id: string) => `${legalerConnect}/apikey/${client_id}`,

      /** @see {@link ILegalerConnectDeleteApikeyApi} @method DELETE  */
      delete: (client_id: string) => `${legalerConnect}/apikey/${client_id}`,
    },
  },
  billing: {
    /** @see {@link IGetAllInvoicesApi} @method GET  */
    getInvoices: () => `${billing}/invoices`,

    /** @see {@link IUpdateInvoiceDetailApi} @method PUT  */
    updateInvoiceSetting: () => `${billing}/invoice-setting`,

    /** @see {@link IGenerateSetupIntentApi} @method POST  */
    generateSetupIntent: () => `${billing}/setup-intent`,

    /** @see {@link IPreviewProrationApi} @method GET  */
    previewProration: () => `${billing}/preview-proration`,

    /** @see {@link IFinalizeOrderApi} @method POST  */
    finalizeOrder: () => `${billing}/finalize`,

    /** @see {@link ICancelSubscriptionApi} @method POST  */
    cancelSubscription: () => `${billing}/cancel-subscription`,

    /** @see {@link IGetAutoLoginUrlApi} @method GET  */
    getAutoLoginURL: () => `${billing}/auto-login-link`,

    /** @see {@link IGetCheckoutUrlApi} @method GET  */
    getCheckoutURL: () => `${billing}/checkout`,

    /** @see {@link IGetSubscriptionInfoApi} @method GET  */
    getSubscriptionInfo: () => `${billing}/subscription-info`,

    /** @see {@link IGetTransactionsApi} @method GET  */
    getTransactions: () => `${billing}/transactions`,
  },
  file: {
    /** @see {@link IUploadApi} @method POST  */
    upload: `${file}/upload`,

    /** @see {@link IRemoveFileApi} @method POST  */
    removeFile: () => `${file}/remove`,

    /** @see {@link IGetFileDownloadLinkApi} @method GET  */
    getFileDownloadLink: () => `${file}/download-link`,

    /** @see {@link IGetFileApi} @method GET  */
    downloadFile: (file_name: string) => `${file}/${file_name}`,

    /** @see {@link ICreateFolderApi} @method POST  */
    createFolder: () => `${file}/folder`,

    /** @see {@link IRemoveFolderApi} @method POST  */
    deleteFolder: () => `${file}/folder/remove`,

    /** @see {@link IUpdateFolderApi} @method PATCH  */
    updateFolder: (folder_hash: string) => `${file}/folder/${folder_hash}`,

    /** @see {@link IUpdateFileApi} @method PATCH  */
    updateFile: (file_hash: string) => `${file}/${file_hash}`,

    /** @see {@link IUpdateFileTrashStatusApi} @method POST  */
    fileTrashAction: (file_hash: string) => `${file}/trash/${file_hash}`,

    /** @see {@link IUpdateFolderTrashStatusApi} @method POST  */
    folderTrashAction: (folder_hash: string) => `${file}/folder/trash/${folder_hash}`,

    /** @see {@link IGetFolderApi} @method GET  */
    getFolder: () => `${file}/folder`,

    /** @see {@link IGetAllFilesApi} @method GET  */
    GetAllFiles: () => `${file}/deprecated`,

    /** @see {@link IGetAllFoldersApi} @method GET  */
    GetAllFolders: () => `${file}/folder/deprecated`,
  },
  opportunity: {
    /** @see {@link IAddOpportunityApi} @method POST */
    add: () => `${workspace}/opportunity/`,

    /** @see {@link IGetOpportunityApi} @method GET */
    get: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}`,

    /** @see {@link IGetAllOpportunitiesApi} @method GET */
    getAll: () => `${workspace}/opportunity`,

    /** @see {@link IRemoveOpportunityApi} @method DELETE */
    remove: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}`,

    /** @see {@link IUpdateOpportunityApi} @method PATCH */
    update: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}`,

    /** @see {@link IExpressInterestApi} @method PATCH */
    expressInterest: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}/express.interest`,

    /** @see {@link ICancelExpressInterestApi} @method PATCH */
    cancelExpressInterest: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}/cancel.express`,

    /** @see {@link IGetExpressedProvidersApi} @method GET */
    expressedProviders: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}/expressed.providers`,

    /** @see {@link IAssignProviderApi} @method PATCH */
    assignProvider: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}/assign.provider`,

    /** @see {@link IUnassignProviderApi} @method PATCH */
    unassignProvider: (opportunity_hash: string) => `${workspace}/opportunity/${opportunity_hash}/unassign.provider`,
  },

  task: {
    /** @see {@link ICreateTaskApi} @method POST */
    createTask: () => `${task}`,

    /** @see {@link IUpdateTaskApi} @method PATCH */
    updateTask: (task_hash: string) => `${task}/${task_hash}`,

    /** @see {@link IGetTaskApi} @method GET */
    getTask: (task_hash: string) => `${task}/${task_hash}`,

    /** @see {@link IGetAllTaskApi} @method GET */
    getAllTask: () => `${task}`,

    /** @see {@link IDeleteTaskApi} @method DELETE */
    deleteTask: (task_hash: string) => `${task}/${task_hash}`,

    /** @see {@link IChangeTrashTaskStatusApi} @method POST */
    trashTask: (task_hash: string) => `${task}/${task_hash}/trash`,

    changeOrder: (task_hash: string) => `${task}/${task_hash}/order/change`,
    type: {
      /** @see {@link ICreateTaskTypeApi} @method POST */
      createTaskType: () => `${task}/type`,

      /** @see {@link IUpdateTaskTypeApi} @method PATCH */
      updateTaskType: (task_type_hash: string) => `${task}/type/${task_type_hash}`,

      /** @see {@link IGetTaskTypeApi} @method GET */
      getTaskType: (task_type_hash: string) => `${task}/type/${task_type_hash}`,

      /** @see {@link IGetAllTaskTypeApi} @method GET */
      getAllTaskType: () => `${task}/type`,

      /** @see {@link IDeleteTaskTypeApi} @method DELETE */
      deleteTaskType: (task_type_hash: string) => `${task}/type/${task_type_hash}`,
    },

    status: {
      /** @see {@link ICreateTaskStatusApi} @method POST */
      createTaskStatus: () => `${task}/status`,

      /** @see {@link IUpdateTaskStatusApi} @method PATCH */
      updateTaskStatus: (task_status_hash: string) => `${task}/status/${task_status_hash}`,

      /** @see {@link IUpdateTaskStatusOrderApi} @method PATCH */
      updateTaskStatusOrder: (task_status_hash: string) => `${task}/status/${task_status_hash}/order`,

      /** @see {@link IGetTaskStatusApi} @method GET */
      getTaskStatus: (task_status_hash: string) => `${task}/status/${task_status_hash}`,

      /** @see {@link IGetAllTaskStatusApi} @method GET */
      getAllTaskStatus: () => `${task}/status`,

      /** @see {@link IDeleteTaskStatusApi} @method DELETE */
      deleteTaskStatus: (task_status_hash: string) => `${task}/status/${task_status_hash}`,
    },
  },

  /**
   * Generates pathname for relaying requests
   *
   * @param method The request's method {@link RequestMethods}
   * @param pathname The request-URL's pathname
   * @param body The request's body
   * @param next Where to redirect the user to, after the API call is done
   */
  relay: (method: RequestMethods, pathname: string, body?: string, next?: string) => {
    let relayPath = `/relay?method=${method}&pathname=${encodeURIComponent(pathname)}`
    if (body) relayPath += `&body=${encodeURIComponent(body)}`
    if (next) relayPath += `&next=${encodeURIComponent(next)}`
    return relayPath
  },
}
