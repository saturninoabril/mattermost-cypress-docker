// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {getRandomId} from '../../../../utils';
import * as TIMEOUTS from '../../../../fixtures/timeouts';
import {getAdminAccount} from '../../../../support/env';

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Group: @enterprise @system_console @moderation

// const checkboxesTitleToIdMap = {
//     CREATE_POSTS_GUESTS: 'create_post-guests',
//     CREATE_POSTS_MEMBERS: 'create_post-members',
//     POST_REACTIONS_GUESTS: 'create_reactions-guests',
//     POST_REACTIONS_MEMBERS: 'create_reactions-members',
//     MANAGE_MEMBERS_GUESTS: 'manage_members-guests',
//     MANAGE_MEMBERS_MEMBERS: 'manage_members-members',
//     CHANNEL_MENTIONS_MEMBERS: 'use_channel_mentions-members',
//     CHANNEL_MENTIONS_GUESTS: 'use_channel_mentions-guests',
// };

// // # Wait's until the Saving text becomes Save
// const waitUntilConfigSave = () => {
//     cy.waitUntil(() => cy.get('#saveSetting').then((el) => {
//         return el[0].innerText === 'Save';
//     }));
// };

// const checkBoxes = [
//     checkboxesTitleToIdMap.CREATE_POSTS_GUESTS,
//     checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS,
//     checkboxesTitleToIdMap.POST_REACTIONS_GUESTS,
//     checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS,
//     checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS,
//     checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS,
//     checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS,
// ];

// const demoteToChannelOrTeamMember = (userId, id, channelsOrTeams = 'channels') => {
//     cy.externalRequest({
//         user: getAdminAccount(),
//         method: 'put',
//         path: `${channelsOrTeams}/${id}/members/${userId}/schemeRoles`,
//         data: {
//             scheme_user: true,
//             scheme_admin: false,
//         },
//     });
// };

// const promoteToChannelOrTeamAdmin = (userId, id, channelsOrTeams = 'channels') => {
//     cy.externalRequest({
//         user: getAdminAccount(),
//         method: 'put',
//         path: `${channelsOrTeams}/${id}/members/${userId}/schemeRoles`,
//         data: {
//             scheme_user: true,
//             scheme_admin: true,
//         },
//     });
// };

// # Disable (uncheck) all the permissions in the channel moderation widget
const disableAllChannelModeratedPermissions = () => {
    checkBoxes.forEach((buttonId) => {
        cy.findByTestId(buttonId).then((btn) => {
            if (btn.hasClass('checked')) {
                btn.click();
            }
        });
    });
};

// # Enable (check) all the permissions in the channel moderation widget
const enableAllChannelModeratedPermissions = () => {
    checkBoxes.forEach((buttonId) => {
        cy.findByTestId(buttonId).then((btn) => {
            if (!btn.hasClass('checked')) {
                btn.click();
            }
        });
    });
};

// // # Enable (check) all the permissions in the channel moderation widget through the API
// const enableDisableAllChannelModeratedPermissionsViaAPI = (channelId, enable = true) => {
//     cy.externalRequest(
//         {
//             user: getAdminAccount(),
//             method: 'PUT',
//             path: `channels/${channelId}/moderations/patch`,
//             data:
//                 [
//                     {
//                         name: 'create_post',
//                         roles: {
//                             members: enable,
//                             guests: enable,
//                         },
//                     },
//                     {
//                         name: 'create_reactions',
//                         roles: {
//                             members: enable,
//                             guests: enable,
//                         },
//                     },
//                     {
//                         name: 'manage_members',
//                         roles: {
//                             members: enable,
//                         },
//                     },
//                     {
//                         name: 'use_channel_mentions',
//                         roles: {
//                             members: enable,
//                             guests: enable,
//                         },
//                     },
//                 ],
//         },
//     );
// };

// const deleteExistingTeamOverrideSchemes = () => {
//     cy.apiAdminLogin();
//     cy.apiGetSchemes('team').then((res) => {
//         res.body.forEach((scheme) => {
//             cy.apiDeleteScheme(scheme.id);
//         });
//     });
// };

// // # Disable a specific channel moderated permission in the channel moderation widget
// const disableChannelModeratedPermission = (permission) => {
//     cy.findByTestId(permission).then((btn) => {
//         if (btn.hasClass('checked')) {
//             btn.click();
//         }
//     });
// };

// // # Enable a specific channel moderated permission in the channel moderation widget
// const enableChannelModeratedPermission = (permission) => {
//     cy.findByTestId(permission).then((btn) => {
//         if (!btn.hasClass('checked')) {
//             btn.click();
//         }
//     });
// };

// // # This goes to the system scheme and clicks the reset permissions to default and then saves the setting
// const resetSystemSchemePermissionsToDefault = () => {
//     cy.apiAdminLogin();
//     cy.visit('/admin_console/user_management/permissions/system_scheme');
//     cy.findByTestId('resetPermissionsToDefault').click();
//     cy.get('#confirmModalButton').click();
//     saveConfigForScheme();
// };

