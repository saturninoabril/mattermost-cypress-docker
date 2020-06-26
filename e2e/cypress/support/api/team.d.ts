// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/// <reference types="cypress" />

// ***************************************************************
// Each command should be properly documented using JSDoc.
// See https://jsdoc.app/index.html for reference.
// Basic requirements for documentation are the following:
// - Meaningful description
// - Specific link to https://api.mattermost.com
// - Each parameter with `@params`
// - Return value with `@returns`
// - Example usage with `@example`
// Custom command should follow naming convention of having `api` prefix, e.g. `apiLogin`.
// ***************************************************************

declare namespace Cypress {
    interface Chainable<Subject = any> {

        /**
         * Creates a team directly via API.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams/post
         * @param {String} name - Unique handler for a team, will be present in the team URL
         * @param {String} displayName - Non-unique UI name for the team
         * @param {String} type - 'O' for open (default), 'I' for invite only
         * @param {Boolean} unique - if true (default), it will create with unique/random team name.
         * @returns {Team} `out.team` as `Team`
         *
         * @example
         *   cy.apiCreateTeam('test-team', 'Test Team').then(({team}) => {
         *       // do something with team
         *   });
         */
        apiCreateTeam(name: string, displayName: string, type?: string, unique?: boolean): Chainable<Team>;

        /**
         * Delete a team.
         * Soft deletes a team, by marking the team as deleted in the database.
         * Optionally use the permanent query parameter to hard delete the team.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}/delete
         * @param {String} teamId - The team ID to be deleted
         * @param {Boolean} permanent - false (default) as soft delete and true as permanent delete
         * @returns {Object} `out.data` as response status
         *
         * @example
         *   cy.apiDeleteTeam('test-id');
         */
        apiDeleteTeam(teamId: string, permanent?: boolean): Chainable<Record<string, any>>;

        /**
         * Patch a team.
         * Partially update a team by providing only the fields you want to update.
         * Omitted fields will not be updated.
         * The fields that can be updated are defined in the request body, all other provided fields will be ignored.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams/post
         * @param {String} teamId - The team ID to be patched
         * @param {String} patch.display_name - Display name
         * @param {String} patch.description - Description
         * @param {String} patch.description - Description
         * @param {String} patch.company_name - Company name
         * @param {String} patch.allowed_domains - Allowed domains
         * @param {Boolean} patch.allow_open_invite - Allow open invite
         * @param {Boolean} patch.group_constrained - Group constrained
         * @returns {Team} `out.team` as `Team`
         *
         * @example
         *   cy.apiPatchTeam('test-team', {display_name: 'New Team', group_constrained: true}).then(({team}) => {
         *       // do something with team
         *   });
         */
        apiPatchTeam(teamId: string, patch: Team): Chainable<Team>;

        /**
         * Get a team based on provided name string.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams~1name~1{name}/get
         * @param {String} name - Name of a team
         * @returns {Team} `out.team` as `Team`
         *
         * @example
         *   cy.apiGetTeamByName('team-name').then(({team}) => {
         *       // do something with team
         *   });
         */
        apiGetTeamByName(name: string): Chainable<Team>;

        /**
         * Get teams.
         * For regular users only returns open teams.
         * Users with the "manage_system" permission will return teams regardless of type.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams~1name~1{name}/get
         * @param {String} queryParams.page - Page to select, 0 (default)
         * @param {String} queryParams.perPage - The number of teams per page, 60 (default)
         * @param {Boolean} queryParams.includeTotalCount - false (default) or true to include total count
         * @returns {Team[]} `out.teams` as `Team[]`
         * @returns {number} `out.totalCount` as `number`
         *
         * @example
         *   cy.apiGetAllTeams().then(({teams}) => {
         *       // do something with teams
         *   });
         */
        apiGetAllTeams(queryParams: Record<string, any>): Chainable<Team[]>;

        /**
         * Get team members.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1members/get
         * @param {string} teamId - team ID
         * @returns {TeamMembership[]} `out.members` as `TeamMembership[]`
         *
         * @example
         *   cy.apiGetTeamMembers(teamId).then(({members}) => {
         *       // do something with members
         *   });
         */
        apiGetTeamMembers(teamId: string): Chainable<TeamMembership[]>;

        /**
         * Update the scheme-derived roles of a team member.
         * Requires sysadmin session to initiate this command.
         * See https://api.mattermost.com/#tag/teams/paths/~1teams~1{team_id}~1members~1{user_id}~1schemeRoles/put
         * @param {string} teamId - team ID
         * @param {string} userId - user ID
         * @param {Object} schemeRoles.scheme_admin - false (default) or true to change into team admin
         * @param {Object} schemeRoles.scheme_user - true (default) or false to change not to be a team user
         * @returns {Object} `out.data` as response status
         *
         * @example
         *   cy.apiUpdateTeamMemberSchemeRole(teamId, userId, {scheme_admin: false, scheme_user: true});
         */
        apiUpdateTeamMemberSchemeRole(teamId: string, userId: string, schemeRoles: Record<string, any>): Chainable<Record<string, any>>;
    }
}
