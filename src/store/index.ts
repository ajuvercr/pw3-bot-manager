import { createStore, useStore as baseUseStore, Store } from 'vuex'

export type Bot = {
    name: string,
    arguments: string[],
    id: number,
}
export type BotState = { [id: number]: Bot };

export type Lobby = {

}

export type LobbyState = { [id: number]: Lobby};

export type Error = {
    status: number,
    msg: string,
    id: number,
};

export type ErrorState = Error[];

export type State = {
    bots: BotState,
    lobbies: LobbyState,
    errors: ErrorState,
}

export const store = createStore<State>({
    state: {
        bots: {},
        lobbies: {},
        errors: [],
    },
    mutations: {
        setBots(state: State, bots: BotState) {
            console.log("setting bots", bots);
            state.bots = bots;
        },
        addBot(state: BotState, bot: Bot) {
            console.log(state);
            state[bot.id] = bot;
        },
        removeBot(state: BotState, index: number) {
            delete state[index];
        },
        updateBotWith(state: BotState, bot: Bot) {
            state[bot.id] = bot;
        },
        addError(state: State, error: Error) {
            state.errors.push(error);
        },
        popError(state: State) {
            state.errors = state.errors.slice(1);
        }
    }
})

export default store;
