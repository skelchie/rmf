const express = require("express");
const sqlite3 = require("sqlite3");

// Instantiate the app here
const app = express();
const database = "./data.db";

const PORT = process.env.PORT || 4001;
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});

var machines = getMachinesFromDb();

app.get("/", (req, res, next) => {
  res.send("Welcome to the server!");
});

app.get("/:machines", (req, res, next) => {
  var machine = req.params.machines;
  var machineArray = machines.map(value => value.Name);
  var position = machineArray.indexOf(machine);

  if (position > -1) {
    res.status(200).send(machines[position].Name);
  } else {
    res.status(400).send("Machine not found");
  }
});

app.put("/:machines", (req, res, next) => {
  var machine = req.params.machines;
  createTableInDb(machine);
  insertIntoTable(machine, "Machines");
  res.status(200).send("Machine has been inserted");
});
// Invoke the app's `.listen()` method below:
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}"`);
});
function getMachinesFromDb() {
  const db = new sqlite3.Database(database);
  var machines = [];
  db.each("SELECT * FROM machines", (error, rows) => {
    if (error) {
      throw error;
    } else {
      machines.push(rows);
    }
  });
  db.close;
  return machines;
}

function createTableInDb(newTable) {
  const db = new sqlite3.Database(database);
  db.run(`CREATE TABLE ${newTable} VALUES (?)`, ["LPAR string"], function(err) {
    if (err) {
      return console.log(err.message);
    }
  });
  db.close;
}

function insertIntoTable(value, table) {
  const db = new sqlite3.Database(database);
  // insert one row into the langs table
  db.run(`INSERT INTO ${table}(Name) VALUES(?)`, [value], function(err) {
    if (err) {
      return console.log(err.message);
    } else {
      value + " has been inserted into " + table;
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
    machines = getMachinesFromDb();
  });
  db.close;
}
