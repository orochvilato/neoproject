import React from 'react';
import Chip from 'material-ui/Chip';

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
    this.updateGraph();
  };
  setChips(chips) {
    console.log(chips);
    this.setState({chipData:chips});
  }
  updateGraph() {
    this.props.updateGraph(this.state.chipData.map(function(chip) { return chip.id}));
  }
  renderChip(data) {
    return (
      <Chip
        key={data.key}
        onRequestDelete={ this.handleRequestDelete.bind(this,data.key) }
        style={this.styles.chip}
      >
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
