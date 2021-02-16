<template>
    <div>
        <h3>Lobbies</h3>
        <ul class="list-lobbies">
            <li class="lobby" v-for="lobby in lobbies" v-bind:key=lobby.id>
                <p class="name">
                    <div class="delButton">
                        <fa-icon v-on:click="deleteLobby(lobby.id)" icon="times" class="status-icon"/>
                    </div>
                    {{lobby.token}}
                </p>
            </li>
        </ul>

        <LobbyCreate />
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
.lobby .name {
    position: relative;
}
.lobby .name .delButton {
    position: absolute;
    top: 50%;
    left: -1.1em;
    transform: translateY(-50%);
}

.bot .name .delButton :hover {
    color: orange;
    cursor: pointer;
}
</style>

<script lang="ts">
import axios from "redaxios";
import LobbyCreate from './Create.vue'
import { Bot, BotState } from '../../store/bots'
import { LobbyState } from '@/store/lobbies';

export default {
    name: "Lobbies",
    components: { LobbyCreate },
    data() {
        return {
            deleted: new Set()
        }
    },
    computed: {
        lobbies(): LobbyState {
            return this.$store.state.lobbies;
        },
        bots(): BotState {
            return this.$store.state.bots;
        }
    },
    methods: {
        deleteLobby(id: number) {
            // Some debouncing required, don't really know why
            if (this.deleted.has(id)) return;
            this.deleted.add(id);

            axios.delete(`/api/lobbies/${id}`).then((response) => {
                // Update bots
                this.$store.commit('removeLobby', id);
            });
        }
    }
}
</script>
