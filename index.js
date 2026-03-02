import express from 'express'
import cors from 'cors'
import serverless from 'serverless-http'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

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
    const routeModule = await import(`./api/${file}`)
    if (routeModule.default?.path && routeModule.default?.handler) {
      app.all(routeModule.default.path, routeModule.default.handler)
    }
  }
}

try {
  const docs = await import('./docs.js')
  if (docs.default) app.use('/docs', docs.default)
} catch {}

app.get('/', (req, res) => {
  if (fs.existsSync(path.join(sitePath, 'index.html'))) {
    res.sendFile(path.join(sitePath, 'index.html'))
  } else {
    res.json({ status: true, message: 'Slider Taem love you' })
  }
})

export const handler = serverless(app)
export default app
