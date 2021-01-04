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
 *   BROWSER=[browser]          : Chrome by default. Set to run test on other browser such as chrome, edge, electron and firefox.
 *                                The environment should have the specified browser to successfully run.
 *   HEADLESS=[boolean]         : Headless by default (true) or false to run on headed mode.
 *   BRANCH=[branch]            : Branch identifier from CI
 *   BUILD_ID=[build_id]        : Build identifier from CI
 *   CI_BASE_URL=[ci_base_url]  : Test server base URL in CI
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
const cypress = require('cypress');
const argv = require('yargs').
    default('part', 1).
    default('of', 1).
    argv;

const dashboard = require('./utils/new_dashboard');
const {getTestFiles, getSkippedFiles} = require('./utils/file');
const {writeJsonToFile} = require('./utils/report');
const {MOCHAWESOME_REPORT_DIR, RESULTS_DIR} = require('./utils/constants');

require('dotenv').config();

async function runTests() {
    const overallStartedAt = new Date();

    const {
        BRANCH,
        BROWSER,
        BUILD_ID,
        DASHBOARD_ENABLE,
        HEADLESS,
        ENABLE_VISUAL_TEST,
        APPLITOOLS_API_KEY,
        APPLITOOLS_BATCH_NAME,
    } = process.env;

    const browser = BROWSER || 'chrome';
    const headless = typeof HEADLESS === 'undefined' ? true : HEADLESS === 'true';
    const platform = os.platform();
    const initialTestFiles = getTestFiles().sort((a, b) => a.localeCompare(b));
    const {finalTestFiles} = getSkippedFiles(initialTestFiles, platform, browser, headless);
    const numberOfTestFiles = finalTestFiles.length;

    if (!numberOfTestFiles) {
        console.log(chalk.red('Nothing to test!'));
        return;
    }

    const {
        start,
        end,
        lastIndex,
        multiplier,
    } = getTestFilesIdentifier(numberOfTestFiles);

    let cycleKeys;
    let runKeys;
    let runData;
    let runField;
    const {invert, excludeGroup, group, stage, part, of} = argv;
    if (DASHBOARD_ENABLE === 'true') {
        cycleKeys = dashboard.getCycleKeys(BRANCH, BUILD_ID);
        runKeys = dashboard.getRunKeys(BRANCH, BUILD_ID, part);

        const commonData = {
            tool: 'cypress',
            entityType: 'cycle',
            buildId: BUILD_ID,
            branch: BRANCH,
            browser: BROWSER,
            headless,
            platform,
            testFilter: {
                invert,
                excludeGroup,
                group,
                stage,
                of,
            },
            totalFiles: numberOfTestFiles,
            testedFiles: 0,
            testDuration: 0,
            suites: 0,
            tests: 0,
            passes: 0,
            failures: 0,
            skipped: 0,
            pending: 0,
            startedAt: overallStartedAt.toISOString(),
            endedAt: '0',
        };

        const runKey = dashboard.getRunName(BRANCH, BUILD_ID, part);
        runField = `run${part}`;
        runData = {
            [runField]: {
                testStatus: 'ongoing',
                key: runKey,
            },
        };
        dashboard.createOrUpdateCycle(cycleKeys, commonData, runData);
    }

    dashboard.createItem(runKeys, {
        entityType: 'run',
        branch: BRANCH,
        buildId: BUILD_ID,
        run: part,
        totalFiles: lastIndex,
        testedFiles: 0,
        testDuration: 0,
        suites: 0,
        tests: 0,
        passes: 0,
        failures: 0,
        skipped: 0,
        pending: 0,
        startedAt: overallStartedAt.toISOString(),
        testStatus: 'ongoing',
    });

    for (let i = start; i < end; i++) {
        printMessage(finalTestFiles, i, (i % multiplier) + 1, lastIndex);

        const testFile = finalTestFiles[i];

        const specStartedAt = new Date();
        const specKeys = dashboard.getSpecKeys(BRANCH, BUILD_ID, testFile);
        dashboard.createItem(specKeys, {
            entityType: 'spec',
            branch: BRANCH,
            buildId: BUILD_ID,
            spec: testFile,
            run: part,
            startedAt: specStartedAt.toISOString(),
            testStatus: 'ongoing',
        });

        const result = await cypress.run({
            browser,
            headless,
            spec: testFile,
            config: {
                screenshotsFolder: `${MOCHAWESOME_REPORT_DIR}/screenshots`,
                trashAssetsBeforeRuns: false,
            },
            env: {
                enableVisualTest: ENABLE_VISUAL_TEST,
                enableApplitools: Boolean(APPLITOOLS_API_KEY),
                batchName: APPLITOOLS_BATCH_NAME,
            },
            reporter: 'cypress-multi-reporters',
            reporterOptions:
                {
                    reporterEnabled: 'mocha-junit-reporters, mochawesome',
                    mochaJunitReportersReporterOptions: {
                        mochaFile: 'results/junit/test_results[hash].xml',
                        toConsole: false,
                    },
                    mochawesomeReporterOptions: {
                        reportDir: MOCHAWESOME_REPORT_DIR,
                        reportFilename: `json/${testFile}`,
                        quiet: true,
                        overwrite: false,
                        html: false,
                        json: true,
                        testMeta: {
                            platform,
                            browser,
                            headless,
                            branch: BRANCH,
                            buildId: BUILD_ID,
                        },
                    },
                },
        });

        // Write test environment details once only
        if (i === 0) {
            const environment = {
                cypressVersion: result.cypressVersion,
                browserName: result.browserName,
                browserVersion: result.browserVersion,
                headless,
                osName: result.osName,
                osVersion: result.osVersion,
                nodeVersion: process.version,
            };

            writeJsonToFile(environment, 'environment.json', RESULTS_DIR);
        }

        result.runs.forEach((run) => {
            dashboard.updateItemWithIncrement(cycleKeys, {...run.stats, testedFiles: 1});
            dashboard.updateItemWithIncrement(runKeys, {...run.stats, testedFiles: 1});

            dashboard.updateItem(specKeys, {
                ...run.stats,
                testDuration: Date.now() - specStartedAt.getTime(),
                testStatus: 'completed',
            });

            run.tests.forEach((test, index) => {
                const order = index + 1;
                const fullTitle = test.title.join(' ');
                const {state, startedAt, duration, error} = test.attempts[0];

                const testKeys = dashboard.getTestKeys(BRANCH, BUILD_ID, testFile, fullTitle);
                const testData = {
                    entityType: 'test',
                    fullTitle,
                    order,
                    branch: BRANCH,
                    buildId: BUILD_ID,
                    spec: testFile,
                    run: part,
                    state,
                    startedAt,
                    testDuration: duration,
                    error,
                };
                if (!testData.error) {
                    delete testData.error;
                }
                if (!testData.startedAt) {
                    delete testData.startedAt;
                }
                if (!testData.testDuration) {
                    delete testData.testDuration;
                }
                dashboard.createItem(testKeys, testData);
            });
        });
    }

    if (DASHBOARD_ENABLE === 'true') {
        const overallEndedAt = new Date();
        const testDuration = overallEndedAt.getTime() - overallStartedAt.getTime();
        runData[runField].testStatus = 'completed';
        dashboard.updateItem(cycleKeys, {...runData, endedAt: overallEndedAt.toISOString(), testDuration});
        dashboard.updateItem(runKeys, {endedAt: overallEndedAt.toISOString(), testDuration, testStatus: 'completed'});
    }
}

