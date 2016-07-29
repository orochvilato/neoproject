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
    this.lasthoveredge = undefined;
    this.filters = props.filters || { labels:['~WLAN','~Network','~Promox Cluster'], types:['~A_POUR_PASSERELLE','~A_POUR_NODE'] };
    const {identifier} = this.props;
    this.updateGraph = this.updateGraph.bind(this);
    this.graph = { };
    this.fullgraph = { nodes:new vis.DataSet(), edges:new vis.DataSet()};
    this.startNodes = this.props.startNodes;
    this.expandedNodes = [];
    this.path = {};
    theme = require('./graphthemes/'+this.props.theme)
    this.graphProps = theme.graphProps;
    this.state = {
      graph: this.graph,
      hierarchicalLayout: false,
      identifier : identifier ? identifier : uuid.v4(),
      style:this.props.style
    };
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
  mergearrays(a1,a2) {

    for (var i=0; i<a2.length; i++) {
      if (a1.indexOf(a2[i])<0) {
        a1.push(a2[i]);
      }
    }

  }

  loadFullGraph() {
    console.log('loadFullGraph()');
    this.serverRequest = $.getJSON(this.api + '/getNodesAndRelationships?filters=' + JSON.stringify(this.filters),
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

        this.fullgraph.nodes.update(nodes);
        this.fullgraph.edges.update(edges);
        this.graph = { nodes:new vis.DataSet(this.fullgraph.nodes.get()), edges:new vis.DataSet(this.fullgraph.edges.get()) };
        this.updateGraph();
      }.bind(this));
  };


  updateChips() {
    var chips = [];
    for (var nid in this.path) {
      chips.push(this.path[nid]);
    }
    this.props.chips(chips);
  }
  deleteFromPath(nodeid) {
    delete this.path[nodeid]
    console.log(this.path);
    this.buildGraph();

  }
  updatePath(path) {
    this.path = path;
    this.buildGraph();
  }

  componentDidMount() {
    console.log("componentDidMount");
    //this.updateGraphData(this.startNodes);
    this.loadFullGraph();

  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
    this.updateGraph();
  }

  changeMode(event) {
    console.log("changeMode");
    this.setState({hierarchicalLayout: !this.state.hierarchicalLayout});
    this.updateGraph();
  }

  buildGraph() {
    console.log('buildGraph, path:',this.path);
    var nodes = [];
    var edges = [];
    // first pass
    for (var nid in this.path) {
      var n = this.path[nid];
      console.log("n ",n," nid ",nid);
      nodes.push(this.fullgraph.nodes.get(nid));
      if (n.expand === true) {
        var expand_edges = this.fullgraph.edges.get().filter(function (edge) {
          return edge.from === n.id || edge.to === n.id;
        });
        var expand_nodes = expand_edges.map(function(edge) {
          if (edge.from === n.id) {
            return edge.to
          } else {
            return edge.from
          };
        });
        console.log('enodes ',expand_nodes,', eedges ',expand_edges);
        nodes = nodes.concat(this.fullgraph.nodes.get(expand_nodes).filter(function (node) { return node != null }));
        console.log('nodes ',nodes)
      }
    }
    // second pass
    var nodeids = nodes.map(function(node) { return node.id; });
    var pathids = Object.keys(this.path).map(function(k) { return this.path[k].id; }.bind(this));
    edges = edges.concat(this.fullgraph.edges.get().filter(function (edge) {
      return nodeids.indexOf(edge.from)>=0 || nodeids.indexOf(edge.to)>=0;
    }).map(function (edge) {
      if ((pathids.indexOf(edge.from)<0) && (pathids.indexOf(edge.to)<0)) {
        edge.label = "";
        console.log(pathids,'bingo',edge);
      }
      return edge;
    }));
    var edgeids = edges.map(function(edge) { return edge.id; });

    var nodes_remove = this.graph.nodes.get().filter(function(node) {
      return nodeids.indexOf(node.id)<0;
    });
    var edges_remove = this.graph.edges.get().filter(function(edge) {
      return edgeids.indexOf(edge.id)<0;
    });
    var current_nodeids = this.graph.nodes.get().map(function(node) { return node.id});
    var current_edgeids = this.graph.nodes.get().map(function(edge) { return edge.id});

    var nodes_add = nodes // nodes.filter(function(node) { return current_nodeids.indexOf(node.id)<0; });
    var edges_add = edges // edges.filter(function(edge) { return current_edgeids.indexOf(edge.id)<0; });

    this.graph.nodes.remove(nodes_remove);
    this.graph.edges.remove(edges_remove);
    this.graph.nodes.update(nodes_add);
    this.graph.edges.update(edges_add);
    //this.graph.nodes.update(nodes);
    //this.graph.edges.clear();
    //this.graph.edges.update(edges);
    this.network.fit();

    console.log('nodes:', nodes, 'edges:', edges);
  }
  updateGraph() {
    console.log("updateGraph")
    let container = document.getElementById(this.state.identifier);
    let options = {
      interaction:{hover:false},
      nodes: {
        shadow: false
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

    //new vis.Network(container, this.props.graph, options);
    console.log("Build network");
    this.network = new vis.Network(container, this.graph, options);
    console.log("Build network - done");
    this.network.on("hold", function (params) {
      if (params.nodes.length>0) {
        var nid = params.nodes[0];
        var n = this.graph.nodes.get(nid);
        if (nid in this.path) {
          this.path[nid].expand =  !this.path[nid].expand;
        } else {
          this.path[nid] = {id:nid, label:n.label, key:nid, expand:true };
        }
        this.buildGraph();
        this.updateChips();
      }
    }.bind(this));
    this.network.on("selectNode", function (params) {
      this.props.info(this.fullgraph.nodes.get(params.nodes).map(function(node) { return node.data; }));
    }.bind(this))
    this.network.on("deselectNode", function (params) {
      if (params.nodes.length==0) {
        this.props.info([],false);
      }
      console.log('deselectNode',params);
    }.bind(this))

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
