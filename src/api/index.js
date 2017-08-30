const { lstatSync, readdirSync, writeFileSync, readFileSync } = require('fs')
const { join, basename } = require('path')

const { getEmailsBaseDir } = require('./utils')

const sendEmail = require('../../lib/send-email')

const isDirectory = source => lstatSync(source).isDirectory()
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory)

const gitCommit = require('./git/commit')
const gitStatus = require('./git/status')
const gitPush = require('./git/push')

const listEmails = require('./emails/list-emails')

function wrapAsync(fn) {
    return async function (req, res) {
        try {
            const result = await fn(req, res)
            if (result) {
                res.json({
                    result: 'ok',
                    data: result
                })
            } else {
                res.json({
                    result: 'ok'
                })
            }
        } catch (err) {
            console.log('ERROR', err)
            
            res.status(400).json({
                result: 'error',
                message: err.toString()
            })
        }
    };
}

// TODO Change this
const UserName = 'stefan.huber@check24.de'

function authenticate(fn) {
    return async (req, res) => {
        // TODO Implement this properly
        req.userName = UserName

        return await fn(req, res)
    }
}

module.exports = (server, app, handle) => { 

    /**
     * API
     */

    /**
     * Get a list of emails
     */
    server.get('/api/emails', wrapAsync(authenticate(listEmails)))

    /**
     * Get a specific email template
     */
    server.get('/api/emails/:id', (req, res) => {
        const emailTemplate = readFileSync(join(getEmailsBaseDir(UserName), req.params.id, 'template.js'), { encoding: 'utf-8' })

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
        const renderFn = require(join(getEmailsBaseDir(UserName), req.params.id, 'index.js'))
        const model = require(join(getEmailsBaseDir(UserName), req.params.id, '_tests', 'default.js'))
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

        const template = join(getEmailsBaseDir(UserName), req.params.id, 'template.js')
        writeFileSync(template, emailSource)

        return res.json({
            result: 'ok'
        })
    })

    /**
     * Git commit email changes
     */   
    server.post('/api/git/commit', wrapAsync(authenticate(gitCommit)))
    server.post('/api/git/status', wrapAsync(authenticate(gitStatus)))
    server.post('/api/git/push', wrapAsync(authenticate(gitPush)))
    
    /**
     * Send the specified email
     */
    server.post('/api/emails/:id/send', async (req, res) => {
        const renderFn = require(join(getEmailsBaseDir(UserName), req.params.id, 'index.js'))
        const model = require(join(getEmailsBaseDir(UserName), req.params.id, '_tests', 'default.js'))
        const { html, error } = renderFn(model)

        if (error) return res.json(error)

        const result = await sendEmail({
            to: 'stefan.huber@check24.de',
            from: 'email-editor@gmail.com',
            html,
            subject: model.title
        })

        res.send({
            result: 'ok',
            message: result
        })
    })
    
    /**
     * Get images embedded in specified email
     */
    server.get('/email-images/:email/:image', (req, res) => {
        const imagePath = join(process.cwd(), 'emails', req.params.email, req.params.image)
        res.sendFile(imagePath)
    })

}