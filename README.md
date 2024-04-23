<img src="https://user-images.githubusercontent.com/1423657/218816262-e0e8d7ad-44d0-4a7d-9497-0d383ed78b83.png" height=150>

# grafana-flow
Grafana 10+ Flow Diagram Visualization plugin

<img src="https://user-images.githubusercontent.com/1423657/259414028-ce4c8603-be1f-4ca9-a0fa-556d84c5660c.gif">

> Designed for [hepic](https://hepic.cloud), [homer](https://sipcapture.org) and [qryn](https://qryn.dev) integrations


## Status

- Fully Functional releases available for testing.
- Work in Progress. Please provide feedback and report any issues.

## Usage
### Installation
Allow and Install the unsigned plugin, ie:
```
- GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS=qxip-flow-panel
- GF_INSTALL_PLUGINS=https://github.com/metrico/grafana-flow/releases/download/v10.1.1/qxip-flow-panel-10.1.1.zip;qxip-flow-panel"
```

### Panel Options

![image](https://github.com/metrico/grafana-flow/assets/1423657/788ceb63-735b-4148-98c0-bf52a10d94c0)



<!--
## Development

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

-->
