import React from 'react';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
export default class NodeChips extends React.Component {

  constructor(props) {
    super(props);
    this.state = {chipData: [
    ]};
    this.styles = {
      smallIcon: {
        fontSize:'16px',
      },
      chip: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    };
  }

  handleRequestDelete(key) {
    this.chipData = this.state.chipData;
    const chipToDelete = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData.splice(chipToDelete, 1);
    this.setState({chipData: this.chipData});
    this.props.graphDeleteFromPath(key);
  };
  handleTouchTap(key) {
    this.chipData = this.state.chipData;
    const chip = this.chipData.map((chip) => chip.key).indexOf(key);
    this.chipData[chip].expand = !this.chipData[chip].expand;
    this.setState({chipData: this.chipData});
    var path = {}
    for (var i=0;i<this.chipData.length;i++) {
        path[this.chipData[i].id] = this.chipData[i];
    }
    this.props.graphUpdatePath(path);
  };
  setChips(chips) {
    console.log(chips);
    this.setState({chipData:chips});
  }

  renderChip(data) {
    if (data.expand) {
      var icon = "fullscreen_exit"
    } else {
      var icon = "fullscreen"
    }
    var fi = (
      <FontIcon className="material-icons">{icon}</FontIcon>
    )
    return (
      <Chip
        key={data.key}
        onRequestDelete={ this.handleRequestDelete.bind(this,data.key) }
        onTouchTap={ this.handleTouchTap.bind(this,data.key) }
        style={this.styles.chip}
      >
      <Avatar icon={fi} />
      {data.label}
      </Chip>
    );
  }

  render() {
    return (
      <div style={this.styles.wrapper}>
        {this.state.chipData.map(this.renderChip, this)}
      </div>
    );
  }
}
