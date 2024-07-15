const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'data.json');

function readData() {
    if (!fs.existsSync(dataFilePath)) {
        return { assistantId: null, vectorStoreId: null, fileIds: [] };
    }

    const rawData = fs.readFileSync(dataFilePath);
    return JSON.parse(rawData);
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
