export default function reply(req, res, data, status = 200) {
  const accept = req.headers.accept || ''
  const isBrowser = accept.includes('text/html')

  if (!isBrowser) {
    return res.status(status).json(data)
  }

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>Slider API Réponse</title>
    <style>
      body{background:#0f172a;color:#e2e8f0;font-family:monospace;padding:30px}
      .box{background:#1e293b;padding:20px;border-radius:10px}
      pre{white-space:pre-wrap;word-wrap:break-word}
      h1{color:#38bdf8}
    </style>
  </head>
  <body>
    <h1>API Response</h1>
    <div class="box">
      <pre>${JSON.stringify(data, null, 2)}</pre>
    </div>
  </body>
  </html>
  `

  res.status(status).send(html)
}
