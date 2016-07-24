import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TableExampleComplex from './tableComponent';
import DialogEditNode from './dialogEditNode';
import Graph from './react-graph-vis';
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

  add(e) {
    this.serverRequest = $.get('http://localhost:5000/add', function (result) {
      this.refs.mytable.updateData();
    }.bind(this));
  }
  del(e) {
    var nodes = this.refs.mytable.selectedIds;
    if (nodes.length>0) {
      this.serverRequest = $.post('http://localhost:5000/del',{ nodes: nodes },function (result) {
        this.refs.mytable.updateData();
      }.bind(this),'json')
    }
  }
  edit(e) {
    var nodes = this.refs.mytable.selectedIds;
    if (nodes.length == 1) {
      this.refs.dialogEdit.updateData(nodes[0]);
      this.refs.dialogEdit.setState({open: true});
    }
  }
  updateTable() {
    this.refs.mytable.updateData();
  }
  render(){
    return (
        <MuiThemeProvider>
        <div>
          <NodeChips />
          <GraphExplorer ref='graph' filters={this.state.filters} startNodes={this.state.startNodes} theme='si' api={this.api}/>
        </div>
        </MuiThemeProvider>

    );
  }

}

GraphExplorerApp.defaultProps = { txt: 'button', result:''}

export default GraphExplorerApp
