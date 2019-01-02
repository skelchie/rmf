import React from "react";

export default class Rmf extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: [] };
  }
  render() {
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
        var emptyArray = [];
        for (var i = begin; i < end; i++) {
          emptyArray.push(result[i]);
        }
        var table = emptyArray.map(value => (
          <li className="list-group-item">{value}</li>
        ));
        var fullTable = <ul className="list-group">{table}</ul>;
        this.setState({ content: fullTable });
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
