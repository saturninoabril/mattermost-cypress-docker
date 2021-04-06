// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable no-await-in-loop, no-console */

/*
 * This command, which normally use in CI, runs Cypress test in full or partial
 * depending on test metadata and environment capabilities.
 *
 * Usage: [ENVIRONMENT] node run_tests.js [options]
 *
 * Options:
 *   --stage=[stage]
 *      Selects spec files with matching stage. It can be of multiple values separated by comma.
 *      E.g. "--stage='@prod,@dev'" will select files with either @prod or @dev.
 *   --group=[group]
 *      Selects spec files with matching group. It can be of multiple values separated by comma.
 *      E.g. "--group='@channel,@messaging'" will select files with either @channel or @messaging.
 *   --exclude-group=[group]
 *      Exclude spec files with matching group. It can be of multiple values separated by comma.
 *      E.g. "--exclude-group='@enterprise'" will select files except @enterprise.
 *   --invert
 *      Selected files are those not matching any of the specified stage or group.
 *
 * Environment:
 *   AUTOMATION_DASHBOARD_URL   : Dashboard URL
 *   AUTOMATION_DASHBOARD_TOKEN : Dashboard token
 *   REPO                       : Project repository, ex. mattermost-webapp
 *   BRANCH                     : Branch identifier from CI
 *   BUILD_ID                   : Build identifier from CI
 *   BROWSER                    : Chrome by default. Set to run test on other browser such as chrome, edge, electron and firefox.
 *                                The environment should have the specified browser to successfully run.
 *   HEADLESS                   : Headless by default (true) or false to run on headed mode.
 *   CI_BASE_URL                : Test server base URL in CI
 *
 * Example:
 * 1. "node run_tests.js"
 *      - will run all the specs on default test environment, except those matching skipped metadata
 * 2. "node run_tests.js --stage='@prod'"
 *      - will run all production tests, except those matching skipped metadata
 * 3. "node run_tests.js --stage='@prod' --invert"
 *      - will run all non-production tests
 * 4. "BROWSER='chrome' HEADLESS='false' node run_tests.js --stage='@prod' --group='@channel,@messaging'"
 *      - will run spec files matching stage and group values in Chrome (headed)
 * 5. "node run_tests.js --stage='@prod' --exclude-group='@enterprise'"
 *      - will run all production tests except @enterprise group
 *      - typical test run for Team Edition
 * 6. "node run_tests.js --stage='@prod' --part=1 --of=2"
 *      - will run the first half (1 of 2) of all production tests
 *      - will be used for parallel testing where each part could run separately against its own test server
 */

const os = require('os');
const chalk = require('chalk');
const axios = require('axios');

const {getSortedTestFiles} = require('./utils/file');

require('dotenv').config();

const {
    AUTOMATION_DASHBOARD_URL,
    AUTOMATION_DASHBOARD_TOKEN,
    BRANCH,
    BROWSER,
    BUILD_ID,
    HEADLESS,
    REPO,
} = process.env;

async function createAndStartCycle(data) {
    try {
        console.log('createAndStartCycle url', AUTOMATION_DASHBOARD_URL)
        console.log('createAndStartCycle on', AUTOMATION_DASHBOARD_TOKEN)
        const response = await axios({
            url: `${AUTOMATION_DASHBOARD_URL}/cycles/start`,
            headers: {
                Authorization: `Bearer ${AUTOMATION_DASHBOARD_TOKEN}`,
            },
            method: 'post',
            timeout: 10000,
            data,
        });

        return response.data;
    } catch (e) {
        console.log('createAndStartCycle error', e.response)
    }
}

async function main() {
    const browser = BROWSER || 'chrome';
    const headless = typeof HEADLESS === 'undefined' ? true : HEADLESS === 'true';
    const platform = os.platform();
    const {weightedTestFiles} = getSortedTestFiles(platform, browser, headless);

    if (!weightedTestFiles.length) {
        console.log(chalk.red('Nothing to test!'));
        return;
    }

    console.log('main REPO', REPO)
    console.log('main BRANCH', BRANCH)
    console.log('main BUILD_ID', BUILD_ID)
    console.log('main weightedTestFiles', weightedTestFiles)
    const data = await createAndStartCycle({
        repo: REPO,
        branch: BRANCH,
        build: BUILD_ID,
        files: weightedTestFiles,
    });

    console.log(chalk.green('Successfully generated a test cycle.'));
    console.log(data.cycle);
}

main();
