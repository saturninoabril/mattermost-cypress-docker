// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @websocket

import {getRandomId} from '../../../utils';

describe('Handle removed user - new sidebar', () => {
    let newTeam;

    before(() => {
        cy.apiInitSetup({loginAfter: true}).then(({team}) => {
            newTeam = team;

             // # Start with a new team
            cy.visit(`/${newTeam.name}/channels/town-square`).wait(3000);
        });
    });

    it('MM-27202 should add new channels to the sidebar when created from another session', () => {
        // * Verify that we've switched to the new team
        cy.get('#headerTeamName').should('be.visible').should('contain', newTeam.display_name);

        // # Create a new channel from another session
        const channelName = `channel-${getRandomId()}`;
        cy.apiCreateChannel(newTeam.id, channelName, channelName, 'O', '', '', false);

        // Verify that the new channel is in the sidebar
        cy.get(`#sidebarItem_${channelName}`).should('be.visible');
    });
});
