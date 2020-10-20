// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// *****************************************************************************
// Elasticsearch
// https://api.mattermost.com/#tag/elasticsearch
// *****************************************************************************

Cypress.Commands.add('apiElasticsearchTest', (config) => {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: 'api/v4/elasticsearch/test',
        method: 'POST',
        body: config,
    }).then((response) => {
        expect(response.status).to.equal(200);
        console.log('apiElasticsearchTest', response.body)
        return cy.wrap(response.body);
    });
});
