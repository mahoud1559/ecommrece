const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const usersRouter = require("./Routes/user.routes");
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

//? routes
app.use("/api/user", usersRouter);

app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
      code: error.statusCode || 500,
      message: error.statusText || 'invalid status',
      error: error.message || 'invalid status',
      data: null
    });
  })

app.listen(port, () => {
    console.log(`start server work in ${port}`);
});