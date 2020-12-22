// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({region: process.env.AWS_REGION});
const documentClient = new AWS.DynamoDB.DocumentClient();

const tableParams = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
};

function getCycleName(branch, buildId) {
    return `cypress#cycle#${branch}#${buildId}`;
}

function getRunName(branch, buildId, part) {
    return `cypress#cycle#${branch}#${buildId}#run${part}`;
}

function getCycleKeys(branch, buildId) {
    const cycleName = getCycleName(branch, buildId);

    return {
        PK: cycleName,
        SK: cycleName,
    };
}

function getRunKeys(branch, buildId, part) {
    const cycleName = getCycleName(branch, buildId);

    return {
        PK: cycleName,
        SK: `run#${part}`,
    };
}

function getSpecKeys(branch, buildId, specFile) {
    const cycleName = getCycleName(branch, buildId);

    return {
        PK: cycleName,
        SK: `spec#${specFile}`,
    };
}

function getTestKeys(branch, buildId, specFile, fullTitle) {
    const cycleName = getCycleName(branch, buildId);

    const title = fullTitle.trim().replace(/\s/g, '_');

    return {
        PK: cycleName,
        SK: `test#${specFile}#${title}`,
    };
}

function updateItem(keys, item) {
    if (item.duration) {
        delete item.duration;
    }

    const itemProperties = Object.keys(item);
    if (!item || itemProperties.length < 1) {
        return {
            error: 'invalid request, no item to update',
        };
    }

    const params = {
        ...tableParams,
        Key: keys,
        UpdateExpression: '',
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW',
    };

    itemProperties.forEach((property, index) => {
        params.UpdateExpression += `${index === 0 ? 'set' : ','} ${property} = :${property}`;
        params.ExpressionAttributeValues[`:${property}`] = item[property];
    });

    return documentClient.update(params).promise().
        then((response) => response).
        catch((error) => error);
}

function updateItemWithIncrement(keys, item) {
    const validProperties = [
        'suites',
        'tests',
        'passes',
        'pending',
        'skipped',
        'failures',
        'testDuration',
        'testedFiles',
    ];
    const itemProperties = Object.keys(item);
    if (!item || itemProperties.length < 1) {
        return {
            error: 'invalid request, no item to update',
        };
    }

    const params = {
        ...tableParams,
        Key: keys,
        UpdateExpression: '',
        ExpressionAttributeValues: {},
        ReturnValues: 'UPDATED_NEW',
    };

    itemProperties.forEach((property) => {
        if (validProperties.includes(property)) {
            params.UpdateExpression += `${params.UpdateExpression ? ',' : 'set'} ${property} = ${property} + :incr${property}`;
            params.ExpressionAttributeValues[`:incr${property}`] = item[property];
        }
    });

    return documentClient.update(params).promise().
        then((response) => response).
        catch((error) => error);
}

function getCycle(keys) {
    const params = {
        ...tableParams,
        Key: keys,
    };

    return documentClient.get(params).promise().
        then((response) => response).
        catch((error) => error);
}

function createOrUpdateCycle(keys, commonData, runData) {
    return getCycle(keys).then((response) => {
        if (response.Item) {
            return updateItem(keys, runData);
        }

        return createItem(keys, {...commonData, ...runData});
    });
}

function createItem(keys, item) {
    if (item.duration) {
        delete item.duration;
    }

    const params = {
        ...tableParams,
        Item: {
            ...keys,
            ...item,
        },
    };

    return documentClient.put(params).promise().
        then((response) => response).
        catch((error) => error);
}

module.exports = {
    createOrUpdateCycle,
    getCycleKeys,
    getCycleName,
    getRunKeys,
    getSpecKeys,
    getTestKeys,
    updateItemWithIncrement,
    getRunName,
    updateItem,
    createItem,
};
