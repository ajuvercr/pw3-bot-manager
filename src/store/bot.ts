export type Bot = {
    name: string,
    arguments: string[],
    id: number,
}

export type BotsState = {
    inner: {
        [id: number]: Bot
    }
}

export const botsStore = {
    state: {
        bots: [],
    },
    mutations: {
        setBots(state: BotsState, bots: { [id: number]: Bot }) {
            state.inner = bots;
        },
        addBot(state: BotsState, bot: Bot) {
            console.log(state.inner);
            state.inner[bot.id] = bot;
        },
        removeBot(state: BotsState, index: number) {
            delete state.inner[index];
        },
        updateBotWith(state: BotsState, bot: Bot) {
            state.inner[bot.id] = bot;
        }
    }
}

export default botsStore;
