const nodegit = require('nodegit')
const path = require("path")

const {getEmailsBaseDir} = require('../utils')

module.exports = async (req, res) => {
    function statusToText(status) {
        var words = [];
        if (status.isNew()) { words.push("NEW"); }
        if (status.isModified()) { words.push("MODIFIED"); }
        if (status.isTypechange()) { words.push("TYPECHANGE"); }
        if (status.isRenamed()) { words.push("RENAMED"); }
        if (status.isIgnored()) { words.push("IGNORED"); }

        return words.join(" ");
    }

    const repo = await nodegit.Repository.open(path.join(getEmailsBaseDir(req.userName), '.git'))
    const statuses = await repo.getStatus()

    // statuses.forEach(function(file) {
    //     console.log(file.path() + " " + statusToText(file));
    // });

    return statuses.map(file => ({
        file: file.path(),
        status: statusToText(file)
    }))
}