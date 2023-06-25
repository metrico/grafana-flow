# grafana-flow
Grafana Flow plugin for HEPIC, HOMER and QRYN


how to run DEMO (development mode):

---
1) enviroument:
 - OS: Windows (WSL2), linux or MacOS
 - Make sure node version should be [>= 16.x]

---
2) command action:
```
git clone https://github.com/metrico/grafana-flow.git
```
```
cd ./grafana-flow
```

```
npm install
```

run development mode of plugin for grafana

[1] run command on parallel terminal on same time
```
npm run dev
```

run docker-image of grafana

[2] run command on parallel terminal on same time
```
npm run server
```
run dev mode NGX-FLOW plugin (Angular Project)
[3] run command on parallel terminal on same time

```
cd ./ngx-flow

npm install

npm start
```


after all open link http://localhost:3000/ 

