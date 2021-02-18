# pw3-bot-manager

This is intended to work together with [pw3-moz2](https://github.com/iasoon/pw3-moz2).


## Setup

```
npm install
cd backend
npm install
```

## Start

### Start backend
```
cd pw3-moz2
cargo run --bin server
```

### Start frontend
```
cd pw3-frontend
npm run dev         # after npm install ofcourse
```

### Start client backend with addresses of previous started serversss
```
cd backend
npm run localhost:3000 localhost:8080
```

### Start client frontend
```
npm run dev
```

Profit


## Notes

This thing is the definition of fragile, handle with care.

Anything fails, try to remove `backend/store/*`.
