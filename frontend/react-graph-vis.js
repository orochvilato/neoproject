import {default as React, Component} from 'react';
//import compileExpression from 'filtrex'
//var jsep = require("jsep");
const vis = require('vis');
const uuid = require('uuid');
var $ = require('jquery');

function hasLabel(node,label) { return node.labels.indexOf(label)>=0; }
function isType(edge,etype) { return edge.type === etype;}
const colors = {
  User: '#03A9F4',
  VMHost: '#009688',
  VM: '#4DB6AC',
  Storage: '#FF9800',
  Network: '#4CAF50',
  Wifi: '#673AB7'
};
const graphProps = {
  node: [
    { e:'hasLabel(node,"PC")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf108',
                size: 40,
                color:colors.User
              }}},
    { e:'hasLabel(node,"VM")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 35,
                color:colors.VM
              }}},
    { e:'hasLabel(node,"Proxmox Node")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 40,
                color:colors.VMHost
              }}},
    { e:'hasLabel(node,"Storage")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf1c0',
                size: 40,
                color: colors.Storage // orange
              }}},
    { e:'hasLabel(node,"Switch")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf0e8',
                size: 40,
                color: colors.Network
              }}},
    { e:'hasLabel(node,"WIFI")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf1eb',
                size: 40,
                color: colors.Wifi
              }}},

  ],
  edge: [
    { e:'isType(edge,"CONNECTE_A")', props: { label: 'edge.properties.port || ""',color: 'colors.Network'}},
    { e:'isType(edge,"EST_PILOTE_PAR")', props: { label: '""',color: 'colors.Wifi'}},
    { e:'isType(edge,"A_POUR_DISQUE")', props: { label: 'edge.properties.name', color: 'colors.Storage'}},
    { e:'isType(edge,"A_POUR_HOTE")', props: { label: 'edge.properties.vmid',color: 'colors.VMHost'}}
  ]
};

class Graph extends Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.filters = props.filters || { labels:['~WLAN','~Network'], types:['~A_POUR_PASSERELLE'] };
    this.data = {
      nodes: [
          {id: 1, label: 'Node 1', group: 0},
          {id: 2, label: 'Node 2', group: 2},
          {id: 3, label: 'Node 3', group: 1},
          {id: 4, label: 'Node 4', group: 1},
          {id: 5, label: 'Node 5', group: 0}
        ],
      edges: [
          {from: 1, to: 2},
          {from: 1, to: 3},
          {from: 2, to: 4},
          {from: 2, to: 5}
        ]
    };
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.state = {
      graph:{ nodes:[], edges:[]},
      hierarchicalLayout: true,
      identifier : identifier ? identifier : uuid.v4(),
      style:this.props.style
    };
  }
  getNodeProps(node) {
    var props = {};

    for (var i=0; i<graphProps.node.length; i++) {
      if (eval(graphProps.node[i].e)) {
        for (var key in graphProps.node[i].props) {
          props[key] = graphProps.node[i].props[key];
        }
      }
    }
    return props
  }
  getEdgeProps(edge) {
    var props = {};
    for (var i=0; i<graphProps.edge.length; i++) {
      if (eval(graphProps.edge[i].e)) {
        for (var key in graphProps.edge[i].props) {
          props[key] = eval(graphProps.edge[i].props[key]);
        }
      }
    }
    return props
  }
  updateGraphData() {
    this.serverRequest = $.getJSON(this.api + '/getNodesAndRelationships?filters=' + JSON.stringify(this.filters),
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
          var edge = { from: data.relationships[i].from,
                   to: data.relationships[i].to,
                   label: data.relationships[i].type,
                   font: { align: 'bottom'},
                   arrows:'to:{scaleFactor:0.2}' };

          var props = this.getEdgeProps(data.relationships[i]);
          for (var key in props)
            edge[key] = props[key];
          edges.push(edge)
        }
        this.setState({
          graph:{ nodes:nodes, edges: edges}
        });
      }.bind(this));
  };

  componentDidMount() {
    this.updateGraphData();
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
        improvedLayout: false,
      }
    };

    if (this.state.hierarchicalLayout) {
      options.layout.hierarchical = {
        enabled: true,
        direction: 'UD',
        levelSeparation: 100,
        nodeSpacing: 1
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
    new vis.Network(container, this.state.graph, options);
  }

  render() {
    const {identifier,style} = this.state;
    return React.createElement('div', {onDoubleClick: this.changeMode.bind(this), id: identifier, style}, identifier);
  }
}

Graph.defaultProps = {
  graph: {},
  style: {width: '100%', height: '800px'}
};

export default Graph;
