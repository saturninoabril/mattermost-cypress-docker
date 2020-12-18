// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @signin_authentication

describe('Cookie with Subpath', () => {
    let testUser;
    let townsquareLink;

    before(() => {
        // # Create new team and user
        cy.apiInitSetup().then(({team, user}) => {
            testUser = user;
            townsquareLink = `/${team.name}/channels/town-square`;
            cy.visit(townsquareLink);
        });
    });

    it('should generate cookie with subpath', () => {
        cy.url().then((url) => {
            cy.location().its('origin').then((origin) => {
                let subpath = '';
                if (url !== origin) {
                    subpath = url.replace(origin, '').replace(townsquareLink, '');
                }

                // # Logout current session and visit login page
                cy.apiLogout();
                cy.visit('/login');

                // * Check login page is loaded
                cy.get('#login_section').should('be.visible');

                // # Login as testUser
                cy.get('#loginId').should('be.visible').type(testUser.username);
                cy.get('#loginPassword').should('be.visible').type(testUser.password);
                cy.get('#loginButton').should('be.visible').click();

                // * Check login success
                cy.get('#channel_view').should('be.visible');

                // * Check subpath included in url
                cy.url().should('include', '/channels/town-square');
                cy.url().should('include', subpath);

                // * Check cookies have correct path parameter
                cy.getCookies().each((cookie) => {
                    if (subpath) {
                        expect(cookie).to.have.property('path', subpath);
                    } else {
                        expect(cookie).to.have.property('path', '/');
                    }
                });
            });
        });
    });
});
