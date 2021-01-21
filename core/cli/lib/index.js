'use strict';

module.exports = core;

const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const userHome = require('user-home')
const pathExists = require('path-exists').sync
const commander = require('commander')
const log = require('@dog-cli/log')
const commandInit = require('@dog-cli/init')
const pkg = require('../package.json')
const constant = require('./const')

const program = new commander.Command()

async function core() {
    try {
        checkPkgVersion()
        checkNodeVersion()
        checkRoot()
        checkUserHome()
        checkEnv()
        await checkGlobalUpdate()
        registerCommand()
    } catch (e) {
        log.error(e.message)
    }
    
}

function registerCommand() {
    program
        .name(Object.keys(pkg.bin)[0])
        .usage('<command> [options]')
        .version(pkg.version, '-v, --version', 'output the version number')
        .option('-d, --debug', '是否开启调试模式', false)
    
    program
        .command('init [name]')
        .option('-f, --force', '是否强制初始化项目')
        .action(commandInit)
    // 开启debug模式
    program.on('option:debug', function() {
        const options = program.opts()
        if (options.debug) {
           process.env.DOG_CLI_LOG_LEVEL = 'verbose' 
        } else {
           process.env.DOG_CLI_LOG_LEVEL = 'info' 
        }
        log.level = process.env.DOG_CLI_LOG_LEVEL
    })
    // 未知命令的监听
    program.on('command:*', function(operands) {
        console.error(`error: unknown command '${operands[0]}'`);
        const availableCommands = program.commands.map(cmd => cmd.name());
        // mySuggestBestMatch(operands[0], availableCommands);
        process.exitCode = 1;
    })
    //
    if (process.argv.length < 3) {
        program.outputHelp()
    }

    program.parse(process.argv)
}

async function checkGlobalUpdate() {
    // 1.获取当前版本号和模块名
    const currentVersion = pkg.version
    const npmName = pkg.name
    // 2.调用npm API，获取所有版本号
    const {getNpmSemverVersions} = require('@dog-cli/get-npm-info')
    const lastVersion = await getNpmSemverVersions(currentVersion, npmName)
    if (lastVersion && semver.gt(lastVersion, currentVersion)) {
        log.warn('更新提醒', colors.yellow(`请手动更新 ${npmName}, 当前版本: ${currentVersion}, 最新版本: ${lastVersion} 更新命令: npm install -g ${npmName}`))
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
    log.verbose('环境变量', process.env.DOG_CLI_HOME_PATH)
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
}

function checkNodeVersion() {
    // 第一步，获取当前Node版本号
    const currentVersion = process.version
    // 第二部，比对最低版本号
    const lowestVersion = constant.LOWEST_NODE_VERSION
    if (!semver.gte(currentVersion, lowestVersion)) {
        throw new Error(colors.red(`dog-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`))
    }
}

function checkPkgVersion() {
    log.verbose('cli', pkg.version)
}

