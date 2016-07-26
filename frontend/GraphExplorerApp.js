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
    this.api ='http://localhost:5000'
    this.state = {
       filters: { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] },
       startNodes: [],
       optionsDrawer : false
    };

  }


  setChips(chips) {
    return this._nodechips.setChips(chips);
  }
  graphDeleteFromPath(nodeid) {
    return this._graph.deleteFromPath(nodeid);
  }
  toggleOptionsDrawer() {
    console.log('toggle');
    this.setState({optionsDrawer: !this.state.optionsDrawer});
  }
  render(){
    return (
        <MuiThemeProvider>
        <div style={styles.root}>
          <div style={styles.grapharea}>
            <NodeChips
              ref={(c) => this._nodechips = c}
              graphDeleteFromPath = {this.graphDeleteFromPath.bind(this)} />
            <GraphExplorer
              ref={(c) => this._graph = c}
              filters={this.state.filters}
              startNodes={this.state.startNodes}
              chips={this.setChips.bind(this)}
              theme='si'
              api={this.api}/>
          </div>
          <div style={styles.options}>
            <List>
            <ListItem
              primaryText="When calls and notifications arrive"
              secondaryText="Always interrupt"
            />
            </List>
            <Divider />
            <List>
              <Subheader>Priority Interruptions</Subheader>
              <ListItem primaryText="Events and reminders" rightToggle={<Toggle />} />
              <ListItem primaryText="Calls" rightToggle={<Toggle />} />
              <ListItem primaryText="Messages" rightToggle={<Toggle />} />
            </List>
            <Divider />
            <List>
              <Subheader>Hangout Notifications</Subheader>
              <ListItem primaryText="Notifications" leftCheckbox={<Checkbox />} />
              <ListItem primaryText="Sounds" leftCheckbox={<Checkbox />} />
              <ListItem primaryText="Video sounds" leftCheckbox={<Checkbox />} />
            </List>
          </div>
        </div>
        </MuiThemeProvider>

    );
  }

}

GraphExplorerApp.defaultProps = { }

export default GraphExplorerApp
