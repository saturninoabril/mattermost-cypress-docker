// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

const fs = require('fs');

const path = require('path');

module.exports = (filename) => {
    const filePath = path.resolve(__dirname, `../fixtures/${filename}`);

    return fs.existsSync(filePath);
};
