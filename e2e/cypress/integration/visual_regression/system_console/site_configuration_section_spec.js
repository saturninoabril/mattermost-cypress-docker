// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @visual_regression

import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('System Console - Site Configuration', () => {
    const testCases = [
        {
            section: 'Site Configuration',
            header: 'Customization',
            sidebar: 'Customization',
            url: 'admin_console/site_config/customization',
        },
        {
            section: 'Site Configuration',
            header: 'Localization',
            sidebar: 'Localization',
            url: 'admin_console/site_config/localization',
        },
        {
            section: 'Site Configuration',
            header: 'Users and Teams',
            sidebar: 'Users and Teams',
            url: 'admin_console/site_config/users_and_teams',
        },
        {
            section: 'Site Configuration',
            header: 'Notifications',
            sidebar: 'Notifications',
            url: 'admin_console/environment/notifications',
        },
        {
            section: 'Site Configuration',
            header: 'Announcement Banner',
            sidebar: 'Announcement Banner',
            url: 'admin_console/site_config/announcement_banner',
        },
        {
            section: 'Site Configuration',
            header: 'Emoji',
            sidebar: 'Emoji',
            url: 'admin_console/site_config/emoji',
        },
        {
            section: 'Site Configuration',
            header: 'Posts',
            sidebar: 'Posts',
            url: 'admin_console/site_config/posts',
        },
        {
            section: 'Site Configuration',
            header: 'File Sharing and Downloads',
            sidebar: 'File Sharing and Downloads',
            url: 'admin_console/site_config/file_sharing_downloads',
        },
        {
            section: 'Site Configuration',
            header: 'Public Links',
            sidebar: 'Public Links',
            url: 'admin_console/site_config/public_links',
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
