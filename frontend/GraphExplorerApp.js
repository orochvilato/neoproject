import React from 'react';
import ReactDom from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar'
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import Toggle from 'material-ui/Toggle';
import GraphExplorer from './graphExplorerComponent';
import NodeChips from './nodeChipsComponent';
import InfoDrawer from './infoDrawerComponent';
import ToolBar from './toolBarComponent';

var theme = undefined;

var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  grapharea: {
    float: 'left'

  },
  options: {
    width:'200px'
  }
};

var $ = require('jquery');

class GraphExplorerApp extends React.Component {
  constructor() {
    super();
    this.api ='http://129.184.121.208:5000'
    this.theme = 'si';
    theme = require('./graphthemes/'+this.theme)
    this.graphProps = theme.graphProps;
    this.state = {
       filters: { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] },
       startNodes: [],
       optionsDrawer : false
    };

  }
  componentDidMount() {
    console.log("componentDidMount");
    //this.updateGraphData(this.startNodes);
    this.loadFullGraph();

  }

  getNodeProps(node) {
    var props = {};

    for (var i=0; i<this.graphProps.node.length; i++) {
      var e = this.graphProps.node[i].e;
      if (node.labels.indexOf(e.label)>=0) {
        for (var key in this.graphProps.node[i].props) {
          props[key] = this.graphProps.node[i].props[key];
        }
      }
    }
    return props
  }
  getEdgeProps(edge) {
    var props = new Object();
    for (var i=0; i<this.graphProps.edge.length; i++) {
      var e = this.graphProps.edge[i].e;
      if (e.type === edge.type) {
        for (var key in this.graphProps.edge[i].props) {
          props[key] = eval(this.graphProps.edge[i].props[key]);
        }
      }
    }
    return props
  }
  loadFullGraph() {
    console.log('loadFullGraph()');
    this.serverRequest = $.getJSON(this.api + '/getNodesAndRelationships?filters=' + JSON.stringify(this.state.filters),
      function (data) {
        var nodes = [];
        console.log('request : nodes:',data.nodes.length,' edges:',data.relationships.length)
        for (var i = 0; i < data.nodes.length; i++) {
          var node = new Object({
            id: data.nodes[i].id,
            label: data.nodes[i].name,
            shape: 'dot',
            size: 20,
            borderWidth: 2,
            data: data.nodes[i]
          });
          var props = this.getNodeProps(data.nodes[i]);

          for (var key in props) {
            node[key]= JSON.parse(JSON.stringify(props[key]));
          }
          if (node.icon != undefined) {
              node.icon.color = node.unfocus;
          }
          nodes.push(node);
        }

        var edges = [];
        for (var i = 0; i < data.relationships.length; i++) {
          var edge = {  id: data.relationships[i].id,
                  from: data.relationships[i].from,
                   to: data.relationships[i].to,
                   font: { align: 'bottom', size:10, face:'roboto'},
                   arrows:'to:{scaleFactor:0.05}',
                   data: data.relationships[i]
                 };

          var props = this.getEdgeProps(data.relationships[i]);

          edge.label = data.relationships[i].type;

          for (var key in props)
            edge[key] = props[key];
          edges.push(edge);
        }
        this.updateGraphData(nodes,edges);
        this.toolBarUpdateNodeList(nodes);
      }.bind(this));
  };


  setChips(chips) {
    return this._nodechips.setChips(chips);
  }
  setInfo(data,open=true) {
    if (data.length>0) {
      var title = data[0].name;
    } else {
      var title = "Info";
    }
    return this._infodrawer.setState({data:data, title:title, open:open});
  }
  updateGraphData(nodes,edges) {
    return this._graph.updateGraphData(nodes,edges);
  }
  graphDeleteFromPath(nodeid) {
    return this._graph.deleteFromPath(nodeid);
  }
  graphUpdatePath(path) {
    return this._graph.updatePath(path)
  }
  toolBarUpdateNodeList(nodes) {
    return this._toolbar.updateNodeList(nodes);
  }
  graphAddNodeToPath(nodeid) {
    return this._graph.addToPath(nodeid);
  }
  toggleOptionsDrawer() {
    console.log('toggle');
    this.setState({optionsDrawer: !this.state.optionsDrawer});
  }
  render(){
    return (
        <MuiThemeProvider>
        <div style={styles.root}>
          <ToolBar
            ref={(c) => this._toolbar = c}
            selectNode = {this.graphAddNodeToPath.bind(this)}
          />
          <div style={styles.grapharea}>
            <NodeChips
              ref={(c) => this._nodechips = c}
              graphDeleteFromPath = {this.graphDeleteFromPath.bind(this)}
              graphUpdatePath = {this.graphUpdatePath.bind(this)} />
            <GraphExplorer
              ref={(c) => this._graph = c}
              startNodes={this.state.startNodes}
              chips={this.setChips.bind(this)}
              info={this.setInfo.bind(this)}
            />
          </div>
          <InfoDrawer
            ref={(c) => this._infodrawer = c}
          />
        </div>
        </MuiThemeProvider>

    );
  }

}

GraphExplorerApp.defaultProps = { }

export default GraphExplorerApp
