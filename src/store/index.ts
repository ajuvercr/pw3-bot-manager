import { createStore, Store } from 'vuex';
import {botsStore as bots, BotsState} from './bot';

export type State = {
    bots: BotsState
}


export const store = createStore<State>({
    modules: {
        bots,
    },
});

export default store;
