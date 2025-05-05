# Grafana-flow


the application works as follows. when initialized in the grafana settings.
- grafana makes a request to datasource,
- after that it returns the data to the flow component
- the flow component parses the data and displays it
- the component settings on the panel are (filter) of the already received data.

LOKI - provides data as an object with LABEL keys. by which the component is oriented. if they are not there, the component cannot work.

and LOKI also passes the MESSAGE field, which contains the message details.

each time grafana makes a request to datasource, the response updates the component display for


> ### dev: install & run

```bash
.> git clone https://github.com/metrico/grafana-flow

.> cd ./grafana-flow

./grafana-flow> npm install

./grafana-flow> cd ./ngx-flow

./grafana-flow/ngx-flow> npm install

./grafana-flow/ngx-flow> cd ..

./grafana-flow> npm run build:component

./grafana-flow> npm run dev

```

after that open up seccond terminal window and run server

```bash 
./grafana-flow> npm run server
```

> ### local enviroument
```
OS: Windows 11

> npm -v
10.9.2

> node -v
v22.14.0
```