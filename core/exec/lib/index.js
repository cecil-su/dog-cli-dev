'use strict';

const path = require('path')
const Package = require('@dog-cli/package')
const log = require('@dog-cli/log')

const SETTINGS = {
    init: '@dog-cli/init'
}

const CACHE_DIR = 'dependencies'

function exec() {
    // TODO
    let storePath = ''
    let targetPath = process.env.DOG_CLI_TARGET_PATH
    const homePath = process.env.DOG_CLI_HOME_PATH
    log.verbose('targetPath', targetPath)
    log.verbose('homePath', homePath)

    const cmd = arguments[arguments.length - 1]
    const cmdName = cmd.name()
    const name = SETTINGS[cmdName]
    const version = 'latest'

    if (!targetPath) {
        targetPath = path.resolve(homePath, CACHE_DIR) // 生成缓存路径
        storePath = path.resolve(targetPath, 'node_modules')
        log.verbose('targetPath', targetPath)
        log.verbose('storePath', storePath)
    }

    const pkg = new Package({
        name,
        version,
        storePath,
        targetPath,
    })
    console.log(pkg.getRootFilePath())
    // 1. targetPath -> modulePath
    // 2. modulePath -> Package(npmmok)
    // 3. Package.getRootFile(获取入口文件)
    // 4. Package
}

module.exports = exec;

