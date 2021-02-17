const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function setupWS(url, bot) {
    return new Promise(resolve => {
        console.log("Trying ws at "+url);
        const socket = new WebSocket(url);

        socket.onopen = (ev) => {
            console.log('ws connected')
            resolve(socket);
        }

        socket.onmessage = (ev) => {
            const event = JSON.parse(ev.data);
            if(event.type === "proposalData") {
                bot.handle_proposal(event.data);
            }
        }
    })
}

const axios = require('axios');
const WebSocket = require('ws');

const settings = {};


module.exports.init = function(http_server, ws_server){
    settings.http_server = http_server;
    settings.ws_server = ws_server;
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

        this.socket = await setupWS(settings.ws_server, this);

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
