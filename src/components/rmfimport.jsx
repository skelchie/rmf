import React from "react";
import { url } from "./data";
export default class Rmfimport extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: [] };
  }

  render() {
    function checkServer(result, systemIdSearcher, machine) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url + "machines/" + machine, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log("The machine already exists");
          while (
            result.indexOf(
              "1                                                       C P U  A C T I V I T Y"
            ) > -1
          ) {
            readRMF(result, systemIdSearcher, machine);
            var slice = result.indexOf(
              "1                                                       C P U  A C T I V I T Y"
            );
            result = result.slice(slice + 1);
          }

          readRMF(result, systemIdSearcher, machine);
        } else {
          createTableInDb(result, systemIdSearcher, machine);
        }
      };
      xhr.send(null);
    }
    function createTableInDb(result, systemIdSearcher, machine) {
      var data = {};
      data.Name = machine;
      var json = JSON.stringify(data);
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", url + "machines/" + machine, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          while (
            result.indexOf(
              "1                                                       C P U  A C T I V I T Y"
            ) > -1
          ) {
            readRMF(result, systemIdSearcher, machine);
            var slice = result.indexOf(
              "1                                                       C P U  A C T I V I T Y"
            );
            result = result.slice(slice + 1);
          }

          readRMF(result, systemIdSearcher, machine);
        } else {
          console.log("error on creation");
        }
      };
      xhr.send(json);
    }
    function readRMF(result, systemIdSearcher, machine) {
      var begin = result.indexOf(
        " NAME       S  WGT   DEF    ACT  DEF     WLM%   NUM  TYPE  EFFECTIVE       TOTAL      EFFECTIVE    TOTAL  LPAR MGMT  EFFECTIVE  TOTAL"
      );
      var end = result.indexOf(
        "            ------                                        ------------  ------------                          -----      -----  -----"
      );
      systemIdSearcher = 0;
      while (
        result[systemIdSearcher].search("SYSTEM ID") === -1 &&
        systemIdSearcher < 50
      ) {
        systemIdSearcher++;
      }
      var start = result[systemIdSearcher].search("START");
      var interval = result[systemIdSearcher].search("INTERVAL");
      var startText = result[systemIdSearcher].slice(start, interval);
      var space = startText.search(" ");
      var slash = startText.search("/");
      var startDate = startText.substr(space + 1, slash + 2);
      var startTime = startText.substr(slash + 9, slash + 13);
      var endvar = result[systemIdSearcher + 1].search("END");
      var cycle = result[systemIdSearcher + 1].search("CYCLE");
      var endText = result[systemIdSearcher + 1].slice(endvar, cycle);
      var slashEnd = endText.search("/");
      var endTime = endText.substr(slashEnd + 9, slashEnd + 13);

      for (var k = begin + 1; k < end - 1; k++) {
        var input = result[k];
        var isLength = input.length;
        var startNumber = 1;
        var dataArray = [];
        var stringForTransport = null;
        for (startNumber; startNumber < isLength; startNumber++) {
          if (input.charAt(startNumber) === " ") {
            dataArray.push(stringForTransport);
            stringForTransport = null;
          } else {
            if (stringForTransport === null) {
              stringForTransport = input.charAt(startNumber);
            } else {
              stringForTransport += input.charAt(startNumber);
            }
          }
        }
        var finalArray = [];
        for (var j = 0; j < dataArray.length; j++) {
          if (dataArray[j] === null) {
          } else {
            finalArray.push(dataArray[j]);
          }
        }
        //var lastArray = [];
        var lpar = finalArray[0];
        /*var helpstring =
          '{"' +
          lpar +
          '": "' +
          finalArray[4] +
          '","Start": "' +
          startDate +
          '","Starttime": "' +
          startTime +
          '","End": "' +
          endDate +
          '","Endtime": "' +
          endTime +
          '"}';

        lastArray.push(helpstring);
        console.log(JSON.parse(lastArray));*/
        insertDataIntoTable(
          machine,
          lpar,
          finalArray[4],
          startDate,
          startTime,
          endTime
        );
      }
    }
    function insertDataIntoTable(
      machine,
      lpar,
      usage,
      startDate,
      startTime,
      endTime
    ) {
      var data = {};
      data.machine = machine;
      data.lpar = lpar;
      data.startDate = startDate;
      data.startTime = startTime;
      data.endTime = endTime;
      var putUrl = `${url}data/${machine}?lpar=${lpar}&usage=${usage}&startDate=${startDate}&startTime=${startTime}&endTime=${endTime}`;
      var json = JSON.stringify(data);
      var xhr = new XMLHttpRequest();
      xhr.open("PUT", putUrl, true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
        } else {
          console.log("error on insertData");
        }
      };
      xhr.send(json);
    }

    const ImportFromFileBodyComponent = () => {
      let fileReader;

      const handleFileRead = e => {
        const content = fileReader.result;
        // … do something with the 'content' …
        var result = content.split(/[\r\n]+/g);
        // searching for the first line of the cpu activity report, needs to be adjusted/generalized
        var slice = result.indexOf(
          "1                                                       C P U  A C T I V I T Y"
        );
        result = result.slice(slice + 1);
        var systemIdSearcher = 0;
        while (
          result[systemIdSearcher].search("SYSTEM ID") === -1 &&
          systemIdSearcher < 50
        ) {
          systemIdSearcher++;
        }
        var systemIdRow = result[systemIdSearcher];
        var systemId = systemIdRow.slice(
          systemIdRow.search("SYSTEM ID") + 10,
          systemIdRow.search("START")
        );
        var systemIdWithoutSpace = "";

        for (var p = 0; p < systemId.length; p++) {
          if (systemId.charAt(p) === " ") {
          } else {
            systemIdWithoutSpace = systemIdWithoutSpace + systemId.charAt(p);
          }
        }

        checkServer(result, systemIdSearcher, systemIdWithoutSpace);

        /*var emptyArray = [];
        for (var i = begin; i < end; i++) {
          emptyArray.push(result[i]);
        }
        var table = emptyArray.map(value => (
          <li className="list-group-item">{value}</li>
        ));
        var fullTable = <ul className="list-group">{table}</ul>;
        this.setState({ content: fullTable });*/
      };

      const handleFileChosen = file => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
      };

      return (
        <div className="upload-expense">
          <input
            type="file"
            id="file"
            className="input-file"
            accept=".txt"
            onChange={e => handleFileChosen(e.target.files[0])}
          />
        </div>
      );
    };

    return (
      <div>
        <ImportFromFileBodyComponent />
        {this.state.content}
      </div>
    );
  }
}
