export type Bot = {
    name: string,
    arguments: string[],
    id: number,
}
export type BotState = { [id: number]: Bot };

const module = {
    state: (): BotState => ({}),
    mutations: {
        setBots(state: BotState, bots: BotState) {
            console.log("setting bots", bots);
            Object.assign(state, bots);
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
    }
};

export default module;
