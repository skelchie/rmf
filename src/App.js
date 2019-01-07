import React, { Component } from "react";
import "./App.css";
import Rmfimport from "./components/rmfimport";
import RmfData from "./components/rmfdata";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Rmfimport />
        <RmfData />
      </div>
    );
  }
}
