const express = require('express')
const fs = require('fs');
const validate = require('./validation');
const runtime = require('./runtime');

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

function bot_does_not_exist(bot) {
    for (let field in state.bots.inner.data) {
        const other = state.bots.inner.data[field];
        if (other.id === bot) {
            return;
        }
    }
    return `Bot does not exist.`
}

function lobby_does_not_exist(lobby) {
    for (let field in state.lobbies.inner.data) {
        const other = state.lobbies.inner.data[field];
        if (other.id === lobby) {
            return;
        }
    }
    return `Lobby does not exist.`
}


const botValidator = {
    "arguments": validate.array(validate.string()),
    "name": validate.and(validate.string(), validate.custom(bot_already_exists)),
    "id": validate.number()
};

const playerValidator = {
    "token": validate.and(validate.string(), validate.hex(64)),
    "botId": validate.and(validate.number(), validate.custom(bot_does_not_exist)),
    "lobbyId": validate.and(validate.number(), validate.custom(lobby_does_not_exist)),
    "autoAccept": validate.boolean(),
    "startClient": validate.boolean(),
    "id": validate.number()
};

const lobbyValidator = {
    "id": validate.number(),
    "token": validate.and(validate.string(), validate.hex(32))
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

const noop = () => {};
async function setup_crud(app, url, file, state, validator, hooks={}) {
    hooks.put = hooks.put || noop;
    hooks.get = hooks.get || noop;
    hooks.post = hooks.post || noop;
    hooks.delete = hooks.delete || noop;

    state.inner = JSON.parse(await load_or_save_default(file, state.inner));

    app.get(url, (req, res) => {
        res.json(state.inner.data);
        hooks.get(state, state.inner.data);
    });

    app.put(url+'/:id', async (req, res) => {
        const id = req.params.id;
        const data = req.body;

        const errors = validate(data, validator);
        if(errors.length > 0) {
            res.status(400);
            res.send(errors);
            return;
        }

        Object.assign(state.inner.data[id], data);

        save_file(file, state.inner);
        res.json(data);

        hooks.put(state, state.inner.data[id]);
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

        save_file(file, state.inner);
        res.json(data);

        hooks.post(state, state.inner.data[id]);
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

        save_file(file, state.inner);

        res.json(data);
        hooks.delete(state, data);
    });
}

app.get("/", (req, res) => {
    res.json(state)
});

const log_hooks = {
    "get": (_, d) => console.log('get', d),
    "put": (_, d) => console.log('put', d),
    "post": (_, d) => console.log('post', d),
    "delete": (_, d) => console.log('delete', d),
};

const check_auto_accept = function(_, bot) {
    console.log(state);
    const lobbyId = state.lobbies.inner.data[bot.lobbyId].token;
    const name = state.bots.inner.data[bot.botId].name;
    const argv = state.bots.inner.data[bot.botId].arguments;
    runtime.set_auto_accept(bot.autoAccept, name, lobbyId, bot.token);

    runtime.set_start_bot(bot.startClient, bot.token, argv, lobbyId);
}
const hooks = {
    "post": check_auto_accept,
    "put": check_auto_accept,
};

if(process.argv.length < 4) {
    console.error(`Please use as ${process.argv[0]} ${process.argv[1]} <web_server> <bot_server>`);
    console.error(`Like ${process.argv[0]} ${process.argv[1]} localhost:3000 localhost:8080`);

    process.exit(1);
}

runtime.init("http://"+process.argv[2]+"/api", "ws://" + process.argv[2] +"/websocket", "ws://"+process.argv[3]);


(async function() {
    await setup_crud(app, '/bots', 'store/bots.json', state.bots, botValidator, log_hooks);
    await setup_crud(app, '/lobbies', 'store/lobbies.json', state.lobbies, lobbyValidator, log_hooks);
    await setup_crud(app, '/players', 'store/players.json', state.players, playerValidator, hooks);
    app.listen(port, () => {
        console.log(`>> Bot manager backend launched at port ${port}!`)
    });

})();
