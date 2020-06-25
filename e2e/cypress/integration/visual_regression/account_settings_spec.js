// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @account_setting @visual_regression @verify

describe('Account Settings', () => {
    let testUser;

    before(() => {
        // # Login as new user and visit town-square
        cy.apiInitSetup({loginAfter: true}).then(({team, user}) => {
            testUser = user;
            cy.visit(`/${team.name}/channels/town-square`);
        });
    });

    describe('General Settings', () => {
        beforeEach(() => {
            cy.visualEyesOpen({
                browser: [
                    {width: 1024, height: 800, name: 'chrome'},
                ],
            });

            // # Go to Account Settings
            cy.toAccountSettingsModal();
        });

        afterEach(() => {
            cy.visualEyesClose();
        });

        it('General Settings Section', () => {
            // # Check that the General tab is loaded and click it
            cy.get('#generalButton').should('be.visible').click();

            cy.wait(5000);

            // # Save snapshot for visual testing
            cy.visualSaveSnapshot({
                tag: 'Account Settings - General section',
                target: 'window',
                fully: true,
                floating: [
                    {selector: '.modal-content', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
                ],
            });

            cy.get('#accountSettingsHeader > .close').should('be.visible').click();
        });

        it('Account Settings - General - Nickname', () => {
            // # Click "Edit" to the right of "Nickname"
            cy.get('#nicknameEdit').should('be.visible').click();

            // # Save snapshot for visual testing
            cy.visualSaveSnapshot({
                tag: 'Account Settings - General - Nickname',
                target: 'window',
                fully: true,
                floating: [
                    {selector: '.modal-content', maxUpOffset: 20, maxDownOffset: 20, maxLeftOffset: 20, maxRightOffset: 20},
                ],
            });
        });
    });
});
