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

describe('SF15699 Search Date Filter - input', () => {
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

    it('can search for single post without adding a date filter', () => {
        searchAndValidate(todayMessage, [todayMessage]);
    });

    it('can search for posts sharing text', () => {
        searchAndValidate(commonText, allMessagesInOrder);
    });

    it('with calendar picker to set date', () => {
        const today = Cypress.moment().format('YYYY-MM-DD');

        // # Type before: in search field
        cy.get('#searchBox').clear().type('before:');

        // * Day picker should be visible
        cy.get('.DayPicker').
            as('dayPicker').
            should('be.visible');

        // # Select today's day
        cy.get('@dayPicker').
            find('.DayPicker-Day--today').click();

        cy.get('@dayPicker').should('not.exist');

        // * Verify date picker output gets put into field as expected date
        cy.get('#searchBox').should('have.value', `before:${today} `);
    });

    it('backspace after last character of filter makes calendar reappear', () => {
        const today = Cypress.moment().format('YYYY-MM-DD');

        // # Type before: in search field
        cy.get('#searchBox').clear().type('before:');

        // * Day picker should be visible
        cy.get('.DayPicker').
            as('dayPicker').
            should('be.visible');

        // # Select today's day
        cy.get('@dayPicker').
            find('.DayPicker-Day--today').click();

        // * Day picker should disappear
        cy.get('@dayPicker').should('not.exist');

        // # Hit backspace with focus right after the date
        cy.get('#searchBox').
            should('have.value', `before:${today} `).
            focus().
            type('{backspace}');

        // * Day picker should reappear
        cy.get('@dayPicker').should('be.visible');
    });

    describe('works without leading 0 in', () => {
        // These must match the date of the firstMessage, only altering leading zeroes
        const tests = [
            {name: 'day', date: '2018-06-5'},
            {name: 'month', date: '2018-6-05'},
            {name: 'month and date', date: '2018-6-5'},
        ];

        before(() => {
            cy.reload();
        });

        tests.forEach((test) => {
            it(test.name, () => {
                searchAndValidate(`on:${test.date} "${firstMessage}"`, [firstMessage]);
            });
        });
    });

    describe('query string can be removed with', () => {
        const queryString = `on:${Cypress.moment().format('YYYY-MM-DD')} ${commonText}`;

        it('with keyboard', () => {
            cy.get('#searchBox').
                clear().
                wait(500).
                type(queryString).
                type('{backspace}'.repeat(queryString.length)).
                should('have.value', '');
        });

        it('with "x"', () => {
            cy.get('#searchBox').clear().wait(500).type(queryString);
            cy.get('#searchFormContainer').find('.input-clear-x').click({force: true});
            cy.get('#searchBox').should('have.value', '');
        });
    });
});
