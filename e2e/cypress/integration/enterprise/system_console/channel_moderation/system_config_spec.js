// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @channel_moderation

import {getRandomId} from '../../../../utils';
import * as TIMEOUTS from '../../../../fixtures/timeouts';

import {
    checkBoxes,
    disableAllChannelModeratedPermissions,
    enableAllChannelModeratedPermissions,
    saveConfigForChannel,
} from './helpers';

describe('Channel Moderation', () => {
    let regularUser;
    let guestUser;
    let testTeam;
    let testChannel;

    before(() => {
        // * Check if server has license
        cy.requireLicense();

        cy.apiCreateUserAndAddToDefaultTeam().then(({user, team}) => {
            regularUser = user;
            testTeam = team;

            // # Add new channel
            cy.apiCreateChannel(testTeam.id, 'moderation', `moderation${getRandomId()}`).then((response) => {
                testChannel = response.body;

                cy.apiAddUserToChannel(testChannel.id, regularUser.id);

                cy.apiCreateGuestUser().then((user) => {
                    guestUser = user;

                    cy.apiAddUserToTeam(team.id, guestUser.id).then(() => {
                        cy.apiAddUserToChannel(testChannel.id, guestUser.id);
                    });

                    // # Make the guest user as Active
                    cy.apiActivateUser(guestUser.id, true);
                });
            });
        });
    });

    it('MM-22276 - Enable and Disable all channel moderated permissions', () => {
        // # Go to system admin page and to channel configuration page of test channel
        cy.apiAdminLogin();
        cy.visit('/admin_console/user_management/channels');

        // # Search for the channel.
        cy.findByTestId('search-input').type(`${testChannel.name}{enter}`);
        cy.findByText('Edit').click();

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // # Check all the boxes currently unchecked (align with the system scheme permissions)
        enableAllChannelModeratedPermissions();

        // # Save if possible (if previous test ended abruptly all permissions may already be enabled)
        saveConfigForChannel(testChannel.display_name);

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // * Ensure all checkboxes are checked
        checkBoxes.forEach((buttonId) => {
            cy.findByTestId(buttonId).should('have.class', 'checked');
        });

        // # Uncheck all the boxes currently checked
        disableAllChannelModeratedPermissions();

        // # Save the page and wait till saving is done
        saveConfigForChannel(testChannel.display_name);

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // * Ensure all checkboxes have the correct unchecked state
        checkBoxes.forEach((buttonId) => {
            // * Ensure all checkboxes are unchecked
            cy.findByTestId(buttonId).should('not.have.class', 'checked');

            // * Ensure Channel Mentions are disabled due to Create Posts
            if (buttonId.includes('use_channel_mentions')) {
                cy.findByTestId(buttonId).should('be.disabled');
                return;
            }

            // * Ensure all other check boxes are still enabled
            cy.findByTestId(buttonId).should('not.be.disabled');
        });
    });
});
