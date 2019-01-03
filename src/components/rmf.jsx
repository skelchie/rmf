import React from "react";

export default class Rmf extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: [] };
  }

  render() {
    function changeStringToMulti(
      input,
      startDate,
      startTime,
      endDate,
      endTime
    ) {
      var isLength = input.length;
      var startNumber = 0;
      if (Number(input.charAt(0)) === 0) {
        startNumber = 1;
      }
      var dataArray = [];
      for (startNumber; startNumber < isLength; startNumber++) {
        var stringForTransport;
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
      var lastArray = [];
      var substring = finalArray[0].substr(9);
      var helpstring =
        '{"' +
        substring +
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
      console.log(JSON.parse(lastArray));
    }
    const ImportFromFileBodyComponent = () => {
      let fileReader;

      const handleFileRead = e => {
        const content = fileReader.result;
        // … do something with the 'content' …
        var result = content.split(/[\r\n]+/g);
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
        console.log(systemId);
        while (
          result.indexOf(
            "1                                                       C P U  A C T I V I T Y"
          ) > -1
        ) {
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
          var date = startText.substr(space + 1, slash + 2);
          var timeStart = startText.substr(slash + 9, slash + 13);

          var endvar = result[systemIdSearcher + 1].search("END");
          var cycle = result[systemIdSearcher + 1].search("CYCLE");
          var endText = result[systemIdSearcher + 1].slice(endvar, cycle);
          var spaceEnd = endText.search(" ");
          var slashEnd = endText.search("/");
          var endDate = endText.substr(spaceEnd + 1, slashEnd + 4);
          var timeEnd = endText.substr(slashEnd + 9, slashEnd + 13);
          for (var k = begin + 1; k < end - 1; k++) {
            changeStringToMulti(result[k], date, timeStart, endDate, timeEnd);
          }
          slice = result.indexOf(
            "1                                                       C P U  A C T I V I T Y"
          );
          result = result.slice(slice + 1);
        }

        begin = result.indexOf(
          " NAME       S  WGT   DEF    ACT  DEF     WLM%   NUM  TYPE  EFFECTIVE       TOTAL      EFFECTIVE    TOTAL  LPAR MGMT  EFFECTIVE  TOTAL"
        );
        end = result.indexOf(
          "            ------                                        ------------  ------------                          -----      -----  -----"
        );

        systemIdSearcher = 0;
        while (
          result[systemIdSearcher].search("SYSTEM ID") === -1 &&
          systemIdSearcher < 50
        ) {
          systemIdSearcher++;
        }
        start = result[systemIdSearcher].search("START");
        interval = result[systemIdSearcher].search("INTERVAL");
        startText = result[systemIdSearcher].slice(start, interval);
        space = startText.search(" ");
        slash = startText.search("/");
        date = startText.substr(space + 1, slash + 2);
        timeStart = startText.substr(slash + 9, slash + 13);

        endvar = result[systemIdSearcher + 1].search("END");
        cycle = result[systemIdSearcher + 1].search("CYCLE");
        endText = result[systemIdSearcher + 1].slice(endvar, cycle);
        spaceEnd = endText.search(" ");
        slashEnd = endText.search("/");
        endDate = endText.substr(spaceEnd + 1, slashEnd + 4);
        timeEnd = endText.substr(slashEnd + 9, slashEnd + 13);
        for (k = begin + 1; k < end - 1; k++) {
          changeStringToMulti(result[k], date, timeStart, endDate, timeEnd);
        }

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
