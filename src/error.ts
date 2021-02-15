import { store } from "./store";

var errorCounter = 0;

async function handle_error(resp: any) {
    if(typeof resp.data === 'object') {
        const msg = `${resp.statusText}: ${resp.data.join("\n")}`;
        store.commit('addError', {
            status: resp.status,
            msg,
            id: errorCounter ++,
        });
    } else {
        store.commit('addError', {
            status: resp.status,
            msg: resp.statusText,
            id: errorCounter ++,
        });
    }
    setTimeout(
        () => {
            console.log("Popping error")
            store.commit('popError');
        },
        2000
    );
}

export default handle_error
