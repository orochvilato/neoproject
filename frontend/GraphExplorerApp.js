import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import GraphExplorer from './graphExplorerComponent';
import NodeChips from './nodeChipsComponent';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var $ = require('jquery');

class GraphExplorerApp extends React.Component {
  constructor() {
    super();
    this.api ='http://localhost:5000'
    this.state = {
       filters: { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] },
       startNodes: [1960]
    };

  }


  setChips(chips) {
    return this._nodechips.setChips(chips);
  }
  updateGraph(nodes) {
    return this._graph.updatePath(nodes);
  }

  render(){
    return (
        <MuiThemeProvider>
        <div>
          <NodeChips
            ref={(c) => this._nodechips = c}
            updateGraph = {this.updateGraph.bind(this)} />
          <GraphExplorer
            ref={(c) => this._graph = c}
            filters={this.state.filters}
            startNodes={this.state.startNodes}
            chips={this.setChips.bind(this)}
            theme='si'
            api={this.api}/>
        </div>
        </MuiThemeProvider>

    );
  }

}

GraphExplorerApp.defaultProps = { }

export default GraphExplorerApp
