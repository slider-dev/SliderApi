import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const router = express.Router()

router.get('/', async (req, res) => {
  const apiPath = path.join(__dirname, 'api')
  let routes = []

  if (fs.existsSync(apiPath)) {
    const files = fs.readdirSync(apiPath).filter(f => f.endsWith('.js'))
    for (const file of files) {
      const mod = await import(`./api/${file}`)
      if (mod.default?.path) {
        routes.push({
          name: file.replace('.js',''),
          path: mod.default.path
        })
      }
    }
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Slider API Docs</title>
    <style>
      body{background:#0f172a;color:#e2e8f0;font-family:sans-serif;padding:40px}
      .card{background:#1e293b;padding:20px;margin-bottom:15px;border-radius:10px}
      a{color:#38bdf8;text-decoration:none}
      h1{color:#38bdf8}
    </style>
  </head>
  <body>
    <h1>Slider API Documentation</h1>
    ${routes.map(r=>`
      <div class="card">
        <h3>${r.name}</h3>
        <p>Endpoint: <a href="${r.path}" target="_blank">${r.path}</a></p>
      </div>
    `).join('')}
  </body>
  </html>
  `

  res.send(html)
})

export default router
