// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @interactive_dialog

/**
* Note: This test requires webhook server running. Initiate `npm run start:webhook` to start.
*/

const webhookUtils = require('../../../utils/webhook_utils');

let createdCommand;
let fullDialog;
const inputTypes = {
    realname: 'input',
    someemail: 'email',
    somenumber: 'number',
    somepassword: 'password',
};

const optionsLength = {
    someuserselector: 25, // default number of users in autocomplete
    somechannelselector: 2, // town-square and off-topic for new team
    someoptionselector: 3, // number of defined basic options
    someradiooptions: 2, // number of defined basic options
};

describe('Interactive Dialog', () => {
    let config;

    before(() => {
        cy.requireWebhookServer();

        // # Login as sysadmin and ensure that teammate name display setting is set to default 'username'
        cy.apiLogin('sysadmin');
        cy.apiSaveTeammateNameDisplayPreference('username');

        // # Get config
        cy.apiGetConfig().then((res) => {
            config = res.body;
        });

        // # Create new team and create command on it
        cy.apiCreateTeam('test-team', 'Test Team').then((teamResponse) => {
            const team = teamResponse.body;
            cy.visit(`/${team.name}`);

            const webhookBaseUrl = Cypress.env().webhookBaseUrl;

            const command = {
                auto_complete: false,
                description: 'Test for dialog',
                display_name: 'Dialog',
                icon_url: '',
                method: 'P',
                team_id: team.id,
                trigger: 'dialog' + Date.now(),
                url: `${webhookBaseUrl}/dialog_request`,
                username: '',
            };

            cy.apiCreateCommand(command).then(({data}) => {
                createdCommand = data;
                fullDialog = webhookUtils.getFullDialog(createdCommand.id, webhookBaseUrl);
            });
        });
    });

    afterEach(() => {
        // # Reload current page after each test to close any dialogs left open
        cy.reload();
    });

    it('ID15888 - Cancel button works', () => {
        // # Post a slash command
        cy.postMessage(`/${createdCommand.trigger}`);

        // * Verify that the interactive dialog modal open up
        cy.get('#interactiveDialogModal').should('be.visible');

        // # Click cancel from the modal
        cy.get('#interactiveDialogCancel').click();

        // * Verify that the interactive dialog modal is closed
        cy.get('#interactiveDialogModal').should('not.be.visible');
    });

    it('ID15888 - "X" closes the dialog', () => {
        // # Post a slash command
        cy.postMessage(`/${createdCommand.trigger}`);

        // * Verify that the interactive dialog modal open up
        cy.get('#interactiveDialogModal').should('be.visible');

        // # Click "X" button from the modal
        cy.get('.modal-header').should('be.visible').within(($elForm) => {
            cy.wrap($elForm).find('button.close').should('be.visible').click();
        });

        // * Verify that the interactive dialog modal is closed
        cy.get('#interactiveDialogModal').should('not.be.visible');
    });

    it('ID15888 - Correct error messages displayed if empty form is submitted', () => {
        // # Post a slash command
        cy.postMessage(`/${createdCommand.trigger}`);

        // * Verify that the interactive dialog modal open up
        cy.get('#interactiveDialogModal').should('be.visible');

        // # Click submit button from the modal
        cy.get('#interactiveDialogSubmit').click();

        // * Verify that the interactive dialog modal is still open
        cy.get('#interactiveDialogModal').should('be.visible');

        // * Verify that not optional element without text value shows an error and vice versa
        cy.get('.modal-body').should('be.visible').children().each(($elForm, index) => {
            const element = fullDialog.dialog.elements[index];

            if (!element.optional && !element.default) {
                cy.wrap($elForm).find('div.error-text').scrollIntoView().should('be.visible').and('have.text', 'This field is required.').and('have.css', 'color', 'rgb(253, 89, 96)');
            } else {
                cy.wrap($elForm).find('div.error-text').should('not.be.visible');
            }
        });

        closeInteractiveDialog();
    });

    it('ID15888 - Number validation', () => {
        cy.postMessage(`/${createdCommand.trigger}`);

        cy.get('#interactiveDialogModal').should('be.visible');

        // # Enter invalid and valid number
        // Verify that error is: shown for invalid number and not shown for valid number.
        [
            {valid: false, value: 'invalid-number'},
            {valid: true, value: 12},
        ].forEach((testCase) => {
            cy.get('#somenumber').scrollIntoView().clear().type(testCase.value);

            cy.get('#interactiveDialogSubmit').click();

            cy.get('.modal-body').should('be.visible').children().eq(2).within(($elForm) => {
                if (testCase.valid) {
                    cy.wrap($elForm).find('div.error-text').should('not.be.visible');
                } else {
                    cy.wrap($elForm).find('div.error-text').should('be.visible').and('have.text', 'This field is required.').and('have.css', 'color', 'rgb(253, 89, 96)');
                }
            });
        });

        closeInteractiveDialog();
    });

    it('ID21032 - Password element check', () => {
        // # Post a slash command
        cy.postMessage(`/${createdCommand.trigger}`);

        // * Verify that the interactive dialog modal open up
        cy.get('#interactiveDialogModal').should('be.visible');

        // * Verify that the password text area is visible
        cy.get('#somepassword').should('be.visible');

        // * Verify that the password is masked on enter of text
        cy.get('#somepassword').should('have.attr', 'type', 'password');

        closeInteractiveDialog();
    });
});

function closeInteractiveDialog() {
    cy.get('.modal-header').should('be.visible').within(($elForm) => {
        cy.wrap($elForm).find('button.close').should('be.visible').click();
    });
    cy.get('#interactiveDialogModal').should('not.be.visible');
}
