
// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as TIMEOUTS from '../../fixtures/timeouts';

export async function createArchivedChannel(channelOptions, messages, memberUsernames) {
    const channelName = await new Promise((resolve) => {
        cy.uiCreateChannel(channelOptions).then((newChannel) => {
            if (memberUsernames) {
                cy.uiAddUsersToCurrentChannel(memberUsernames);
            }
            if (messages) {
                let messageList = messages;
                if (!Array.isArray(messages)) {
                    messageList = [messages];
                }
                messageList.forEach((message) => {
                    cy.postMessage(message);
                });
            }
            cy.uiArchiveChannel();

            // # Wait for sometime and verify that the archived message is shown
            cy.wait(TIMEOUTS.FIVE_SEC);
            cy.get('#channelArchivedMessage', {timeout: TIMEOUTS.ONE_MIN}).should('be.visible');

            resolve(newChannel.name);
        });
    });

    return cy.wrap({channelName});
}
