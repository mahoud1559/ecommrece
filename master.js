const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
var cors = require('cors')
dotenv.config();

const app = express();
const port = process.env.port;
const url = process.env.mongoURL;

mongoose.connect(url).then(() => {
    console.log("Connect success for DB");
}).catch(err =>  console.log(err));

app.use(cors())
app.use(express.json()); 

app.listen(port, () => {
    console.log(`start server work in ${port}`);
});