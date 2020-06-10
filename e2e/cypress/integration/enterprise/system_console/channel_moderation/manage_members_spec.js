// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @channel_moderation

import * as TIMEOUTS from '../../../../fixtures/timeouts';
import {getRandomId} from '../../../../utils';

import {
    checkboxesTitleToIdMap,
    deleteOrEditTeamScheme,
    disableChannelModeratedPermission,
    enableChannelModeratedPermission,
    goToPermissionsAndCreateTeamOverrideScheme,
    goToSystemScheme,
    saveConfigForChannel,
    saveConfigForScheme,
    viewManageChannelMembersModal,
    visitChannel,
    visitChannelConfigPage,
} from './helpers';

describe('MM-23102 - Channel Moderation - Manage Members', () => {
    let regularUser;
    let guestUser;
    let testTeam;
    let testChannel;

    before(() => {
        // * Check if server has license
        cy.requireLicense();

        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => {
            regularUser = user;
        });

        cy.apiCreateGuestUser().then((user) => {
            guestUser = user;

            // # Make the guest user as Active
            cy.apiActivateUser(guestUser.id, true);
        });
    });

    beforeEach(() => {
        cy.apiAdminLogin();
        cy.apiCreateTeam('moderation-team', `Moderation ${getRandomId()}`).then((response) => {
            testTeam = response.body;
            cy.apiAddUserToTeam(testTeam.id, regularUser.id);

            // # Add new channel
            cy.apiCreateChannel(testTeam.id, 'moderation', `moderation${getRandomId()}`).then((response) => {
                testChannel = response.body;

                cy.apiAddUserToTeam(testTeam.id, regularUser.id).then(() => {
                    cy.apiAddUserToChannel(testChannel.id, regularUser.id);
                });

                cy.apiAddUserToTeam(testTeam.id, guestUser.id).then(() => {
                    cy.apiAddUserToChannel(testChannel.id, guestUser.id);
                });
            });
        });
    });

    it('No option to Manage Members for Guests', () => {
        visitChannelConfigPage(testChannel);

        // * Assert that Manage Members for Guests does not exist (checkbox is not there)
        cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

        visitChannel(guestUser, testChannel, testTeam);

        // # View members modal
        viewManageChannelMembersModal('View');

        // * Add Members button does not exist
        cy.get('#showInviteModal').should('not.exist');
    });

    it('Manage Members option for Members', () => {
        // # Visit test channel page and turn off the Manage members for Members and then save
        visitChannelConfigPage(testChannel);
        disableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
        saveConfigForChannel();

        visitChannel(regularUser, testChannel, testTeam);
        viewManageChannelMembersModal('View');

        // * Add Members button does not exist
        cy.get('#showInviteModal').should('not.exist');

        // # Visit test channel page and turn off the Manage members for Members and then save
        visitChannelConfigPage(testChannel);
        enableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
        saveConfigForChannel();

        visitChannel(regularUser, testChannel, testTeam);
        viewManageChannelMembersModal('Manage');

        // * Add Members button does exist
        cy.get('#showInviteModal').should('exist');
    });

    it('Manage Members option removed for Members in System Scheme', () => {
        // Edit the System Scheme and remove the Manage Members option for Members & Save.
        goToSystemScheme();
        cy.get('#all_users-public_channel-manage_public_channel_members').click();
        saveConfigForScheme();

        // # Visit test channel page and turn off the Manage members for Members and then save
        visitChannelConfigPage(testChannel);

        // * Assert that Manage Members option should be disabled for a Members.
        // * A message Manage members for members are disabled in the System Scheme should be displayed.
        cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
            should('exist').
            and('have.text', 'Manage members for members are disabled in System Scheme.');
        cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');
        cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

        visitChannel(regularUser, testChannel, testTeam);
        viewManageChannelMembersModal('View');

        // * Add Members button does not exist
        cy.get('#showInviteModal').should('not.exist');
    });

    it('Manage Members option removed for Members in Team Override Scheme', () => {
        const teamOverrideSchemeName = `manage_members_${getRandomId()}`;

        // # Create a new team override scheme and remove manage members option for members
        goToPermissionsAndCreateTeamOverrideScheme(teamOverrideSchemeName, testTeam);
        deleteOrEditTeamScheme(teamOverrideSchemeName, 'edit');
        cy.get('#all_users-public_channel-manage_public_channel_members').click();
        saveConfigForScheme(false);
        cy.wait(TIMEOUTS.SMALL);

        // * Assert that Manage Members is disabled for members and a message is displayed
        visitChannelConfigPage(testChannel);
        cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
            should('exist').
            and('have.text', 'Manage members for members are disabled in manage_members Team Scheme.');
        cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');
        cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

        visitChannel(regularUser, testChannel, testTeam);
        viewManageChannelMembersModal('View');

        // * Add Members button does not exist in manage channel members modal
        cy.get('#showInviteModal').should('not.exist');
    });
});
