// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {enableVisualTest, enableApplitools} = Cypress.env();
console.log('enableVisualTest', typeof enableVisualTest, enableVisualTest);
console.log('enableApplitools', typeof enableApplitools, enableApplitools);
const isEnabled = enableVisualTest && enableApplitools;

if (isEnabled) {
    console.log('isEnabled:', isEnabled, process.env.APPLITOOLS_API_KEY);
    // Only add Applitools commands if all are set for visual testing
    require('@applitools/eyes-cypress/commands'); // eslint-disable-line global-require
}

Cypress.Commands.add('visualEyesOpen', (options) => {
    console.log('visualEyesOpen isEnabled:', isEnabled);
    if (isEnabled) {
        cy.eyesOpen(options);
    }
});

Cypress.Commands.add('visualEyesClose', () => {
    if (isEnabled) {
        cy.eyesClose();
    }
});

Cypress.Commands.add('visualSaveSnapshot', (options) => {
    if (isEnabled) {
        cy.eyesCheckWindow(options);
    }
});
