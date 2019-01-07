import React, { Component } from "react";
import "./App.css";
import Rmfimport from "./components/rmfimport";
import Rmfdata from "./components/rmfdata";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Rmfimport />
        <Rmfdata/>
      </div>
    );
  }
}

export default App;
