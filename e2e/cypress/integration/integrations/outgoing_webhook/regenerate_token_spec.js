// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @integrations

import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('Integrations', () => {
    let testTeam;
    let testChannel;

    before(() => {
        const callbackUrl = `${Cypress.env().webhookBaseUrl}/post_outgoing_webhook`;

        cy.requireWebhookServer();

        // # Create test team, channel, and webhook
        cy.apiInitSetup().then(({team, channel}) => {
            testTeam = team.name;
            testChannel = channel.name;

            const newOutgoingHook = {
                team_id: team.id,
                display_name: 'New Outgoing Webhook',
                trigger_words: ['testing'],
                callback_urls: [callbackUrl],
            };

            cy.apiCreateWebhook(newOutgoingHook, false);
            cy.visit(`/${testTeam}/integrations/outgoing_webhooks`);
        });
    });

    it('MM-T612 Regenerate token', () => {
        // # Grab the generated token
        let generatedToken;
        cy.get('.item-details__token').then((number1) => {
            generatedToken = number1.text().split(' ').pop();
            console.log('generatedToken', generatedToken);
            cy.visit(`/${testTeam}/channels/${testChannel}`).wait(TIMEOUTS.THREE_SEC);

            // * Post message and assert token is present in test message
            cy.postMessage('testing');
            cy.uiWaitUntilMessagePostedIncludes(generatedToken);
        });

        // # Regenerate the token
        cy.visit(`/${testTeam}/integrations/outgoing_webhooks`);
        cy.findAllByText('Regenerate Token').click().wait(TIMEOUTS.THREE_SEC);

        // # Grab the regenerated token
        let regeneratedToken;
        cy.get('.item-details__token').then((number2) => {
            regeneratedToken = number2.text().split(' ').pop();
            console.log('regeneratedToken', regeneratedToken);
            // * Post a message and confirm regenerated token appears only
            cy.visit(`/${testTeam}/channels/${testChannel}`).wait(TIMEOUTS.THREE_SEC);
            cy.postMessage('testing');
            cy.uiWaitUntilMessagePostedIncludes(regeneratedToken).then(() => {
                cy.getLastPostId().then((lastPostId) => {
                    cy.get(`#${lastPostId}_message`).should('not.contain', generatedToken);
                });
            });
        });
    });
});
