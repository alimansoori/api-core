import { Readable } from 'stream'
import { MediaSoupKindEnum, MediaSoupRTPParameters } from '@app/shared-models/index.js'
import { MediaRecordParameters } from './interfaces/mediaRecordingInterfaces.js'

export const getCodecInfoFromRtpParameters = (kind: MediaSoupKindEnum, rtpParameters: MediaSoupRTPParameters) => {
  return {
    payloadType: rtpParameters.codecs[0].payloadType,
    codecName: rtpParameters.codecs[0].mimeType.replace(`${kind}/`, ''),
    clockRate: rtpParameters.codecs[0].clockRate,
    channels: kind === MediaSoupKindEnum.audio ? rtpParameters.codecs[0].channels : undefined,
  }
}

type codecInfoType = ReturnType<typeof getCodecInfoFromRtpParameters>

const createVideoSdpCommand = (remoteRtpPort: number, codecInfo: codecInfoType) => {
  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=video ${remoteRtpPort} RTP/AVP ${codecInfo.payloadType} 
  a=rtpmap:${codecInfo.payloadType} ${codecInfo.codecName}/${codecInfo.clockRate}
  a=fmtp:${codecInfo.payloadType} useadaptivelayering_v2=true; useadaptivelayering=true
  a=sendonly
  `
}

const createAudioSdpCommand = (remoteRtpPort: number, codecInfo: codecInfoType) => {
  return `v=0
  o=- 0 0 IN IP4 127.0.0.1
  s=FFmpeg
  c=IN IP4 127.0.0.1
  t=0 0
  m=audio ${remoteRtpPort} RTP/AVP ${codecInfo.payloadType} 
  a=rtpmap:${codecInfo.payloadType} ${codecInfo.codecName}/${codecInfo.clockRate}/${codecInfo.channels}
  a=fmtp:${codecInfo.payloadType} minptime=10; useinbandfec=1; stereo=0; sprop-stereo=0; usedtx=1
  a=sendonly
  `
}

export const createSdpCommand = (recordParameters: MediaRecordParameters, codecInfo: codecInfoType) => {
  const { kind, remoteRtpPort } = recordParameters

  return kind === MediaSoupKindEnum.audio
    ? createAudioSdpCommand(remoteRtpPort, codecInfo)
    : createVideoSdpCommand(remoteRtpPort, codecInfo)
}

export const convertSdpToStream = (sdp: string) => {
  const stream = new Readable()

  stream._read = () => {}

  stream.push(sdp)
  stream.push(null)

  return stream
}
