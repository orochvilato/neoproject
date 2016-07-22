import React from 'react';
import {Table, Column, Cell} from 'fixed-data-table';
var $ = require('jquery');


const TextCell = ({rowIndex, data, col, ...props}) => {
  const { columnKey, ...rest } = props;
  return (
    <Cell {...props}>
      {data[rowIndex][col]}
      </Cell>
  );
}

class MyTable extends React.Component {

  constructor(props) {
    super(props);
    this.neo4j = props.neo;
    this.state = {
      rows : []
    };
  }

  componentDidMount() {
    this.serverRequest = $.getJSON(this.neo4j, function (rows) {
      this.setState({
        rows: rows
      });
    }.bind(this));
  }
  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {

      return <Table
        height={40+((this.state.rows.length+1) * 30)}
        width={600}
        rowsCount={this.state.rows.length}
        rowHeight={30}
        headerHeight={30}>
        <Column
          header={<Cell>Name</Cell>}
          cell={<TextCell data={this.state.rows} col='name' />}
          width={300}
        />
        <Column
          header={<Cell>Title</Cell>}
          cell={<TextCell data={this.state.rows} col='title' />}
          width={300}
        />
      </Table>;
  }
}

module.exports = MyTable;
