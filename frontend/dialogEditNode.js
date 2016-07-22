import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ChipArray from './chipArrayComponent';

var $ = require('jquery');

export default class DialogEditNode extends React.Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.properties = {};
    this.state = {
      open: false,
      nodeid: null
    };
  }
  updateData(nodeid) {
    if (this.serverRequest) {
      this.serverRequest.abort();
    }
    this.properties = {};
    this.serverRequest = $.getJSON(this.api + '/getNode/' + nodeid, function (node) {
      this.properties = node['n'];
      this.refs.labels.setState({ chipData:node.labels.map(function(label,index) { return {key:index, label:label};})});
      this.serverRequest = null;
      this.setState({nodeid:nodeid});
      console.log(this.state);
    }.bind(this));
  }

  //componentWillUnmount() {
  //  this.serverRequest.abort();
  //};


  handleClose() {
    this.setState({open: false});
  };

  handleSave() {
    if (this.serverRequest) {
      return
    }
    var props = this.properties;
    var labels = this.refs.labels.state['chipData'];

    this.serverRequest = $.post(this.api + '/saveNode/' + this.state.nodeid, JSON.stringify({ n:props, labels:labels }), function (node) {
      this.serverRequest = null;
      this.setState({
        open: false
      });
      this.props.updateTable();
    }.bind(this),'json');
  }
  handleChange(event) {
    this.properties[event.target.name] = event.target.value;
  };

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleSave.bind(this)}
      />,
    ];

    const nodeFields = []
    for (var key in this.properties) {
      nodeFields.push(
        (<TextField
          key={key}
          name={key}
          floatingLabelText={key}
          defaultValue={this.properties[key]}
          onChange={this.handleChange.bind(this)}
        />)
      )
    }


    return (
      <div>
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
        { nodeFields }
        <ChipArray
          ref='labels'
          minChips={1}
        />
        </Dialog>
      </div>
    );
  }
}
