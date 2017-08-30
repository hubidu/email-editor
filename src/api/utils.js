const { join } = require('path')

const getEmailsBaseDir = (username) => join(process.cwd(), 'users', username, 'emails')
const getUserDir = (username) => join(process.cwd(), 'users', username)

module.exports = {
    getEmailsBaseDir,
    getUserDir
}