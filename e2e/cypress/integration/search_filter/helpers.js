// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

import * as TIMEOUTS from '../../fixtures/timeouts';

export function searchAndValidate(query, expectedResults = []) {
    cy.reload();

    // # Enter in search query, and hit enter
    cy.get('#searchBox').clear().wait(500).type(query).wait(500).type('{enter}');

    cy.get('#loadingSpinner').should('not.be.visible');
    cy.get('#search-items-container', {timeout: TIMEOUTS.HUGE}).should('be.visible');

    // * Verify the amount of results matches the amount of our expected results
    cy.findAllByTestId('search-item-container').should('have.length', expectedResults.length).then((results) => {
        if (expectedResults.length > 0) {
            // * Verify text of each result
            cy.wrap(results).each((result, index) => {
                cy.wrap(result).find('.post-message').should('have.text', expectedResults[index]);
            });
        } else {
            // * If we expect no results, verify results message
            cy.get('.no-results__title').should('be.visible').and('have.text', `No results for "${query}"`);
        }
    });

    cy.get('#searchResultsCloseButton').click();
    cy.get('.search-item__container').should('not.exist');
}

export function getMsAndQueryForDate(date) {
    return {
        ms: date,
        query: new Date(date).toISOString().split('T')[0],
    };
}
