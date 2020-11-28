// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import merge from 'deepmerge';

import {Constants} from '../../utils';

import partialDefaultConfig from '../../fixtures/partial_default_config.json';
import cloudDefaultConfig from '../../fixtures/cloud_default_config.json';

// *****************************************************************************
// System
// https://api.mattermost.com/#tag/system
// *****************************************************************************

Cypress.Commands.add('apiGetClientLicense', () => {
    return cy.request('/api/v4/license/client?format=old').then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap({license: response.body});
    });
});

Cypress.Commands.add('apiRequireLicenseForFeature', (key = '') => {
    Cypress.log({name: 'EE License', message: `Checking if server has license for feature: __${key}__.`});

    return uploadLicenseIfNotExist().then(({license}) => {
        const hasLicenseMessage = `Server ${license.IsLicensed === 'true' ? 'has' : 'has no'} EE license.`;
        expect(license.IsLicensed, hasLicenseMessage).to.equal('true');

        let hasLicenseKey = false;
        for (const [k, v] of Object.entries(license)) {
            if (k === key && v === 'true') {
                hasLicenseKey = true;
                break;
            }
        }

        const hasLicenseKeyMessage = `Server ${hasLicenseKey ? 'has' : 'has no'} EE license for feature: __${key}__`;
        expect(hasLicenseKey, hasLicenseKeyMessage).to.equal(true);

        return cy.wrap({license});
    });
});

Cypress.Commands.add('apiRequireLicense', () => {
    Cypress.log({name: 'EE License', message: 'Checking if server has license.'});

    return uploadLicenseIfNotExist().then(({license}) => {
        const hasLicenseMessage = `Server ${license.IsLicensed === 'true' ? 'has' : 'has no'} EE license.`;
        expect(license.IsLicensed, hasLicenseMessage).to.equal('true');

        return cy.wrap({license});
    });
});

Cypress.Commands.add('apiUploadLicense', (filePath) => {
    cy.apiUploadFile('license', filePath, {url: '/api/v4/license', method: 'POST', successStatus: 200});
});

Cypress.Commands.add('apiInstallTrialLicense', () => {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/trial-license',
        method: 'POST',
        body: {
            trialreceive_emails_accepted: true,
            terms_accepted: true,
            users: Cypress.env('numberOfTrialUsers'),
        },
    }).then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap(response.body);
    });
});

Cypress.Commands.add('apiDeleteLicense', () => {
    return cy.request({
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        url: '/api/v4/license',
        method: 'DELETE',
    }).then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap({response});
    });
});

const getDefaultConfig = () => {
    const cypressEnv = Cypress.env();

    const fromCypressEnv = {
        LdapSettings: {
            LdapServer: cypressEnv.ldapServer,
            LdapPort: cypressEnv.ldapPort,
        },
        ServiceSettings: {
            AllowedUntrustedInternalConnections: `localhost,${cypressEnv.ciBaseUrl}`,
            SiteURL: Cypress.config('baseUrl'),
        },
    };

    const isCloud = cypressEnv.serverEdition === Constants.ServerEdition.CLOUD;
    const defaultConfig = isCloud ? cloudDefaultConfig : partialDefaultConfig;

    return merge(defaultConfig, fromCypressEnv);
};

const expectConfigToBeUpdatable = (currentConfig, newConfig) => {
    function errorMessage(name) {
        return `${name} is restricted or not available to update. You may check user/sysadmin access, license requirement, server version or edition (on-prem/cloud) compatibility.`;
    }

    Object.entries(newConfig).forEach(([newMainKey, newSubSetting]) => {
        const setting = currentConfig[newMainKey];

        if (setting) {
            Object.keys(newSubSetting).forEach((newSubKey) => {
                
                const isAvailable = setting.hasOwnProperty(newSubKey);
                const name = `${newMainKey}.${newSubKey}`;
                expect(isAvailable, isAvailable ? `${name} setting can be updated.` : errorMessage(name)).to.equal(true);

                // if (!isAvailable) {
                //     console.log('not available', name)
                // }
            });
        } else {
            expect(Boolean(setting), Boolean(setting) ? `${newMainKey} setting can be updated.` : errorMessage(name)).to.equal(true);

            // if (!Boolean(setting)) {
            //     console.log('not available', newMainKey)
            // }
        }
    });
}

