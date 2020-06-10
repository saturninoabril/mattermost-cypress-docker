// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @channel_moderation

import {getRandomId} from '../../../../utils';

import {
    checkboxesTitleToIdMap,
    disableChannelModeratedPermission,
    enableChannelModeratedPermission,
    postChannelMentionsAndVerifySystemMessageExist,
    postChannelMentionsAndVerifySystemMessageNotExist,
    saveConfigForChannel,
    saveConfigForScheme,
    visitChannel,
    visitChannelConfigPage,
} from './helpers';

describe('MM-23102 - Channel Moderation - Channel Mentions', () => {
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

                    cy.apiAddUserToTeam(testTeam.id, guestUser.id).then(() => {
                        cy.apiAddUserToChannel(testChannel.id, guestUser.id);
                    });

                    // # Make the guest user as Active
                    cy.apiActivateUser(guestUser.id, true);
                });
            });
        });
    });

    it('Channel Mentions option for Guests', () => {
        // # Uncheck the Channel Mentions option for Guests and save
        visitChannelConfigPage(testChannel);
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS);
        saveConfigForChannel();

        visitChannel(guestUser, testChannel, testTeam);

        // # Check Guest user has the permission to user special mentions like @all @channel and @here
        postChannelMentionsAndVerifySystemMessageExist(testChannel.name);

        // # Visit Channel page and Search for the channel.
        visitChannelConfigPage(testChannel);

        // # check the channel mentions option for guests and save
        enableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS);
        saveConfigForChannel();

        visitChannel(guestUser, testChannel, testTeam);

        // # Check Guest user has the permission to user special mentions like @all @channel and @here
        postChannelMentionsAndVerifySystemMessageNotExist(testChannel);
    });

    it('Channel Mentions option for Members', () => {
        // # Visit Channel page and Search for the channel.
        visitChannelConfigPage(testChannel);

        // # Uncheck the channel mentions option for guests and save
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
        saveConfigForChannel();

        visitChannel(regularUser, testChannel, testTeam);

        // # Check Member user does not has the permission to use special mentions like @all @channel and @here
        postChannelMentionsAndVerifySystemMessageExist(testChannel.name);

        // # Visit Channel page and Search for the channel.
        visitChannelConfigPage(testChannel);

        // # check the channel mentions option for guests and save
        enableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
        saveConfigForChannel();

        visitChannel(regularUser, testChannel, testTeam);

        // # Check Member user has the permission to user special mentions like @all @channel and @here
        postChannelMentionsAndVerifySystemMessageNotExist(testChannel);
    });

    it('Channel Mentions option removed when Create Post is disabled', () => {
        // # Visit Channel page and Search for the channel.
        visitChannelConfigPage(testChannel);

        // # Uncheck the create posts option for guests
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);

        // * Option to allow Channel Mentions for Guests should also be disabled when Create Post option is disabled.
        // * A message Guests can not use channel mentions without the ability to create posts should be displayed.
        cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledGuestsDueToCreatePosts').
            should('have.text', 'Guests can not use channel mentions without the ability to create posts.');
        cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS).should('be.disabled');

        // # check the create posts option for guests and uncheck for members
        enableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS);

        // * Option to allow Channel Mentions for Members should also be disabled when Create Post option is disabled.
        // * A message Members can not use channel mentions without the ability to create posts should be displayed.
        cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledMemberDueToCreatePosts').
            should('have.text', 'Members can not use channel mentions without the ability to create posts.');
        cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS).should('be.disabled');

        // # Uncheck the create posts option for guests
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);

        // * Ensure that channel mentions for members and guests is disabled
        // * Ensure message Guests & Members can not use channel mentions without the ability to create posts
        cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledBothDueToCreatePosts').
            should('have.text', 'Guests and members can not use channel mentions without the ability to create posts.');
        cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS).should('be.disabled');
        cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS).should('be.disabled');
    });

    it('Message when user without channel mention permission uses special channel mentions', () => {
        visitChannelConfigPage(testChannel);
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
        saveConfigForChannel();

        visitChannel(regularUser, testChannel, testTeam);

        cy.findByTestId('post_textbox').clear().type('@');

        // * Ensure that @here, @all, and @channel do not show up in the autocomplete list
        cy.findAllByTestId('mentionSuggestion_here').should('not.exist');
        cy.findAllByTestId('mentionSuggestion_all').should('not.exist');
        cy.findAllByTestId('mentionSuggestion_channel').should('not.exist');

        // * When you type @all, @enter, and @channel make sure that a system message shows up notifying you nothing happened.
        postChannelMentionsAndVerifySystemMessageExist(testChannel.name);
    });

    it('Confirm sending notifications while using special channel mentions', () => {
        // # Visit Channel page and Search for the channel.
        visitChannelConfigPage(testChannel);
        disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
        saveConfigForChannel();

        // # Set @channel and @all confirmation dialog to true
        cy.visit('admin_console/environment/notifications');
        cy.findByTestId('TeamSettings.EnableConfirmNotificationsToChanneltrue').check();
        saveConfigForScheme();

        // # Visit test channel
        visitChannel(regularUser, testChannel, testTeam);

        // * Type at all and enter that no confirmation dialogue shows up
        cy.findByTestId('post_textbox').clear().type('@all{enter}');
        cy.get('#confirmModalLabel').should('not.exist');

        // * Type at channel and enter that no confirmation dialogue shows up
        cy.findByTestId('post_textbox').clear().type('@channel{enter}');
        cy.get('#confirmModalLabel').should('not.exist');

        // * Type at here and enter that no confirmation dialogue shows up
        cy.findByTestId('post_textbox').clear().type('@here{enter}');
        cy.get('#confirmModalLabel').should('not.exist');
    });
});
