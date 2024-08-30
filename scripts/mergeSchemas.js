import { readFileSync, readdirSync, writeFileSync, statSync, existsSync, unlinkSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const baseDirs = [join(__dirname, '..', 'prisma'), join(__dirname, '..', 'src')];
const outputFile = join(__dirname, '..', 'prisma', 'schema.prisma');

if (existsSync(outputFile)) {
  unlinkSync(outputFile);
}

const getSchemaFiles = (dir) => {
  let results = [];
  const list = readdirSync(dir);

  list.forEach(file => {
    file = join(dir, file);
    const stat = statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(getSchemaFiles(file));
    } else if (file.endsWith('.prisma')) {
      results.push(file);
    }
  });

  return results;
};

let schemaFiles = [];
baseDirs.forEach(baseDir => {
  schemaFiles = schemaFiles.concat(getSchemaFiles(baseDir));
});

let combinedSchema = `generator client {
  provider = "prisma-client-js"
  previewFeatures = ["fullTextSearch", "fullTextIndex"]
  binaryTargets   = ["native", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
`;

schemaFiles.forEach(file => {
  const schema = readFileSync(file, 'utf8');
  combinedSchema += schema + '\n';
});

writeFileSync(outputFile, combinedSchema);
console.log('Schemas merged successfully.');
