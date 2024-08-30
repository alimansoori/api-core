import { injectable } from 'tsyringe'

interface ExecutableJob {
  job: () => any
  resolve: (value: any) => void
  reject: (reason?: any) => void
}
@injectable()
export default class JobQueue {
  private jobs: Array<ExecutableJob> = []
  private isRunning = false
  constructor(public readonly delay: number) {}
  execute = <T>(job: () => T): T extends Promise<any> ? T : Promise<T> =>
    new Promise((resolve, reject) => {
      this.jobs.push({ job, resolve, reject })
      if (!this.isRunning) this.executeNextJobInQueue()
    }) as T extends Promise<any> ? T : Promise<T>

  private executeNextJobInQueue() {
    if (!this.jobs[0]) {
      this.isRunning = false
      return
    }

    this.isRunning = true
    this.resolveResults(this.jobs[0])
    this.jobs.shift()
    setTimeout(() => {
      this.executeNextJobInQueue()
    }, this.delay)
  }

  private resolveResults(executableJob: ExecutableJob) {
    const { job, resolve, reject } = executableJob
    let result

    try {
      result = job()

      if (result?.then && typeof result.then === 'function') {
        const promiseLikeResults = result as Promise<any>
        promiseLikeResults.then((d) => resolve(d)).catch((e) => reject(e))
      } else {
        resolve(result)
      }
    } catch (e) {
      reject(e)
    }
  }
}
