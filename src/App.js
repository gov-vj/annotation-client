import React from 'react';
import './App.css';
import { Content } from "./Components/Content";
import { Home } from "./Components/Home";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <div className="App-main">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/isMultiToken/:isMultiToken/isTagOn/:isTagOn/isHistoryOn/:isHistoryOn" component={Content} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
