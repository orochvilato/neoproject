# neoproject

Install dev environment
-----------------------

```
  git clone https://github.com/orochvilato/neoproject.git
```

- In a terminal :
```
  virtualenv neoproject
  cd neoproject
  source bin/activate
  cd server
  pip install -r requirements.txt
  python server.py
```
- In 2nd terminal :
```
  cd neoproject/frontend
  npm install
  npm start
```

TODO
----

- handle edges (colors, labels show/hide on hover...)
- chip Component
- search Component
