/* eslint-disable no-console */

// See reference: https://support.smartbear.com/tm4j-cloud/api-docs/

const axios = require('axios');
const chalk = require('chalk');

const {
    JIRA_PROJECT_KEY,
    TM4J_API_KEY,
} = process.env;

const TEST_EXECUTION_PASSED_STATUS = 401937;
const PROD_TEST_CASE_STATUS = '✅ in Production';
const UPDATE_TEST_CASE_STATUS = '🔧 Update'
const TICKET_OPEN_TEST_CASE_STATUS = '👋 Ticket Open';

const PASSED = '🟢 passed';
const FAILED = '🔴 failed';

function getTestExecutions(testCycle) {
    return axios({
        method: 'GET',
        url: `https://api.adaptavist.io/tm4j/v2/testexecutions?maxResults=10000&testCycle=${testCycle}`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: TM4J_API_KEY,
        },
    }).then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('[getTestExecutions] Something went wrong:', error.response.data.message);
        return error.response.data;
    });
}

function getTestCases() {
    return axios({
        method: 'GET',
        url: `https://api.adaptavist.io/tm4j/v2/testcases?maxResults=10000&projectKey=${JIRA_PROJECT_KEY}`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: TM4J_API_KEY,
        },
    }).then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('[getTestCases] Something went wrong:', error.response.data.message);
        return error.response.data;
    });
}

function updateTestCase(data) {
    return axios({
        method: 'PUT',
        url: `https://api.adaptavist.io/tm4j/v2/testcases/${data.key}`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: TM4J_API_KEY,
        },
        data,
    }).then((res) => {
        return res.data;
    }).catch((error) => {
        console.log('[updateTestCase] Something went wrong:', error);
        console.log('[updateTestCase] Something went wrong:', error.response.data.message);
        return error.response.data;
    });
}

