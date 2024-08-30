// eslint-disable-next-line importPL/extensions
import { resolve as resolveTs } from 'ts-node/esm';
import * as tsConfigPaths from 'tsconfig-paths';
import { pathToFileURL } from 'url';

const { absoluteBaseUrl, paths } = tsConfigPaths.loadConfig();
const matchPath = tsConfigPaths.createMatchPath(absoluteBaseUrl, paths);

/**
 * Resolves the specifier to a valid URL using the provided context and default resolver.
 * @param {string} specifier - The specifier to resolve.
 * @param {object} ctx - The context object.
 * @param {function} defaultResolve - The default resolver function.
 * @returns {string} - The resolved URL.
 */
export function resolve (specifier, ctx, defaultResolve) {
  let trimmed;
  if (specifier.endsWith('/index.js')) {
    // Handle index.js
    trimmed = specifier.substring(0, specifier.lastIndexOf('/index.js'));
  } else if (specifier.endsWith('.js')) {
    // Handle *.js
    trimmed = specifier.substring(0, specifier.length - 3);
  }

  if (trimmed) {
    const match = matchPath(trimmed);
    if (match) {
      const resolvedUrl = specifier.endsWith('/index.js') ? `${match}/index.js` : `${match}.js`;
      return resolveTs(pathToFileURL(resolvedUrl).href, ctx, defaultResolve);
    }
  }

  return resolveTs(specifier, ctx, defaultResolve);
}

// eslint-disable-next-line importPL/extensions
export { load, transformSource } from 'ts-node/esm';
