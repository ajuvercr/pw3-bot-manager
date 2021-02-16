<template>
    <p class="name">
        <div class="delButton">
            <fa-icon v-on:click="deleteLobby()" icon="times" class="status-icon"/>
        </div>
        {{lobby?.token}}
    </p>
</template>

<style scoped>
.status-icon {
  width: 1em;
}
.name {
    position: relative;
}
.name .delButton {
    position: absolute;
    top: 50%;
    left: -1.1em;
    transform: translateY(-50%);
}

.name .delButton :hover {
    color: orange;
    cursor: pointer;
}
</style>

<script lang="ts">
import axios from "redaxios";
import LobbyCreate from './Create.vue'
import { Lobby } from '@/store/lobbies';
import errorHandler from '../../error';

export default {
    name: "Lobby",
    components: { LobbyCreate },
    props: { lobby: Object as () => Lobby },
    methods: {
        deleteLobby() {
            axios.delete(`/api/lobbies/${this.lobby?.id}`).then((response) => {
                // Update bots
                this.$store.commit('removeLobby', this.lobby?.id);
            }).catch(errorHandler);
        }
    }
}
</script>
