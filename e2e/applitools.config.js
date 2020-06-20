// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// See https://github.com/applitools/eyes.sdk.javascript1/tree/master/packages/eyes-cypress#advanced-configuration

module.exports = {
    appName: 'Mattermost Webapp UI',
    accessibilityValidation: {level: 'AA', guidelinesVersion: 'WCAG_2_0'},
    browser: [
        {width: 1024, height: 768, name: 'chrome'},
        // {width: 1024, height: 768, name: 'chrome-two-versions-back'},
        // {width: 800, height: 600, name: 'firefox'},
        // {width: 1024, height: 768, name: 'safari'},
        // {deviceName: 'iPhone X', screenOrientation: 'portrait', name: 'chrome'},
        // {deviceName: 'iPad Pro', screenOrientation: 'landscape', name: 'chrome'},
    ],
    concurrency: 1,
    compareWithParentBranch: true,
    matchLevel: 'Strict',
    showLogs: true,
};