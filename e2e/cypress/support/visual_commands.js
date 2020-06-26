// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const {enableVisualTest, enableApplitools, enablePercy} = Cypress.env();
const isApplitoolsEnabled = enableVisualTest && enableApplitools;
const isPercyEnabled = enableVisualTest && enablePercy;

if (isApplitoolsEnabled) {
    // Only add Applitools commands if all are set for visual testing
    require('@applitools/eyes-cypress/commands'); // eslint-disable-line global-require
}

Cypress.Commands.add('visualEyesOpen', (options) => {
    // if (isApplitoolsEnabled) {
    //     cy.eyesOpen(options);
    // }
});

Cypress.Commands.add('visualEyesClose', () => {
    // if (isApplitoolsEnabled) {
    //     cy.eyesClose();
    // }
});

Cypress.Commands.add('visualSaveSnapshot', (options) => {
    if (isPercyEnabled) {
        cy.percySnapshot();
    }
});
