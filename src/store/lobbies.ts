export type Lobby = {
    id: number,
    token: string,
    instances: BotInstance[],
}

export type BotInstance = {
    token: string,
    botId: number,
    autoAccept: boolean,
    startClient: boolean,
}

export type LobbyState = { [id: number]: Lobby};

const module = {
    state: (): LobbyState => ({}),
    mutations: {
        setLobbies(state: LobbyState, bots: LobbyState) {
            Object.assign(state, bots);
        },
        addLobby(state: LobbyState, bot: Lobby) {
            console.log(state);
            state[bot.id] = bot;
        },
        removeLobby(state: LobbyState, index: number) {
            delete state[index];
        },
        updateLobbyWith(state: LobbyState, bot: Lobby) {
            state[bot.id] = bot;
        },
    }
};

export default module;
