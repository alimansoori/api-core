/** Reserved room urls, there must be no rooms with these url values. */
export enum ROOM_RESERVED_KEY {
  'create' = 'create',
  'edit' = 'edit',
}

/** Reserved subdomains, there must be no workspaces with these subdomain values. */
export enum SUBDOMAIN_RESERVED_KEY {
  'id' = 'id',
  'chat' = 'chat',
  'core2' = 'core2',
  'staging' = 'staging',
  'api' = 'api',
}