// // # Goes to the permissions page and clicks edit or delete for a team override scheme
// const deleteOrEditTeamScheme = (schemeDisplayName, editOrDelete) => {
//     cy.apiAdminLogin();
//     cy.visit('/admin_console/user_management/permissions');
//     cy.findByTestId(`${schemeDisplayName}-${editOrDelete}`).click();
//     if (editOrDelete === 'delete') {
//         cy.get('#confirmModalButton').click();
//     }
// };

// // # Goes to the System Scheme page as System Admin
// const goToSystemScheme = () => {
//     cy.apiAdminLogin();
//     cy.visit('/admin_console/user_management/permissions/system_scheme');
// };

// // # Goes to the permissions page and creates a new team override scheme with schemeName
// const goToPermissionsAndCreateTeamOverrideScheme = (schemeName) => {
//     cy.apiAdminLogin();
//     cy.visit('/admin_console/user_management/permissions');
//     cy.findByTestId('team-override-schemes-link').click();
//     cy.get('#scheme-name').type(schemeName);
//     cy.findByTestId('add-teams').click();
//     cy.get('#selectItems').click().type('eligendi');
//     cy.get('#multiSelectList').should('be.visible').children().first().click({force: true});
//     cy.get('#saveItems').should('be.visible').click();
//     saveConfigForScheme(false);
//     cy.wait(TIMEOUTS.TINY * 2);
// };

// // # Visits the channel configuration for a channel with channelName
// const visitChannelConfigPage = (channelName) => {
//     cy.apiAdminLogin();
//     cy.visit('/admin_console/user_management/channels');
//     cy.findByTestId('search-input').type(`${channelName}{enter}`);
//     cy.findByText('Edit').click();
//     cy.wait(TIMEOUTS.TINY * 2);
// };

// // # Saves channel config and navigates back to the channel config page if specified
// const saveConfigForChannel = (channelName = false, clickConfirmationButton = false) => {
//     cy.get('#saveSetting').then((btn) => {
//         if (btn.is(':enabled')) {
//             btn.click();

//             if (clickConfirmationButton) {
//                 cy.get('#confirmModalButton').click();
//             }

//             // # Make sure the save is complete by looking for the search input which is only visible on the teams index page
//             cy.findByTestId('search-input').should('be.visible');

//             if (channelName) {
//                 // # Search for the channel.
//                 cy.findByTestId('search-input').type(`${channelName}{enter}`);
//                 cy.findByText('Edit').click();
//             }
//         }
//     });
// };

// // Clicks the save button in the system console page.
// // waitUntilConfigSaved: If we need to wait for the save button to go from saving -> save.
// // Usually we need to wait unless we are doing this in team override scheme
// const saveConfigForScheme = (waitUntilConfigSaved = true, clickConfirmationButton = false) => {
//     // # Save if possible (if previous test ended abruptly all permissions may already be enabled)
//     cy.get('#saveSetting').then((btn) => {
//         if (btn.is(':enabled')) {
//             btn.click();
//         }
//     });
//     if (clickConfirmationButton) {
//         cy.get('#confirmModalButton').click();
//     }
//     if (waitUntilConfigSaved) {
//         waitUntilConfigSave();
//     }
// };

// // # Clicks the View/Manage channel members for a channel (Text changes between View and Manage depending on your role in the channel)
// const viewManageChannelMembersModal = (viewOrManage) => {
//     // # Click member count to open member list popover
//     cy.get('#member_popover').click();

//     cy.get('#member-list-popover').should('be.visible').within(() => {
//         // # Click "View/Manage Members"
//         cy.findByText(`${viewOrManage} Members`).click();
//     });
// };

// // # Checks to see if we got a system message warning after using @all/@here/@channel
// const postChannelMentionsAndVerifySystemMessageExist = (channelName) => {
//     function getSystemMessage(text) {
//         return `Channel notifications are disabled in ${channelName}. The ${text} did not trigger any notifications.`;
//     }

//     // # Type @all and post it to the channel
//     cy.findByTestId('post_textbox').clear().type('@all{enter}');

//     // # Get last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is the system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('include.text', getSystemMessage('@all'));
//     });

//     // # Type @here and post it to the channel
//     cy.findByTestId('post_textbox').clear().type('@here{enter}');

//     // # Get last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is the system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('include.text', getSystemMessage('@here'));
//     });

//     cy.findByTestId('post_textbox').clear().type('@channel{enter}');

//     // # Type last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is the system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('include.text', systemMessage);
//     });
// };

// // # Checks to see if we did not get a system message warning after using @all/@here/@channel
// const postChannelMentionsAndVerifySystemMessageNotExist = (channelName) => {
//     function getSystemMessage(text) {
//         return `Channel notifications are disabled in ${channelName}. The ${text} did not trigger any notifications.`;
//     }

//     cy.findByTestId('post_textbox').clear().type('@all{enter}{enter}{enter}');

//     // # Get last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is NOT a system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('not.have.text', getSystemMessage('@all'));
//     });

//     cy.findByTestId('post_textbox').clear().type('@here{enter}{enter}{enter}');

//     // # Get last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is NOT a system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('not.have.text', getSystemMessage('@here'));
//     });

//     cy.findByTestId('post_textbox').clear().type('@channel{enter}{enter}{enter}');

//     // # Get last post message text
//     cy.getLastPostId().then((postId) => {
//         // * Assert that the last message posted is NOT a system message informing us we are not allowed to use channel mentions
//         cy.get(`#postMessageText_${postId}`).should('not.have.text', getSystemMessage('@channel'));
//     });
// };

