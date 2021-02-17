<template>
    <p class="name">
        Lobby: {{lobby?.token}}
        <div class="delButton">
            <fa-icon v-on:click="deleteLobby()" icon="times" class="status-icon"/>
        </div>
    </p>
    <ul class="list-instances">
        <div>
            <h3>Add bot instance</h3>
            <select v-model="newinstance.botId">
                <option value="" disabled>Select your bot</option>
                <option v-for="bot in bots" v-bind:key=bot.id :value=bot.id>
                    {{bot.name}}
                </option>
            </select>
            <div>
                <input type="text" v-model="newinstance.token" placeholder="Bot token" />
                <button v-on:click="generateToken()">Generate token</button>
            </div>
            <button v-on:click="botInstanceCreate" :disabled="buttonDisabled()" class="join-button">
                Add bot
            </button>
        </div>
        <br>
        <!-- <li class="instances" v-for="instance in lobby.instances" v-bind:key=instance.id>
            <BotInstance :lobbyId="lobby.id" :bot="instance"/>
        </li> -->
    </ul>
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
import { LobbyT } from '@/store';
import errorHandler from '../../error';
import BotInstance from './BotInstance.vue';
import { BotState } from '@/store/bots';

export default {
    name: "Lobby",
    components: { LobbyCreate, BotInstance },
    props: { lobby: Object as () => LobbyT },
    data() {
        return {
            newinstance: {
                botId: "",
                token: ""
            }
        };
    },
    computed: {
      bots(): BotState {
          return this.$store.state.bots;
      }
    },
    methods: {
        deleteLobby() {
            axios.delete(`/api/lobbies/${this.lobby?.id}`).then((response) => {
                // Update bots
                this.$store.commit('lobbies/remove', this.lobby?.id);
            }).catch(errorHandler);
        },
        botInstanceCreate() {
            console.log("Creating new bot instance")
        },
        buttonDisabled() {
            const validBot = !!this.newinstance.botId;
            const validToken = !!this.newinstance.token;
            return !(validBot && validToken);
        },
        generateToken() {
            this.newinstance.token = "some random token";
        }
    }
}
</script>
