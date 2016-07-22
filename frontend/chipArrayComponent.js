import React from 'react';
import Chip from 'material-ui/Chip';

/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
export default class ChipArray extends React.Component {

  constructor(props) {
    super(props);
    this.state = {chipData: []};
    this.minChips = props.minChips || 0;
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
    if (this.chipData.length > this.minChips) {
      this.chipData[key].change = 'del';
      //this.chipData.splice(chipToDelete, 1);
      this.setState({chipData: this.chipData});
    }

  };

  renderChip(data) {
    if (data.change === 'del') {
      return
    }
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
