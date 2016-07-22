import React from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
var $ = require('jquery');


const styles = {
  propContainer: {
    width: 400,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};



export default class TableExampleComplex extends React.Component {

  constructor(props) {
    super(props);

    this.api = props.api;
    this.selectedIds = [];
    this.searchTerm = '';
    this.state = {
      allRowsSelected: false,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: false,
      showCheckboxes: true,
      height: '300px',
      tableData: [],
    };

  }
  updateData() {
    this.selectedIds = [];
    this.serverRequest = $.getJSON(this.api + '/search?term=' + this.searchTerm, function (rows) {
      this.setState({
        allRowsSelected: false,
        tableData: rows
      });
    }.bind(this));
  };
  search(e) {
    this.searchTerm = e.target.value;
    this.updateData();
  }
  componentDidMount() {
    this.updateData();
  };
  componentWillUnmount() {
    this.serverRequest.abort();
  };

  handleToggle(event, toggled) {
    this.setState({
      [event.target.name]: toggled,
    });
  };

  handleChange(event) {
    this.setState({height: event.target.value});
  };
  onRowSelection(keys) {
    var ids = [];
    if (keys==="all") {
      for (var i=0; i<this.state.tableData.length; i++) {
        ids.push(this.state.tableData[i].id);
      }
    } else if (keys!=='none') {
      for (var i=0; i<keys.length; i++) {
        ids.push(this.state.tableData[keys[i]].id);
      }
    }
    this.selectedIds = ids;

  };

  render() {
    return (
      <div>
        <TextField
          hintText="Hint Text"
          onChange={this.search.bind(this)}
        />
        <Table
          allRowsSelected={this.state.allRowsSelected}
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={this.onRowSelection.bind(this)}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
          >
            <TableRow>
              <TableHeaderColumn colSpan="3" tooltip="Super Header" style={{textAlign: 'center'}}>
                Super Header
              </TableHeaderColumn>
            </TableRow>
            <TableRow>
              <TableHeaderColumn tooltip="The ID">ID</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Name">Name</TableHeaderColumn>
              <TableHeaderColumn tooltip="The Title">Title</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.tableData.map( (row, index) => (
              <TableRow key={index} selected={row.selected}>
                <TableRowColumn>{row.id}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn>{row.title}</TableRowColumn>
              </TableRow>
              ))}
          </TableBody>
          <TableFooter
            adjustForCheckbox={this.state.showCheckboxes}
          >
            <TableRow>
              <TableRowColumn>ID</TableRowColumn>
              <TableRowColumn>Name</TableRowColumn>
              <TableRowColumn>Title</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                Super Footer
              </TableRowColumn>
            </TableRow>
          </TableFooter>
        </Table>

        <div style={styles.propContainer}>
          <h3>Table Properties</h3>
          <TextField
            floatingLabelText="Table Body Height"
            defaultValue={this.state.height}
            onChange={this.handleChange.bind(this)}
          />
          <Toggle
            name="fixedHeader"
            label="Fixed Header"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.fixedHeader}
          />
          <Toggle
            name="fixedFooter"
            label="Fixed Footer"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.fixedFooter}
          />
          <Toggle
            name="selectable"
            label="Selectable"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.selectable}
          />
          <Toggle
            name="multiSelectable"
            label="Multi-Selectable"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.multiSelectable}
          />
          <Toggle
            name="enableSelectAll"
            label="Enable Select All"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.enableSelectAll}
          />
          <h3 style={styles.propToggleHeader}>TableBody Properties</h3>
          <Toggle
            name="deselectOnClickaway"
            label="Deselect On Clickaway"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.deselectOnClickaway}
          />
          <Toggle
            name="stripedRows"
            label="Stripe Rows"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.stripedRows}
          />
          <Toggle
            name="showRowHover"
            label="Show Row Hover"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.showRowHover}
          />
          <h3 style={styles.propToggleHeader}>Multiple Properties</h3>
          <Toggle
            name="showCheckboxes"
            label="Show Checkboxes"
            onToggle={this.handleToggle.bind(this)}
            defaultToggled={this.state.showCheckboxes}
          />
        </div>
      </div>
    );
  }
}
