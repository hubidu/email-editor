const execa = require('execa')

const {getEmailsBaseDir} = require('../utils')

module.exports = async (req, res) => {
    const opts = {
        cwd: getEmailsBaseDir()
    }

    return await execa('git', ['push'], opts)
}