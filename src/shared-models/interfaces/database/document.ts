// import { IBlockParams} from '../../index.js';
import { IFileResponseModel, IHeaderResponse, PERMISSION } from '../app/index.js'
import { document_child, DOCUMENT_MARK_TYPE, timezone, URL_PRIVACY, USER_ROLE } from '../backend.js'
// export type INoteScopes = 'all_notes' | 'my_notes' | 'shared_with_me' | 'meeting_notes' | 'starred' | 'archived' | 'trash';
export enum ENUM_NOTE_SCOPE {
  all_notes = 'all_notes',
  my_notes = 'my_notes',
  shared_with_me = 'shared_with_me',
  meeting_notes = 'meeting_notes',
  starred = 'starred',
  archived = 'archived',
  trash = 'trash',
}
export type INoteScopes = keyof typeof ENUM_NOTE_SCOPE
export type IAgendaStatus = 'played' | 'paused' | 'not_started'
export type IUpdateAllStatus = 'reset_all' | 'pause_all' | 'delete_all'

export enum ENUM_DOCUMENT_TYPE {
  note = 'note',
  agenda = 'agenda',
  document_template = 'document_template',
  form = 'form',
}
export type DOCUMENT_TYPE = keyof typeof ENUM_DOCUMENT_TYPE

export enum BLOCK_TYPE_KEY {
  // input blocks
  input_blocks = 'input_blocks',
  input_text = 'input_text',
  textarea = 'textarea',
  multiple_choice = 'multiple_choice',
  checkbox = 'checkbox',
  dropdown = 'dropdown',
  input_number = 'input_number',
  input_email = 'input_email',
  input_phone = 'input_phone',
  input_link = 'input_link',
  input_time = 'input_time',
  input_date = 'input_date',
  file_upload = 'file_upload',
  payment = 'payment',
  rating = 'rating',
  linear_scale = 'linear_scale',
  password = 'password',
  page = 'page',
  // embed blocks
  embed_blocks = 'embed_blocks',
  embed_image = 'embed_image',
  embed_video = 'embed_video',
  embed_audio = 'embed_audio',
  embed_link = 'embed_link',
  // layout blocks
  layout_blocks = 'layout_blocks',
  h1 = 'h1',
  h2 = 'h2',
  h3 = 'h3',
  label = 'label',
  text = 'text',
  br = 'br',
  // note blocks
  note_blocks = 'note_blocks',
  paragraph = 'paragraph',
  heading = 'heading',
  image = 'image',
  ordered_list = 'ordered_list',
  ordered_list_row = 'ordered_list_row',
  todo = 'todo',
  title = 'title',
  bulleted_list = 'bulleted_list',
  table = 'table',
  table_row = 'table_row',
  table_cell = 'table_cell',
  table_paragraph = 'table_paragraph',
}

export type BLOCK_TYPE_KEY_TYPE = keyof typeof BLOCK_TYPE_KEY

export type IDocumentMark = {
  type: DOCUMENT_MARK_TYPE[]
  color?: string
}

export type IChildFeatures = {
  hash: string
  text?: string | null
  type?: BLOCK_TYPE_KEY
  mark?: IDocumentMark | null
  placeholder?: string
}

// This is for maximum 5 layers of children
// If our children layers be increased we should increase this layers too
export type IDocumentChildren = {
  children?: {
    children?: {
      children?: {
        children?: {
          children?: IChildFeatures[]
        } & IChildFeatures[]
      } & IChildFeatures[]
    } & IChildFeatures[]
  } & IChildFeatures[]
} & IChildFeatures

export type IDocumentBlockIterator = {
  hash: string
  above_hash?: string | null
  below_hash?: string | null
  _delete?: boolean
  children: IDocumentChildren[]
  checked?: boolean // only for to.do
  url?: string // only for image & input_link
  /**
   * @example 12.56304
   * @type number
   *
   */
  image_scale?: number // only for image
  columns?: number
  rows?: number
}

export type IParagraphBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.paragraph
}

export type IHeadingBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.h1 | BLOCK_TYPE_KEY.h2 | BLOCK_TYPE_KEY.h3
}

export type IBulletListBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.bulleted_list
}

export type IOrderListBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.ordered_list
}

export type IOrderListRowBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.ordered_list_row
}

export type ITodoBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.todo
}

