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
            section: 'User Management',
            header: 'Mattermost Users',
            sidebar: 'Users',
            url: 'admin_console/user_management/users',
        },
        {
            section: 'User Management',
            header: 'Groups (Beta)',
            sidebar: 'Groups (Beta)',
            url: 'admin_console/user_management/groups',
        },
        {
            section: 'User Management',
            header: 'Mattermost Teams',
            sidebar: 'Teams',
            url: 'admin_console/user_management/teams',
        },
        {
            section: 'User Management',
            header: 'Mattermost Channels',
            sidebar: 'Channels',
            url: 'admin_console/user_management/channels',
        },
        {
            section: 'User Management',
            header: 'Permission Schemes',
            sidebar: 'Permissions',
            url: 'admin_console/user_management/permissions',
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
