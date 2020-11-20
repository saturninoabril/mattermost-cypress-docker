// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @bot_accounts

import * as TIMEOUTS from '../../fixtures/timeouts';
import {getRandomId} from '../../utils';

describe('Managing bot accounts', () => {
    let newTeam;
    let testBot;

    beforeEach(() => {
        cy.apiAdminLogin();

        // # Set ServiceSettings to expected values
        const newSettings = {
            ServiceSettings: {
                EnableBotAccountCreation: true,
                DisableBotsWhenOwnerIsDeactivated: true,
            },
            PluginSettings: {
                Enable: true,
                RequirePluginSignature: false,
            },
        };
        cy.apiUpdateConfig(newSettings);

        // # Create a test bot
        cy.apiCreateBot({prefix: 'test-bot'}).then(({bot}) => {
            testBot = bot;
        });

        // # Create and visit new channel
        cy.apiInitSetup().then(({team}) => {
            newTeam = team;
        });
    });

    it('MM-T1851 No option to create BOT accounts when Enable Bot Account Creation is set to False.', () => {
        // # Visit bot config
        cy.visit('/admin_console/integrations/bot_accounts');

        // # Click 'false' to disable
        cy.findByTestId('ServiceSettings.EnableBotAccountCreationfalse', {timeout: TIMEOUTS.ONE_MIN}).click();

        // # Save
        cy.findByTestId('saveSetting').should('be.enabled').click();

        // # Visit the integrations
        cy.visit(`/${newTeam.name}/integrations/bots`);

        // * Assert that adding bots is not possible
        cy.get('#addBotAccount', {timeout: TIMEOUTS.ONE_MIN}).should('not.be.visible');
    });

    it('MM-T1852 Bot creation via API is not permitted when Enable Bot Account Creation is set to False', () => {
        // # Visit bot config
        cy.visit('/admin_console/integrations/bot_accounts');

        // # Click 'false' to disable
        cy.findByTestId('ServiceSettings.EnableBotAccountCreationfalse', {timeout: TIMEOUTS.ONE_MIN}).click();

        // # Save
        cy.findByTestId('saveSetting').should('be.enabled').click().wait(TIMEOUTS.HALF_SEC);

        // * Validate that creating bot fails

        cy.request({
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            url: '/api/v4/bots',
            method: 'POST',
            failOnStatusCode: false,
            body: {
                username: `bot-${getRandomId()}`,
                display_name: 'test bot',
                description: 'test bot',
            },
        }).then((response) => {
            console.log('response', response)
            expect(response.status).to.equal(403);
            expect(response.body.message).to.equal('Bot creation has been disabled.');
            return cy.wrap(response);
        });
    });

    it('MM-T1853 Bots managed plugins can be created when Enable Bot Account Creation is set to false', () => {
        // # Visit bot config
        cy.visit('/admin_console/integrations/bot_accounts');

        // # Click 'false' to disable
        cy.findByTestId('ServiceSettings.EnableBotAccountCreationfalse', {timeout: TIMEOUTS.ONE_MIN}).click();

        // # Save
        cy.findByTestId('saveSetting').should('be.enabled').click();

        // # Try to remove the plugin, just in case
        cy.apiRemovePluginById('com.github.matterpoll.matterpoll');

        // # Upload and enable "matterpoll" plugin
        cy.apiUploadPlugin('com.github.matterpoll.matterpoll.tar.gz').then(() => {
            cy.apiEnablePluginById('com.github.matterpoll.matterpoll');
        });

        // # Visit the integrations
        cy.visit(`/${newTeam.name}/integrations/bots`);

        // * Validate that plugin installed ok
        cy.contains('Matterpoll (@matterpoll)', {timeout: TIMEOUTS.ONE_MIN});
    });

    it('MM-T1854 Bots can be create when Enable Bot Account Creation is set to True.', () => {
        // # Visit bot config
        cy.visit('/admin_console/integrations/bot_accounts');

        // * Check that creation is enabled
        cy.findByTestId('ServiceSettings.EnableBotAccountCreationtrue', {timeout: TIMEOUTS.ONE_MIN}).should('be.checked');

        // # Visit the integrations
        cy.visit(`/${newTeam.name}/integrations/bots`);

        // * Assert that adding bots is possible
        cy.get('#addBotAccount', {timeout: TIMEOUTS.ONE_MIN}).should('be.visible');
    });

    it('MM-T1856 Disable Bot', () => {
        // # Visit the integrations
        cy.visit(`/${newTeam.name}/integrations/bots`);

        // # Filter bot
        cy.get('#searchInput', {timeout: TIMEOUTS.ONE_MIN}).type(testBot.username);

        // * Check that the previously created bot is listed
        cy.findByText(testBot.fullDisplayName, {timeout: TIMEOUTS.ONE_MIN}).scrollIntoView().then((el) => {
            // # Click the disable button
            cy.wrap(el[0].parentElement.parentElement).find('button:nth-child(3)').should('be.visible').click();
        });

        // * Check that the bot is in the 'disabled' section
        cy.get('.bot-list__disabled').scrollIntoView().findByText(testBot.fullDisplayName).should('be.visible');
    });

    it('MM-T1857 Enable Bot', () => {
        // # Visit the integrations
        cy.visit(`/${newTeam.name}/integrations/bots`);

        // * Check that the previously created bot is listed
        cy.findByText(testBot.fullDisplayName, {timeout: TIMEOUTS.ONE_MIN}).scrollIntoView().then((el) => {
            // # Click the disable button
            cy.wrap(el[0].parentElement.parentElement).find('button:nth-child(3)').should('be.visible').click();
        });

        // # Filter bot
        cy.get('#searchInput', {timeout: TIMEOUTS.ONE_MIN}).type(testBot.username);

        // # Re-enable the bot
        cy.get('.bot-list__disabled').scrollIntoView().findByText(testBot.fullDisplayName, {timeout: TIMEOUTS.ONE_MIN}).scrollIntoView().then((el) => {
            // # Click the enable button
            cy.wrap(el[0].parentElement.parentElement).find('button:nth-child(1)').should('be.visible').click();
        });

        // * Check that the bot is in the 'enabled' section
        cy.findByText(testBot.fullDisplayName).scrollIntoView().should('be.visible');
        cy.get('.bot-list__disabled').should('not.be.visible');
    });

    it('MM-T1858 Search active and disabled Bot accounts', () => {
        cy.apiCreateBot({prefix: 'hello-bot'}).then(({bot}) => {
            // # Visit the integrations
            cy.visit(`/${newTeam.name}/integrations/bots`);

            // * Check that the previously created bot is listed
            cy.findByText(bot.fullDisplayName, {timeout: TIMEOUTS.ONE_MIN}).then((el) => {
                // # Make sure it's on the screen
                cy.wrap(el[0].parentElement.parentElement).scrollIntoView();

                // # Click the disable button
                cy.wrap(el[0].parentElement.parentElement).find('button:nth-child(3)').should('be.visible').click();
            });

            // * Validate that disabled section appears
            cy.get('.bot-list__disabled').scrollIntoView().should('be.visible');

            // # Search for the other bot
            cy.get('#searchInput').type(testBot.username);

            // * Validate that disabled section disappears
            cy.get('.bot-list__disabled').should('not.be.visible');
        });
    });

    it('MM-T1859 Bot is kept active when owner is disabled', () => {
        // # Visit bot config
        cy.visit('/admin_console/integrations/bot_accounts');

        // # Click 'false' to disable
        cy.findByTestId('ServiceSettings.DisableBotsWhenOwnerIsDeactivatedfalse', {timeout: TIMEOUTS.ONE_MIN}).click();

        // # Save
        cy.findByTestId('saveSetting').should('be.enabled').click();

        // # Create another admin account
        cy.apiCreateCustomAdmin().then(({sysadmin}) => {
            // # Login as the new admin
            cy.apiLogin(sysadmin);

            // # Create a new bot as the new admin
            cy.apiCreateBot({prefix: 'stay-enabled-bot'}).then(({bot}) => {
                // # Login again as main admin
                cy.apiAdminLogin();

                // # Deactivate the newly created admin
                cy.apiDeactivateUser(sysadmin.id);

                // # Get bot list
                cy.visit(`/${newTeam.name}/integrations/bots`);

                // # Search for the other bot
                cy.get('#searchInput', {timeout: TIMEOUTS.ONE_MIN}).type(bot.display_name);

                // * Validate that the plugin is still active, even though its owner is disabled
                cy.get('.bot-list__disabled').should('not.be.visible');
                cy.findByText(bot.fullDisplayName).scrollIntoView().should('be.visible');

                cy.visit(`/${newTeam.name}/messages/@sysadmin`);

                // # Get last post message text
                cy.getLastPostId().then((postId) => {
                    cy.get(`#postMessageText_${postId}`).as('postMessageText');
                });

                // * Verify entire message
                cy.get('@postMessageText').
                    should('be.visible').
                    and('contain.text', `${sysadmin.username} was deactivated. They managed the following bot accounts`).
                    and('contain.text', bot.username);
            });
        });
    });

    it('MM-T1860 Bot is disabled when owner is deactivated', () => {
        // # Create another admin account
        cy.apiCreateCustomAdmin().then(({sysadmin}) => {
            // # Login as the new admin
            cy.apiLogin(sysadmin);

            // # Create a new bot as the new admin
            cy.apiCreateBot({prefix: 'stay-enabled-bot'}).then(({bot}) => {
                // # Login again as main admin
                cy.apiAdminLogin();

                // # Deactivate the newly created admin
                cy.apiDeactivateUser(sysadmin.id);

                // # Get bot list
                cy.visit(`/${newTeam.name}/integrations/bots`);

                // # Search for the other bot
                cy.get('#searchInput', {timeout: TIMEOUTS.ONE_MIN}).type(bot.display_name);

                // * Validate that the plugin is disabled since it's owner is deactivate
                cy.get('.bot-list__disabled').scrollIntoView().findByText(bot.fullDisplayName).scrollIntoView().should('be.visible');

                cy.visit(`/${newTeam.name}/messages/@sysadmin`);

                // # Get last post message text
                cy.getLastPostId().then((postId) => {
                    cy.get(`#postMessageText_${postId}`).as('postMessageText');
                });

                // * Verify entire message
                cy.get('@postMessageText').
                    should('be.visible').
                    and('contain.text', `${sysadmin.username} was deactivated. They managed the following bot accounts`).
                    and('contain.text', bot.username);
            });
        });
    });
});
