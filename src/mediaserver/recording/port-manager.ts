import { spawn } from 'child_process'
import { DeLogger } from '@app/lib/de-logger.js'
import mediaConfig from '@app/utility/config/media.config.js'
import MediasoupProducer from '../mediasoup/producer/mediasoup-producer.js'

export default class PortManager {
  private static readonly MIN_PORT = mediaConfig.mediasoup.worker.rtcMinPort
  private static readonly MAX_PORT = mediaConfig.mediasoup.worker.rtcMaxPort
  private static takenRecordingPorts = new Set<number>()
  private static acquiringPortInProgress = false

  private readonly logger: DeLogger = new DeLogger({ namespace: 'PortManager', tags: ['port', 'recording'] })

  constructor(private producer: MediasoupProducer) {
    this.logger.meta = { meeting_id: this.producer.peer.room.meeting_id.toString(), producerId: this.producer.producerId }
  }

  public async takePort(mustBeEven = false): Promise<number> {
    // sometimes producers being recorded (taking port) simultaneously, and they get the same port accidentally
    while (PortManager.acquiringPortInProgress) {
      const waitMs = 300
      this.logger.log(`Acquiring another port is already in progress, trying again in ${waitMs}ms.`).save()
      await new Promise((resolve) => setTimeout(resolve, waitMs))
    }

    return this.acquirePort(mustBeEven)
  }

  private async acquirePort(mustBeEven = false): Promise<number> {
    try {
      PortManager.acquiringPortInProgress = true
      let currentPort = PortManager.MIN_PORT

      /*
        according to https://www.ietf.org/rfc/rfc2327 :
        "For RTP, only the even ports are used for data and the corresponding one-higher odd port is used for RTCP."
        so we need to make sure getting even ports here.
      */
      while (
        (mustBeEven && currentPort % 2 !== 0) ||
        PortManager.takenRecordingPorts.has(currentPort) ||
        !(await Promise.all([this.checkPortAvailability(currentPort), this.checkPortAvailability(currentPort + 1)])).every(
          (availability) => availability,
        )
      ) {
        currentPort += 1
      }

      PortManager.takenRecordingPorts.add(currentPort)
      PortManager.acquiringPortInProgress = false
      return currentPort
    } catch (error) {
      this.logger.error('acquirePort failed.', { error }).save()
      PortManager.acquiringPortInProgress = false
      throw error
    }
  }

  private async checkPortAvailability(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      let process_output = ''
      const netstat_cmd = spawn('netstat', ['-tunlp'])
      netstat_cmd.stdout.setEncoding('utf-8')
      netstat_cmd.stdout.on('data', (msg) => {
        process_output += msg
      })
      netstat_cmd.on('close', () => {
        if (process_output.includes(`:${port}`)) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  public releasePort(port: number) {
    PortManager.takenRecordingPorts.delete(port)
  }
}
