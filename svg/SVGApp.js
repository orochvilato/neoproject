import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
//import ReactSVG from 'react-svg'
var Isvg = require('react-inlinesvg');

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var $ = require('jquery');

const data = { Strategique___0: "4CAF50"  }

class SVGApp extends React.Component {
  constructor() {
    super();

  }
  svgloaded() {
    $("#Strategique___0").css('fill','#81C784');
  }

  render(){
    return (
        <MuiThemeProvider>
        <div>
        <Isvg src="./carto.svg" onLoad={this.svgloaded.bind(this)}>
        </Isvg>


        </div>

        </MuiThemeProvider>

    );
  }

}

export default SVGApp
