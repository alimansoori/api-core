import { FastifyPluginCallback } from 'fastify'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const V1Router: FastifyPluginCallback = async (fastify, options, done) => {

  const modules = readdirSync(__dirname, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  for (const module of modules) {
    const controllerPath = join(__dirname, module, `${module}.controller.js`);

    try {
      const controllerURL = pathToFileURL(controllerPath).href;
      const controllerModule = await import(controllerURL);
      const controller = controllerModule[`${module}Controller`];

      if (controller) {
        fastify.register(controller, { prefix: `/${module !== 'root' ? module : '' }` });
      }
    } catch (err) {
      console.error(`Failed to load controller for module: ${module}`, err);
    }
  }

  done()
}