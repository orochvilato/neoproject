import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TableExampleComplex from './tableComponent';
import DialogEditNode from './dialogEditNode';
import Graph from './react-graph-vis';

var data = {
  nodes: [
      {id: 1, label: 'Node 1'},
      {id: 2, label: 'Node 2'},
      {id: 3, label: 'Node 3'},
      {id: 4, label: 'Node 4'},
      {id: 5, label: 'Node 5'}
    ],
  edges: [
      {from: 1, to: 2},
      {from: 1, to: 3},
      {from: 2, to: 4},
      {from: 2, to: 5}
    ]
};


var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var $ = require('jquery');

class App extends React.Component {
  constructor() {
    super();
    this.api ='http://localhost:5000'
    this.state = { rows: []};
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
          <div>
          <Graph ref='graph' graph={data} api={this.api}/>
          <RaisedButton
            label="Edit"
            onTouchTap={this.edit.bind(this)} />

          <RaisedButton
            onTouchTap={this.add.bind(this)}
            label="Add" />

          <RaisedButton
            onTouchTap={this.del.bind(this)}
            label="Del" />
            </div>
          <DialogEditNode ref='dialogEdit' api={this.api} updateTable={this.updateTable.bind(this)} />
          <TableExampleComplex ref='mytable' api={this.api} />
        </div>

        </MuiThemeProvider>

    );
  }

}

App.defaultProps = { txt: 'button', result:''}

export default App
