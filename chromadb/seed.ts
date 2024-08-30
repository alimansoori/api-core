/* eslint-disable no-console */
/* eslint-disable no-process-env */
/* eslint-disable importPL/extensions */
import 'reflect-metadata'

import { OpenAIEmbeddings } from '@langchain/openai'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import fs from 'fs'
import { ChromaClient } from 'chromadb'
import YAML from 'yaml'

const schema_text = fs.readFileSync('./chromadb/ai-migrations/selected_schemas.yaml', 'utf8')

const schemaObj: {
  tables: {
    [table: string]: {
      keywords: string[]
      query: string
    }
  }[]
} = YAML.parse(schema_text)

const tables = schemaObj.tables.map((i) => Object.keys(i)[0])
const keywords: string[] = []
const table_queries: {
  table: string
  query: string
}[] = []

tables.forEach((t) => {
  schemaObj.tables.forEach((i) => {
    if (Object.keys(i)[0] === t) {
      keywords.push(i[t].keywords.join(' '))
      table_queries.push({
        table: t,
        query: i[t].query,
      })
    }
  })
})

const client = new ChromaClient({
  // auth: {
  //   provider: "basic",
  //   credentials: "db_username:db_password",
  // },
})
// Remove previous db_schema collection
await client.deleteCollection({ name: 'db_schema' }) // Delete a collection and all associated embeddings, documents, and metadata. ⚠️ This is destructive and not reversible

await Chroma.fromTexts(
  keywords, // embeddings
  table_queries, // metadata : table_names and sql queries
  new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'text-embedding-3-large', // should update when we change Te
  }),
  {
    collectionName: 'db_schema',
    // auth: {
    //   provider: "basic",
    //   credentials: "db_username:db_password",
    // },
  },
)

console.log('db_schema collection created')
