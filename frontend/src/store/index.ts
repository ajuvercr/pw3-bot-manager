import { createStore, Module } from 'vuex'

export interface WithId {
    id: number;
}

export type State<T extends WithId> = { [id: number]: T };

export function moduleFactory<T extends WithId>(): Module<State<T>, RootState> {
    return {
        namespaced: true,
        mutations: {
            set(state: State<T>, new_state: State<T>) {
                Object.assign(state, new_state);
            },
            add(state: State<T>, el: T) {
                state[el.id] = el;
            },
            remove(state: State<T>, index: number) {
                delete state[index];
            },
            update(state: State<T>, el: WithId) {
                console.log("setting", state[el.id], el);
                Object.assign(state[el.id], el);
            }
        }
    }
}

export type BotT = {
    name: string,
    arguments: string[],
    id: number,
}

export type LobbyT = {
    id: number,
    token: string,
}

export type ErrorT = {
    status: number,
    msg: string,
    id: number,
    show: boolean,
};

export type PlayerT = {
    token: string,
    botId: number,
    lobbyId: number,
    autoAccept: boolean,
    startClient: boolean,
    id: number,
};


export type RootState = {
    bots: State<BotT>,
    lobbies: State<LobbyT>,
    players: State<PlayerT>,
    errors: State<ErrorT>,
}

export const store = createStore<RootState>({
    modules: {
        bots: moduleFactory<BotT>(),
        lobbies: moduleFactory<LobbyT>(),
        players: moduleFactory<PlayerT>(),
        errors: moduleFactory<ErrorT>()
    }
})

export default store;
