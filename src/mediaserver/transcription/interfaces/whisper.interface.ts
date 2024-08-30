export type WhisperOutputTypes = 'txt' | 'srt' | 'json' | 'tsv' | 'vtt'
export type WhisperModelTypes = 'tiny' | 'tiny.en' | 'base' | 'small' | 'medium' | 'large'

export interface IWhisperConvertParams {
  output_dir?: string
  output_format?: WhisperOutputTypes
  model?: WhisperModelTypes
}

export interface WhisperObserverEvents {
  'process-close': any
  'output-ready': string
}

export type WhisperObserverEventKeys = keyof WhisperObserverEvents
