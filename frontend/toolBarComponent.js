import React from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import AutoComplete from 'material-ui/AutoComplete';


const dataSource1 = [];

export default class ToolBar extends React.Component {

  constructor(props) {
    super(props);
    this.graphSelectNode = props.selectNode;
    this.nodes = {};
    this.state = {
      value: 3,
      data:dataSource1
    };
  }
  updateNodeList(nodes) {
    for (var i=0;i<nodes.length;i++) {
      this.nodes[nodes[i].label] = nodes[i].id;
    }
    var nodelist = nodes.map(function(node) {
      if (node.className != undefined) {
        var icon = (<FontIcon
           className={node.className}
           color={node.focus} />);
      } else {
        var icon;
      }

      return ({
        text: node.label,
        id: node.id,
        value : (
          <MenuItem
            leftIcon = {icon}
            primaryText={node.label}
          />
        )
      })
    });
    this.setState({data:nodelist});

  }


  selectNode(n) {
    console.log(n);
    if (typeof n === 'string') {
      if (n in this.nodes) {
        this.graphSelectNode(this.nodes[n]);
      }
    } else {
      this.graphSelectNode(n.id);
    }
    const autocomplete = this._autocomplete;
    setTimeout(_ => { autocomplete.setState({ searchText: '' }); }, 500);
  }
  render() {
    return (
      <Toolbar>
        <ToolbarGroup>
          <AutoComplete
            ref={(c) => this._autocomplete = c}
            hintText="Rechercher"
            filter={AutoComplete.fuzzyFilter}
            maxSearchResults={5}

            dataSource={this.state.data}
            onNewRequest={this.selectNode.bind(this)}

          />
        </ToolbarGroup>

      </Toolbar>
    );
  }
}
