/* eslint-disable global-require */
const { resolve } = require('path');
const { existsSync } = require('fs');
const { spawnSync } = require('child_process');

const CONFIG_FILENAMES = [
  '.bypass-husky.js',
  '.bypass-husky.config.js',
  '.bypass-husky.json',
  '.bypass-husky.config.json',
];

function getCurrentBranch() {
  const { status, stdout: branch } = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    encoding: 'utf8',
  });
  return status === 0 ? branch : null;
}

function loadNoVerifyConfig(filename, hook) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    const noVerifyConfig = require(filename)[hook];
    return noVerifyConfig || null;
  } catch (err) {
    console.error(`Loading the bypass-husky config file "${filename}" throws an error:\n`);
    console.error(`${err.message}\n`);
    return null;
  }
}

function branchMatches(branch, pattern) {
  if (Array.isArray(pattern)) {
    return pattern.some((p) => branchMatches(branch, p));
  }
  const regex = pattern instanceof RegExp ? pattern : new RegExp(pattern);
  return regex.test(branch);
}

function makeNoVerifyInfo(branch, verify) {
  return {
    branch,
    verify,
  };
}

function getNoVerifyInfo(hook) {
  const branch = getCurrentBranch();

  const noVerifyConfigFile = CONFIG_FILENAMES.map((name) => resolve(process.cwd(), name)).find(
    existsSync,
  );

  if (!noVerifyConfigFile) {
    return makeNoVerifyInfo(branch, true);
  }

  const noVerifyConfig = loadNoVerifyConfig(noVerifyConfigFile, hook);
  if (!noVerifyConfig) {
    return makeNoVerifyInfo(branch, true);
  }

  const { exclude, include } = noVerifyConfig;
  if (exclude) {
    return makeNoVerifyInfo(branch, !branchMatches(branch, exclude));
  }

  if (include) {
    return makeNoVerifyInfo(branch, branchMatches(branch, include));
  }

  return makeNoVerifyInfo(branch, true);
}

module.exports = getNoVerifyInfo;
/* eslint-enable global-require */
