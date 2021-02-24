// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @enterprise @system_console @not_cloud

import accessRules from '../../../fixtures/system-roles-console-access';
import disabledTests from '../../../fixtures/console-example-inputs';
import * as TIMEOUTS from '../../../fixtures/timeouts';

describe('Limited console access', () => {
    const roleNames = ['system_manager', 'system_user_manager', 'system_read_only_admin'];
    const testUsers = {};

    const ACCESS_NONE = 'none';
    const ACCESS_READ_ONLY = 'read';
    const ACCESS_READ_WRITE = 'read+write';

    before(() => {
        cy.shouldNotRunOnCloudEdition();
        cy.apiRequireLicense();

        Cypress._.forEach(roleNames, (roleName) => {
            cy.apiCreateUser().then(({user}) => {
                testUsers[roleName] = user;
            });
        });
    });

    it('MM-T3386 - Verify the Admin Role - System Manager', () => {
        const role = 'system_manager';

        // # Make the user a System  Manager
        makeUserASystemRole(role);

        // * Login as the new user and verify the role permissions (ensure they really are a system manager)
        forEachConsoleSection(role);
    });

    function makeUserASystemRole (role) {
        // # Login as each new role.
        cy.apiAdminLogin();

        // # Go the system console.
        cy.visit('/admin_console/user_management/system_roles');
        cy.contains('System Roles', {timeout: TIMEOUTS.ONE_MIN}).should('exist').and('be.visible');

        // # Click on edit for the role
        cy.findByTestId(`${role}_edit`).click();

        // # Click Add People button
        cy.findByRole('button', {name: 'Add People'}).click().wait(TIMEOUTS.HALF_SEC);

        // # Type in user name
        cy.findByText('Search for people').type(`${testUsers[role].email}`);

        // # Find the user and click on him
        cy.get('#multiSelectList').should('be.visible').children().first().click({force: true});

        // # Click add button
        cy.findByRole('button', {name: 'Add'}).click().wait(TIMEOUTS.HALF_SEC);

        // # Click save button
        cy.findByRole('button', {name: 'Save'}).click().wait(TIMEOUTS.HALF_SEC);
    }

    function noAccessFunc(section) {
        // * If it's a no-access permission, we just need to check that the section doesn't exist in the side bar
        cy.findByTestId(section).should('not.exist');
    }

    function readOnlyFunc (section) {
        // * If it's a read only permission, we need to make sure that the section does exist in the sidebar however the inputs in that section is disabled (read only)
        cy.findByTestId(section).should('exist');
        checkInputsShould('be.disabled', section);
    }

    function readWriteFunc (section) {
        // * If we have read + write (can edit) permissions, we need to make the section exists and also that the inputs are all enabled
        cy.findByTestId(section).should('exist');
        checkInputsShould('be.enabled', section);
    }

    function checkInputsShould (shouldString, section) {
        const {disabledInputs} = disabledTests.find((item) => item.section === section);
        Cypress._.forEach(disabledInputs, ({path, selector}) => {
            if (path.length && selector.length) {
                cy.visit(path, {timeout: TIMEOUTS.HALF_MIN});
                cy.findByTestId(selector, {timeout: TIMEOUTS.ONE_MIN}).should(shouldString);
            }
        });
    }

    function forEachConsoleSection(roleName) {
        const user = testUsers[roleName];

        // # Login as each new role.
        cy.apiLogin(user);

        // # Go the system console.
        cy.visit('/admin_console');
        cy.get('.admin-sidebar', {timeout: TIMEOUTS.ONE_MIN}).should('be.visible');

        accessRules.forEach((rule) => {
            const {section} = rule;
            const access = rule[roleName];
            switch (access) {
            case ACCESS_NONE:
                noAccessFunc(section);
                break;
            case ACCESS_READ_ONLY:
                readOnlyFunc(section);
                break;
            case ACCESS_READ_WRITE:
                readWriteFunc(section);
                break;
            }
        });
    }
});
