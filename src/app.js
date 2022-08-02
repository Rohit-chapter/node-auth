const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const router = require("./api/routes/index")
dotenv.config();

const app = express();
app.use(express.json())

app.use("/v1", router)

// create server code
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

// Here start database connectivity
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully...");
  })
  .catch((e) => {
    console.log("Database connection error", e);
  });
