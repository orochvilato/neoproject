import React from 'react';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField';

const styles = {
  drawerContent: {
    padding: '20px',
  },
};
export default class InfoDrawer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "Info",
      data: []
    };
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  nodeInfo(node) {
    var items = [];
    for (var k in node) {
      items.push((
        <TextField
          multiLine={true}
          rows={1}
          rowsMax={4}
          value={node[k]}
          floatingLabelText={k}
          floatingLabelFixed={true} />
      ))
    }
    return items;
  }
  render() {

    return (
      <div>
        <Drawer width={300} openSecondary={true} open={this.state.open} >
          <AppBar title={this.state.title} />
          <div style={styles.drawerContent}>
          { this.state.data.map(function(node) { return this.nodeInfo(node); }.bind(this)) }
          </div>
        </Drawer>
      </div>
    );
  }
}
