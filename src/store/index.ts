import { createStore } from 'vuex'
import botModule, { BotState } from './bots'
import lobbyModule, { LobbyState } from './lobbies'
import errorModule, { ErrorState } from './errors'


export type State = {
    bots: BotState,
    lobbies: LobbyState,
    errors: ErrorState,
}

export const store = createStore<State>({
    modules: {
        bots: botModule,
        lobbies: lobbyModule,
        errors: errorModule
    }
})

export default store;
