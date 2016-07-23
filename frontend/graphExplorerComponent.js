import {default as React, Component} from 'react';
//import compileExpression from 'filtrex'
//var jsep = require("jsep");
const vis = require('vis');
const uuid = require('uuid');
var $ = require('jquery');
var theme = undefined;


class GraphExplorer extends Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.filters = props.filters || { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] };

    const {identifier} = this.props;

    this.updateGraph = this.updateGraph.bind(this);
    this.graph = { nodes:new vis.DataSet(), edges:new vis.DataSet() };
    this.startNodes = this.props.startNodes;
    this.expandedNodes = [];
    this.path = [];
    theme = require('./graphthemes/'+this.props.theme)
    this.graphProps = theme.graphProps;
    this.state = {
      graph: this.graph,
      hierarchicalLayout: true,
      identifier : identifier ? identifier : uuid.v4(),
      style:this.props.style
    };
  }
  getNodeProps(node) {
    var props = {};

    for (var i=0; i<this.graphProps.node.length; i++) {
      if (eval(this.graphProps.node[i].e)) {
        for (var key in this.graphProps.node[i].props) {
          props[key] = this.graphProps.node[i].props[key];
        }
      }
    }
    return props
  }
  getEdgeProps(edge) {
    var props = {};
    for (var i=0; i<this.graphProps.edge.length; i++) {
      if (eval(this.graphProps.edge[i].e)) {
        for (var key in this.graphProps.edge[i].props) {
          props[key] = eval(this.graphProps.edge[i].props[key]);
        }
      }
    }
    return props
  }

  updateGraphData(explorenodes) {
    this.serverRequest = $.getJSON(this.api + '/getNodesAndRelationships?nodes='+explorenodes.join(',')+'&filters=' + JSON.stringify(this.filters),
      function (data) {
        var nodes = [];
        for (var i = 0; i < data.nodes.length; i++) {
          var node = {
            id: data.nodes[i].id,
            label: data.nodes[i].name,
            shape: 'dot',
            size: 20,
            borderWidth: 2
          };

          var props = this.getNodeProps(data.nodes[i])
          for (var key in props) {
            node[key]= props[key];
          }
          nodes.push(node);
        }
        var edges = [];
        for (var i = 0; i < data.relationships.length; i++) {
          var edge = {  id: data.relationships[i].id,
                  from: data.relationships[i].from,
                   to: data.relationships[i].to,
                   font: { align: 'bottom'},
                   arrows:'to:{scaleFactor:0.2}' };

          var props = this.getEdgeProps(data.relationships[i]);

          if (props.unselectedLabel != undefined) {
            edge.label = props.unselectedLabel;
          } else {
            edge.label = data.relationships[i].type;
          }
          for (var key in props)
            edge[key] = props[key];
          edges.push(edge)
        }

        this.path =this.path.concat(explorenodes);
        console.log('path',this.path);
        var keepnodes = this.path.concat(nodes.map(function(node) { return node.id; }));

        this.graphKeepNodes(keepnodes);

        this.graph.nodes.update(nodes);
        this.graph.edges.update(edges);
        this.network.selectNodes(explorenodes);

      }.bind(this));
  };
  graphKeepNodes(keepnodes) {
    var removenodes = this.graph.nodes.get().filter(function(node) {
      return keepnodes.indexOf(node.id)<0;
    }).map(function(node) { return node.id;});

    this.graph.nodes.remove(removenodes);

  }
  componentDidMount() {
    this.updateGraphData(this.startNodes);
    this.updateGraph();
  }

  componentDidUpdate() {
    this.updateGraph();
  }

  changeMode(event) {
    this.setState({hierarchicalLayout: !this.state.hierarchicalLayout});
    this.updateGraph();
  }

  updateGraph() {
    let container = document.getElementById(this.state.identifier);
    let options = {
      nodes: {
        shadow: true
      },
      layout: {
        improvedLayout: true,
      }
    };

    if (this.state.hierarchicalLayout) {
      options.layout.hierarchical = {
        enabled: true,
        direction: 'UD',
        levelSeparation: 100,
        nodeSpacing: 1,
        blockShifting: true,
        edgeMinimization: true,
        sortMethod: 'hubsize'
      };
    } else {
      options.layout.hierarchical = {
        enabled: false
      };
    }
    options = {
      layout: {
        improvedLayout: false,
      }
    }
    //new vis.Network(container, this.props.graph, options);
    this.network = new vis.Network(container, this.state.graph, options);

    this.network.on("select", function (params) {
      console.log(params,this.expandedNodes,params.nodes[0]);
      if (this.expandedNodes.indexOf(params.nodes[0])>=0) {
        this.graphKeepNodes(this.path);
        this.network.unselectAll();
        this.expandedNodes = [];
      } else {
        console.log('update');
        this.updateGraphData(params.nodes);
        this.expandedNodes = params.nodes;
      }

    }.bind(this));

    this.network.on("selectEdge", function (params) {

    }.bind(this));

    this.network.on("deselectNode", function (params) {

    }.bind(this));

    this.network.on("deselectEdge", function (params) {

    }.bind(this));
  }

  render() {
    const {identifier,style} = this.state;
    return React.createElement('div', { id: identifier, style}, identifier); //onDoubleClick: this.changeMode.bind(this),
  }
}
//GraphExplorer.propTypes = {
//
//}
GraphExplorer.defaultProps = {
  style: {width: '100%', height: '800px'}
};

export default GraphExplorer;
