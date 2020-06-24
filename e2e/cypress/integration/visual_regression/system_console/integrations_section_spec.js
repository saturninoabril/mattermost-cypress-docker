// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @visual_regression

import * as TIMEOUTS from '../../../fixtures/timeouts';

import {getBatchName} from '../helpers';

describe('System Console - Integrations', () => {
    const testCases = [
        {
            section: 'Integrations',
            header: 'Integration Management',
            sidebar: 'Integration Management',
            url: 'admin_console/integrations/integration_management',
        },
        {
            section: 'Integrations',
            header: 'Bot Accounts',
            sidebar: 'Bot Accounts',
            url: 'admin_console/integrations/bot_accounts',
        },
        {
            section: 'Integrations',
            header: 'GIF (Beta)',
            sidebar: 'GIF (Beta)',
            url: 'admin_console/integrations/gif',
        },
        {
            section: 'Integrations',
            header: 'CORS',
            sidebar: 'CORS',
            url: 'admin_console/integrations/cors',
        },
    ];

    before(() => {
        // * Check if server has E20 license by checking one of its feature
        cy.requireLicenseForFeature('Elasticsearch');

        // # Go to system admin then verify admin console URL and header
        cy.visit('/admin_console/about/license');
        cy.url().should('include', '/admin_console/about/license');
        cy.get('.admin-console', {timeout: TIMEOUTS.ONE_MIN}).should('be.visible').within(() => {
            cy.get('.admin-console__header').should('be.visible').and('have.text', 'Edition and License');
        });
    });

    afterEach(() => {
        cy.visualEyesClose();
    });

    testCases.forEach((testCase) => {
        it(`${testCase.section} - ${testCase.header}`, () => {
            const browser = [{width: 1024, height: 2200, name: 'chrome'}];
            cy.visualEyesOpen({
                batchName: getBatchName(`System Console - ${testCase.section}`),
                browser,
            });

            // # Click the link on the sidebar
            cy.get('.admin-sidebar').should('be.visible').within(() => {
                cy.findByText(testCase.sidebar).scrollIntoView().should('be.visible').click();
            });

            // * Verify that it redirects to the URL and matches with the header
            cy.url().should('include', testCase.url);
            cy.get('.admin-console').should('be.visible').within(() => {
                cy.get('.admin-console__header').should('be.visible').and('have.text', testCase.header);

                // # Save snapshot for visual testing
                cy.visualSaveSnapshot({tag: testCase.sidebar, target: 'window', fully: true});
            });
        });
    });
});
