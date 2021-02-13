const express = require('express')
const fs = require('fs');

const app = express();
const port = 8888;

const state = {
    "bots": {
        "inner": {
            "length": 0,
            "data": {}
        }
    },
    "lobbies": {
        "inner": {
            "length": 0,
            "data": {}
        }
    }
};

async function init() {
    state.bots = JSON.parse(await load_or_save_default('./store/bots.json', state.bots));
    state.lobbies = JSON.parse(await load_or_save_default('./store/lobbies.json', state.lobbies));
}

function wrap_async(task, res, status=400) {
    task.then(d => res.send(d)).catch(err => {
        res.status(status);
        res.send(err);
    });
}

async function load_or_save_default(file, def={}) {
    return await load_file(file)
        .catch(_ => save_file(file, JSON.stringify(def)));
}

function save_file(file, data) {
    return new Promise((resolve, reject) => {
        if(data instanceof Object) data = JSON.stringify(data);
        fs.writeFile(file, data,
            (err) => err && reject(err) || resolve(data));
    });
}

function load_file(file) {
    return new Promise((resolve, reject) => {
        fs.readFile(file, 'utf8',
            (err, data) => err && reject(err) || resolve(data));
    });
}

app.use(express.json());
async function setup_crud(app, url, file, state) {
    state.inner = JSON.parse(await load_or_save_default(file, state.inner));

    app.get(url, (req, res) => {
        res.json(state.inner.data);
    });

    app.post(url, async (req, res) => {
        const id = state.inner.length ++;
        const data = req.body;

        data["id"] = id;
        state.inner.data[id] = data;

        save_file(file, state.inner).then(() => console.log("saved " + file));
        res.json({"id": id});
    });


    app.delete(url+'/:id', (req, res) => {
        const id = req.params.id;
        const data = state.inner.data[id];

        if (!data) {
            res.status(404);
            res.send({"error": "Not found"});
            return;
        }

        delete state.inner.data[id];

        save_file(file, state.inner).then(() => console.log("saved"));

        res.json(data);
    });
}

app.get("/", (req, res) => {
    res.json(state)
});

(async function() {
    await setup_crud(app, '/bots', 'store/bots.json', state.bots);
    await setup_crud(app, '/lobbies', 'store/lobbies.json', state.lobbies);
    app.listen(port, () => {
        console.log(`>> Bot manager backend launched at port ${port}!`)
    });
})();
