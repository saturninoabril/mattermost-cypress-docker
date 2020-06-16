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

function changeTimezone(timezone) {
    cy.apiPatchMe({timezone: {automaticTimezone: '', manualTimezone: timezone, useAutomaticTimezone: 'false'}});
}

describe('SF15699 Search Date Filter - edit', () => {
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
        changeTimezone('UTC');

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

    it('with calendar picker and results update', () => {
        // # Create expected data
        const targetMessage = 'calendarUpdate' + Date.now();
        const targetDate = getMsAndQueryForDate(Date.UTC(2019, 0, 15, 9, 30));

        // # Post message with unique text
        cy.getCurrentChannelId().then((channelId) => {
            cy.postMessageAs({sender: admin, message: targetMessage, channelId, createAt: targetDate.ms});
        });

        // # Set clock to custom date, reload page for it to take effect
        cy.clock(targetDate.ms, ['Date']);
        cy.reload();

        // # Type on: into search field
        cy.get('#searchBox').clear().type('on:');

        // * Day picker should appear
        cy.get('.DayPicker').
            as('dayPicker').
            should('be.visible');

        // # Click on today's date
        cy.get('@dayPicker').
            find('.DayPicker-Day--today').click();

        // * Search field should populate with the correct date, then send rest of query
        cy.get('#searchBox').
            should('have.value', 'on:2019-01-15 ').
            focus().
            type(`${targetMessage}{enter}`);

        cy.get('#loadingSpinner').should('not.be.visible');

        // * Verify we see our single result
        cy.queryAllByTestId('search-item-container').
            should('be.visible').
            and('have.length', 1).
            find('.post-message').
            should('have.text', targetMessage);

        cy.reload();

        // # Back space right after the date to bring up date picker again
        cy.get('#searchBox').focus().clear().
            type(`on:2019-01-15 ${targetMessage}`).
            type('{leftarrow}'.repeat(targetMessage.length + 1)).
            type('{backspace}');

        // * Day picker should be visible
        cy.get('@dayPicker').should('be.visible');

        // # Click on tomorrow's day
        cy.get('@dayPicker').
            find('.DayPicker-Day--today').
            next('.DayPicker-Day').click();

        // # Add message to search for, and hit enter
        cy.get('#searchBox').
            should('have.value', `on:2019-01-16  ${targetMessage}`).
            type('{enter}');

        cy.get('#loadingSpinner').should('not.be.visible');

        // * There should be no results
        cy.queryAllByTestId('search-item-container').should('have.length', 0);
    });

    it('changing timezone changes day search results appears', () => {
        const identifier = 'timezone' + Date.now();

        const target = getMsAndQueryForDate(Date.UTC(2018, 9, 31, 23, 59));

        const targetMessage = 'targetAM ' + identifier;

        // # Post message with unique text
        cy.getCurrentChannelId().then((channelId) => {
            cy.postMessageAs({sender: admin, message: targetMessage, channelId, createAt: target.ms});
        });

        // * Verify result appears in current timezone
        searchAndValidate(`on:${target.query} ${identifier}`, [targetMessage]);

        // # Change timezone to alter what posts appear in results
        changeTimezone('Europe/Brussels');

        // * With same query, no results should appear
        searchAndValidate(`on:${target.query} ${identifier}`);
    });
});
