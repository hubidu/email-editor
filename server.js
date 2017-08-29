const express = require('express')
const next = require('next')
const routes = require('./routes')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler  = routes.getRequestHandler(app)

const bodyParser = require('body-parser')

const mountApi = require('./src/api')

app.prepare()
.then(() => {
  const server = express()

  server.use(bodyParser.json())

  // Mount the REST api
  mountApi(server, app, handler)

  server.get('*', (req, res) => {
    handler(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})