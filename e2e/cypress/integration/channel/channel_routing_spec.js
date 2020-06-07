// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel

describe('Channel routing', () => {
    let testUser;
    let otherUser1;
    let otherUser2;

    before(() => {
        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => otherUser1 = user);
        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => otherUser2 = user);

        // # Login as test user
        cy.apiCreateAndLoginAsNewUser().then((user) => {
            testUser = user;
        });
    });

    it('should go to town square channel view', () => {
        // # Go to town square channel
        cy.visit('/ad-1/channels/town-square');

        // * Check if the channel is loaded correctly
        cy.get('#channelHeaderTitle').should('be.visible').should('contain', 'Town Square');
    });

    it('should go to private channel view', () => {
        cy.getCurrentTeamId().then((teamId) => {
            // # Create a private channel
            cy.apiCreateChannel(teamId, 'private-channel', 'Private channel', 'P').then((response) => {
                // # Go to the newly created channel
                cy.visit(`/ad-1/channels/${response.body.name}`);

                // * Check you can go to the channel without problem
                cy.get('#channelHeaderTitle').should('be.visible').should('contain', 'Private channel');

                // # Remove the created channel
                cy.apiDeleteChannel(response.body.id);
            });
        });
    });

    it('should go to self direct channel using the multiple ways to go', () => {
        // # Create a self direct channel
        cy.apiCreateDirectChannel([testUser.id, testUser.id]).then((response) => {
            const ownDMChannel = response.body;

            // # Visit the channel using the channel name
            cy.visit(`/ad-1/channels/${testUser.id}__${testUser.id}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', `${testUser.username} (you)`);

            // # Visit the channel using the channel id
            cy.visit(`/ad-1/channels/${ownDMChannel.id}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', `${testUser.username} (you)`);

            // # Visit the channel using the username
            cy.visit(`/ad-1/messages/@${testUser.username}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', `${testUser.username} (you)`);

            // # Visit the channel using the user email
            cy.visit(`/ad-1/messages/${testUser.email}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', `${testUser.username} (you)`);
        });
    });

    it('should go to other user direct channel using multiple ways to go', () => {
        // # Create a direct channel between two users
        cy.apiCreateDirectChannel([testUser.id, otherUser1.id]).then((response) => {
            const dmChannel = response.body;

            console.log('dmChannel', dmChannel);

            // # Visit the channel using the channel name
            cy.visit(`/ad-1/channels/${testUser.id}__${otherUser1.id}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', otherUser1.username);

            // # Visit the channel using the channel id
            cy.visit(`/ad-1/channels/${dmChannel.id}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', otherUser1.username);

            // # Visit the channel using the target username
            cy.visit(`/ad-1/messages/@${otherUser1.username}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', otherUser1.username);

            // # Visit the channel using the target user email
            cy.visit(`/ad-1/messages/${otherUser1.email}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', otherUser1.username);
        });
    });

    it('should go group channel using group id', () => {
        const userGroupIds = [testUser.id, otherUser1.id, otherUser2.id];

        // # Create a group channel for 3 users
        cy.apiCreateGroupChannel(userGroupIds).then((response) => {
            const gmChannel = response.body;

            // # Visit the channel using the name using the channels route
            cy.visit(`/ad-1/channels/${gmChannel.name}`);

            // * Check you can go to the channel without problem
            const displayName = gmChannel.display_name.split(', ').filter((username => username !== testUser.username)).join(', ');
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', displayName);

            // # Visit the channel using the name using the messages route
            cy.visit(`/ad-1/messages/${gmChannel.name}`);

            // * Check you can go to the channel without problem
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', displayName);
        });
    });
});
