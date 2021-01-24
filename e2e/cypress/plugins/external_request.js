// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const axios = require('axios');

module.exports = async ({baseUrl, user, method = 'get', path, data = {}}) => {
    console.log('External request');
    const loginUrl = `${baseUrl}/api/v4/users/login`;

    // First we need to login with our external user to get cookies/tokens
    let loginResponse;
    try {
        console.log('External Login');
        loginResponse = await axios({
            url: loginUrl,
            headers: {'X-Requested-With': 'XMLHttpRequest'},
            method: 'post',
            data: {login_id: user.username, password: user.password},
        });
        console.log('External Login done');
    } catch (error) {
        console.log('External Login error');
        return error;
    }

    let cookieString = '';
    const setCookie = loginResponse.headers['set-cookie'];
    setCookie.forEach((cookie) => {
        const nameAndValue = cookie.split(';')[0];
        cookieString += nameAndValue + ';';
    });

    let response;

    try {
        console.log('External config');
        response = await axios({
            method,
            url: `${baseUrl}/api/v4/${path}`,
            headers: {
                'Content-Type': 'text/plain',
                Cookie: cookieString,
                'X-Requested-With': 'XMLHttpRequest',
            },
            timeout: 15000,
            data,
        });
        console.log('External config done');

        return {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
        };
    } catch (error) {
        // If we have a response for the error, pull out the relevant parts
        if (error.response) {
            response = {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                isError: true,
            };
        }else if (error.code === 'ECONNABORTED') {
            return {isTimeout: true};
        } else {
            // If we get here something else went wrong, so throw
            throw error;
        }
    }
    console.log('External request response', response);
    return response;
};
