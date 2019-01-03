const express = require("express");
const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("./data.db");
// Instantiate the app here
const app = express();

const PORT = process.env.PORT || 4001;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}"`);
});
