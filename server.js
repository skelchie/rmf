const express = require("express");
const sqlite3 = require("sqlite3");

// Instantiate the app here
const app = express();
const database = "./data.db";

const PORT = process.env.PORT || 5000;
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

app.get("/data", (req, res, next) => {
  var machineArray = machines.map(value => value.Name);

  if (machineArray !== []) {
    res.status(200).send(machineArray);
  } else {
    res.status(400).send("No Machines found");
  }
});
app.get("/machines/:id", (req, res, next) => {
  var machine = req.params.id;
  var machineArray = machines.map(value => value.Name);
  var position = machineArray.indexOf(machine);

  if (position > -1) {
    res.status(200).send(machines[position].Name);
  } else {
    res.status(400).send("Machine not found");
  }
});

app.put("/machines/:id", (req, res, next) => {
  var machine = req.params.id;
  createTableInDb(machine);
  insertIntoTable(machine, "Machines");
  res.status(200).send("Machine has been inserted");
});

app.put("/data/:machines", (req, res, next) => {
  var startDate = req.query.startDate;
  var startTime = req.query.startTime;
  var endTime = req.query.endTime;
  var lpar = req.query.lpar;
  var machine = req.params.machines;
  var usage = req.query.usage;
  console.log({ machine, lpar, usage, startDate, startTime, endTime });
  const db = new sqlite3.Database(database);
  db.run(
    `INSERT INTO ${machine}(lpar, usage, startDate, startTime, endTime) VALUES (?,?,?,?,?)`,
    [lpar, usage, startDate, startTime, endTime],

    function(err) {
      if (err) {
        return console.log(err.message);
      } else {
        [lpar, startDate, startTime, endTime] +
          " has been inserted into " +
          machine;
      }
      res.status(200).send("Data has been inserted");
    }
  );
  db.close;
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
  db.run(
    `CREATE TABLE ${newTable} (lpar STRING, usage STRING, startDate STRING, startTime STRING, endTime STRING)`,
    function(err) {
      if (err) {
        return console.log(err.message);
      }
    }
  );
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
    machines = getMachinesFromDb();
  });
  db.close;
}
