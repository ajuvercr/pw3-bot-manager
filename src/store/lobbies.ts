export type Lobby = {

}

export type LobbyState = { [id: number]: Lobby};

const module = {
    state: (): LobbyState => ({}),
};

export default module;
