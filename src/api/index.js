const { lstatSync, readdirSync, writeFileSync, readFileSync } = require('fs')
const { join, basename } = require('path')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

module.exports = (server, app, handle) => { 

    /**
     * API
     */

    /**
     * Get a list of emails
     */
    server.get('/api/emails', (req, res) => {
        const emailDirs = getDirectories('./emails')
        return res.json(emailDirs.map(d => basename(d)).map(d => ({ id: d })))
    })

    /**
     * Get a specific email template
     */
    server.get('/api/emails/:id', (req, res) => {
        const emailTemplate = readFileSync(join('./emails', req.params.id, 'template.js'), { encoding: 'utf-8' })

        return res.json({
            id: req.params.id,
            template: emailTemplate
        })
    })

    /**
     * Preview the specified email
     */
    server.get('/api/emails/:id/preview', (req, res) => {
        // TODO Must use eval to get current template
        const renderFn = require(join(process.cwd(), 'emails', req.params.id, 'index.js'))
        const model = require(join(process.cwd(), 'emails', req.params.id, '_tests', 'default.js'))
        const {html, error} = renderFn(model)

        if (error) return res.json(error)
        return res.send(html)
    })

    /**
     * Save the edited email source template
     */
    server.post('/api/emails/:id/save', (req, res) => {
        const {emailSource} = req.body
        if (!emailSource) throw new Error('No email source given')

        const template = join(process.cwd(), 'emails', req.params.id, 'template.js')
        writeFileSync(template, emailSource)

        return res.json({
            result: 'ok'
        })
    })
    
    /**
     * Get images embedded in specified email
     */
    server.get('/email-images/:email/:image', (req, res) => {
        const imagePath = join(process.cwd(), 'emails', req.params.email, req.params.image)
        res.sendFile(imagePath)
    })

    /**
     * APP ROUTES
     */
    // server.get('/emails/:id', (req, res) => {
    //     const params = { id: req.params.id }
    //     return app.render(req, res, '/emails/single', params);
    // });    

    // TODO Handle images


}