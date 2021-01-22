// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @system_console

describe('Feature discovery', () => {
    before(() => {
        cy.shouldRunOnTeamEdition();

        // # Visit admin console
        cy.visitAndWait('/admin_console');
    });

    const testCallsToAction = () => {
        cy.get("a[data-testid$='CallToAction']").each(($el) => {
            cy.wrap($el).should('have.attr', 'href').and('not.eq', '');
            cy.wrap($el).should('have.attr', 'target', '_blank');
        });
    };

    it('MM-25000 - LDAP', () => {
        cy.get('li').contains('AD/LDAP').click();
        cy.get("div[data-testid='featureDiscovery_title']").should('contain', 'LDAP');
        testCallsToAction();
    });

    it('MM-25000 - SAML', () => {
        cy.get('li').contains('SAML 2.0').click();
        cy.get("div[data-testid='featureDiscovery_title']").should('contain', 'SAML');
        testCallsToAction();
    });
});
