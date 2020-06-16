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

describe('SF15699 Search Date Filter - on', () => {
    // Store unique suffix
    const commonText = getRandomId();

    // Setup Messages
    const todayMessage = `1st Today's message ${commonText}`;
    const firstMessage = `5th First message ${commonText}`;
    const secondMessage = `3rd Second message ${commonText}`;
    const firstOffTopicMessage = `4th Off topic 1 ${commonText}`;
    const secondOffTopicMessage = `2nd Off topic 2 ${commonText}`;

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

    it('omits results before and after target date', () => {
        searchAndValidate(`on:${secondDateEarly.query} ${commonText}`, [secondOffTopicMessage, secondMessage]);
    });

    it('takes precedence over "after:" and "before:"', () => {
        searchAndValidate(`before:${Cypress.moment().format('YYYY-MM-DD')} on:${secondDateEarly.query} ${commonText}`, [secondOffTopicMessage, secondMessage]);
    });

    it('takes precedence over "after:"', () => {
        searchAndValidate(`after:${firstDateEarly.query} on:${secondDateEarly.query} ${commonText}`, [secondOffTopicMessage, secondMessage]);
    });

    it('can be used in conjunction with "in:"', () => {
        searchAndValidate(`on:${secondDateEarly.query} in:town-square ${commonText}`, [secondMessage]);
    });

    it('can be used in conjunction with "from:"', () => {
        searchAndValidate(`on:${secondDateEarly.query} from:${newAdmin.username} ${commonText}`, [secondOffTopicMessage]);
    });

    it('works from 12:00am to 11:59pm', () => {
        // create posts on a day att 11:59 the previous day, 12:00am the main day, 11:59pm the main day, and 12:00 the next day
        const identifier = 'christmas' + Date.now();

        const preTarget = getMsAndQueryForDate(Date.UTC(2018, 11, 24, 23, 59)); // December 24th, 2018 @ 11:59pm
        const targetAM = getMsAndQueryForDate(Date.UTC(2018, 11, 25, 0, 0)); // December 25th, 2018 @ 12:00am
        const targetPM = getMsAndQueryForDate(Date.UTC(2018, 11, 25, 23, 59)); // December 25th, 2018 @ 11:59pm
        const postTarget = getMsAndQueryForDate(Date.UTC(2018, 11, 26, 0, 0)); // December 26th, 2018 @ 12:00am

        const targetAMMessage = 'targetAM ' + identifier;
        const targetPMMessage = 'targetPM ' + identifier;

        // Post same message at different times
        cy.getCurrentChannelId().then((channelId) => {
            cy.postMessageAs({sender: admin, message: 'pretarget ' + identifier, channelId, createAt: preTarget.ms});
            cy.postMessageAs({sender: admin, message: targetAMMessage, channelId, createAt: targetAM.ms});
            cy.postMessageAs({sender: admin, message: targetPMMessage, channelId, createAt: targetPM.ms});
            cy.postMessageAs({sender: admin, message: 'postTarget' + identifier, channelId, createAt: postTarget.ms});
        });

        // * Verify we only see messages from the expected date, and not outside of it
        searchAndValidate(`on:${targetAM.query} ${identifier}`, [targetPMMessage, targetAMMessage]);
    });

    it('using a date from the future shows no results', () => {
        searchAndValidate(`on:2099-7-15 ${commonText}`);
    });
});