async function update() {
    const state = {};

    const {total: totalTestCases, values: testCases} = await getTestCases();

    const testCasesMap = testCases.reduce((acc, testCase) => {
        acc[testCase.key] = testCase;
        return acc;
    }, {});

    const currentProdTestCases = testCases.filter(value => value.customFields['— Cypress —'] === PROD_TEST_CASE_STATUS).map(value => value.key);
    const currentUpdateTestCases = testCases.filter(value => value.customFields['— Cypress —'] === UPDATE_TEST_CASE_STATUS).map(value => value.key);

    

    currentProdTestCases.forEach((p) => {
        if (state[p]) {
            state[p].caseStatus = PROD_TEST_CASE_STATUS;
        } else {
            state[p] = {caseStatus: PROD_TEST_CASE_STATUS};
        }
    });

    currentUpdateTestCases.forEach((p) => {
        if (state[p]) {
            state[p].caseStatus = UPDATE_TEST_CASE_STATUS;
        } else {
            state[p] = {caseStatus: UPDATE_TEST_CASE_STATUS};
        }
    });

    const TEST_KEY = 'MM-R1118';
    const {total: totalTestExecutions, values: testExecutions} = await getTestExecutions(TEST_KEY);

    console.log('totalTestExecutions', totalTestExecutions);

    const passed = testExecutions.filter(value => value.testExecutionStatus.id === TEST_EXECUTION_PASSED_STATUS);
    const failed = testExecutions.filter(value => value.testExecutionStatus.id !== TEST_EXECUTION_PASSED_STATUS);

    const passedSelf = passed.map(value => value.testCase.self.split('/')[6]);
    const failedSelf = failed.map(value => value.testCase.self.split('/')[6]);
    

    passedSelf.forEach((p) => {
        if (state[p]) {
            state[p].executionStatus = PASSED;
        } else {
            state[p] = {executionStatus: PASSED};
        }

        if (testCasesMap[p]) {
            state[p].caseStatus = testCasesMap[p].customFields['— Cypress —'];
        } else {
            console.log(`No info: ${p}`)
            state[p].caseStatus = 'no info';
        }
    });

    failedSelf.forEach((p) => {``
        if (state[p]) {
            state[p].executionStatus = FAILED;
        } else {
            state[p] = {executionStatus: FAILED};
        }

        if (testCasesMap[p]) {
            state[p].caseStatus = testCasesMap[p].customFields['— Cypress —'];
        } else {
            console.log(`No info: ${p}`)
            state[p].caseStatus = 'no info';
        }
    });

    const newState = Object.entries(state).map(([k, v]) => {
        let newCaseStatus;

        // Remain as-is
        // { caseStatus: '✅ in Production', executionStatus: 'passed' }
        // { caseStatus: '🔧 Update' }
        
        // { caseStatus: '🔧 Update', executionStatus: 'passed' }
        if (v.caseStatus === UPDATE_TEST_CASE_STATUS && v.executionStatus === PASSED) {
            newCaseStatus = PROD_TEST_CASE_STATUS;

        // { executionStatus: 'failed', caseStatus: '👋 Ticket Open' }
        } else if (v.caseStatus === TICKET_OPEN_TEST_CASE_STATUS && v.executionStatus === FAILED) {
            newCaseStatus = UPDATE_TEST_CASE_STATUS;

        // { executionStatus: 'passed', caseStatus: '👋 Ticket Open' }
        } else if (v.caseStatus === TICKET_OPEN_TEST_CASE_STATUS && v.executionStatus === PASSED) {
            newCaseStatus = PROD_TEST_CASE_STATUS;

        // { caseStatus: '✅ in Production', executionStatus: 'failed' }
        } else if (v.caseStatus === PROD_TEST_CASE_STATUS && v.executionStatus === FAILED) {
            newCaseStatus = UPDATE_TEST_CASE_STATUS;

        // { caseStatus: '✅ in Production' }
        } else if (v.caseStatus === PROD_TEST_CASE_STATUS && !v.executionStatus) {
            newCaseStatus = UPDATE_TEST_CASE_STATUS;
        }

        const item = {
            key: k,
            ...v,
        }

        if (newCaseStatus) {
            item.newCaseStatus = newCaseStatus;
        }

        return item;
    })

    console.log('state', state);

    const newProd = newState.filter((p) => p.newCaseStatus && p.newCaseStatus === PROD_TEST_CASE_STATUS);
    const newUpdate = newState.filter((p) => p.newCaseStatus && p.newCaseStatus === UPDATE_TEST_CASE_STATUS);
    const unchanged = newState.filter((p) => !p.newCaseStatus);

    const newStateMap = newState.reduce((acc, s) => {
        acc[s.key] = s;
        return acc;
    }, {});

    newProd.sort((a, b) => a.key.localeCompare(b.key))
    newProd.forEach((p, i) => {
        const {
            id,
            key,
            name,
            project,
            priority,
            status,
            customFields,
        } = testCasesMap[p.key];

        delete project.self;
        delete priority.self;
        delete status.self;

        let notes = customFields['⚠️  Please leave notes here when you make any major changes to the test case. ⚠️'];
        notes += '<br> 21 Jan 2021 (Automation): Changed Cypress to Production'
        const newTestCase = {
            id,
            key,
            name,
            project,
            priority,
            status,
            customFields: {
                ...customFields,
                '— Cypress —': p.newCaseStatus,
                '⚠️  Please leave notes here when you make any major changes to the test case. ⚠️': notes,
            }
        }

        // temporary: try to update one item only
        // if (i === 0) {
        //     console.log('newTestCase', newTestCase);

        //     // call update here
        //     prodPromises.push(updateTestCase(newTestCase));
        // }
    });

    newUpdate.sort((a, b) => a.key.localeCompare(b.key))
    newUpdate.forEach((p, i) => {
        const testCase = testCasesMap[p.key];

        let notes = testCase.customFields['⚠️  Please leave notes here when you make any major changes to the test case. ⚠️'];
        notes += '<br> 21 Jan 2021 (Automation): Changed Cypress to Update'
        const newTestCase = {
            id: testCase.id,
            key: testCase.key,
            name: testCase.name,
            project: testCase.project,
            priority: testCase.priority,
            status: testCase.status,
            customFields: {
                ...testCase.customFields,
                '— Cypress —': p.newCaseStatus,
                '⚠️  Please leave notes here when you make any major changes to the test case. ⚠️': notes,
            }
        }

        // // temporary: try to update one item only
        // if (i === 0) {
        //     console.log('testCase', testCase);
        //     console.log('newTestCase', newTestCase);

        //     // call update here
        //     updatePromises.push(updateTestCase(newTestCase));
        // } 
    });

    console.log('\n--- Current TM4J Cases ---');
    console.log(totalTestCases, 'total test cases');
    console.log(currentProdTestCases.length, 'current tests in production');
    console.log(currentUpdateTestCases.length, 'current tests in update');

    console.log(`\n--- Test results from ${TEST_KEY} ---`);
    console.log(passed.length, 'passed');
    console.log(failed.length, 'failed');

    console.log('\n--- Action needed ---');
    console.log(newProd.length, 'tests to change to production');
    if (newProd.length) newProd.forEach((n) => console.log(n.key))
    console.log(newUpdate.length, 'tests to change to update');
    // if (newUpdate.length) newUpdate.forEach((n) => console.log(n.key))
    console.log(unchanged.length, 'to remain as is (no change needed)', );
}

update();

/**
 * 
62 tests to change to update
MM-T1031 - retest
MM-T1032 - nc
MM-T1033 - retest
MM-T1034 - nc
MM-T1035 - nc
MM-T1036 - retest
MM-T1037 - nc
MM-T1038 - retest
MM-T1039 - nc
MM-T1191 - u
MM-T1201 - nc
MM-T1209 - nc
MM-T1211 - nc
MM-T1212 - nc
MM-T1213 - nc
MM-T1214 - nc
MM-T1215 - nc
MM-T1216 - nc
MM-T1217 - nc
MM-T134 - nc
MM-T1471 - u
MM-T1537 - F
MM-T1744 - F
MM-T1775 - F
MM-T1837 - nc
MM-T1849 - nc
MM-T1853 - nc
MM-T1859 - nc
MM-T1861 - nc
MM-T1880 - retest
MM-T1986 - nc
MM-T2001 - nc
MM-T2002 - nc
MM-T211 - F
MM-T2185 - F
MM-T2443 - F (Ticket Open)
MM-T265 - nc
MM-T305 - nc
MM-T3279 - nc
MM-T3386 - nc
MM-T3387 - retest
MM-T3388 - retest
MM-T345 - nc
MM-T346 - nc
MM-T3719 - retest
MM-T3804 - nc
MM-T453 - F
MM-T576 - nc
MM-T638 - F
MM-T897 - retest
MM-T898 - nc
MM-T94 - F (retest)
MM-T952 - nc
MM-T956 - nc
MM-T959 - nc
MM-T960 - nc
MM-T961 - nc
MM-T991 - nc
MM-T993 - nc
MM-T994 - nc
MM-T995 - nc
MM-T996 - nc
 */
