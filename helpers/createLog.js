const path = require('path');
const fs = require('fs');
const logPath = path.join('./files/logs.txt');
function createLog(req, res, next) {
    const time = new Date().toLocaleString();
    const log =
        `
        Time: ${time}
        Url: ${req.url}
        Method: ${req.method}
        Authorization: ${req.headers.authorization}
        Body: ${req.body ? JSON.stringify(req.body) : 'no body'}
        `
    fs.appendFile(logPath, log, 'utf8', (err) => {});
    return next();
}
module.exports = {
    createLog
}