function printMessage(testFiles, overallIndex, currentIndex, lastIndex) {
    const {invert, excludeGroup, group, stage} = argv;

    const testFile = testFiles[overallIndex];
    const testStage = stage ? `Stage: "${stage}" ` : '';
    const withGroup = group || excludeGroup;
    const groupMessage = group ? `"${group}"` : 'All';
    const excludeGroupMessage = excludeGroup ? `except "${excludeGroup}"` : '';
    const testGroup = withGroup ? `Group: ${groupMessage} ${excludeGroupMessage}` : '';

    // Log which files were being tested
    console.log(chalk.magenta.bold(`${invert ? 'All Except --> ' : ''}${testStage}${stage && withGroup ? '| ' : ''}${testGroup}`));
    console.log(chalk.magenta(`(Testing ${overallIndex + 1} of ${testFiles.length})  - `, testFile));
    if (process.env.CI_BASE_URL) {
        console.log(chalk.magenta(`Testing ${currentIndex}/${lastIndex} in "${process.env.CI_BASE_URL}" server`));
    }
}

function getTestFilesIdentifier(numberOfTestFiles) {
    const {part, of} = argv;
    const PART = parseInt(part, 10) || 1;
    const OF = parseInt(of, 10) || 1;
    if (PART > OF) {
        throw new Error(`"--part=${PART}" should not be greater than "--of=${OF}"`);
    }

    const multiplier = Math.ceil(numberOfTestFiles / OF);
    const start = (PART - 1) * multiplier;
    let end = start + multiplier;
    end = end < numberOfTestFiles ? end : numberOfTestFiles;

    const lastIndex = end < numberOfTestFiles ? multiplier : numberOfTestFiles - start;

    return {start, end, lastIndex, multiplier};
}

runTests();
