# pw3-bot-manager


## Setup

```
cd frontend
npm install
cd ../backend
npm install
```


## Start

### Start frontend

```
cd pw3-frontend
npm run dev
```


### Start client backend with addresses of previous started servers

For local development also start [pw3-moz2](https://github.com/iasoon/pw3-moz2). Http server is localhost:3000, bot server is localhost:8080.

```
cd backend
npm run <http_server> <bot_server>
```


### Start client frontend
```
npm run dev
```

Profit


## Notes

This thing is the definition of fragile, handle with care.

Anything fails, try to remove `backend/store/*`.
