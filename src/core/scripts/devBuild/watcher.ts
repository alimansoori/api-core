import 'reflect-metadata'
import { spawn } from 'child_process'
import { singleton } from 'tsyringe'

/**
 * Class representing a watcher for file changes during development.
 * Used to run `swc:watch` and `node` concurrently.
 *
 * If you are asking why can't we simply run them in a single script like:
 *
 * `node --watch-path=./dist "./dist/index.js" & pnpm swc:watch`
 *
 * The answer is node needs to wait for the first compilation and only then start watching
 * the dist, other wise it will keep restarting the server whenever swc compiles a single file
 * during its first compilation process. In order to see the results for yourself, you may run
 * the script mentioned above.
 *
 * What we do in {@link Watcher} is to make sure `swc:watch` will finish its initial
 * compilation before the node is started.
 *
 * @class
 * @author Ali Mansoori
 * @date 2024-06-04
 */
@singleton()
export default class Watcher {
  private isNodeRunning = false
  private debugModeEnabled = false
  private isShellNeeded = false

  constructor() {
    this.isShellNeeded = process.platform === 'win32'
  }

  /**
   * Starts watching for file changes.
   * @param debug - Whether to enable debug mode. Default is false.
   */
  watch(debug = false) {
    this.debugModeEnabled = debug ?? false
    this.runSwcWatcher()
  }

  private runSwcWatcher() {
    const swcWatcher = this.createSwcWatcher()
    swcWatcher.stdout.on('data', (data: Buffer) => {
      const stringData = data.toString()
      process.stdout.write('[swc] ' + stringData)
      if (!this.isNodeRunning && stringData.toLowerCase().includes('watching for file changes')) this.runNode()
    })
  }

  private createSwcWatcher() {
    return spawn('pnpm', ['swc:watch'], { shell: this.isShellNeeded })
  }

  private runNode() {
    this.isNodeRunning = true
    const nodeArgs = this.getNodeArgs()
    spawn('node', nodeArgs, { stdio: 'inherit', shell: this.isShellNeeded })
  }

  private getNodeArgs() {
    const nodeArgs = ['--watch-path=./dist', '--watch-preserve-output', 'dist/index.js']
    if (this.debugModeEnabled) nodeArgs.unshift('--inspect=5858')
    return nodeArgs
  }
}
