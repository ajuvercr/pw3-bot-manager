import { store } from "./store";

var errorCounter = 0;

async function handle_error(resp: any) {
    const id = errorCounter ++;
    if(typeof resp.data === 'object') {
        const msg = `${resp.statusText}: ${resp.data.join("\n")}`;
        store.commit('errors/add', {
            status: resp.status,
            msg,
            id,
            show: true,
        });
    } else {
        store.commit('errors/add', {
            status: resp.status,
            msg: resp.statusText,
            id,
            show: true,
        });
    }
    setTimeout(
        () => {
            console.log("Popping error")
            store.commit('errors/update', { show: false, id });
        },
        2000
    );
}

export default handle_error
