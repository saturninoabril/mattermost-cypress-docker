// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @search_date_filter

import * as TIMEOUTS from '../../fixtures/timeouts';
import {getAdminAccount} from '../../support/env';
import {getRandomId} from '../../utils';

import {getMsAndQueryForDate, searchAndValidate} from './helpers';

describe('SF15699 Search Date Filter - before', () => {
    // Store unique suffix
    const commonText = getRandomId();

    // Setup Messages
    const todayMessage = `1st Today's message ${commonText}`;
    const firstMessage = `5th First message ${commonText}`;
    const secondMessage = `3rd Second message ${commonText}`;
    const firstOffTopicMessage = `4th Off topic 1 ${commonText}`;
    const secondOffTopicMessage = `2nd Off topic 2 ${commonText}`;

    // Store messages in expected order they'd appear
    const allMessagesInOrder = [
        todayMessage,
        secondOffTopicMessage,
        secondMessage,
        firstOffTopicMessage,
        firstMessage,
    ];

    // Get dates for query and in ms for usage below
    const firstDateEarly = getMsAndQueryForDate(Date.UTC(2018, 5, 5, 9, 30)); // June 5th, 2018 @ 9:30am
    const firstDateLater = getMsAndQueryForDate(Date.UTC(2018, 5, 5, 9, 45)); // June 5th, 2018 @ 9:45am
    const secondDateEarly = getMsAndQueryForDate(Date.UTC(2018, 9, 15, 13, 15)); // October 15th, 2018 @ 1:15pm
    const secondDateLater = getMsAndQueryForDate(Date.UTC(2018, 9, 15, 13, 25)); // October 15th, 2018 @ 1:25pm

    const baseUrl = Cypress.config('baseUrl');
    const admin = getAdminAccount();
    let newAdmin;

    before(() => {
        // # Change timezone to UTC so we are in sync with the backend
        cy.apiPatchMe({timezone: {automaticTimezone: '', manualTimezone: 'UTC', useAutomaticTimezone: 'false'}});

        cy.apiInitSetup().then(({team}) => {
            // # Create another admin user so we can create posts from another user
            cy.apiCreateUser().then(({user: user1}) => {
                newAdmin = user1;
                cy.externalRequest({user: admin, method: 'put', baseUrl, path: `users/${newAdmin.id}/roles`, data: {roles: 'system_user system_admin'}});

                // # Visit town-square
                cy.visit(`/${team.name}/channels/town-square`);

                // # Create a post from today
                cy.get('#postListContent', {timeout: TIMEOUTS.LARGE}).should('be.visible');
                cy.postMessage(todayMessage).wait(1000);

                cy.apiAddUserToTeam(team.id, newAdmin.id).then(() => {
                    // cy.visit(`/${team.name}/channels/town-square`);
                    cy.getCurrentChannelId().then((townSquareChannelId) => {
                        // cy.externalRequest({user: admin, method: 'put', baseUrl, path: `users/${user.id}/roles`, data: {roles: 'system_user system_admin'}});

                        // Post message as new admin to Town Square
                        cy.postMessageAs({sender: newAdmin, message: firstMessage, channelId: townSquareChannelId, createAt: firstDateEarly.ms}).wait(1000);

                        // Post message as sysadmin to Town Square
                        cy.postMessageAs({sender: admin, message: secondMessage, channelId: townSquareChannelId, createAt: secondDateEarly.ms});

                        // # Create messages at same dates in Off Topic channel
                        cy.visit(`/${team.name}/channels/off-topic`);

                        cy.getCurrentChannelId().then((offTopicChannelId) => {
                            // Post message as sysadmin to off topic
                            cy.postMessageAs({sender: admin, message: firstOffTopicMessage, channelId: offTopicChannelId, createAt: firstDateLater.ms}).wait(1000);

                            // Post message as new admin to off topic
                            cy.postMessageAs({sender: newAdmin, message: secondOffTopicMessage, channelId: offTopicChannelId, createAt: secondDateLater.ms});
                        });
                    });
                });
            });
        });
    });

    it('omits results on and after target date', () => {
        searchAndValidate(`before:${secondDateEarly.query} ${commonText}`, [firstOffTopicMessage, firstMessage]);
    });

    it('can be used in conjunction with "in:"', () => {
        searchAndValidate(`before:${secondDateEarly.query} in:town-square ${commonText}`, [firstMessage]);
    });

    it('can be used in conjunction with "from:"', () => {
        searchAndValidate(`before:${secondDateEarly.query} from:${newAdmin.username} ${commonText}`, [firstMessage]);
    });

    it('using a date from the future shows results', () => {
        searchAndValidate(`before:2099-7-15 ${commonText}`, allMessagesInOrder);
    });
});
