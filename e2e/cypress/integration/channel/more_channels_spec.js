// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel

import * as TIMEOUTS from '../../fixtures/timeouts';

let channel;

describe('Channels', () => {
    it('MM-19337 Verify UI of More channels modal with archived selection', () => {
        // # Login as sysadmin and update config
        cy.apiLogin('sysadmin');
        cy.apiGetTeamByName('ad-1').then((teamRes) => {
            // # Create new test channel
            cy.apiCreateChannel(teamRes.body.id, 'channel-test', 'Channel Test' + Date.now()).then((channelRes) => {
                channel = channelRes.body;
            });
        });

        cy.visit('/ad-1/channels/town-square');

        verifyMoreChannelsModalWithArchivedSelection(false);

        verifyMoreChannelsModalWithArchivedSelection(true);
    });
});

function verifyMoreChannelsModalWithArchivedSelection(isEnabled) {
    // # Login as sysadmin and Update config to enable/disable viewing of archived channels
    cy.apiLogin('sysadmin');
    cy.apiUpdateConfig({
        TeamSettings: {
            ExperimentalViewArchivedChannels: isEnabled,
        },
    });

    // * Verify more channels modal
    verifyMoreChannelsModal(isEnabled);

    // # Login as regular user and verify more channels modal
    cy.apiLogin('user-1');
    verifyMoreChannelsModal(isEnabled);
}

function verifyMoreChannelsModal(isEnabled) {
    cy.visit('/ad-1/channels/town-square');

    // # Select "More..." on the left hand side menu
    cy.get('#publicChannelList').should('be.visible').within(() => {
        cy.findByText('More...').scrollIntoView().should('be.visible').click({force: true});
    });

    // * Verify that the more channels modal is open and with or without option to view archived channels
    cy.get('#moreChannelsModal').should('be.visible').within(() => {
        if (isEnabled) {
            cy.get('#channelsMoreDropdown').should('be.visible').and('have.text', 'Show: Public Channels');
        } else {
            cy.get('#channelsMoreDropdown').should('not.exist');
        }
    });
}
