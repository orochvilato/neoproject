from neo4j.v1 import GraphDatabase, basic_auth
from flask import Flask
from flask_cors import CORS
from flask import request
from py2neo import Graph
import json

#graph = Graph("http://localhost:7474/db/data/",password="olivier")
graph = Graph("http://neo4j.chilbp.fr:7474/db/data/",password="chilbp")

app = Flask(__name__)
CORS(app)

@app.route('/init')
def init():
    graph.run('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE r,n' )
    fruits = [
    'Apple', 'Apricot', 'Avocado',
    'Banana', 'Bilberry', 'Blackberry', 'Blackcurrant', 'Blueberry',
    'Boysenberry', 'Blood Orange',
    'Cantaloupe', 'Currant', 'Cherry', 'Cherimoya', 'Cloudberry',
    'Coconut', 'Cranberry', 'Clementine',
    'Damson', 'Date', 'Dragonfruit', 'Durian',
    'Elderberry',
    'Feijoa', 'Fig',
    'Goji berry', 'Gooseberry', 'Grape', 'Grapefruit', 'Guava',
    'Honeydew', 'Huckleberry',
    'Jabouticaba', 'Jackfruit', 'Jambul', 'Jujube', 'Juniper berry',
    'Kiwi fruit', 'Kumquat',
    'Lemon', 'Lime', 'Loquat', 'Lychee',
    'Nectarine',
    'Mango', 'Marion berry', 'Melon', 'Miracle fruit', 'Mulberry', 'Mandarine',
    'Olive', 'Orange',
    'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Physalis', 'Plum', 'Pineapple',
    'Pumpkin', 'Pomegranate', 'Pomelo', 'Purple Mangosteen',
    'Quince',
    'Raspberry', 'Raisin', 'Rambutan', 'Redcurrant',
    'Salal berry', 'Satsuma', 'Star fruit', 'Strawberry', 'Squash', 'Salmonberry',
    'Tamarillo', 'Tamarind', 'Tomato', 'Tangerine',
    'Ugli fruit',
    'Watermelon',
    ]
    for fruit in fruits:
        graph.run("CREATE (a:Fruit {name:'%s', title:'Fruit'})" % fruit)
    graph.run("MATCH (n) SET n:Label1")
    graph.run("MATCH (n) SET n:Label2")

    return "done"


# ALL LABELS
#MATCH (n)
#WITH DISTINCT labels(n) as labels
#UNWIND labels as label
#RETURN distinct label
#ORDER BY label


@app.route('/getNodesAndRelationships')
def getNodesAndRelationships():
    # where labels(n)<>['Network']
    nodeids = request.args.get('nodes')
    nodeids = nodeids.split(',') if nodeids else []
    print nodeids
    f = request.args.get('filters')

    filters = json.loads(f) if f else {}
    labels = filters.get('labels',[])
    types = filters.get('types',[])
    print labels,types
    # Relationships
    labelinclude = []
    whereclause = []
    from string import Template
    for label in labels:
        if label[0]=='~':
            whereclause.append('(not "%s" in LABELS(n))' % label[1:])
        else:
            labelinclude.append(':%s' % label)

    labelinc_q = "".join(labelinclude)
    relwhere = list(whereclause)
    if len(nodeids)>0:
        relwhere.append('(ID(n) in [%s])' % ','.join(nodeids))
    where_q = " WHERE %s" % ' AND '.join(relwhere) if relwhere else ''

    nodematch = "MATCH (n%s)%s" % (labelinc_q,where_q)
    relinclude = []
    relexclude = []
    for t in types:
        if t[0]=='~':
            relexclude.append('(TYPE(r)<>"%s")' % t[1:])
        else:
            relinclude.append(':%s' % t)

    relinc_q = "".join(relinclude)
    relexc_q = " WHERE %s" % ' AND '.join(relexclude) if relexclude else ''
    nodematch = "MATCH (n%s)%s" % (labelinc_q,where_q)
    relquery = nodematch + " MATCH (n)-[r%s]->(m)%s RETURN ID(n) as from,ID(r) as id,type(r) as type,r as properties,ID(m) as to" % (relinc_q,relexc_q);
    relquery += " UNION "+ nodematch + " MATCH (m)-[r%s]->(n)%s RETURN ID(m) as from,ID(r) as id,type(r) as type,r as properties,ID(n) as to" % (relinc_q,relexc_q);
    print relquery
    relationships = graph.run(relquery).data()

    if len(nodeids)>0:
        nodeids += list(set([str(r['from']) for r in relationships] + [str(r['to']) for r in relationships]))

    nodewhere  = list(whereclause)
    if len(nodeids)>0:
        nodewhere.append('(ID(n) in [%s])' % ','.join(nodeids))

    where_q = " WHERE %s" % ' AND '.join(nodewhere) if nodewhere else ''
    # Nodes
    nodematch = "MATCH (n%s)%s" % (labelinc_q,where_q)
    nodequery = nodematch + " RETURN ID(n) as id,n,labels(n) as labels"
    print nodequery
    nodes = graph.run(nodequery).data()
    for node in nodes:
        node['n'].update({'id':node['id'],'labels':node['labels']})



    return json.dumps({'nodes':[ node['n'] for node in nodes],'relationships':relationships})

@app.route('/getNode/<int:node_id>')
def getNode(node_id):
    query = "START n=node({node_id}) RETURN n,labels(n) as labels"
    return json.dumps(graph.run(query,{'node_id':node_id}).data()[0])

@app.route('/saveNode/<int:node_id>',methods=['GET','POST'])
def saveNode(node_id):
    node = request.get_json(force=True)
    operations = ['START n=node({node_id})','SET n = {props}']
    for label in node['labels']:
        if 'change' in label.keys():
            op = "REMOVE" if label['change']=='del' else "SET"
            operations.append("%s n:%s" % (op,label['label']))

    cypher = ' '.join(operations)
    graph.run(cypher,{'node_id':node_id,'props':node['n']});
    #graph.run('START n=node(%s) OPTIONAL MATCH (n)-[r]-() DELETE r,n' % nodelist)
    return json.dumps({'result':'done'})


@app.route('/add')
def add():
    graph.run("CREATE (a:Fruit {name:'Arthur', title:'King'})")
    return 'done'

@app.route('/del',methods=['POST'])
def delete():
    nodelist = ",".join(node for node in request.form.getlist('nodes[]'))
    print "delete nodes :%s" % nodelist
    graph.run('START n=node(%s) OPTIONAL MATCH (n)-[r]-() DELETE r,n' % nodelist)
    return json.dumps({'result':'done'})

#START n=node(1916)
#OPTIONAL MATCH n-[r]-()
#DELETE r, n;

@app.route('/')
def index():
    return 'index'

@app.route('/search')
def search():
    query ="""MATCH (a) WHERE a.name =~ '(?i).*%s.*' RETURN ID(a) as id, a.name AS name, a.title AS title""" % request.args.get('term','')
    return json.dumps(graph.run(query).data())


if __name__ == "__main__":
    app.run(debug=True,host='0.0.0.0')
