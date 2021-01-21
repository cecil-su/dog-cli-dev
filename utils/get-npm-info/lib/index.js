'use strict';

const axios = require('axios')
const urljoin = require('url-join')
const semver = require('semver')

function getNpmInfo(name, registry) {
    if (!name) {
        return null 
    }
    const url = registry || getDefaultRegistry()
    const npmInfoUrl = urljoin(url, name)
    return axios.get(npmInfoUrl).then(res => {
        if (res.status === 200) {
            return res.data
        } else {
            return null
        }
    }).catch(err => {
        return Promise.reject(err)
    })
}

function getDefaultRegistry(isOriginal = false) {
    return isOriginal ? 'https://registry.npmjs.org' : 'https://registry.npm.taobao.org'
}

async function getNpmVersions(name, registry) {
    const data = await getNpmInfo(name, registry)
    if (data) {
        return Object.keys(data.versions)
    } else {
        return []
    }
}

function getSemverVersions(baseVersion, versions) {
    return versions.filter(version =>
        semver.satisfies(version, `^${baseVersion}`)
    ).sort((a, b) => semver.gt(b, a))
}

async function getNpmSemverVersions(baseVersion, name, registry) {
    const versions = await getNpmVersions(name, registry)
    const v = getSemverVersions(baseVersion, versions)
    if (v && v.length > 0) {
        return v[0]
    }
}

module.exports = {
    getNpmInfo,
    getNpmVersions,
    getNpmSemverVersions
}
