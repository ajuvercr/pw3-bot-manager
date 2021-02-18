const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function setupWS(url) {
    return new Promise(resolve => {
        const socket = new WebSocket(url);

        socket.onopen = (ev) => {
            console.log('ws connected')
            resolve(socket);
        }
    })
}

const axios = require('axios');
const WebSocket = require('ws');

const settings = {};


module.exports.init = function(http_server, ws_server, bot_ws_server){
    settings.http_server = http_server;
    settings.ws_server = ws_server;
    settings.bot_ws_server = bot_ws_server;
}

class BotAcceptor {
    constructor(name, lobbyToken, botToken) {
        if(!(settings.ws_server && settings.http_server)) {
            console.error("Please initialize ephemeral first thanks");
            process.exit(2);
        }

        this.botToken = botToken;
        this.name = name;
        this.lobbyToken = lobbyToken;
    }

    async setup() {
        const lobbies = await axios.get(`${settings.http_server}/lobbies/${this.lobbyToken}`).then(resp => resp.data);

        this.socket = await setupWS(settings.ws_server);

        this.socket.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
            if(event.type === "proposalData") {
                this.handle_proposal(event.data);
            }
        }

        const playerParams = {
            "token": this.botToken,
            "name": this.name
        };

        const resp = await axios.post(`${settings.http_server}/lobbies/${this.lobbyToken}/join`, playerParams).then(resp => resp.data);
        this.playerId = resp.id;

        this.socket.send(JSON.stringify({
            type: 'connect',
            lobbyId: this.lobbyToken,
            token: this.botToken,
        }));

        // Check if there are any current proposals that are open
        for(let proposal of Object.values(lobbies.proposals)) {
            this.handle_proposal(proposal);
        }
    }

    async handle_proposal(proposal) {
        // Check if some player is this bot, and is still unanswered
        if(proposal.players.some(p => (p.player_id === this.playerId) && (p.status === 'Unanswered'))) {
            // Conserns me
            console.log("Accepting a game");
            await delay(200); // Fixes some bug somewhere

            await axios.post(`${settings.http_server}/lobbies/${this.lobbyToken}/proposals/${proposal.id}/accept`,
              { status: 'Accepted' },
              { headers: { 'Authorization': `Bearer ${this.botToken}` } }
            );
        }
    }

    close() {
        console.log("Closing really")
        if(this.socket) {
            this.socket.close();
        }
    }
}


const auto_accept_bots = {};

module.exports.set_auto_accept = function(auto_accept, name, lobbyToken, botToken) {
    console.log(`Setting ${auto_accept} ${name} ${lobbyToken} ${botToken}`);

    auto_accept_bots[lobbyToken] = auto_accept_bots[lobbyToken] || {};
    const lobby = auto_accept_bots[lobbyToken];

    if (auto_accept && !lobby[botToken]) {
        lobby[botToken] = new BotAcceptor(name, lobbyToken, botToken);
        lobby[botToken].setup();
    }

    if (!auto_accept && !!lobby[botToken]) {
        console.log("Closing")
        lobby[botToken].close();
        delete lobby[botToken];
    }
}





const { encode, decode } = require('@msgpack/msgpack');
const { spawn } = require('child_process');

class BotRunner {
    constructor(send_f, argv) {
        this.send_f = send_f;

        this.bot = spawn(argv[0], argv.slice(1));

        this.bot.stdout.on('data', this.handle_bot_data.bind(this));
        this.bot.stderr.on('data', (data) => console.error(`Bot stderr: ${data}`));
    }

    handle_bot_data(bot_data) {
        // This shouldn't be wrapped in PlayerResponse for some fucking reason
        const data = {
            "content": Array.from(bot_data),
            "request_id": this.request_id
        };

        this.send_f(Array.from(encode(data)));
    }

    handle_data(data) {
        const msg = decode(Uint8Array.from(data));

        if(msg["0"]) {
            this.request_id = msg["0"][0];
            const content = msg["0"][1];

            this.bot.stdin.write(Uint8Array.from(content));
            this.bot.stdin.write("\r\n");
        }

        if(msg["1"]) {
            console.log("INFO", msg["1"])
        }
    }

    close() {
        if(this.bot) {
            this.bot.kill('SIGINT');
        }
    }
}


class PlayerRunner {
    constructor(token, argv) {
        this.token = token;
        this.argv = argv;

        this.bots = {};
    }

    async setup() {
        this.socket = await setupWS(settings.bot_ws_server);

        //
        const identify = {
            "IdentifyClient":{
                "client_token": this.token.match(/([0-9abcdef]){2}/gi).map(t => parseInt(t, 16))
            }
        };
        this.socket.send(encode(identify), { binary: true });

        this.socket.onmessage = (ev) => {
            const event = decode(ev.data);
            if(event['0']) {    // ServerMessage::RunPlayer
                const player_token = event['0'][0];
                const sendMsg = (msg) =>  {
                    const data = {
                        "PlayerMessage": {
                            "player_token": player_token,
                            "data": msg,
                        }
                    };
                    this.socket.send(encode(data), { binary: true })
                };

                this.bots[player_token] = new BotRunner(sendMsg, this.argv);

                const data = {
                    "ConnectPlayer": {
                        "player_token": player_token
                    }
                };

                this.socket.send(encode(data), { binary: true })
            }

            if (event['1']) {
                const player_token = event['1'][0];
                const data = event['1'][1];
                this.bots[player_token].handle_data(data);
            }
        }
    }
}

module.exports.PlayerRunner = PlayerRunner;


const start_bots = {};

module.exports.set_start_bot = function(start, botToken, argv, lobbyToken) {
    console.log(`Setting ${start} ${lobbyToken} ${botToken}`);

    start_bots[lobbyToken] = start_bots[lobbyToken] || {};
    const lobby = start_bots[lobbyToken];

    if (start && !lobby[botToken]) {
        lobby[botToken] = new PlayerRunner(botToken, argv);
        lobby[botToken].setup();
    }

    if (!start && !!lobby[botToken]) {
        console.log("Closing")
        lobby[botToken].close();
        delete lobby[botToken];
    }
}
