import React from "react";

export default class Rmf extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: [] };
  }

  render() {
    function changeStringToMulti(input) {
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
      var helpstring = '{"' + substring + '": "' + finalArray[4] + '"}';

      lastArray.push(helpstring);
      console.log(JSON.parse(lastArray));
    }
    const ImportFromFileBodyComponent = () => {
      let fileReader;

      const handleFileRead = e => {
        const content = fileReader.result;
        // … do something with the 'content' …
        var result = content.split(/[\r\n]+/g);
        var begin = result.indexOf(
          " NAME       S  WGT   DEF    ACT  DEF     WLM%   NUM  TYPE  EFFECTIVE       TOTAL      EFFECTIVE    TOTAL  LPAR MGMT  EFFECTIVE  TOTAL"
        );
        var end = result.indexOf(
          "            ------                                        ------------  ------------                          -----      -----  -----"
        );
        for (var k = begin + 1; k < end - 1; k++) {
          changeStringToMulti(result[k]);
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
