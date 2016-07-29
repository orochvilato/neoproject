import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import GraphExplorer from './graphExplorerComponent';
import NodeChips from './nodeChipsComponent';
import InfoDrawer from './infoDrawerComponent';
import ToolBar from './toolBarComponent';


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  grapharea: {
    float: 'left'

  },
  options: {
    width:'200px'
  }
};

var $ = require('jquery');

class GraphExplorerApp extends React.Component {
  constructor() {
    super();
    this.api ='http://129.184.121.208:5000'
    this.state = {
       filters: { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] },
       startNodes: [],
       optionsDrawer : false
    };

  }


  setChips(chips) {
    return this._nodechips.setChips(chips);
  }
  setInfo(data,open=true) {
    if (data.length>0) {
      var title = data[0].name;
    } else {
      var title = "Info";
    }
    return this._infodrawer.setState({data:data, title:title, open:open});
  }
  graphDeleteFromPath(nodeid) {
    return this._graph.deleteFromPath(nodeid);
  }
  graphUpdatePath(path) {
    return this._graph.updatePath(path)
  }

  toggleOptionsDrawer() {
    console.log('toggle');
    this.setState({optionsDrawer: !this.state.optionsDrawer});
  }
  render(){
    return (
        <MuiThemeProvider>
        <div style={styles.root}>
          <ToolBar />
          <div style={styles.grapharea}>
            <NodeChips
              ref={(c) => this._nodechips = c}
              graphDeleteFromPath = {this.graphDeleteFromPath.bind(this)}
              graphUpdatePath = {this.graphUpdatePath.bind(this)} />
            <GraphExplorer
              ref={(c) => this._graph = c}
              filters={this.state.filters}
              startNodes={this.state.startNodes}
              chips={this.setChips.bind(this)}
              info={this.setInfo.bind(this)}
              theme='si'
              api={this.api}/>
          </div>
          <InfoDrawer
            ref={(c) => this._infodrawer = c}
          />
        </div>
        </MuiThemeProvider>

    );
  }

}

GraphExplorerApp.defaultProps = { }

export default GraphExplorerApp
