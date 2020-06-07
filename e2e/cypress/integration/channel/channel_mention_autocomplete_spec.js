// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel

import users from '../../fixtures/users.json';
import * as TIMEOUTS from '../../fixtures/timeouts';

describe('Channel', () => {
    let testTeam;
    let testChannel;
    let testUser;

    before(() => {
        // # Build data to test and login as new user
        cy.apiCreateAndLoginAsNewUser().then((user) => {
            testUser = user;
        });
        cy.apiCreateTeam('test-team', 'Test Team').then((response) => {
            testTeam = response.body;

            cy.apiGetUserByEmail(users.sysadmin.email).then((eRes) => {
                const user = eRes.body;
                cy.apiAddUserToTeam(testTeam.id, user.id);

                cy.apiLogin('sysadmin');
                cy.apiCreateChannel(testTeam.id, 'test-channel', 'Test Channel').then((cRes) => {
                    testChannel = cRes.body;

                    cy.apiLogin(testUser.username, testUser.password);
                    cy.visit(`/${testTeam.name}/channels/town-square`);
                });
            });
        });
    });

    it('Channel autocomplete should have both lists populated correctly', () => {
        // # Type "~"
        cy.get('#post_textbox').should('be.visible').clear().type('~').wait(TIMEOUTS.TINY);
        cy.get('#loadingSpinner').should('not.exist');

        // * Should open up suggestion list for channels
        // * Should match each channel item and group label
        cy.get('#suggestionList').should('be.visible').children().within((el) => {
            cy.wrap(el).eq(0).should('contain', 'My Channels');
            cy.wrap(el).eq(1).should('contain', 'Off-Topic');
            cy.wrap(el).eq(2).should('contain', 'Town Square');
            cy.wrap(el).eq(3).should('contain', 'Other Channels');
            cy.wrap(el).eq(4).should('contain', testChannel.display_name);
        });
    });

    it('Joining a channel should alter channel mention autocomplete lists accordingly', () => {
        // # Join a channel by /join slash command
        cy.get('#post_textbox').should('be.visible').clear().wait(TIMEOUTS.TINY).type(`/join ~${testChannel.name}`).type('{enter}').wait(TIMEOUTS.TINY);

        // * Verify that it redirects into the channel
        cy.url().should('include', `/${testTeam.name}/channels/${testChannel.name}`);

        // # Type "~"
        cy.get('#post_textbox').should('be.visible').type('~').wait(TIMEOUTS.TINY);
        cy.get('#loadingSpinner').should('not.exist');

        // * Should open up suggestion list for channels
        // * Should match each channel item and group label
        cy.get('#suggestionList').should('be.visible').children().within((el) => {
            cy.wrap(el).eq(0).should('contain', 'My Channels');
            cy.wrap(el).eq(1).should('contain', 'Off-Topic');
            cy.wrap(el).eq(2).should('contain', testChannel.display_name);
            cy.wrap(el).eq(3).should('contain', 'Town Square');
        });
    });

    it('Getting removed from a channel should alter channel mention autocomplete lists accordingly', () => {
        // # Remove test user from the test channel
        cy.removeUserFromChannel(testChannel.id, testUser.id).then((res) => {
            expect(res).to.equal(200);

            // # Login as test user and visit the test team
            cy.apiLogin(testUser.username, testUser.password);
            cy.visit(`/${testTeam.name}/channels/town-square`);

            // # Type "~"
            cy.get('#post_textbox').should('be.visible').clear().type('~').wait(TIMEOUTS.TINY);
            cy.get('#loadingSpinner').should('not.exist');

            // * Should open up suggestion list for channels
            // * Should match each channel item and group label
            cy.get('#suggestionList').should('be.visible').children().within((el) => {
                cy.wrap(el).eq(0).should('contain', 'My Channels');
                cy.wrap(el).eq(1).should('contain', 'Off-Topic');
                cy.wrap(el).eq(2).should('contain', 'Town Square');
                cy.wrap(el).eq(3).should('contain', 'Other Channels');
                cy.wrap(el).eq(4).should('contain', testChannel.display_name);
            });
        });
    });
});
