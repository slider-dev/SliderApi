import express from 'express'
import cors from 'cors'
import serverless from 'serverless-http'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const apiPath = path.join(__dirname, 'api')
const sitePath = path.join(__dirname, 'site')

if (fs.existsSync(sitePath)) {
  app.use(express.static(sitePath))
}

if (fs.existsSync(apiPath)) {
  const files = fs.readdirSync(apiPath).filter(f => f.endsWith('.js'))

  for (const file of files) {
    const routeModule = require(`./api/${file}`)

    if (routeModule.default?.path && routeModule.default?.handler) {
      app.all(routeModule.default.path, routeModule.default.handler)
    }
  }
}

const docsRouter = require('./docs.js').default
app.use('/docs', docsRouter)

app.get('/', (req, res) => {
  const indexFile = path.join(sitePath, 'index.html')
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile)
  } else {
    res.json({ status: true })
  }
})

export const handler = serverless(app)
