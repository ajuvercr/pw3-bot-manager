<template>
    <div>
        <h3>Lobbies</h3>
        <LobbyCreate />

        <ul class="list-lobbies">
            <li class="lobby" v-for="lobby in lobbies" v-bind:key=lobby.id>
                <Lobby :lobby="lobby"/>
            </li>
        </ul>
    </div>
</template>

<style scoped>
h3 {
    padding-left: 10px;
}
ul {
    list-style-type: none;
}
.status-icon {
  width: 1em;
}
.list-lobbies {
    padding-left: 40px;
}
.lobby + .lobby {
    padding-top: 15px;
}
</style>

<script lang="ts">
import LobbyCreate from './Create.vue'
import { State, LobbyT } from '@/store';
import Lobby from './Lobby.vue';

export default {
    name: "LobbyPage",
    components: { LobbyCreate, Lobby },
    computed: {
        lobbies(): State<LobbyT> {
            return this.$store.state.lobbies;
        }
    }
}
</script>
