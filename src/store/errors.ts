export type Error = {
    status: number,
    msg: string,
    id: number,
};

export type ErrorState = { errors: Error[], index: number};

const module = {
    state: (): ErrorState => ({errors: [], index: 0}),
    mutations: {
        addError(state: ErrorState, error: Error) {
            state.errors.push(error);
        },
        popError(state: ErrorState) {
            state.index += 1;
        }
    }
};

export default module;
