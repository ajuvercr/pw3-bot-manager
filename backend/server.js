const express = require('express')
const fs = require('fs');
const validate = require('./validation');

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
    },
    "players": {
        "inner": {
            "length": 0,
            "data": {}
        }
    }
};

function bot_already_exists(bot) {
    for (let field in state.bots.inner.data) {
        const other = state.bots.inner.data[field];
        if (other.name === bot) {
            return `Bot with that name (${bot}) already exists.`
        }
    }
}

const botValidator = {
    "arguments": validate.array(validate.string()),
    "name": validate.and(validate.string(), validate.custom(bot_already_exists)),
    "id": validate.number()
};

const playerValidator = {
    "token": validate.string(),
    "botId": validate.number(),   // TODO add custom validator to see if bot is valid bot
    "lobbyId": validate.number(),
    "autoAccept": validate.boolean(),
    "startClient": validate.boolean(),
    "id": validate.number()
};

const lobbyValidator = {
    "id": validate.number(),
    "token": validate.and(validate.string(), validate.hex(64))
};

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
async function setup_crud(app, url, file, state, validator) {
    state.inner = JSON.parse(await load_or_save_default(file, state.inner));

    app.get(url, (req, res) => {
        res.json(state.inner.data);
    });

    app.post(url, async (req, res) => {
        const id = state.inner.length ++;
        const data = req.body;
        data["id"] = id; // Just overwrite

        const errors = validate(data, validator);
        if(errors.length > 0) {
            res.status(400);
            res.send(errors);
            return;
        }

        state.inner.data[id] = data;

        save_file(file, state.inner).then(() => console.log("saved " + file));
        res.json(data);
    });

    app.delete(url+'/:id', (req, res) => {
        const id = req.params.id;
        const data = state.inner.data[id];
        console.log(state.inner.data, id, data);

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
    await setup_crud(app, '/bots', 'store/bots.json', state.bots, botValidator);
    await setup_crud(app, '/lobbies', 'store/lobbies.json', state.lobbies, lobbyValidator);
    await setup_crud(app, '/players', 'store/players.json', state.players, playerValidator);
    app.listen(port, () => {
        console.log(`>> Bot manager backend launched at port ${port}!`)
    });
})();
