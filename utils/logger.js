const winston = require('winston');
const path = require('path');
const fs = require('fs');
const logDir = 'Logs';
if ( !fs.existsSync( logDir ) ) {
    // Create the directory if it does not exist
    fs.mkdirSync( logDir );
}
// Return the last folder name in the path and the calling
// module's filename.
var getLabel = function(callingModule) {
  var parts = callingModule.filename.split(path.sep);
  return path.join(parts[parts.length - 2], parts.pop());
};
module.exports = (dirname, _module) => {
    const loggers = {
        info: null,
        warn: null,
        error: null
    };

    for (let level of Object.keys(loggers)) {
        loggers[level] = winston.createLogger({
            levels: { [level]: 0 },
            format: winston.format.combine(
                winston.format.label({label:getLabel(_module)}),
                winston.format.timestamp(),
                winston.format.printf(info =>
                    `${info.timestamp}\t[${getLabel(_module)}][${info.level}]\t\t${info.message}`
                )
            ),
            transports: [
                new winston.transports.Console({
                    level
                }),
                new winston.transports.File({
                    filename: path.join(__dirname, '..', logDir, `${level}.log`),
                    level,
                    format: winston.format.json()
                }),
            ]
        })[level];
    }

    return loggers;
};