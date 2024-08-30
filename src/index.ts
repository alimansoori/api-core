/**
 * Entry point of the application.
 *
 * This file serves as the main entry point for the backend API server.
 * It imports necessary modules, sets up module aliases, and starts the server.
 *
 * @remarks
 * This file is written in TypeScript and can be compiled to JavaScript.
 *
 * @see {@link https://github.com/alimansoori GitHub Repository}
 *
 * @author Ali Mansoori
 */

import 'reflect-metadata'
import 'isomorphic-fetch'
import moduleAlias from 'module-alias'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

moduleAlias.addAliases({
  '@app': __dirname,
  '@mediaserver': __dirname + '/mediaserver',
})

import { runtimeEnvs } from './core/runtimeEnvs.js'
runtimeEnvs()

import Server from './server.js'

const server = new Server()
server.start()
