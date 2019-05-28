import React, { Component } from "react";
//smooth scroll for ie
import smoothscroll from 'smoothscroll-polyfill';
import "./App.scss";

/*Components*/
import HeroBanner from "./components/hero-banner/HeroBanner";
import FieldFilter from './components/field-filter/FieldFilter';

class App extends Component {
  constructor() {
    super()
    // kick off the polyfill!
    smoothscroll.polyfill();
  }
  render() {
    return (
      <div className="App">
        {/* <h1>Hello World With Polyfill</h1> */}
        <HeroBanner />
        <FieldFilter />    
        
      </div>
    );
  }
}

export default App;
