exports.hasLabel = function(node,label) { return node.labels.indexOf(label)>=0; }
exports.isType = function(edge,etype) { return edge.type === etype;}

const colors = {
  User: '#03A9F4',
  VMHost: '#009688',
  VM: '#4DB6AC',
  Storage: '#FF9800',
  Network: '#4CAF50',
  Wifi: '#673AB7'
};

exports.graphProps = {
  node: [
    { e:'theme.hasLabel(node,"PC")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf108',
                size: 40,
                color: colors.User
              }}},
    { e:'theme.hasLabel(node,"VM")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 35,
                color: colors.VM
              }}},
    { e:'theme.hasLabel(node,"Proxmox Node")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf233',
                size: 40,
                color: colors.VMHost
              }}},
    { e:'theme.hasLabel(node,"Storage")', props: { shape: 'icon',icon: {
                face: 'FontAwesome',
                code: '\uf1c0',
                size: 40,
                color: colors.Storage // orange
              }}},
    { e:'theme.hasLabel(node,"Switch")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf0e8',
                size: 40,
                color: colors.Network
              }}},
    { e:'theme.hasLabel(node,"WIFI")', props: { shape: 'icon', icon: {
                face: 'FontAwesome',
                code: '\uf1eb',
                size: 40,
                color: colors.Wifi
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
