
const fs = require("fs");
const incomingRequestLogger = ((req, res, next) => {
    fs.appendFile("log.txt", req.method + " " + req.url + new Date().toISOString() + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    })
    next();
})

module.exports =  {incomingRequestLogger};