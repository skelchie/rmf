import React from "react";
import { url } from "./data";

export default class RmfData extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.getDataFromServer();
  }
  getDataFromServer() {
    const request = require("request");
    request(url + "data", (err, res, body) => {
      this.setState({ data: JSON.parse(body) });
    });
  }

  render() {
    return <div>{this.state.data}</div>;
  }
}
