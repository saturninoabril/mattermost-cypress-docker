// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable no-await-in-loop, no-console */

/*
 * This command, which normally use in CI, runs Cypress test in full or partial
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
 *   TEST_LAST_FIRST            : Start test from the last spec files which typically require more services or
 *                                known to have side-effect to other tests
 *
 * Example:
 * 1. "node test_player.js"
 *      - will run all the specs available from the Automation dashboard
 */

const axios = require('axios');
const chalk = require('chalk');
const cypress = require('cypress');

const {MOCHAWESOME_REPORT_DIR} = require('./utils/constants');

require('dotenv').config();

const {
    AUTOMATION_DASHBOARD_URL,
    AUTOMATION_DASHBOARD_TOKEN,
    BRANCH,
    BUILD_ID,
    CI_BASE_URL,
    TEST_LAST_FIRST,
    REPO,
} = process.env;

async function getSpecToTest({repo, branch, build, server, testLastFirst}) {
    try {
        const response = await axios({
            url: `${AUTOMATION_DASHBOARD_URL}/executions/specs/start?repo=${repo}&branch=${branch}&build=${build}&test_last_first=${testLastFirst}`,
            headers: {
                Authorization: `Bearer ${AUTOMATION_DASHBOARD_TOKEN}`,
            },
            method: 'post',
            timeout: 10000,
            data: {server},
        });

        return response.data;
    } catch (err) {
        console.log(err)
        return err.response && err.response.data;
    }
}

async function recordSpecResult(specId, spec, tests) {
    const response = await axios({
        url: `${AUTOMATION_DASHBOARD_URL}/executions/specs/end?id=${specId}`,
        headers: {
            Authorization: `Bearer ${AUTOMATION_DASHBOARD_TOKEN}`,
        },
        method: 'post',
        timeout: 10000,
        data: {spec, tests},
    });

    return response.data;
}

async function runTest(specExecution, firstTest = false) {
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
        env: {
            firstTest,
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
                    platform: 'darwin',
                    browser,
                    headless,
                    branch: BRANCH,
                    buildId: BUILD_ID,
                },
            },
        },
    });

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

async function testLoop() {
    const spec = await getSpecToTest({
        repo: REPO,
        branch: BRANCH,
        build: BUILD_ID,
        testLastFirst: TEST_LAST_FIRST === 'true',
        server: CI_BASE_URL,
    });

    if (!spec || !spec.execution || !spec.execution.file) {
        console.log(chalk.magenta(spec.message));
        return;
    }

    const currentTestCount = spec.summary.reduce((total, item) => {
        return total + parseInt(item.count, 10);
    }, 0);

    printSummary(spec.summary)
    console.log(chalk.magenta(`(Testing ${currentTestCount} of ${spec.cycle.specs_registered})  - `, spec.execution.file));

    await runTest(spec.execution);

    return testLoop(); // eslint-disable-line consistent-return
}

function printSummary(summary) {
    const obj = summary.reduce((acc, item) => {
        const {server, state, count} = item;
        if (!server) return acc;

        if (!acc[server]) {
            acc[server] = {[state]: count, server};
        } else {
            acc[server][state] = count;
        }

        return acc;
    }, {});

    Object.values(obj).sort((a, b) => {
        return a.server.localeCompare(b.server);
    }).forEach((item) => {
        const {server, done, started} = item;
        console.log(chalk.magenta(`${server}: done: ${done || 0}, started: ${started || 0}`))
    });
}

testLoop();
