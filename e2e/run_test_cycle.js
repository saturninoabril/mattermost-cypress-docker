// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable no-await-in-loop, no-console */

/*
 * This command, which is normally used in CI, runs Cypress test in full or partial
 * depending on test metadata and environment capabilities.
 *
 * Usage: [ENVIRONMENT] node run_tests.js [options]
 *
 * Environment:
 *   AUTOMATION_DASHBOARD_URL   : Dashboard URL
 *   AUTOMATION_DASHBOARD_TOKEN : Dashboard token
 *   REPO                       : Project repository, ex. mattermost-webapp
 *   BRANCH                     : Branch identifier from CI
 *   BUILD_ID                   : Build identifier from CI
 *   CI_BASE_URL                : Test server base URL in CI
 *
 * Example:
 * 1. "node test_player.js"
 *      - will run all the specs available from the Automation dashboard
 */

const axios = require('axios');
const axiosRetry = require('axios-retry');
const chalk = require('chalk');
const cypress = require('cypress');

const {
    getSpecToTest,
    recordSpecResult,
    updateCycle,
} = require('./utils/dashboard');
const {writeJsonToFile} = require('./utils/report');
const {MOCHAWESOME_REPORT_DIR, RESULTS_DIR} = require('./utils/constants');

require('dotenv').config();
axiosRetry(axios, {
    retries: 5,
    retryDelay: axiosRetry.exponentialDelay,
});

const {
    BRANCH,
    BUILD_ID,
    CI_BASE_URL,
    REPO,
} = process.env;

async function runCypressTest(specExecution, currentTestCount) {
    const browser = 'chrome';
    const headless = true;

    const result = await cypress.run({
        browser,
        headless,
        spec: specExecution.file,
        config: {
            screenshotsFolder: `${MOCHAWESOME_REPORT_DIR}/screenshots`,
            trashAssetsBeforeRuns: false,
        },
        reporter: 'cypress-multi-reporters',
        reporterOptions: {
            reporterEnabled: 'mocha-junit-reporters, mochawesome',
            mochaJunitReportersReporterOptions: {
                mochaFile: 'results/junit/test_results[hash].xml',
                toConsole: false,
            },
            mochawesomeReporterOptions: {
                reportDir: MOCHAWESOME_REPORT_DIR,
                reportFilename: `json/${specExecution.file}`,
                quiet: true,
                overwrite: false,
                html: false,
                json: true,
                testMeta: {
                    browser,
                    headless,
                    branch: BRANCH,
                    buildId: BUILD_ID,
                },
            },
        },
    });

    // Write and update test environment details once
    if (currentTestCount === 1) {
        const environment = {
            cypress_version: result.cypressVersion,
            browser_name: result.browserName,
            browser_version: result.browserVersion,
            headless,
            os_name: result.osName,
            os_version: result.osVersion,
            node_version: process.version,
        };

        writeJsonToFile(environment, 'environment.json', RESULTS_DIR);
        await updateCycle(specExecution.cycle_id, environment);
    }

    const {stats, tests, spec} = result.runs[0];

    const specPatch = {
        file: spec.relative,
        tests: spec.tests,
        pass: stats.passes,
        fail: stats.failures,
        pending: stats.pending,
        skipped: stats.skipped,
        duration: stats.duration || 0,
        test_start_at: stats.startedAt,
        test_end_at: stats.endedAt,
    };

    const testCases = [];
    tests.forEach((t) => {
        const test = {
            title: t.title,
            full_title: t.title.join(' '),
            state: t.attempts[0].state,
            duration: t.attempts[0].duration || 0,
            test_start_at: t.attempts[0].startedAt,
        };
        testCases.push(test);
    });

    await recordSpecResult(specExecution.id, specPatch, testCases);
}

function printSummary(summary) {
    const obj = summary.reduce((acc, item) => {
        const {server, state, count} = item;
        if (!server) {
            return acc;
        }

        if (acc[server]) {
            acc[server][state] = count;
        } else {
            acc[server] = {[state]: count, server};
        }

        return acc;
    }, {});

    Object.values(obj).sort((a, b) => {
        return a.server.localeCompare(b.server);
    }).forEach((item) => {
        const {server, done, started} = item;
        console.log(chalk.magenta(`${server}: done: ${done || 0}, started: ${started || 0}`));
    });
}

const maxRetryCount = 5;
const runSpecFragment = async function(count, retry) {
    console.log(chalk.magenta(`Starting: ${count}`));

    const spec = await getSpecToTest({
        repo: REPO,
        branch: BRANCH,
        build: BUILD_ID,
        server: CI_BASE_URL,
    });

    // Retry on connection/timeout errors
    if (!spec || spec.code) {
        if (retry >= maxRetryCount) {
            return {
                doNext: false,
                count,
                message: `Test ended due to multiple (${retry}) connection/timeout errors with the dashboard server.`,
            };
        }

        console.log(chalk.red(`Retry count: ${retry}`));
        return await runSpecFragment(count, retry + 1); // eslint-disable-line consistent-return
    }

    if (!spec.execution || !spec.execution.file) {
        return {
            doNext: false,
            count,
            message: spec.message,
        }
    }

    const currentTestCount = spec.summary.reduce((total, item) => {
        return total + parseInt(item.count, 10);
    }, 0);

    printSummary(spec.summary);
    console.log(chalk.magenta(`\n(Testing ${currentTestCount} of ${spec.cycle.specs_registered})  - ${spec.execution.file}`));
    console.log(chalk.magenta(`At "${process.env.CI_BASE_URL}" server`));

    await runCypressTest(spec.execution, count);

    return {
        doNext: true,
        count: count + 1,
        retry: 0,
        message: 'Continue testing',
    }
};

const runSpec = async function(count = 1, retry = 0) {
    const fragment = await runSpecFragment(count, retry)
    if (fragment.doNext) {
        return await runSpec(fragment.count, fragment.retry);
    } else {
        return {count: fragment.count, message: fragment.message}
    }
  }
  

runSpec().then(({count, message}) => {
    console.log(chalk.magenta(message));
    console.log(chalk.magenta(`Completed ${count} spec files`));
});
