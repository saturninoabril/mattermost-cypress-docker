// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @system_console

import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('System Console > Site Statistics', () => {
    let testUser;

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            // # Login as test user and visit town-square
            testUser = user;
            cy.apiLogin(testUser);
            cy.visit(`/${team.name}/channels/town-square`);
            cy.postMessage('New Daily Message');
        });
    });

    it('MM-T903 - Site Statistics > Deactivating a user increments the Daily and Monthly Active Users counts down', () => {
        // # Go to admin console
        goToAdminConsole();

        // # Go to system analytics
        cy.findByTestId('reporting.system_analytics', {timeout: TIMEOUTS.ONE_MIN}).click();
        cy.wait(TIMEOUTS.ONE_SEC);

        // # Get the number text and turn them into numbers
        cy.findByTestId('totalActiveUsers').invoke('text').then((totalActiveText) => {
            const totalActiveUsersInitial = parseInt(totalActiveText, 10);
            cy.findByTestId('dailyActiveUsers').invoke('text').then((dailyActiveText) => {
                const dailyActiveUsersInitial = parseInt(dailyActiveText, 10);
                cy.findByTestId('monthlyActiveUsers').invoke('text').then((monthlyActiveText) => {
                    const monthlyActiveUsersInitial = parseInt(monthlyActiveText, 10);

                    // # Deactivate user and reload page and then wait 2 seconds
                    cy.externalActivateUser(testUser.id, false);
                    cy.reload();
                    cy.wait(TIMEOUTS.TWO_SEC);

                    // # Get the numbers required again
                    cy.findByTestId('totalActiveUsers').invoke('text').then((totalActiveFinalText) => {
                        const totalActiveUsersFinal = parseInt(totalActiveFinalText, 10);

                        cy.findByTestId('dailyActiveUsers').invoke('text').then((dailyActiveFinalText) => {
                            const dailyActiveUsersFinal = parseInt(dailyActiveFinalText, 10);

                            cy.findByTestId('monthlyActiveUsers').invoke('text').then((monthlyActiveFinalText) => {
                                const monthlyActiveUsersFinal = parseInt(monthlyActiveFinalText, 10);

                                // * Assert that the final number is the initial number minus one
                                expect(totalActiveUsersFinal).equal(totalActiveUsersInitial - 1);
                                expect(dailyActiveUsersFinal).equal(dailyActiveUsersInitial - 1);
                                expect(monthlyActiveUsersFinal).equal(monthlyActiveUsersInitial - 1);
                            });
                        });
                    });
                });
            });
        });
    });
});

// # Goes to the System Scheme page as System Admin
const goToAdminConsole = () => {
    cy.apiAdminLogin();
    cy.visit('/admin_console');
};