export type ITitleBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.title
}

export type IImageBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.image
}

export type ILinkBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.input_link
}

export type ITableBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.table
}

export type ITableCellBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.table_cell
}

export type ITableRowBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.table_row
}

export type ITableParagraphBlock = IDocumentBlockIterator & {
  type: BLOCK_TYPE_KEY.table_paragraph
}

export type IDocumentBlock =
  | ITodoBlock
  | ITitleBlock
  | IHeadingBlock
  | IParagraphBlock
  | IOrderListBlock
  | IBulletListBlock
  | IImageBlock
  | ILinkBlock
  | ITableBlock
  | ITableCellBlock
  | ITableRowBlock
  | ITableParagraphBlock
  | IOrderListRowBlock

export interface ICreateDocumentData {
  user_id: number
  type: DOCUMENT_TYPE
  workspace_id?: number | null
  meeting_hash?: string
  meeting_user_id?: number
  agenda_order?: number
  name?: string | null
  is_public?: boolean
}

export interface IDuplicateDocumentBlock {
  document_block_id: number | null
  document_block_hash: string
  document_block_type_key: BLOCK_TYPE_KEY
  document_block_type_id: number
  children: document_child[] | null
  above_hash: string | null
  below_hash: string | null
  checked?: boolean | null
  content?: string | null
  image_scale?: number | null
  private_file: {
    private_file_hash: string
  } | null
  file: {
    name: string
    path: string
    mime: string | null
  } | null
}

export type ITransformedChildFeatures = {
  hash?: string | null
  text?: string | null
  type?: BLOCK_TYPE_KEY_TYPE
  placeholder?: string | null
  mark: {
    color?: string | null
    type?: DOCUMENT_MARK_TYPE[] | null
  }
}

export interface ITransformedDocumentBlock {
  hash: string
  above_hash?: string | null
  below_hash?: string | null
  checked?: boolean | null
  url?: string | null
  image_scale?: number | null
  type?: BLOCK_TYPE_KEY_TYPE
  // children?: {
  //       hash?: string | null;
  //       text?: string | null;
  //       type?: BLOCK_TYPE_KEY_TYPE;
  //       placeholder?: string | null;
  //       mark: {
  //         color?: string | null;
  //         type?: DOCUMENT_MARK_TYPE[] | null;
  //       },
  //       children?: ITransformedDocumentBlock['children'];
  //     }[]
  //   | null;

  children?:
    | ({
        children?:
          | ({
              children?:
                | ({
                    children?:
                      | ({
                          children?: ITransformedChildFeatures[] | null
                        } & ITransformedChildFeatures[])
                      | null
                  } & ITransformedChildFeatures[])
                | null
            } & ITransformedChildFeatures[])
          | null
      } & ITransformedChildFeatures[])
    | null

  file?:
    | (NonNullable<IFileResponseModel> & {
        mime: string | null
      })
    | null
}

// export interface IImportBlocks {
//   document_block_hash: string;
//   document_block_id: number;
//   content: string | null;
//   above_hash: string | null;
//   below_hash: string | null;
//   checked: boolean | null;
//   image_scale: number | null;
//   children: document_child[];
//   private_file: {
//     name: string;
//     private_file_hash: string;
//   } | null;
//   file: {
//     name: string;
//     file_id: number;
//     path: string;
//     mime: string | null;
//     file_hash: string;
//   } | null;
//   document_block_type: {
//     document_block_type_id: number;
//     key: string;
//   };
// }

export interface IGetDocumentNoteUsers {
  user: {
    user_hash: string
    meeting_user_id?: number
    first_name: string
    last_name: string
    timezone: timezone | null
    role: USER_ROLE
    avatar: IFileResponseModel | null
    email: string | null
    position: string | null
    company: string | null
    nickname?: string | null
  }
}

export type IGetAllNotesResult = {
  note_hash: string
  url_privacy: URL_PRIVACY
  cover: IHeaderResponse
  text: string
  is_search_indexable: boolean
  is_e2ee: boolean
  name: string | null
  created_at: Date
  updated_at: Date
  document: { document_hash: string } | null
  note_users: IGetDocumentNoteUsers[]
  projects?: {
    name: string
  }[]
  me: {
    is_participant: boolean
    is_starred?: boolean
    note_user_id?: number
    calc_permission?: PERMISSION
  }
}
