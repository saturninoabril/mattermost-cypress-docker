// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @visual_regression

import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('System Console - Enterprise', () => {
    const testCases = [
        {
            section: 'Reporting',
            header: 'System Statistics',
            sidebar: 'Site Statistics',
            url: '/admin_console/reporting/system_analytics',
        },
        {
            section: 'Reporting',
            header: 'Team Statistics',
            sidebar: 'Team Statistics',
            url: '/admin_console/reporting/team_statistics',
            headerContains: true,
        },
        {
            section: 'Reporting',
            header: 'Server Logs',
            sidebar: 'Server Logs',
            url: 'admin_console/reporting/server_logs',
        },
    ];

    before(() => {
        // * Check if server has license for feature
        cy.requireLicenseForFeature('Elasticsearch');

        // # Go to system admin then verify admin console URL and header
        cy.visit('/admin_console/about/license');
        cy.url().should('include', '/admin_console/about/license');
        cy.get('.admin-console', {timeout: TIMEOUTS.HALF_MIN}).should('be.visible').within(() => {
            cy.get('.admin-console__header').should('be.visible').and('have.text', 'Edition and License');
        });
    });

    testCases.forEach((testCase) => {
        it(`${testCase.section} - ${testCase.header}`, () => {
            // # Click the link on the sidebar
            cy.get('.admin-sidebar').should('be.visible').within(() => {
                cy.findByText(testCase.sidebar).scrollIntoView().should('be.visible').click();
            });

            // * Verify that it redirects to the URL and matches with the header
            cy.url().should('include', testCase.url);
            cy.get('.admin-console').should('be.visible').within(() => {
                cy.get('.admin-console__header').should('be.visible').and(testCase.headerContains ? 'contain' : 'have.text', testCase.header);
            });
        });
    });
});
