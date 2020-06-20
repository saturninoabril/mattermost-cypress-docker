// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import * as TIMEOUTS from '../fixtures/timeouts';

const {enableVisualTest, enableApplitools} = Cypress.env();
console.log('enableVisualTest', enableVisualTest);
console.log('enableApplitools', enableApplitools);
if (enableVisualTest && enableApplitools) {
    // Only add Applitools commands if all are set for visual testing
    require('@applitools/eyes-cypress/commands'); // eslint-disable-line global-require
}

/**
 * A wrapper that creates an Applitools test. This will start a session with the Applitools server.
 * https://github.com/applitools/eyes.sdk.javascript1/tree/master/packages/eyes-cypress#open
 */
Cypress.Commands.add('visualEyesOpen', (options) => {
    if (enableVisualTest && enableApplitools) {
        cy.eyesOpen(options);
    }
});

/**
 * A wrapper that closes the Applitools test and check that all screenshots are valid.
 * https://github.com/applitools/eyes.sdk.javascript1/tree/master/packages/eyes-cypress#close
 */
Cypress.Commands.add('visualEyesClose', () => {
    if (enableVisualTest && enableApplitools) {
        cy.eyesClose();
    }
});

/**
 * A wrapper that generates a screenshot of the current page and add it to the Applitools Test.
 * https://github.com/applitools/eyes.sdk.javascript1/tree/master/packages/eyes-cypress#check-window
 */
Cypress.Commands.add('visualSaveSnapshot', (config, timeout = TIMEOUTS.HALF_SEC) => {
    if (enableVisualTest && enableApplitools) {
        cy.wait(timeout);
        cy.eyesCheckWindow(config);
    }
});
