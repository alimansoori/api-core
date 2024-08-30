/**
 * @file index.ts
 * @author Ali Mansoori
 * @date <current date>
 * @description
 * This file contains the main logic for running the development build process.
 * It uses the `tsyringe` library for dependency injection.
 *
 * The `DevBuilder` class is responsible for starting the development build process.
 * It takes an instance of `Watcher` as a dependency, which is injected via the constructor.
 * The `run` method of `DevBuilder` checks if the `--debug` flag is present in the command line arguments.
 * If it is, it starts the watcher in debug mode.
 *
 * The `startDevBuilder` function is a helper function that resolves an instance of `DevBuilder` from the container
 * and runs it. This function is called at the end of the file to start the development build process.
 *
 * Used to run `dev` and `dev:debug` scripts
 *
 * **flags:**
 *
 * `--debug` starts the watcher with `--inspect:PORT` option on node
 */
import 'reflect-metadata'
import { container, inject, injectable } from 'tsyringe'
import Watcher from './watcher.js'

@injectable()
export class DevBuilder {
  constructor(@inject(Watcher) private watcher: Watcher) {}

  run() {
    const args = process.argv
    const debugMode = args.includes('--debug')
    this.watcher.watch(debugMode)
  }
}

export function startDevBuilder() {
  const devBuilder = container.resolve(DevBuilder)
  devBuilder.run()
}

startDevBuilder()