Cypress.Commands.add('apiUpdateConfig', (newConfig = {}) => {
    // # Get current settings
    return cy.request('/api/v4/config').then((response) => {
        const currentConfig = response.body;

        // * Check if config can be updated
        expectConfigToBeUpdatable(currentConfig, newConfig);

        const config = merge.all([currentConfig, getDefaultConfig(), newConfig]);

        // # Set the modified config
        return cy.request({
            url: '/api/v4/config',
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'PUT',
            body: config,
        }).then((updateResponse) => {
            expect(updateResponse.status).to.equal(200);
            return cy.apiGetConfig();
        });
    });
});

Cypress.Commands.add('apiReloadConfig', () => {
    // # Reload the config
    return cy.request({
        url: '/api/v4/config/reload',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'POST',
    }).then((reloadResponse) => {
        expect(reloadResponse.status).to.equal(200);
        return cy.apiGetConfig();
    });
});

Cypress.Commands.add('apiGetConfig', () => {
    // # Get current settings
    return cy.request('/api/v4/config').then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap({config: response.body});
    });
});

Cypress.Commands.add('apiGetAnalytics', () => {
    cy.apiAdminLogin();

    return cy.request('/api/v4/analytics/old').then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap({analytics: response.body});
    });
});

Cypress.Commands.add('apiInvalidateCache', () => {
    return cy.request({
        url: '/api/v4/caches/invalidate',
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        method: 'POST',
    }).then((response) => {
        expect(response.status).to.equal(200);
        return cy.wrap(response);
    });
});

Cypress.Commands.add('isCloudEdition', () => {
    const isCloudServer = Cypress.env('serverEdition') === Constants.ServerEdition.CLOUD;

    return cy.apiGetClientLicense().then(({license}) => {
        let withCloudLicense = false;

        if (license.IsLicensed === 'true') {
            for (const [k, v] of Object.entries(license)) {
                if (k === 'Cloud' && v === 'true') {
                    withCloudLicense = true;
                }
            }
        }

        return cy.wrap(isCloudServer || withCloudLicense);
    });
});

Cypress.Commands.add('shouldNotRunOnCloudEdition', () => {
    cy.isCloudEdition().then((data) => {
        expect(data, data ? 'Should not run on Cloud server' : '').to.equal(false);
    });
});

Cypress.Commands.add('isTeamEdition', () => {
    const isTeamServer = Cypress.env('serverEdition') === Constants.ServerEdition.TEAM;

    return cy.apiGetClientLicense().then(({license}) => {
        return cy.wrap(isTeamServer || license.IsLicensed !== 'true');
    });
});

Cypress.Commands.add('shouldRunOnTeamEdition', () => {
    cy.isTeamEdition().then((data) => {
        expect(data, !data ? 'Should run on Team edition only' : '').to.equal(true);
    });
});

Cypress.Commands.add('isElasticsearchEnabled', () => {
    return cy.apiGetConfig().then(({config}) => {
        let isEnabled = false;

        if (config.ElasticsearchSettings) {
            const {EnableAutocomplete, EnableIndexing, EnableSearching} = config.ElasticsearchSettings;

            isEnabled = EnableAutocomplete && EnableIndexing && EnableSearching;
        }

        return cy.wrap(isEnabled);
    });
});

Cypress.Commands.add('shouldHaveElasticsearchDisabled', () => {
    cy.isElasticsearchEnabled().then((data) => {
        expect(data, data ? 'Should have Elasticsearch disabled' : '').to.equal(false);
    });
});

Cypress.Commands.add('shouldHavePluginUploadEnabled', () => {
    return cy.apiGetConfig().then(({config}) => {
        let isUploadEnabled = config.PluginSettings.EnableUploads;

        expect(isUploadEnabled, !isUploadEnabled ? 'Should have Plugin upload enabled' : '').to.equal(true);
    });
});

/**
 * Upload a license if it does not exist.
 */
function uploadLicenseIfNotExist() {
    return cy.apiGetClientLicense().then(({license}) => {
        if (license.IsLicensed === 'true') {
            return cy.wrap({license});
        }

        const filename = 'users.txt';

        return cy.task('fileExist', filename).then((exist) => {
            if (!exist) {
                return cy.wrap({license});
            }

            return cy.apiUploadLicense(filename).then(() => {
                return cy.apiGetClientLicense();
            });
        });
    });
}