describe('Channel Moderation Test', () => {
    let regularUser;
    let guestUser;
    let testTeam;
    let testChannel;
    let admin = getAdminAccount();

    before(() => {
        // * Check if server has license
        cy.requireLicense();

        cy.apiCreateUserAndAddToDefaultTeam().then(({user, team}) => {
            regularUser = user;
            testTeam = team;

            // # Add new channel
            cy.apiCreateChannel(testTeam.id, 'moderation', `moderation${getRandomId()}`).then((response) => {
                testChannel = response.body;

                cy.apiAddUserToChannel(testChannel.id, regularUser.id);

                cy.apiCreateGuestUser().then((user) => {
                    guestUser = user;

                    cy.apiAddUserToTeam(team.id, guestUser.id).then(() => {
                        cy.apiAddUserToChannel(testChannel.id, guestUser.id);
                    });

                    // # Make the guest user as Active
                    cy.apiActivateUser(guestUser.id, true);
                });
            });
        });
    });

    beforeEach(() => {
        // Reset permissions in system scheme to defaults.
        resetSystemSchemePermissionsToDefault();

        // # Delete all Team Override Schemes
        deleteExistingTeamOverrideSchemes();

        // # Reset test channel Moderation settings to default (everything on)
        enableDisableAllChannelModeratedPermissionsViaAPI(testChannel.id);
    });

    // describe('MM-23102 - Create Posts', () => {
    //     it('Create Post option for Guests', () => {
    //         // # Go to channel configuration page of
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the Create Posts option for Guests and Save
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);
    //         saveConfigForChannel();

    //         // # Login as a Guest user and visit the same channel
    //         visitTestChannel(guestUser);

    //         // # Check Guest user should not have the permission to create a post on a channel when the option is removed
    //         // * Guest user should see a message stating that this channel is read-only and the textbox area should be disabled
    //         cy.findByTestId('post_textbox_placeholder').should('have.text', 'This channel is read-only. Only members with permission can post here.');
    //         cy.findByTestId('post_textbox').should('be.disabled');

    //         // # As a system admin, check the option to allow Create Posts for Guests and save
    //         visitChannelConfigPage(testChannel.name);
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);
    //         saveConfigForChannel();

    //         // # Login as a Guest user and visit the same channel
    //         visitTestChannel(guestUser);

    //         // # Check Guest user should have the permission to create a post on a channel when the option is allowed
    //         // * Guest user should see a message stating that this channel is read-only and the textbox area should be disabled
    //         cy.findByTestId('post_textbox').clear();
    //         cy.findByTestId('post_textbox_placeholder').should('have.text', `Write to ${testChannel.display_name}`);
    //         cy.findByTestId('post_textbox').should('not.be.disabled');
    //     });

    //     it('Create Post option for Members', () => {
    //         // # Go to system admin page and to channel configuration page of test channel
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the Create Posts option for Members and Save
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS);
    //         saveConfigForChannel();

    //         // # Login as a Guest user and visit test channel
    //         // TODO Guest?
    //         visitTestChannel(regularUser);

    //         // # Check Member should not have the permission to create a post on a channel when the option is removed.
    //         // * User should see a message stating that this channel is read-only and the textbox area should be disabled
    //         cy.findByTestId('post_textbox_placeholder').should('have.text', 'This channel is read-only. Only members with permission can post here.');
    //         cy.findByTestId('post_textbox').should('be.disabled');

    //         // # As a system admin, check the option to allow Create Posts for Members and save
    //         visitChannelConfigPage(testChannel.name);
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS);
    //         saveConfigForChannel();

    //         // # Login as a Member user and visit the same channel
    //         visitTestChannel(regularUser);

    //         // # Check Member should have the permission to create a post on a channel when the option is allowed
    //         // * Member user should see a message stating that this channel is read-only and the textbox area should be disabled
    //         cy.findByTestId('post_textbox').clear();
    //         cy.findByTestId('post_textbox_placeholder').should('have.text', `Write to ${testChannel.display_name}`);
    //         cy.findByTestId('post_textbox').should('not.be.disabled');
    //     });
    // });

    // describe('MM-23102 - Post Reactions', () => {
    //     before(() => {
    //         // Post a few messages in the channel
    //         visitTestChannel(admin);
    //         cy.findByTestId('post_textbox').clear().type('test123{enter}');
    //         cy.findByTestId('post_textbox').clear().type('test123{enter}');
    //         cy.findByTestId('post_textbox').clear().type('test123{enter}');
    //     });

    //     it('Post Reactions option for Guests', () => {
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the post reactions option for Guests and save
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.POST_REACTIONS_GUESTS);
    //         saveConfigForChannel();

    //         // # Login as a Guest user and visit the same channel
    //         visitTestChannel(guestUser);

    //         // # Check Guest user should not have the permission to react to any post on a channel when the option is removed.
    //         // * Guest user should not see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('not.exist');
    //         });

    //         // # Visit test channel configuration page and enable post reactions for guest and save
    //         visitChannelConfigPage(testChannel.name);
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.POST_REACTIONS_GUESTS);
    //         saveConfigForChannel();

    //         visitTestChannel(guestUser);

    //         // # Check Guest user should have the permission to react to any post on a channel when the option is allowed.
    //         // * Guest user should see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('exist');
    //         });
    //     });

    //     it('Post Reactions option for Members', () => {
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the Create reactions option for Members and save
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         // # Login as a Member user and visit the same channel
    //         visitTestChannel(regularUser);

    //         // # Check Member user should not have the permission to react to any post on a channel when the option is removed.
    //         // * Member user should not see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('not.exist');
    //         });

    //         // # Visit test Channel configuration page and enable post reactions for members and save
    //         visitChannelConfigPage(testChannel.name);
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         // # Login as a Member user and visit the same channel
    //         visitTestChannel(regularUser);

    //         // # Check Member user should have the permission to react to any post on a channel when the option is allowed.
    //         // * Member user should see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('exist');
    //         });
    //     });

    //     it('Post Reactions option removed for Guests and Members in System Scheme', () => {
    //         // # Login as sysadmin and visit the Permissions page in the system console.
    //         // # Edit the System Scheme and remove the Post Reaction option for Guests & Save.
    //         goToSystemScheme();
    //         cy.findByText('Post Reactions').click();
    //         saveConfigForScheme();

    //         // # Visit the Channels page and click on a channel.
    //         visitChannelConfigPage(testChannel.name);

    //         // * Assert that post reaction is disabled for guest and not disabled for members and a message is displayed
    //         cy.findByTestId('admin-channel_settings-channel_moderation-postReactions-disabledGuest').
    //             should('exist').
    //             and('have.text', 'Post reactions for guests are disabled in System Scheme.');
    //         cy.findByTestId(checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS).should('not.be.disabled');
    //         cy.findByTestId(checkboxesTitleToIdMap.POST_REACTIONS_GUESTS).should('be.disabled');

    //         // # Go to system admin page and then go to the system scheme and remove post reaction option for all members and save
    //         goToSystemScheme();
    //         cy.get('#all_users-posts-reactions').click();
    //         saveConfigForScheme();

    //         visitChannelConfigPage(testChannel.name);

    //         // * Post Reaction option should be disabled for a Members. A message Post reactions for guests & members are disabled in the System Scheme should be displayed.
    //         cy.findByTestId('admin-channel_settings-channel_moderation-postReactions-disabledBoth').
    //             should('exist').
    //             and('have.text', 'Post reactions for members and guests are disabled in System Scheme.');
    //         cy.findByTestId(checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS).should('be.disabled');
    //         cy.findByTestId(checkboxesTitleToIdMap.POST_REACTIONS_GUESTS).should('be.disabled');

    //         // # Login as a Guest user and visit the same channel
    //         visitTestChannel(guestUser);

    //         // # Check Guest User should not have the permission to react to any post on any channel when the option is removed from the System Scheme.
    //         // * Guest user should not see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('not.exist');
    //         });

    //         // # Login as a Member user and visit the same channel
    //         visitTestChannel(regularUser);

    //         // # Check Member should not have the permission to react to any post on any channel when the option is removed from the System Scheme.
    //         // * Member user should not see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('not.exist');
    //         });
    //     });

    //     // GUEST PERMISSIONS DON'T EXIST ON TEAM OVERRIDE SCHEMES SO GUEST PORTION NOT IMPLEMENTED!
    //     // ONLY THE MEMBERS PORTION OF THIS TEST IS IMPLEMENTED
    //     it('Post Reactions option removed for Guests & Members in Team Override Scheme', () => {
    //         const teamOverrideSchemeName = 'post_reactions';

    //         // # Create a new team override scheme
    //         goToPermissionsAndCreateTeamOverrideScheme(teamOverrideSchemeName);

    //         visitChannelConfigPage(testChannel.name);

    //         // * Assert that post reaction is disabled for members is not disabled
    //         cy.findByTestId(checkboxesTitleToIdMap.POST_REACTIONS_MEMBERS).should('not.be.disabled');

    //         // # Go to system admin page and then go to the system scheme and remove post reaction option for all members and save
    //         deleteOrEditTeamScheme('post_reactions', 'edit');
    //         cy.get('#all_users-posts-reactions').click();
    //         saveConfigForScheme(false);

    //         // # Wait until the groups have been saved (since it redirects you)
    //         cy.wait(TIMEOUTS.TINY * 2);

    //         visitChannelConfigPage(testChannel.name);

    //         // * Assert that post reaction is disabled for members
    //         cy.findByTestId('create_reactions-members').should('be.disabled');

    //         // # Login as a Member user and visit the same channel
    //         visitTestChannel(regularUser);

    //         // # Check Member should not have the permission to react to any post on any channel in that team when the option is removed from the Team Override Scheme
    //         // * User should not see the smiley face that allows a user to react to a post
    //         cy.getLastPostId().then((postId) => {
    //             cy.get(`#post_${postId}`).trigger('mouseover');
    //             cy.findByTestId('post-reaction-emoji-icon').should('not.exist');
    //         });
    //     });
    // });

    // describe('MM-23102 - Manage Members', () => {
    //     it('No option to Manage Members for Guests', () => {
    //         visitChannelConfigPage(testChannel.name);

    //         // * Assert that Manage Members for Guests does not exist (checkbox is not there)
    //         cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

    //         visitTestChannel(guestUser);

    //         // # View members modal
    //         viewManageChannelMembersModal('View');

    //         // * Add Members button does not exist
    //         cy.get('#showInviteModal').should('not.exist');
    //     });

    //     it('Manage Members option for Members', () => {
    //         // # Visit test channel page and turn off the Manage members for Members and then save
    //         visitChannelConfigPage(testChannel.name);
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
    //         saveConfigForChannel();

    //         visitTestChannel(regularUser);
    //         viewManageChannelMembersModal('View');

    //         // * Add Members button does not exist
    //         cy.get('#showInviteModal').should('not.exist');

    //         // # Visit test channel page and turn off the Manage members for Members and then save
    //         visitChannelConfigPage(testChannel.name);
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
    //         saveConfigForChannel();

    //         visitTestChannel(regularUser);
    //         viewManageChannelMembersModal('Manage');

    //         // * Add Members button does exist
    //         cy.get('#showInviteModal').should('exist');
    //     });

    //     it('Manage Members option removed for Members in System Scheme', () => {
    //         // Edit the System Scheme and remove the Manage Members option for Members & Save.
    //         goToSystemScheme();
    //         cy.get('#all_users-public_channel-manage_public_channel_members').click();
    //         saveConfigForScheme();

    //         // # Visit test channel page and turn off the Manage members for Members and then save
    //         visitChannelConfigPage(testChannel.name);

    //         // * Assert that Manage Members option should be disabled for a Members.
    //         // * A message Manage members for members are disabled in the System Scheme should be displayed.
    //         cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
    //             should('exist').
    //             and('have.text', 'Manage members for members are disabled in System Scheme.');
    //         cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');
    //         cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

    //         visitTestChannel(regularUser);
    //         viewManageChannelMembersModal('View');

    //         // * Add Members button does not exist
    //         cy.get('#showInviteModal').should('not.exist');
    //     });

    //     it('Manage Members option removed for Members in Team Override Scheme', () => {
    //         // # Create a new team override scheme and remove manage members option for members
    //         goToPermissionsAndCreateTeamOverrideScheme('manage_members', testTeam);
    //         deleteOrEditTeamScheme('manage_members', 'edit');
    //         cy.get('#all_users-public_channel-manage_public_channel_members').click();
    //         saveConfigForScheme(false);
    //         cy.wait(TIMEOUTS.TINY * 2);

    //         // * Assert that Manage Members is disabled for members and a message is displayed
    //         visitChannelConfigPage(testChannel.name);
    //         cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
    //             should('exist').
    //             and('have.text', 'Manage members for members are disabled in manage_members Team Scheme.');
    //         cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');
    //         cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_GUESTS).should('not.exist');

    //         visitTestChannel(regularUser);
    //         viewManageChannelMembersModal('View');

    //         // * Add Members button does not exist in manage channel members modal
    //         cy.get('#showInviteModal').should('not.exist');
    //     });
    // });

    // describe('MM-23102 - Channel Mentions', () => {
    //     it('Channel Mentions option for Guests', () => {
    //         // # Uncheck the Channel Mentions option for Guests and save
    //         visitChannelConfigPage(testChannel.name);
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS);
    //         saveConfigForChannel();

    //         visitTestChannel(guestUser);

    //         // # Check Guest user has the permission to user special mentions like @all @channel and @here
    //         postChannelMentionsAndVerifySystemMessageExist(testChannel.name);

    //         // # Visit Channel page and Search for the channel.
    //         visitChannelConfigPage(testChannel.name);

    //         // # check the channel mentions option for guests and save
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS);
    //         saveConfigForChannel();

    //         visitTestChannel(guestUser);

    //         // # Check Guest user has the permission to user special mentions like @all @channel and @here
    //         postChannelMentionsAndVerifySystemMessageNotExist(testChannel.name);
    //     });

    //     it('Channel Mentions option for Members', () => {
    //         // # Visit Channel page and Search for the channel.
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the channel mentions option for guests and save
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         visitTestChannel(regularUser);

    //         // # Check Member user does not has the permission to use special mentions like @all @channel and @here
    //         postChannelMentionsAndVerifySystemMessageExist(testChannel.name);

    //         // # Visit Channel page and Search for the channel.
    //         visitChannelConfigPage(testChannel.name);

    //         // # check the channel mentions option for guests and save
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         visitTestChannel(regularUser);

    //         // # Check Member user has the permission to user special mentions like @all @channel and @here
    //         postChannelMentionsAndVerifySystemMessageNotExist(testChannel.name);
    //     });

    //     it('Channel Mentions option removed when Create Post is disabled', () => {
    //         // # Visit Channel page and Search for the channel.
    //         visitChannelConfigPage(testChannel.name);

    //         // # Uncheck the create posts option for guests
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);

    //         // * Option to allow Channel Mentions for Guests should also be disabled when Create Post option is disabled.
    //         // * A message Guests can not use channel mentions without the ability to create posts should be displayed.
    //         cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledGuestsDueToCreatePosts').
    //             should('have.text', 'Guests can not use channel mentions without the ability to create posts.');
    //         cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS).should('be.disabled');

    //         // # check the create posts option for guests and uncheck for members
    //         enableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS);

    //         // * Option to allow Channel Mentions for Members should also be disabled when Create Post option is disabled.
    //         // * A message Members can not use channel mentions without the ability to create posts should be displayed.
    //         cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledMemberDueToCreatePosts').
    //             should('have.text', 'Members can not use channel mentions without the ability to create posts.');
    //         cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS).should('be.disabled');

    //         // # Uncheck the create posts option for guests
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_GUESTS);

    //         // * Ensure that channel mentions for members and guests is disabled
    //         // * Ensure message Guests & Members can not use channel mentions without the ability to create posts
    //         cy.findByTestId('admin-channel_settings-channel_moderation-channelMentions-disabledBothDueToCreatePosts').
    //             should('have.text', 'Guests and members can not use channel mentions without the ability to create posts.');
    //         cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_GUESTS).should('be.disabled');
    //         cy.findByTestId(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS).should('be.disabled');
    //     });

    //     it('Message when user without channel mention permission uses special channel mentions', () => {
    //         visitChannelConfigPage(testChannel.name);
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         visitTestChannel(regularUser);

    //         cy.findByTestId('post_textbox').clear().type('@');

    //         // * Ensure that @here, @all, and @channel do not show up in the autocomplete list
    //         cy.findAllByTestId('mentionSuggestion_here').should('not.exist');
    //         cy.findAllByTestId('mentionSuggestion_all').should('not.exist');
    //         cy.findAllByTestId('mentionSuggestion_channel').should('not.exist');

    //         // * When you type @all, @enter, and @channel make sure that a system message shows up notifying you nothing happened.
    //         postChannelMentionsAndVerifySystemMessageExist(testChannel.name);
    //     });

    //     it('Confirm sending notifications while using special channel mentions', () => {
    //         // # Visit Channel page and Search for the channel.
    //         visitChannelConfigPage(testChannel.name);
    //         disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
    //         saveConfigForChannel();

    //         // # Set @channel and @all confirmation dialog to true
    //         cy.visit('admin_console/environment/notifications');
    //         cy.findByTestId('TeamSettings.EnableConfirmNotificationsToChanneltrue').check();
    //         saveConfigForScheme();

    //         // # Visit test channel
    //         visitTestChannel(regularUser);

    //         // * Type at all and enter that no confirmation dialogue shows up
    //         cy.findByTestId('post_textbox').clear().type('@all{enter}');
    //         cy.get('#confirmModalLabel').should('not.exist');

    //         // * Type at channel and enter that no confirmation dialogue shows up
    //         cy.findByTestId('post_textbox').clear().type('@channel{enter}');
    //         cy.get('#confirmModalLabel').should('not.exist');

    //         // * Type at here and enter that no confirmation dialogue shows up
    //         cy.findByTestId('post_textbox').clear().type('@here{enter}');
    //         cy.get('#confirmModalLabel').should('not.exist');
    //     });
    // });

    describe('MM-23102 - Higher Scoped Scheme', () => {
        const createNewChannel = (channelName, createAs) => {
            cy.apiLogin(createAs.username, createAs.password);
            cy.visit(`/${testTeam.name}/channels/${testChannel.name}`);
            cy.get('#createPublicChannel').click();
            cy.get('#newChannelName').clear().type(channelName);
            cy.get('#submitNewChannel').click();
        };

        it('Effect of changing System Schemes on a Channel for which Channel Moderation Settings was modified', () => {
            // # Visit Channel page and Search for the channel.
            visitChannelConfigPage(testChannel.name);
            disableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
            disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);

            // # check the channel mentions option for guests and save
            enableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
            saveConfigForChannel();

            goToSystemScheme();
            cy.get('#all_users-public_channel-manage_public_channel_members').click();
            saveConfigForScheme();

            // * Ensure manange members for members is disabled
            visitChannelConfigPage(testChannel.name);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            visitTestChannel(regularUser);

            // # View members modal
            viewManageChannelMembersModal('View');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('not.exist');
        });

        it('Effect of changing System Schemes on a Channel for which Channel Moderation Settings was never modified', () => {
            // # Reset system scheme to default and create a new channel to ensure that this channels moderation settings have never been modified
            const randomChannelName = 'NeverModified' + getRandomId();
            createNewChannel(randomChannelName, admin);

            goToSystemScheme();
            cy.get('#all_users-public_channel-manage_public_channel_members').click();
            saveConfigForScheme();

            // # Visit Channel page and Search for the channel.
            // * ensure manange members for members is disabled
            visitChannelConfigPage(randomChannelName);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            visitChannel(regularUser, randomChannelName.toLowerCase());

            // # View members modal
            viewManageChannelMembersModal('View');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('not.exist');
        });

        it('Effect of changing Team Override Schemes on a Channel for which Channel Moderation Settings was never modified', () => {
            // # Reset system scheme to default and create a new channel to ensure that this channels moderation settings have never been modified
            const randomChannelName = 'NeverModified' + getRandomId();
            createNewChannel(randomChannelName, admin);
            goToPermissionsAndCreateTeamOverrideScheme(`${randomChannelName}`, testTeam);
            deleteOrEditTeamScheme(`${randomChannelName}`, 'edit');
            cy.get('#all_users-public_channel-manage_public_channel_members').click();
            saveConfigForScheme(false);

            // # Visit Channel page and Search for the channel.
            // * Assert message for manage member for members appears and that it's disabled
            visitChannelConfigPage(randomChannelName);
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('have.text', `Manage members for members are disabled in ${randomChannelName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            visitChannel(regularUser, randomChannelName.toLowerCase());

            // # View members modal
            viewManageChannelMembersModal('View');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('not.exist');
        });

        it('Effect of changing Team Override Schemes on a Channel for which Channel Moderation Settings was modified', () => {
            const teamOverrideSchemeName = testChannel.name + getRandomId();

            // # Reset system scheme to default and create a new channel to ensure that this channels moderation settings have never been modified
            visitChannelConfigPage(testChannel.name);
            disableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
            disableChannelModeratedPermission(checkboxesTitleToIdMap.CHANNEL_MENTIONS_MEMBERS);
            saveConfigForChannel();

            visitChannelConfigPage(testChannel.name);
            enableChannelModeratedPermission(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS);
            saveConfigForChannel();

            goToPermissionsAndCreateTeamOverrideScheme(`${teamOverrideSchemeName}`, testTeam);
            deleteOrEditTeamScheme(`${teamOverrideSchemeName}`, 'edit');
            cy.get('#all_users-public_channel-manage_public_channel_members').click();
            saveConfigForScheme(false);

            // # Visit Channel page and Search for the channel.
            // * Assert message shows and manage members for members is disabled
            visitChannelConfigPage(testChannel.name);
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('have.text', `Manage members for members are disabled in ${teamOverrideSchemeName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            // TODO: which user?
            visitTestChannel(regularUser);

            // # View members modal
            viewManageChannelMembersModal('View');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('not.exist');
        });

        it('Manage Members removed for Public Channels', () => {
            const teamOverrideSchemeName = testChannel.name + getRandomId();

            // # Create a new team override scheme and remove manage public channel members
            goToPermissionsAndCreateTeamOverrideScheme(`${teamOverrideSchemeName}`, testTeam);
            deleteOrEditTeamScheme(`${teamOverrideSchemeName}`, 'edit');
            cy.get('#all_users-public_channel-manage_public_channel_members').click();

            // * Ensure that manage private channel members is checked
            cy.get('#all_users-private_channel-manage_private_channel_members').children().should('have.class', 'checked');
            saveConfigForScheme(false);

            // # Visit Channel page and Search for the channel.
            // * Ensure message is disabled and manage members for members is disabled
            visitChannelConfigPage(testChannel.name);
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Public');
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('have.text', `Manage members for members are disabled in ${teamOverrideSchemeName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            // # Turn channel into a private channel
            cy.findByTestId('allow-all-toggle').click();
            saveConfigForChannel(testChannel.display_name, true);

            // * Ensure it is private and no error message is shown and that manage members for members is not disabled
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Private');
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('not.have.text', `Manage members for members are disabled in ${teamOverrideSchemeName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('not.be.disabled');

            // # Turn channel back to public channel
            cy.findByTestId('allow-all-toggle').click();
            saveConfigForChannel(testChannel.display_name, true);

            // * ensure it got reverted back to a Public channel
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Public');
        });

        it('Manage Members removed for Private Channels / Permissions inherited when channel converted from Public to Private', () => {
            const teamOverrideSchemeName = testChannel.name + getRandomId();

            // # Create a new team override scheme and remove manage private channel members from it
            // * Ensure that manage public channel members is checked
            goToPermissionsAndCreateTeamOverrideScheme(`${teamOverrideSchemeName}`, testTeam);
            deleteOrEditTeamScheme(`${teamOverrideSchemeName}`, 'edit');
            cy.get('#all_users-private_channel-manage_private_channel_members').click();
            cy.get('#all_users-public_channel-manage_public_channel_members').children().should('have.class', 'checked');
            saveConfigForScheme(false);

            // # Visit Channel page and Search for the channel.
            visitChannelConfigPage(testChannel.name);

            // * Ensure that error message is not displayed and manage members for members is not disabled
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Public');
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('not.have.text', `Manage members for members are disabled in ${teamOverrideSchemeName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('not.be.disabled');

            // # Turn it into a private channel
            cy.findByTestId('allow-all-toggle').click();
            saveConfigForChannel(testChannel.display_name, true);

            // * Ensure it is a private channel and that a message is disabled and also manage members for members is disabled
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Private');
            cy.findByTestId('admin-channel_settings-channel_moderation-manageMembers-disabledMember').
                should('have.text', `Manage members for members are disabled in ${teamOverrideSchemeName} Team Scheme.`);
            cy.findByTestId(checkboxesTitleToIdMap.MANAGE_MEMBERS_MEMBERS).should('be.disabled');

            // # Turn channel back to public channel
            cy.findByTestId('allow-all-toggle').click();
            saveConfigForChannel(testChannel.display_name, true);

            // * Ensure it got reset back to a public channel
            cy.findByTestId('allow-all-toggle').should('has.have.text', 'Public');
        });

        it('Check if user is allowed to Edit or Delete their own posts on a Read-Only channel', () => {
            visitTestChannel(regularUser);
            cy.findByTestId('post_textbox').clear().type('testMessage123123{enter}');
            cy.findByTestId('post_textbox_placeholder').should('not.have.text', 'This channel is read-only. Only members with permission can post here.');
            cy.findByTestId('post_textbox').should('not.be.disabled');

            visitChannelConfigPage(testChannel.name);
            disableChannelModeratedPermission(checkboxesTitleToIdMap.CREATE_POSTS_MEMBERS);

            saveConfigForChannel();

            visitTestChannel(regularUser);

            // * user should see a message stating that this channel is read-only and the textbox area should be disabled
            cy.findByTestId('post_textbox_placeholder').should('have.text', 'This channel is read-only. Only members with permission can post here.');
            cy.findByTestId('post_textbox').should('be.disabled');

            cy.getLastPostId().then((postId) => {
                cy.clickPostDotMenu(postId);

                // * As per test case, ensure edit and delete button show up
                cy.get(`#edit_post_${postId}`).should('exist');
                cy.get(`#delete_post_${postId}`).should('exist');
            });
        });

        it('Channel Moderation Settings should not be applied for Channel Admins', () => {
            enableDisableAllChannelModeratedPermissionsViaAPI(testChannel.id, false);
            visitTestChannel(regularUser);
            demoteToChannelOrTeamMember(regularUser.id, testChannel.id);

            // * Assert user can post message and user channel mentions
            postChannelMentionsAndVerifySystemMessageNotExist(testChannel.name);

            // # Check Channel Admin have the permission to react to any post on a channel when all channel moderation permissions are off.
            // * Channel Admin should see the smiley face that allows a user to react to a post
            cy.getLastPostId().then((postId) => {
                cy.get(`#post_${postId}`).trigger('mouseover');
                cy.findByTestId('post-reaction-emoji-icon').should('exist');
            });

            // # View members modal
            viewManageChannelMembersModal('Manage');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('exist');

            demoteToChannelOrTeamMember(regularUser.id, testChannel.id);
        });

        it('Channel Moderation Settings should not be applied for Team Admins', () => {
            enableDisableAllChannelModeratedPermissionsViaAPI(testChannel.id, false);
            visitTestChannel(regularUser);
            promoteToChannelOrTeamAdmin(regularUser.id, team.id, 'teams');

            // * Assert user can post message and user channel mentions
            postChannelMentionsAndVerifySystemMessageNotExist(testChannel.name);

            // # Check Channel Admin have the permission to react to any post on a channel when all channel moderation permissions are off.
            // * Channel Admin should see the smiley face that allows a user to react to a post
            cy.getLastPostId().then((postId) => {
                cy.get(`#post_${postId}`).trigger('mouseover');
                cy.findByTestId('post-reaction-emoji-icon').should('exist');
            });

            // # View members modal
            viewManageChannelMembersModal('Manage');

            // * Add Members button does not exist
            cy.get('#showInviteModal').should('exist');

            cy.apiGetMe().then((res) => {
                cy.getCurrentTeamId().then((teamId) => {
                    demoteToChannelOrTeamMember(res.body.id, teamId, 'teams');
                });
            });
        });
    });

    it('MM-22276 - Enable and Disable all channel moderated permissions', () => {
        // # Go to system admin page and to channel configuration page of test channel
        cy.apiAdminLogin();
        cy.visit('/admin_console/user_management/channels');

        // # Search for the channel.
        cy.findByTestId('search-input').type(`${testChannel.name}{enter}`);
        cy.findByText('Edit').click();

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // # Check all the boxes currently unchecked (align with the system scheme permissions)
        enableAllChannelModeratedPermissions();

        // # Save if possible (if previous test ended abruptly all permissions may already be enabled)
        saveConfigForChannel(testChannel.display_name);

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // * Ensure all checkboxes are checked
        checkBoxes.forEach((buttonId) => {
            cy.findByTestId(buttonId).should('have.class', 'checked');
        });

        // # Uncheck all the boxes currently checked
        disableAllChannelModeratedPermissions();

        // # Save the page and wait till saving is done
        saveConfigForChannel(testChannel.display_name);

        // # Wait until the groups retrieved and show up
        cy.wait(TIMEOUTS.TINY * 2);

        // * Ensure all checkboxes have the correct unchecked state
        checkBoxes.forEach((buttonId) => {
            // * Ensure all checkboxes are unchecked
            cy.findByTestId(buttonId).should('not.have.class', 'checked');

            // * Ensure Channel Mentions are disabled due to Create Posts
            if (buttonId.includes('use_channel_mentions')) {
                cy.findByTestId(buttonId).should('be.disabled');
                return;
            }

            // * Ensure all other check boxes are still enabled
            cy.findByTestId(buttonId).should('not.be.disabled');
        });
    });

    // // # Visits a channel as the member specified
    // const visitChannel = (loginAs, channelName, teamName = testTeam.name) => {
    //     cy.apiLogin(loginAs.username, loginAs.password);
    //     cy.visit(`/${teamName}/channels/${channelName}`);
    //     cy.get('#postListContent', {timeout: TIMEOUTS.HUGE}).should('be.visible');
    // };

    // const visitTestChannel = (loginAs) => {
    //     visitChannel(loginAs, testChannel.name);
    // };
});
