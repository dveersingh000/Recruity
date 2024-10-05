const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

const app = express();

app.use((req, res, next) => {
    fs.appendFile("log.txt", req.method + " " + req.url + new Date().toISOString() + "\n", (err) => {
        if (err) {
            console.log(err);
        }
    })
    next();
})

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});