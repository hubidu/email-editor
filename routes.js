const nextRoutes = require('next-routes')
const routes = module.exports = nextRoutes()

routes.add('email_edit', '/emails/:id')
