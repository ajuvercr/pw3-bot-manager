<template>
    <div>
        <LobbyCreate />

        <ul class="list">
            <li class="item" v-for="lobby in lobbies" v-bind:key=lobby.id>
                <Lobby :lobby="lobby"/>
            </li>
        </ul>
    </div>
</template>

<style scoped>
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
