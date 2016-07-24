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
    this.graph = { nodes:new vis.DataSet(), edges:new vis.DataSet() };
    this.startNodes = this.props.startNodes;
    this.expandedNodes = [];
    this.path = [];
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
      if (eval(this.graphProps.node[i].e)) {
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
      if (eval(this.graphProps.edge[i].e)) {
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
  updateGraphData(explorenodes) {
    this.serverRequest = $.getJSON(this.api + '/getNodesAndRelationships?nodes='+explorenodes.join(',')+'&filters=' + JSON.stringify(this.filters),
      function (data) {


        console.log('path:',this.path);
        var keepnodes = this.path.concat([]);
        var knodes = this.graph.nodes.get(keepnodes);
        if (knodes[0] != undefined) {
          var nodes = knodes.map(function(node) {
            console.log(node);
            return { id: node.id, label: node.label, focus: node.focus, unfocus: node.unfocus }
          });
        } else {
          var nodes = [];
        }



        for (var i = 0; i < data.nodes.length; i++) {

          var node = new Object({
            id: data.nodes[i].id,
            label: data.nodes[i].name,
            shape: 'dot',
            size: 20,
            borderWidth: 2
          });
          keepnodes.push(node.id);
          var props = this.getNodeProps(data.nodes[i]);

          for (var key in props) {
            node[key]= JSON.parse(JSON.stringify(props[key]));
          }

          nodes.push(node);



        }


        var edges = [];
        for (var i = 0; i < data.relationships.length; i++) {
          var edge = {  id: data.relationships[i].id,
                  from: data.relationships[i].from,
                   to: data.relationships[i].to,
                   font: { align: 'bottom'},
                   arrows:'to:{scaleFactor:0.05}' };

          var props = this.getEdgeProps(data.relationships[i]);

          if (props.unselectedLabel != undefined) {
            edge.label = props.unselectedLabel;
          } else {
            edge.label = data.relationships[i].type;
          }
          for (var key in props)
            edge[key] = props[key];
          edges.push(edge);
        }

        this.mergearrays(this.path,explorenodes);
        //this.path = this.path.concat(explorenodes);

        for (var i = 0; i < nodes.length; i++) {

          if (nodes[i].icon != undefined) {
            if (this.path.indexOf(nodes[i].id)<0) {
              nodes[i].icon.color = nodes[i].unfocus;
            } else {
              nodes[i].icon.color = nodes[i].focus;
            }
          }
        }




        this.graphKeepNodes(keepnodes);
        this.graph.nodes.update(nodes);
        this.graph.edges.update(edges);
        //this.network.selectNodes(explorenodes);
        this.updateChips();

      }.bind(this));
  };
  updateChips() {
    var nodes = this.graph.nodes.get(this.path);
    if (nodes[0] != undefined) {
      var chips = nodes.map(function (node) { return {key:node.id, id:node.id, label:node.label}});
      this.props.chips(chips);
    }
  }
  updatePath(path) {
    this.path = path;
    this.graphKeepNodes(path);
  }
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
      interaction:{hover:true},
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

    this.network.on("blurEdge", function (params) {
      //var edge = this.graph.edges.get(params.edge);
      //this.graph.edges.update({id: edge.id, label: ' '});
    }.bind(this));

    this.network.on("hoverEdge", function (params) {
      var edge = this.graph.edges.get(params.edge);
      if (this.lasthoveredge != undefined) {
        this.graph.edges.update({id: this.lasthoveredge.id , label: this.lasthoveredge.unselectedLabel});
      }
      this.graph.edges.update({id: edge.id, label: edge.selectedLabel});
      this.lasthoveredge = edge;
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
