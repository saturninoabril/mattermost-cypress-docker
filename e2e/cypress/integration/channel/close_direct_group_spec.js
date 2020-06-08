// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel @channel_settings

// Make sure that the current channel is Town Square and that the
// channel identified by the passed name is no longer in the channel
// sidebar
function verifyChannelWasProperlyClosed(channelName) {
    // * Make sure that we have switched channels
    cy.get('#channelHeaderTitle').should('contain', 'Town Square');

    // * Make sure the old DM no longer exists
    cy.get('#sidebarItem_' + channelName).should('not.exist');
}

describe('Close direct messages', () => {
    let testUser;
    let otherUser;

    before(() => {
        cy.apiAdminLogin();
        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => otherUser = user);
        cy.apiCreateAndLoginAsNewUser().then((user) => {
            testUser = user;

            cy.visit('/ad-1/channels/town-square');
        });
    });

    it('Through channel header dropdown menu', () => {
        createAndVisitDMChannel([testUser.id, otherUser.id]).then((channel) => {
            // # Open channel header dropdown menu and click on Close Direct Message
            cy.get('#channelHeaderDropdownIcon').click();
            cy.findByText('Close Direct Message').click();

            verifyChannelWasProperlyClosed(channel.name);
        });
    });

    it('Through x button on channel sidebar item', () => {
        createAndVisitDMChannel([testUser.id, otherUser.id]).then((channel) => {
            // # Click on the x button on the sidebar channel item
            cy.get('#sidebarItem_' + channel.name + '>span.btn-close').click({force: true});

            verifyChannelWasProperlyClosed(channel.name);
        });
    });

    function createAndVisitDMChannel(userIds) {
        return cy.apiCreateDirectChannel(userIds).then((res) => {
            const channel = res.body;

            // # Visit the new channel
            cy.visit(`/ad-1/channels/${channel.name}`);

            // * Verify channel's display name
            cy.get('#channelHeaderTitle').should('contain', channel.display_name);

            return cy.wrap(channel);
        });
    }
});

describe('Close group messages', () => {
    let testUser;
    let otherUser1;
    let otherUser2;

    before(() => {
        cy.apiAdminLogin();
        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => otherUser1 = user);
        cy.apiCreateUserAndAddToDefaultTeam().then(({user}) => otherUser2 = user);
        cy.apiCreateAndLoginAsNewUser().then((user) => {
            testUser = user;

            cy.visit('/ad-1/channels/town-square');
        });
    });

    it('Through channel header dropdown menu', () => {
        createAndVisitGMChannel([otherUser1, otherUser2], testUser).then((channel) => {
            // # Open channel header dropdown menu and click on Close Direct Message
            cy.get('#channelHeaderDropdownIcon').click();
            cy.findByText('Close Group Message').click();

            verifyChannelWasProperlyClosed(channel.name);
        });
    });

    it('Through x button on channel sidebar item', () => {
        createAndVisitGMChannel([otherUser1, otherUser2], testUser).then((channel) => {
            // # Click on the x button on the sidebar channel item
            cy.get('#sidebarItem_' + channel.name + '>span.btn-close').click({force: true});

            verifyChannelWasProperlyClosed(channel.name);
        });
    });

    function createAndVisitGMChannel(users, currentUser) {
        const userIds = users.map((user) => user.id);
        return cy.apiCreateGroupChannel(userIds).then((res) => {
            const channel = res.body;

            // # Visit the new channel
            cy.visit(`/ad-1/channels/${channel.name}`);
            console.log('channel.display_name', channel.display_name);
            // * Verify channel's display name
            const displayName = channel.display_name.split(', ').filter((username => username !== currentUser.username)).join(', ');
            console.log('displayNem', displayName);
            cy.get('#channelHeaderTitle').should('contain', displayName);

            return cy.wrap(channel);
        });
    }
});
