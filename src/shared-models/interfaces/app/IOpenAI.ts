import { AI_SESSION_TYPE, MEETING_TYPE } from '../../interfaces/backend.js'

export type OPENAI_MODULE = 'document' | 'meeting-room' | 'past-meeting' | 'agenda' | 'telegram'

type IDefaults = {
  module: OPENAI_MODULE
  prompt_type: AI_SESSION_TYPE
  workspace_id: number
  user_id: number
  ai_session_hash: string | null
}

export enum DOCUMENT_AI_ACTIONS {
  summarize = 'summarize',
  extend = 'extend',
  make_action_list = 'make_action_list',
  rephrase = 'rephrase',
  correct_grammar_mistakes = 'correct_grammar_mistakes',
  ask_ai_to_write = 'ask_ai_to_write',
}

export enum MR_AI_ACTIONS {
  custom_prompt = 'mr_custom_prompt',
  short_summary = 'Short Summary',
  long_summary = 'Long Summary',
  sync_up_summary = 'Sync-up Summary',
  action_list = 'Action List',
}

export enum PAST_MEETING_AI_ACTIONS {
  summarize = 'meeting_summarize',
  make_action_list = 'meeting_action_list',
}

export enum AGENDA_ACTIONS {
  suggest_agenda = 'suggest_agenda',
}

export enum TELEGRAM_ACTIONS {
  sql_query = 'sql_query',
  search_from_cache = 'search_from_cache',
}

export type IOpenAIRequestData<T extends OPENAI_MODULE> = IDefaults &
  (T extends 'document'
    ? {
      action: DOCUMENT_AI_ACTIONS
      content: string
      question?: string
    }
    : T extends 'meeting-room'
    ? {
      action: MR_AI_ACTIONS
      meeting_id: number
      meeting_url: string
      meeting_type: MEETING_TYPE
      prompt: string
    }
    : T extends 'past-meeting'
    ? {
      action: PAST_MEETING_AI_ACTIONS
      meeting_id: number
      meeting_url: string
      meeting_type: MEETING_TYPE
    }
    : T extends 'agenda'
    ? {
      action: AGENDA_ACTIONS
      number_agenda: number
      agenda_duration: number
      agenda_description: string
    }
    : T extends 'telegram'
    ? {
      action: TELEGRAM_ACTIONS
      content: string
      prompt: string
      question?: string
    }
    : null)
export enum CHAT_MODELS {
  gpt_4_turbo_preview = 'gpt-4-turbo-preview',
  gpt_4_0125_preview = 'gpt-4-0125-preview',
  gpt_4_1106_preview = 'gpt-4-1106-preview',
  gpt_3_5_turbo_1106 = 'gpt-3.5-turbo-1106',
  gpt_3_5_turbo_0125 = 'gpt-3.5-turbo-0125',
}

export enum EMBEDDING_MODELS {
  text_embedding_3_large = 'text-embedding-3-large',
  text_embedding_3_small = 'text-embedding-3-small',
}
