import { Prisma } from '@prisma/client'
import { BLOCK_TYPE_KEY } from '../../../../shared-models/index.js'

export const documentBlockType: Prisma.document_block_typeCreateArgs['data'][] = [
  {
    key: BLOCK_TYPE_KEY.input_blocks,
    name: 'input blocks',
    childs: {
      createMany: {
        data: [
          { key: BLOCK_TYPE_KEY.input_text, name: 'Text input', alias: 'text,input,text input,textinput' },
          { key: BLOCK_TYPE_KEY.textarea, name: 'Textarea' },
          { key: BLOCK_TYPE_KEY.text, name: 'Text' },
          { key: BLOCK_TYPE_KEY.multiple_choice, name: 'Multiple choice' },
          { key: BLOCK_TYPE_KEY.checkbox, name: 'Checkbox' },
          { key: BLOCK_TYPE_KEY.dropdown, name: 'Dropdown' },
          { key: BLOCK_TYPE_KEY.input_number, name: 'Number' },
          { key: BLOCK_TYPE_KEY.input_email, name: 'Email' },
          { key: BLOCK_TYPE_KEY.input_phone, name: 'Phone number' },
          { key: BLOCK_TYPE_KEY.input_link, name: 'Link' },
          { key: BLOCK_TYPE_KEY.input_date, name: 'Date' },
          { key: BLOCK_TYPE_KEY.input_time, name: 'Time' },
          { key: BLOCK_TYPE_KEY.file_upload, name: 'Upload' },
          { key: BLOCK_TYPE_KEY.payment, name: 'Payment' },
          { key: BLOCK_TYPE_KEY.rating, name: 'Rating' },
          { key: BLOCK_TYPE_KEY.linear_scale, name: 'Linear Scale' },
          { key: BLOCK_TYPE_KEY.password, name: 'Password' },
        ],
      },
    },
  },
  {
    key: BLOCK_TYPE_KEY.embed_blocks,
    name: 'Embed blocks',
    childs: {
      createMany: {
        data: [
          { key: BLOCK_TYPE_KEY.embed_image, name: 'Image' },
          { key: BLOCK_TYPE_KEY.embed_video, name: 'Video' },
          { key: BLOCK_TYPE_KEY.embed_audio, name: 'Audio' },
          { key: BLOCK_TYPE_KEY.embed_link, name: 'Link' },
          { key: BLOCK_TYPE_KEY.page, name: 'Page' },
        ],
      },
    },
  },
  {
    key: BLOCK_TYPE_KEY.layout_blocks,
    name: 'Layout blocks',
    childs: {
      createMany: {
        data: [
          { key: BLOCK_TYPE_KEY.h1, name: 'Heading 1', alias: 'h1' },
          { key: BLOCK_TYPE_KEY.h2, name: 'Heading 2', alias: 'h2' },
          { key: BLOCK_TYPE_KEY.h3, name: 'Heading 3', alias: 'h3' },
        ],
      },
    },
  },
  {
    key: BLOCK_TYPE_KEY.note_blocks,
    name: 'Note Blocks',
    childs: {
      createMany: {
        data: [
          { key: BLOCK_TYPE_KEY.paragraph, name: 'Paragraph' },
          { key: BLOCK_TYPE_KEY.heading, name: 'Heading' },
          { key: BLOCK_TYPE_KEY.image, name: 'Image' },
          { key: BLOCK_TYPE_KEY.ordered_list, name: 'Order List' },
          { key: BLOCK_TYPE_KEY.ordered_list_row, name: 'Order List Row' },
          { key: BLOCK_TYPE_KEY.bulleted_list, name: 'Bulleted List' },
          { key: BLOCK_TYPE_KEY.todo, name: 'Todo' },
          { key: BLOCK_TYPE_KEY.title, name: 'Title' },
          { key: BLOCK_TYPE_KEY.table, name: 'Table' },
          { key: BLOCK_TYPE_KEY.table_row, name: 'Table Row' },
          { key: BLOCK_TYPE_KEY.table_cell, name: 'Table Cell' },
          { key: BLOCK_TYPE_KEY.table_paragraph, name: 'Table Paragraph' },
        ],
      },
    },
  },
]
