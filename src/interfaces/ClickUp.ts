export interface ClickUpGetAccessTokenReq {
  client_id: string
  client_secret: string
  code: string
}

export interface ClickUpGetAccessTokenRes {
  access_token: string
}

export interface ClickUpGetWorkspaceDetailsRes {
  teams: {
    id: string
    name: string
    color: string
    avatar: string
    members: {
      user: {
        id: number
        username: string
        color: string
        profilePicture: string
      }
    }[]
  }[]
}
export interface ClickUpGetUserDetailsRes {
  user: {
    id: number
    username: string
    color: string
    profilePicture: string
  }
}

export interface ClickUpGetSpacesRes {
  spaces: {
    id: string
    name: string
    private: boolean
    color: string | null
    avatar: string
    admin_can_manage: boolean
    archived: boolean
    members: {
      user: {
        id: string
        username: string
        color: string | null
        profilePicture: string
        initials: string
      }
    }[]
    statuses: {
      status: string
      type: string
      orderindex: number
      color: string
    }[]
    multiple_assignees: boolean
    features: {
      due_dates: {
        enabled: boolean
        start_date: Date | boolean
        remap_due_dates: boolean
        remap_closed_due_date: boolean
      }
      time_tracking: {
        enabled: boolean
      }
      tags: {
        enabled: boolean
      }
      time_estimates: {
        enabled: boolean
      }
      checklists: {
        enabled: boolean
      }
      custom_fields: {
        enabled: boolean
      }
      remap_dependencies: {
        enabled: boolean
      }
      dependency_warning: {
        enabled: boolean
      }
      portfolios: {
        enabled: boolean
      }
    }
  }[]
}

export interface ClickUpGetFoldersRes {
  folders: {
    id: string
    name: string
    orderindex: number
    override_statuses: boolean
    hidden: boolean
    space: {
      id: string
      name: string
      access: boolean
    }
    task_count: string
  }[]
}
export interface ClickUpGetListsRes {
  lists: [
    {
      id: string
      name: string
      orderindex: number
      content: string
      status: {
        status: string
        color: string
        hide_label: boolean
      }
      priority: {
        priority: string
        color: string
      }
      folder: {
        id: string
        name: string
        hidden: boolean
        access: boolean
      }
      space: {
        id: string
        name: string
        access: boolean
      }
      archived: boolean
      override_statuses: boolean
      permission_level: string
    },
  ]
}

export interface ClickUpAddWebhookReq {
  endpoint: string
  events: (
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
    | string
  )[]
  space_id?: number
  folder_id?: number
  list_id?: number
  task_id?: string
}

export interface ClickUpAddWebhookRes {
  id: string
  webhook: {
    id: string
    userid: number
    team_id: number
    endpoint: string
    client_id: string
    events: string[]
    task_id: string | null
    list_id: string | null
    folder_id: string | null
    space_id: string | null
    health: {
      status: string
      fail_count: number
    }
    secret: string
  }
}

export interface ClickUpGetTaskDetailsRes {
  id: string
  custom_id: string
  custom_item_id: number
  name: string
  text_content: string
  description: string
  status: {
    id: string
    status: string
    color: string
    orderindex: number
    type: string
  }
  orderindex: string
  date_created: string
  date_updated: string
  date_closed: string
  creator: {
    id: number
    username: string
    color: string
    profilePicture: string
  }
  assignees: string[]
  checklists: string[]
  tags: string[]
  parent: string
  priority: string
  due_date: string
  start_date: string
  time_estimate: string
  time_spent: string
  custom_fields: {
    id: string
    name: string
    type: string
    date_created: string
    hide_from_guests: true
    value: {
      id: 183
      username: string
      email: string
      color: string
      initials: string
      profilePicture: null
    }
    required: true
  }[]
  list: {
    id: string
  }
  folder: {
    id: string
  }
  space: {
    id: string
  }
  url: string
  markdown_description: string
}

export interface GetAllTasksOfListRes {
  tasks: {
    id: string
    custom_item_id: string | null
    name: string
    status: {
      status: string
      color: string
      orderindex: number
      type: string
    }
    markdown_description: string
    orderindex: string
    date_created: string
    date_updated: string
    date_closed: string | null
    date_done: string | null
    creator: {
      id: number
      username: string
      color: string
      profilePicture: string
    }
    assignees: []
    checklists: []
    tags: []
    parent: string | null
    priority: null
    due_date: string | null
    start_date: string | null
    time_estimate: string | null
    time_spent: string | null
    list: {
      id: string
    }
    folder: {
      id: string
    }
    space: {
      id: string
    }
    url: string
  }[]
  last_page: boolean
}

export interface createTaskReq {
  name: string
  description?: string
  status: string
  due_date?: number
  start_date?: number
}
export interface updateTaskReq {
  name?: string
  description?: string
  status: string
  due_date?: number
  start_date?: number
}
