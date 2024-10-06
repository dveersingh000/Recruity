const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
    res.send("hello from recruity");
})

module.exports = router;