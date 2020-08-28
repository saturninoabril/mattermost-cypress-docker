// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @websocket

import {testWithConfig} from '../../../support/hooks';
import {getRandomId} from '../../../utils';

import {
    createNewTeamAndMoveToOffTopic,
    removeMeFromCurrentChannel,
    shouldRemoveFlaggedPostsInRHS,
    shouldRemoveMentionsInRHS,
} from './helpers';

describe('Handle removed user - new sidebar', () => {
    const sidebarItemClass = '.SidebarChannel';

    testWithConfig({
        ServiceSettings: {
            ExperimentalChannelSidebarOrganization: 'default_on',
        },
    });

    before(() => {
        cy.apiInitSetup({loginAfter: true}).then(({team, channel}) => {
            cy.apiSaveCloudOnboardingPreference('hide', 'true');
            cy.apiHideSidebarWhatsNewModalPreference('true');
            cy.visit(`/${team.name}/channels/${channel.name}`);
        });
    });

    it('should be redirected to last channel when a user is removed from their current channel', () => {
        const teamName = `team-${getRandomId()}`;
        createNewTeamAndMoveToOffTopic(teamName, sidebarItemClass);

        removeMeFromCurrentChannel().then(() => {
            // * Verify that the channel changed back to Town Square
            cy.url().should('include', `/${teamName}/channels/town-square`);
            cy.get('#channelHeaderTitle').should('be.visible').should('contain', 'Town Square');
        });
    });

    it('should remove mentions from RHS', () => {
        const teamName = `team-${getRandomId()}`;
        createNewTeamAndMoveToOffTopic(teamName, sidebarItemClass);
        shouldRemoveMentionsInRHS(teamName, sidebarItemClass);
    });

    it('should remove flagged posts from RHS', () => {
        const teamName = `team-${getRandomId()}`;
        createNewTeamAndMoveToOffTopic(teamName, sidebarItemClass);
        shouldRemoveFlaggedPostsInRHS(teamName, sidebarItemClass);
    });
});
