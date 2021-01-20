'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const log = require('@dog-cli/log')
const pkg = require('../package.json')
const constant = require('./const')

function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkEnv()
    } catch (e) {
        log.error(e.message)
    }
    
}

function checkEnv() {
    const dotenv = require('dotenv')
    const dotenvPath = path.resolve(userHome, '.env')
    if (pathExists(dotenvPath)) {
        dotenv.config({
            path: dotenvPath
        })
    }
    createDefaultConfig()
    log.info('环境变量', process.env.DOG_CLI_HOME_PATH)
}

function createDefaultConfig() {
    const cliConfig = {
        home: userHome
    }
    if (process.env.DOG_CLI_HOME) {
        cliConfig['cliHome'] = path.join(userHome, process.env.DOG_CLI_HOME)
    } else {
        cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
    }
    process.env.DOG_CLI_HOME_PATH = cliConfig.cliHome
}

function checkUserHome() {
    if (!userHome || !pathExists(userHome)) {
        throw new Error(colors.red(`当前用户主目录不存在！`))
    }
}

function checkRoot() {
    const rootCheck = require('root-check')
    rootCheck()
    console.log(process.geteuid())
}

function checkNodeVersion() {
    // 第一步，获取当前Node版本号
    console.log(process.version)
    const currentVersion = process.version
    // 第二部，比对最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`dog-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

function checkPkgVersion() {
    log.info('cli', pkg.version)
}

