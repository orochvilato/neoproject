exports.hasLabel = function(node,label) { return node.labels.indexOf(label)>=0; }
exports.isType = function(edge,etype) { return edge.type === etype;}

const colors = {
  User: '#03A9F4',
  User1: '#81D4FA',
  VM1: '#80CBC4',
  VM: '#009688',
  Storage: '#FF9800',
  Storage1: '#FFCC80',
  Network: '#4CAF50',
  Network1: '#A5D6A7',
  Wifi: '#673AB7',
  Wifi1: '#CE93D8'
};

exports.graphProps = {
  node: [
    { e:'theme.hasLabel(node,"PC")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf108',
                size: 40,
                focus: colors.User,
                unfocus: colors.User1,
              }}},
    { e:'theme.hasLabel(node,"VM")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 35,
                focus: colors.VM,
                unfocus: colors.VM1

              }}},
    { e:'theme.hasLabel(node,"Proxmox Node")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 45,
                focus: colors.VM,
                unfocus: colors.VM1
              }}},
    { e:'theme.hasLabel(node,"Storage")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf1c0',
                size: 40,
                focus: colors.Storage,
                unfocus: colors.Storage1 // orange
              }}},
    { e:'theme.hasLabel(node,"Switch")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf0e8',
                size: 40,
                focus: colors.Network,
                unfocus: colors.Network1
              }}},
    { e:'theme.hasLabel(node,"WIFI")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf1eb',
                size: 40,
                focus: colors.Wifi,
                unfocus: colors.Wifi1
              }}},

  ],
  edge: [
    { e:'theme.isType(edge,"CONNECTE_A")', props: { unselectedLabel:'""',selectedLabel: 'edge.properties.port || ""',color: 'theme.colors.Network'}},
    { e:'theme.isType(edge,"EST_PILOTE_PAR")', props: { unselectedLabel:'""',selectedLabel: '""',color: 'theme.colors.Wifi'}},
    { e:'theme.isType(edge,"A_POUR_DISQUE")', props: { unselectedLabel:'""', selectedLabel: 'edge.properties.name', color: 'theme.colors.Storage'}},
    { e:'theme.isType(edge,"A_POUR_HOTE")', props: { unselectedLabel:'""', selectedLabel: 'edge.properties.vmid',color: 'theme.colors.VMHost'}}
  ]
};

exports.colors = colors;
