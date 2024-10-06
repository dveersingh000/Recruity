const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const fs = require("fs");
const {incomingRequestLogger} = require("./middleware/index");
const indexRouter = require("./routes/index");
const userRouter = require("./routes/user");
const bodyParser = require("body-parser");


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(incomingRequestLogger);

app.use("/api/v1", indexRouter);
app.use("/api/v1/user", userRouter);
app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
    mongoose.connect(process.env.MONGOOSE_URI_STRING , {})
    .then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
    })
        

});