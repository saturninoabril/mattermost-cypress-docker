// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @channel_sidebar

import users from '../../fixtures/users';

import {testWithConfig} from '../../support/hooks';

import {getRandomId} from '../../utils';

const sysadmin = users.sysadmin;

describe('Channel switching', () => {
    testWithConfig({
        ServiceSettings: {
            ExperimentalChannelSidebarOrganization: 'default_on',
        },
    });

    before(() => {
        cy.apiLogin('user-1');

        cy.visit('/');
    });

    const cmdOrCtrl = Cypress.platform === 'darwin' ? '{cmd}' : '{ctrl}';

    it('should switch channels when pressing the alt + arrow hotkeys', () => {
        // # Start with a new team
        const teamName = `team-${getRandomId()}`;
        cy.createNewTeam(teamName, teamName);

        // * Verify that we've switched to the new team
        cy.get('#headerTeamName').should('contain', teamName);

        // # Press alt + up
        cy.get('body').type('{alt}', {release: false}).type('{uparrow}').type('{alt}', {release: true});

        // * Verify that the channel changed to the Off-Topic channel
        cy.url().should('include', `/${teamName}/channels/off-topic`);
        cy.get('#channelHeaderTitle').should('contain', 'Off-Topic');

        // # Press alt + down
        cy.get('body').type('{alt}', {release: false}).type('{downarrow}').type('{alt}', {release: true});

        // * Verify that the channel changed to the Town Square
        cy.url().should('include', `/${teamName}/channels/town-square`);
        cy.get('#channelHeaderTitle').should('contain', 'Town Square');
    });
});
