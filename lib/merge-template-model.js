const path = require('path')
const fs = require('fs')
const vm = require('vm')

module.exports = (templateDir, helpers, model) => {
    const code = fs.readFileSync(path.join(templateDir, 'template.js'))

    return vm.runInThisContext(code)(helpers, model);
}